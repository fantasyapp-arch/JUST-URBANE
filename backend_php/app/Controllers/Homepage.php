<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ArticleModel;
use App\Models\HomepageConfigModel;
use Exception;

class Homepage extends ResourceController
{
    protected $format = 'json';
    protected $articleModel;
    protected $homepageConfigModel;

    public function __construct()
    {
        $this->articleModel = new ArticleModel();
        $this->homepageConfigModel = new HomepageConfigModel();
    }

    public function content()
    {
        try {
            // Get latest articles for now
            $articles = $this->articleModel->limit(10)->findAll();
            
            // Parse JSON fields
            foreach ($articles as &$article) {
                if (!empty($article['tags'])) {
                    $article['tags'] = json_decode($article['tags'], true) ?: [];
                } else {
                    $article['tags'] = [];
                }
            }

            // Return structured data
            $response = [
                'hero_article' => !empty($articles) ? $articles[0] : null,
                'sections' => [
                    'featured' => array_slice($articles, 0, 4),
                    'trending' => array_slice($articles, 0, 6),
                    'latest' => $articles,
                    'fashion' => array_filter($articles, function($a) { return $a['category'] === 'fashion'; }),
                    'food' => array_filter($articles, function($a) { return $a['category'] === 'food'; }),
                    'travel' => array_filter($articles, function($a) { return $a['category'] === 'travel'; }),
                    'business' => array_filter($articles, function($a) { return $a['category'] === 'business'; }),
                    'technology' => array_filter($articles, function($a) { return $a['category'] === 'technology'; }),
                    'people' => array_filter($articles, function($a) { return $a['category'] === 'people'; }),
                    'culture' => array_filter($articles, function($a) { return $a['category'] === 'culture'; }),
                    'entertainment' => array_filter($articles, function($a) { return $a['category'] === 'entertainment'; })
                ],
                'last_updated' => date('c'),
                'total_articles' => count($articles)
            ];

            return $this->respond($response);
            
        } catch (Exception $e) {
            return $this->fail('Homepage error: ' . $e->getMessage(), 500);
        }
    }

    private function getFallbackContent()
    {
        try {
            // Get trending articles (by views)
            $trending = $this->articleModel->orderBy('views', 'DESC')->limit(4)->findAll();
            
            // Get latest articles
            $latest = $this->articleModel->orderBy('created_at', 'DESC')->limit(6)->findAll();
            
            // Get featured articles
            $featured = $this->articleModel->where('featured', 1)->limit(3)->findAll();
            if (empty($featured)) {
                $featured = $this->articleModel->orderBy('views', 'DESC')->limit(3)->findAll();
            }

            // Parse JSON fields
            foreach ([$trending, $latest, $featured] as $articleList) {
                foreach ($articleList as &$article) {
                    if ($article['tags']) {
                        $article['tags'] = json_decode($article['tags']);
                    }
                }
            }

            return $this->respond([
                'hero_article' => !empty($featured) ? $featured[0] : null,
                'sections' => [
                    'featured' => $featured,
                    'trending' => $trending,
                    'latest' => $latest
                ],
                'fallback' => true
            ]);
            
        } catch (Exception $e) {
            log_message('error', 'Fallback error: ' . $e->getMessage());
            return $this->fail('Failed to load homepage content', 500);
        }
    }
}