<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\IssueModel;
use App\Models\AdminUserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class Magazines extends ResourceController
{
    protected $format = 'json';
    protected $adminUserModel;
    protected $issueModel;
    protected $uploadPath;

    public function __construct()
    {
        $this->adminUserModel = new AdminUserModel();
        $this->issueModel = new IssueModel();
        $this->uploadPath = WRITEPATH . 'uploads/magazines/';
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
        
        if ($page < 1) $page = 1;
        if ($limit < 1 || $limit > 100) $limit = 20;

        $skip = ($page - 1) * $limit;
        $magazines = $this->issueModel->orderBy('year', 'DESC')->orderBy('month', 'DESC')
                                     ->limit($limit, $skip)->findAll();
        $totalCount = $this->issueModel->countAllResults();

        // Parse JSON fields
        foreach ($magazines as &$magazine) {
            if (!empty($magazine['pages'])) {
                $magazine['pages'] = json_decode($magazine['pages'], true) ?: [];
            } else {
                $magazine['pages'] = [];
            }

            // Convert boolean fields
            $magazine['is_digital'] = (bool)$magazine['is_digital'];

            // Add full URL for cover image
            if ($magazine['cover_image'] && !filter_var($magazine['cover_image'], FILTER_VALIDATE_URL)) {
                $magazine['cover_image'] = base_url('uploads/magazines/' . $magazine['cover_image']);
            }
        }

        $totalPages = ceil($totalCount / $limit);

        return $this->respond([
            'magazines' => $magazines,
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

        $magazine = $this->issueModel->where('id', $id)->first();
        if (!$magazine) {
            return $this->failNotFound('Magazine not found');
        }

        // Parse JSON fields
        if (!empty($magazine['pages'])) {
            $magazine['pages'] = json_decode($magazine['pages'], true) ?: [];
        } else {
            $magazine['pages'] = [];
        }

        // Convert boolean fields
        $magazine['is_digital'] = (bool)$magazine['is_digital'];

        // Add full URL for cover image
        if ($magazine['cover_image'] && !filter_var($magazine['cover_image'], FILTER_VALIDATE_URL)) {
            $magazine['cover_image'] = base_url('uploads/magazines/' . $magazine['cover_image']);
        }

        return $this->respond($magazine);
    }

    public function create()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $rules = [
            'title' => 'required|min_length[3]|max_length[255]',
            'description' => 'required|min_length[10]',
            'month' => 'required|min_length[1]|max_length[20]',
            'year' => 'required|integer|greater_than[2000]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getJSON(true);
        
        // Handle cover image upload if provided
        $coverImagePath = '';
        if (!empty($data['cover_image']) && filter_var($data['cover_image'], FILTER_VALIDATE_URL)) {
            $coverImagePath = $data['cover_image']; // External URL
        } else if (!empty($data['cover_image'])) {
            $coverImagePath = $data['cover_image']; // Local path
        }

        $magazineData = [
            'id' => $this->generateUUID(),
            'title' => $data['title'],
            'cover_image' => $coverImagePath,
            'description' => $data['description'],
            'month' => $data['month'],
            'year' => (int)$data['year'],
            'pages' => !empty($data['pages']) ? json_encode($data['pages']) : json_encode([]),
            'is_digital' => (bool)($data['is_digital'] ?? true),
            'published_at' => date('Y-m-d H:i:s')
        ];

        if (!$this->issueModel->insert($magazineData)) {
            return $this->fail('Failed to create magazine', 500);
        }

        // Parse JSON fields for response
        $magazineData['pages'] = !empty($data['pages']) ? $data['pages'] : [];
        $magazineData['is_digital'] = (bool)$magazineData['is_digital'];

        return $this->respondCreated($magazineData);
    }

    public function update($id)
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $magazine = $this->issueModel->where('id', $id)->first();
        if (!$magazine) {
            return $this->failNotFound('Magazine not found');
        }

        $rules = [
            'title' => 'permit_empty|min_length[3]|max_length[255]',
            'description' => 'permit_empty|min_length[10]',
            'month' => 'permit_empty|min_length[1]|max_length[20]',
            'year' => 'permit_empty|integer|greater_than[2000]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getJSON(true);
        
        $updateData = [];
        
        // Only update provided fields
        $fields = ['title', 'cover_image', 'description', 'month', 'year'];
        foreach ($fields as $field) {
            if (array_key_exists($field, $data)) {
                $updateData[$field] = $data[$field];
            }
        }

        // Handle pages
        if (array_key_exists('pages', $data)) {
            $updateData['pages'] = !empty($data['pages']) ? json_encode($data['pages']) : json_encode([]);
        }

        // Handle boolean fields
        if (array_key_exists('is_digital', $data)) {
            $updateData['is_digital'] = (bool)$data['is_digital'];
        }

        if (!empty($updateData)) {
            if (!$this->issueModel->where('id', $id)->set($updateData)->update()) {
                return $this->fail('Failed to update magazine', 500);
            }
        }

        // Get updated magazine
        $updatedMagazine = $this->issueModel->where('id', $id)->first();
        
        // Parse JSON fields for response
        if (!empty($updatedMagazine['pages'])) {
            $updatedMagazine['pages'] = json_decode($updatedMagazine['pages'], true) ?: [];
        } else {
            $updatedMagazine['pages'] = [];
        }

        $updatedMagazine['is_digital'] = (bool)$updatedMagazine['is_digital'];

        return $this->respond($updatedMagazine);
    }

    public function delete($id)
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $magazine = $this->issueModel->where('id', $id)->first();
        if (!$magazine) {
            return $this->failNotFound('Magazine not found');
        }

        // Delete cover image file if it exists locally
        if (!empty($magazine['cover_image']) && !filter_var($magazine['cover_image'], FILTER_VALIDATE_URL)) {
            $imagePath = $this->uploadPath . $magazine['cover_image'];
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        if (!$this->issueModel->where('id', $id)->delete()) {
            return $this->fail('Failed to delete magazine', 500);
        }

        return $this->respond(['message' => 'Magazine deleted successfully']);
    }

    public function uploadCover()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $files = $this->request->getFiles();
        if (empty($files['cover_image'])) {
            return $this->fail('No cover image uploaded', 400);
        }

        $file = $files['cover_image'];
        
        if (!$file->isValid()) {
            return $this->fail('Invalid file upload', 400);
        }

        // Validate file size (10MB max)
        if ($file->getSize() > 10 * 1024 * 1024) {
            return $this->fail('File too large (max 10MB)', 400);
        }

        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedTypes)) {
            return $this->fail('Invalid file type (only images allowed)', 400);
        }

        // Generate unique filename
        $extension = $file->getExtension();
        $newName = 'cover_' . uniqid() . '_' . time() . '.' . $extension;
        
        // Move file to upload directory
        if (!$file->move($this->uploadPath, $newName)) {
            return $this->fail('Failed to upload cover image', 500);
        }

        return $this->respond([
            'message' => 'Cover image uploaded successfully',
            'filename' => $newName,
            'url' => base_url('uploads/magazines/' . $newName)
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
}