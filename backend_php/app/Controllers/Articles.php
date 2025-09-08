<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ArticleModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class Articles extends ResourceController
{
    protected $format = 'json';
    protected $articleModel;

    public function __construct()
    {
        $this->articleModel = new ArticleModel();
    }

    public function index()
    {
        $builder = $this->articleModel->builder();
        
        // Apply filters
        $category = $this->request->getGet('category');
        $subcategory = $this->request->getGet('subcategory');
        $featured = $this->request->getGet('featured');
        $trending = $this->request->getGet('trending');
        $limit = (int)($this->request->getGet('limit') ?? 20);
        
        if ($limit > 100) $limit = 100;

        if ($category) {
            $builder->where('category', $category);
        }
        
        if ($subcategory) {
            $builder->where('subcategory', $subcategory);
        }
        
        if ($featured !== null) {
            $builder->where('featured', $featured === 'true' ? 1 : 0);
        }
        
        if ($trending !== null) {
            $builder->where('trending', $trending === 'true' ? 1 : 0);
        }

        $articles = $builder->limit($limit)->orderBy('published_at', 'DESC')->get()->getResultArray();
        
        // Parse JSON fields
        foreach ($articles as &$article) {
            if ($article['tags']) {
                $article['tags'] = json_decode($article['tags']);
            }
        }

        return $this->respond($articles);
    }

    public function show($id)
    {
        // Try to find by ID first, then by slug
        $article = $this->articleModel->where('id', $id)->first();
        if (!$article) {
            $article = $this->articleModel->where('slug', $id)->first();
        }
        
        if (!$article) {
            return $this->failNotFound('Article not found');
        }

        // Increment view count
        $this->articleModel->where('id', $article['id'])->set('views', 'views + 1', false)->update();
        
        // Parse JSON fields
        if ($article['tags']) {
            $article['tags'] = json_decode($article['tags']);
        }

        return $this->respond($article);
    }

    public function create()
    {
        // Get current user (requires authentication)
        $user = $this->getCurrentUser();
        if (!$user) {
            return $this->fail('Unauthorized', 401);
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

        $data = $this->request->getPost();
        
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
            'reading_time' => $data['reading_time'] ?? null,
            'slug' => $data['slug'] ?? $this->generateSlug($data['title'])
        ];

        if (!$this->articleModel->insert($articleData)) {
            return $this->fail('Failed to create article', 500);
        }

        // Parse JSON fields for response
        if ($articleData['tags']) {
            $articleData['tags'] = json_decode($articleData['tags']);
        }

        return $this->respondCreated($articleData);
    }

    private function getCurrentUser()
    {
        $header = $this->request->getHeader('Authorization');
        if (!$header || !$header->getValue()) {
            return null;
        }

        $token = str_replace('Bearer ', '', $header->getValue());
        
        try {
            $key = env('jwt.secret_key', 'your-secret-key');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            
            $userModel = new \App\Models\UserModel();
            $user = $userModel->where('email', $decoded->sub)->first();
            return $user;
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

    private function generateSlug($title)
    {
        return url_title(strtolower($title), '-', true);
    }
}