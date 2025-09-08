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
            // Since there's no homepage config yet, return articles organized by category
            // Get featured articles (by views)
            $featured = $this->articleModel->where('featured', 1)->limit(4)->findAll();
            if (empty($featured)) {
                $featured = $this->articleModel->orderBy('views', 'DESC')->limit(4)->findAll();
            }

            // Get trending articles (high views)
            $trending = $this->articleModel->orderBy('views', 'DESC')->limit(6)->findAll();
            
            // Get latest articles
            $latest = $this->articleModel->orderBy('created_at', 'DESC')->limit(8)->findAll();
            
            // Get articles by category
            $fashion = $this->articleModel->where('category', 'fashion')->limit(4)->findAll();
            $business = $this->articleModel->where('category', 'business')->limit(4)->findAll();
            $technology = $this->articleModel->where('category', 'technology')->limit(4)->findAll();
            $travel = $this->articleModel->where('category', 'travel')->limit(4)->findAll();
            $people = $this->articleModel->where('category', 'people')->limit(4)->findAll();
            $culture = $this->articleModel->where('category', 'culture')->limit(4)->findAll();
            $food = $this->articleModel->where('category', 'food')->limit(4)->findAll();
            $entertainment = $this->articleModel->where('category', 'entertainment')->limit(4)->findAll();

            // Parse JSON fields for all article arrays
            $articleArrays = [&$featured, &$trending, &$latest, &$fashion, &$business, &$technology, &$travel, &$people, &$culture, &$food, &$entertainment];
            
            foreach ($articleArrays as &$articles) {
                foreach ($articles as &$article) {
                    if (!empty($article['tags'])) {
                        $article['tags'] = json_decode($article['tags'], true) ?: [];
                    } else {
                        $article['tags'] = [];
                    }
                }
            }

            // Return structured data for homepage
            return $this->respond([
                'hero_article' => !empty($featured) ? $featured[0] : (!empty($latest) ? $latest[0] : null),
                'sections' => [
                    'featured' => $featured,
                    'trending' => $trending,
                    'latest' => $latest,
                    'fashion' => $fashion,
                    'business' => $business,
                    'technology' => $technology,
                    'travel' => $travel,
                    'people' => $people,
                    'culture' => $culture,
                    'food' => $food,
                    'entertainment' => $entertainment
                ],
                'last_updated' => date('c'),
                'fallback' => true
            ]);
            
        } catch (Exception $e) {
            log_message('error', 'Homepage content error: ' . $e->getMessage());
            return $this->fail('Failed to load homepage content: ' . $e->getMessage(), 500);
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