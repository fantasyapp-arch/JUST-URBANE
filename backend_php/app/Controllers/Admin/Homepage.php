<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ArticleModel;
use App\Models\HomepageConfigModel;
use App\Models\AdminUserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class Homepage extends ResourceController
{
    protected $format = 'json';
    protected $adminUserModel;
    protected $articleModel;
    protected $homepageConfigModel;

    public function __construct()
    {
        $this->adminUserModel = new AdminUserModel();
        $this->articleModel = new ArticleModel();
        $this->homepageConfigModel = new HomepageConfigModel();
        helper(['date']);
    }

    public function content()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        try {
            // Get homepage configuration
            $config = $this->homepageConfigModel->first();
            
            if (!$config) {
                // Return empty structure if no config exists
                $sections = [
                    'hero_article' => [],
                    'featured_articles' => [],
                    'trending_articles' => [],
                    'latest_articles' => [],
                    'fashion_articles' => [],
                    'people_articles' => [],
                    'business_articles' => [],
                    'technology_articles' => [],
                    'travel_articles' => [],
                    'culture_articles' => [],
                    'entertainment_articles' => []
                ];
                
                return $this->respond($sections);
            }

            $response = [];

            // Get each section with article data
            $sectionFields = [
                'hero_article',
                'featured_articles',
                'trending_articles', 
                'latest_articles',
                'fashion_articles',
                'people_articles',
                'business_articles',
                'technology_articles',
                'travel_articles',
                'culture_articles',
                'entertainment_articles'
            ];

            foreach ($sectionFields as $section) {
                if (!empty($config[$section])) {
                    $articleIds = json_decode($config[$section], true);
                    if (is_array($articleIds)) {
                        if ($section === 'hero_article') {
                            // Hero article is single article
                            $heroId = $articleIds[0] ?? null;
                            if ($heroId) {
                                $article = $this->articleModel->where('id', $heroId)->first();
                                if ($article) {
                                    $this->parseArticleJson($article);
                                    $response[$section] = $article;
                                } else {
                                    $response[$section] = null;
                                }
                            } else {
                                $response[$section] = null;
                            }
                        } else {
                            // Other sections are arrays
                            $articles = $this->getArticlesByIds($articleIds);
                            $response[$section] = $articles;
                            $response[$section . '_data'] = $articles; // For compatibility
                        }
                    } else {
                        $response[$section] = [];
                        if ($section !== 'hero_article') {
                            $response[$section . '_data'] = [];
                        }
                    }
                } else {
                    $response[$section] = $section === 'hero_article' ? null : [];
                    if ($section !== 'hero_article') {
                        $response[$section . '_data'] = [];
                    }
                }
            }

            return $this->respond($response);

        } catch (Exception $e) {
            return $this->fail('Failed to load homepage content: ' . $e->getMessage(), 500);
        }
    }

    public function availableArticles()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $limit = (int)($this->request->getGet('limit') ?? 50);
        $category = $this->request->getGet('category');
        $search = $this->request->getGet('search');

        $builder = $this->articleModel->builder();

        if ($category && $category !== 'all') {
            $builder->where('category', $category);
        }

        if ($search) {
            $builder->like('title', $search);
        }

        $articles = $builder->limit($limit)->orderBy('published_at', 'DESC')->get()->getResultArray();

        // Parse JSON fields
        foreach ($articles as &$article) {
            $this->parseArticleJson($article);
        }

        return $this->respond(['articles' => $articles]);
    }

    public function updateHero()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $articleId = $this->request->getPost('article_id');
        if (!$articleId) {
            return $this->fail('Article ID is required', 400);
        }

        // Verify article exists
        $article = $this->articleModel->where('id', $articleId)->first();
        if (!$article) {
            return $this->fail('Article not found', 404);
        }

        try {
            $this->updateHomepageSection('hero_article', [$articleId]);
            return $this->respond(['message' => 'Hero article updated successfully']);
        } catch (Exception $e) {
            return $this->fail('Failed to update hero article', 500);
        }
    }

    public function updateSection($sectionName)
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        $articleIdsString = $this->request->getPost('article_ids');
        if (!$articleIdsString) {
            return $this->fail('Article IDs are required', 400);
        }

        $articleIds = array_map('trim', explode(',', $articleIdsString));
        
        // Verify all articles exist
        foreach ($articleIds as $articleId) {
            $article = $this->articleModel->where('id', $articleId)->first();
            if (!$article) {
                return $this->fail('Article not found: ' . $articleId, 404);
            }
        }

        try {
            $this->updateHomepageSection($sectionName, $articleIds);
            return $this->respond(['message' => ucfirst(str_replace('_', ' ', $sectionName)) . ' section updated successfully']);
        } catch (Exception $e) {
            return $this->fail('Failed to update section', 500);
        }
    }

    public function autoPopulate()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        try {
            // Get all articles
            $allArticles = $this->articleModel->orderBy('published_at', 'DESC')->findAll();
            
            if (empty($allArticles)) {
                return $this->fail('No articles available for auto-population', 400);
            }

            // Auto-populate sections
            $updates = [
                'hero_article' => json_encode([$allArticles[0]['id'] ?? '']),
                'featured_articles' => json_encode(array_slice(array_column($allArticles, 'id'), 0, 4)),
                'trending_articles' => json_encode(array_slice(array_column($allArticles, 'id'), 0, 6)),
                'latest_articles' => json_encode(array_slice(array_column($allArticles, 'id'), 0, 8))
            ];

            // Add category-specific sections
            $categories = ['fashion', 'people', 'business', 'technology', 'travel', 'culture', 'entertainment'];
            foreach ($categories as $category) {
                $categoryArticles = array_filter($allArticles, function($article) use ($category) {
                    return $article['category'] === $category;
                });
                $updates[$category . '_articles'] = json_encode(array_slice(array_column($categoryArticles, 'id'), 0, 4));
            }

            // Get or create homepage config
            $config = $this->homepageConfigModel->first();
            if ($config) {
                $this->homepageConfigModel->where('id', $config['id'])->set($updates)->update();
            } else {
                $updates['id'] = $this->generateUUID();
                $this->homepageConfigModel->insert($updates);
            }

            return $this->respond(['message' => 'Homepage auto-populated successfully']);

        } catch (Exception $e) {
            return $this->fail('Failed to auto-populate homepage: ' . $e->getMessage(), 500);
        }
    }

    private function updateHomepageSection($sectionName, $articleIds)
    {
        $config = $this->homepageConfigModel->first();
        
        $updateData = [
            $sectionName => json_encode($articleIds)
        ];

        if ($config) {
            $this->homepageConfigModel->where('id', $config['id'])->set($updateData)->update();
        } else {
            $updateData['id'] = $this->generateUUID();
            $this->homepageConfigModel->insert($updateData);
        }
    }

    private function getArticlesByIds($ids)
    {
        if (empty($ids)) {
            return [];
        }

        $articles = $this->articleModel->whereIn('id', $ids)->findAll();
        
        // Parse JSON fields and maintain order
        $articlesById = [];
        foreach ($articles as $article) {
            $this->parseArticleJson($article);
            $articlesById[$article['id']] = $article;
        }

        // Return articles in the original order
        $orderedArticles = [];
        foreach ($ids as $id) {
            if (isset($articlesById[$id])) {
                $orderedArticles[] = $articlesById[$id];
            }
        }

        return $orderedArticles;
    }

    private function parseArticleJson(&$article)
    {
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