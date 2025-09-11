<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ArticleModel;
use App\Models\AdminUserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class Articles extends ResourceController
{
    protected $format = 'json';
    protected $adminUserModel;
    protected $articleModel;

    public function __construct()
    {
        $this->adminUserModel = new AdminUserModel();
        $this->articleModel = new ArticleModel();
        helper(['text', 'url', 'date']);
    }

    public function index()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $page = (int)($this->request->getGet('page') ?? 1);
        $limit = (int)($this->request->getGet('limit') ?? 20);
        $category = $this->request->getGet('category');
        $search = $this->request->getGet('search');

        if ($page < 1) $page = 1;
        if ($limit < 1 || $limit > 100) $limit = 20;

        $skip = ($page - 1) * $limit;
        $builder = $this->articleModel->builder();

        if ($category) {
            $builder->where('category', $category);
        }

        if ($search) {
            $builder->groupStart()
                ->like('title', $search)
                ->orLike('body', $search)
                ->orLike('author_name', $search)
                ->groupEnd();
        }

        $totalCount = $builder->countAllResults(false);
        $articles = $builder->limit($limit, $skip)->orderBy('created_at', 'DESC')->get()->getResultArray();

        // Parse JSON fields
        foreach ($articles as &$article) {
            if (!empty($article['tags'])) {
                $article['tags'] = json_decode($article['tags'], true) ?: [];
            } else {
                $article['tags'] = [];
            }
            
            // Convert boolean fields
            $article['featured'] = (bool)$article['featured'];
            $article['trending'] = (bool)$article['trending'];
            $article['premium'] = (bool)$article['premium'];
            $article['is_premium'] = (bool)$article['is_premium'];
        }

        $totalPages = ceil($totalCount / $limit);

        return $this->respond([
            'articles' => $articles,
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

        $article = $this->articleModel->where('id', $id)->first();
        if (!$article) {
            return $this->failNotFound('Article not found');
        }

        // Parse JSON fields
        if (!empty($article['tags'])) {
            $article['tags'] = json_decode($article['tags'], true) ?: [];
        } else {
            $article['tags'] = [];
        }

        // Convert boolean fields
        $article['featured'] = (bool)$article['featured'];
        $article['trending'] = (bool)$article['trending'];
        $article['premium'] = (bool)$article['premium'];
        $article['is_premium'] = (bool)$article['is_premium'];

        return $this->respond($article);
    }

    public function create()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $rules = [
            'title' => 'required|min_length[3]',
            'body' => 'required|min_length[10]',
            'author_name' => 'required',
            'category' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getJSON(true);
        
        $articleData = [
            'id' => $this->generateUUID(),
            'title' => $data['title'],
            'body' => $data['body'],
            'summary' => $data['summary'] ?? null,
            'hero_image' => $data['hero_image'] ?? null,
            'author_name' => $data['author_name'],
            'category' => $data['category'],
            'subcategory' => $data['subcategory'] ?? null,
            'tags' => !empty($data['tags']) ? json_encode($data['tags']) : null,
            'featured' => (bool)($data['featured'] ?? false),
            'trending' => (bool)($data['trending'] ?? false),
            'premium' => (bool)($data['premium'] ?? false),
            'is_premium' => (bool)($data['is_premium'] ?? false),
            'views' => 0,
            'reading_time' => $data['reading_time'] ?? $this->estimateReadingTime($data['body']),
            'slug' => $data['slug'] ?? url_title(strtolower($data['title']), '-', true),
            'published_at' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s')
        ];

        if (!$this->articleModel->insert($articleData)) {
            return $this->fail('Failed to create article', 500);
        }

        // Parse JSON fields for response
        if ($articleData['tags']) {
            $articleData['tags'] = json_decode($articleData['tags'], true);
        }

        return $this->respondCreated($articleData);
    }

    public function update($id)
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $article = $this->articleModel->where('id', $id)->first();
        if (!$article) {
            return $this->failNotFound('Article not found');
        }

        $rules = [
            'title' => 'permit_empty|min_length[3]',
            'body' => 'permit_empty|min_length[10]',
            'author_name' => 'permit_empty',
            'category' => 'permit_empty'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getJSON(true);
        
        $updateData = [];
        
        // Only update provided fields
        $fields = ['title', 'body', 'summary', 'hero_image', 'author_name', 'category', 'subcategory', 'reading_time'];
        foreach ($fields as $field) {
            if (array_key_exists($field, $data)) {
                $updateData[$field] = $data[$field];
            }
        }

        // Handle tags
        if (array_key_exists('tags', $data)) {
            $updateData['tags'] = !empty($data['tags']) ? json_encode($data['tags']) : null;
        }

        // Handle boolean fields
        $boolFields = ['featured', 'trending', 'premium', 'is_premium'];
        foreach ($boolFields as $field) {
            if (array_key_exists($field, $data)) {
                $updateData[$field] = (bool)$data[$field];
            }
        }

        if (!empty($updateData)) {
            if (!$this->articleModel->where('id', $id)->set($updateData)->update()) {
                return $this->fail('Failed to update article', 500);
            }
        }

        // Get updated article
        $updatedArticle = $this->articleModel->where('id', $id)->first();
        
        // Parse JSON fields for response
        if (!empty($updatedArticle['tags'])) {
            $updatedArticle['tags'] = json_decode($updatedArticle['tags'], true) ?: [];
        } else {
            $updatedArticle['tags'] = [];
        }

        return $this->respond($updatedArticle);
    }

    public function delete($id)
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $article = $this->articleModel->where('id', $id)->first();
        if (!$article) {
            return $this->failNotFound('Article not found');
        }

        if (!$this->articleModel->where('id', $id)->delete()) {
            return $this->fail('Failed to delete article', 500);
        }

        return $this->respond(['message' => 'Article deleted successfully']);
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

    private function estimateReadingTime($content)
    {
        $wordCount = str_word_count(strip_tags($content));
        return max(1, ceil($wordCount / 200)); // 200 words per minute average
    }
}