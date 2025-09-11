<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\MediaModel;
use App\Models\AdminUserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class Media extends ResourceController
{
    protected $format = 'json';
    protected $adminUserModel;
    protected $mediaModel;
    protected $uploadPath;

    public function __construct()
    {
        $this->adminUserModel = new AdminUserModel();
        $this->mediaModel = new MediaModel();
        $this->uploadPath = WRITEPATH . 'uploads/';
        helper(['filesystem', 'url', 'date']);
        
        // Ensure upload directory exists
        if (!is_dir($this->uploadPath)) {
            mkdir($this->uploadPath, 0755, true);
        }
    }

    public function index()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $page = (int)($this->request->getGet('page') ?? 1);
        $limit = (int)($this->request->getGet('limit') ?? 20);
        $fileType = $this->request->getGet('file_type');
        $search = $this->request->getGet('search');
        $tags = $this->request->getGet('tags');

        if ($page < 1) $page = 1;
        if ($limit < 1 || $limit > 100) $limit = 20;

        $skip = ($page - 1) * $limit;
        $builder = $this->mediaModel->builder();

        if ($fileType && $fileType !== 'all') {
            $builder->where('file_type', $fileType);
        }

        if ($search) {
            $builder->like('filename', $search);
        }

        if ($tags) {
            $builder->like('tags', $tags);
        }

        $totalCount = $builder->countAllResults(false);
        $mediaFiles = $builder->limit($limit, $skip)->orderBy('uploaded_at', 'DESC')->get()->getResultArray();

        // Parse JSON fields and add URL
        foreach ($mediaFiles as &$media) {
            if (!empty($media['tags'])) {
                $media['tags'] = json_decode($media['tags'], true) ?: [];
            } else {
                $media['tags'] = [];
            }

            if (!empty($media['resolutions'])) {
                $media['resolutions'] = json_decode($media['resolutions'], true) ?: [];
            } else {
                $media['resolutions'] = [];
            }

            // Add full URL for media files
            $media['url'] = base_url('uploads/' . $media['file_path']);
        }

        $totalPages = ceil($totalCount / $limit);

        return $this->respond([
            'media_files' => $mediaFiles,
            'total_count' => $totalCount,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => $totalPages
        ]);
    }

    public function show($id)
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $media = $this->mediaModel->where('id', $id)->first();
        if (!$media) {
            return $this->failNotFound('Media file not found');
        }

        // Parse JSON fields
        if (!empty($media['tags'])) {
            $media['tags'] = json_decode($media['tags'], true) ?: [];
        } else {
            $media['tags'] = [];
        }

        if (!empty($media['resolutions'])) {
            $media['resolutions'] = json_decode($media['resolutions'], true) ?: [];
        } else {
            $media['resolutions'] = [];
        }

        // Add full URL
        $media['url'] = base_url('uploads/' . $media['file_path']);

        return $this->respond($media);
    }

    public function create()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $files = $this->request->getFiles();
        if (empty($files['files'])) {
            return $this->fail('No files uploaded', 400);
        }

        $altText = $this->request->getPost('alt_text') ?? '';
        $tags = $this->request->getPost('tags') ?? '';
        $generateResolutions = $this->request->getPost('generate_resolutions') ?? '';

        $tagsArray = !empty($tags) ? array_map('trim', explode(',', $tags)) : [];
        $resolutionsArray = !empty($generateResolutions) ? array_map('trim', explode(',', $generateResolutions)) : [];

        $uploadedFiles = [];
        $errors = [];

        foreach ($files['files'] as $file) {
            if (!$file->isValid()) {
                $errors[] = 'Invalid file: ' . $file->getName();
                continue;
            }

            // Validate file size (50MB max)
            if ($file->getSize() > 50 * 1024 * 1024) {
                $errors[] = 'File too large: ' . $file->getName();
                continue;
            }

            // Validate file type
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/avi', 'video/mov'];
            if (!in_array($file->getMimeType(), $allowedTypes)) {
                $errors[] = 'Invalid file type: ' . $file->getName();
                continue;
            }

            // Generate unique filename
            $originalName = $file->getName();
            $extension = $file->getExtension();
            $newName = uniqid() . '_' . time() . '.' . $extension;
            
            // Move file to upload directory
            if ($file->move($this->uploadPath, $newName)) {
                $fileType = strpos($file->getMimeType(), 'image/') === 0 ? 'image' : 'video';
                
                $mediaData = [
                    'id' => $this->generateUUID(),
                    'filename' => $originalName,
                    'file_path' => $newName,
                    'file_type' => $fileType,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'alt_text' => $altText,
                    'tags' => !empty($tagsArray) ? json_encode($tagsArray) : null,
                    'resolutions' => !empty($resolutionsArray) ? json_encode($this->generateResolutionsData($resolutionsArray)) : null,
                    'uploaded_at' => date('Y-m-d H:i:s')
                ];

                if ($this->mediaModel->insert($mediaData)) {
                    // Parse JSON for response
                    $mediaData['tags'] = $tagsArray;
                    $mediaData['resolutions'] = $resolutionsArray;
                    $mediaData['url'] = base_url('uploads/' . $newName);
                    $uploadedFiles[] = $mediaData;
                } else {
                    $errors[] = 'Database error for: ' . $originalName;
                    unlink($this->uploadPath . $newName); // Clean up file
                }
            } else {
                $errors[] = 'Upload failed for: ' . $originalName;
            }
        }

        if (!empty($uploadedFiles)) {
            $response = ['uploaded_files' => $uploadedFiles];
            if (!empty($errors)) {
                $response['errors'] = $errors;
            }
            return $this->respondCreated($response);
        } else {
            return $this->fail(['errors' => $errors], 400);
        }
    }

    public function delete($id)
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $media = $this->mediaModel->where('id', $id)->first();
        if (!$media) {
            return $this->failNotFound('Media file not found');
        }

        // Delete physical file
        $filePath = $this->uploadPath . $media['file_path'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        // Delete from database
        if (!$this->mediaModel->where('id', $id)->delete()) {
            return $this->fail('Failed to delete media file', 500);
        }

        return $this->respond(['message' => 'Media file deleted successfully']);
    }

    public function stats()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $totalFiles = $this->mediaModel->countAllResults();
        $totalImages = $this->mediaModel->where('file_type', 'image')->countAllResults();
        $totalVideos = $this->mediaModel->where('file_type', 'video')->countAllResults();

        // Calculate storage usage
        $storageQuery = $this->mediaModel->selectSum('file_size')->get();
        $storageResult = $storageQuery->getRowArray();
        $totalStorage = $storageResult['file_size'] ?? 0;

        return $this->respond([
            'total_files' => $totalFiles,
            'total_images' => $totalImages,
            'total_videos' => $totalVideos,
            'storage_stats' => [
                [
                    'total_size' => $totalStorage
                ]
            ]
        ]);
    }

    private function getCurrentAdminUser()
    {
        $header = $this->request->getHeader('Authorization');
        if (!$header || !$header->getValue()) {
            return null;
        }

        $token = str_replace('Bearer ', '', $header->getValue());
        
        try {
            $key = env('JWT_SECRET_KEY', 'admin-super-secret-key-2025');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            
            // Check if it's an admin token
            if (!isset($decoded->type) || $decoded->type !== 'admin') {
                return null;
            }
            
            $adminUser = $this->adminUserModel->where('username', $decoded->sub)->first();
            return $adminUser;
        } catch (Exception $e) {
            return null;
        }
    }

    private function generateUUID()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }

    private function generateResolutionsData($resolutions)
    {
        $data = [];
        foreach ($resolutions as $resolution) {
            $data[$resolution] = [
                'url' => '#', // Placeholder - would implement actual image processing
                'width' => 0,
                'height' => 0
            ];
        }
        return $data;
    }
}