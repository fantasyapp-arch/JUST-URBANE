<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ArticleModel;
use App\Models\HomepageConfigModel;

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
            // Get active homepage configuration
            $homepageConfig = $this->homepageConfigModel->where('active', 1)->first();
            
            if (!$homepageConfig) {
                // Return fallback data if no config exists
                return $this->getFallbackContent();
            }

            // Get articles by IDs
            $heroArticle = null;
            if ($homepageConfig['hero_article']) {
                $heroData = $this->articleModel->find($homepageConfig['hero_article']);
                if ($heroData) {
                    $heroArticle = $heroData;
                    if ($heroArticle['tags']) {
                        $heroArticle['tags'] = json_decode($heroArticle['tags']);
                    }
                }
            }

            $sections = [];
            
            // Get articles for each section
            $sectionTypes = ['featured', 'trending', 'latest', 'fashion', 'people', 'business', 'technology', 'travel', 'culture', 'entertainment'];
            
            foreach ($sectionTypes as $section) {
                $sectionKey = $section . '_articles';
                if (!empty($homepageConfig[$sectionKey])) {
                    $articleIds = json_decode($homepageConfig[$sectionKey], true);
                    if ($articleIds && is_array($articleIds)) {
                        $articles = [];
                        foreach (array_slice($articleIds, 0, 6) as $articleId) { // Limit to 6 articles per section
                            $article = $this->articleModel->find($articleId);
                            if ($article) {
                                if ($article['tags']) {
                                    $article['tags'] = json_decode($article['tags']);
                                }
                                $articles[] = $article;
                            }
                        }
                        $sections[$section] = $articles;
                    }
                }
            }

            return $this->respond([
                'hero_article' => $heroArticle,
                'sections' => $sections,
                'last_updated' => $homepageConfig['updated_at'] ?? date('c')
            ]);
            
        } catch (Exception $e) {
            log_message('error', 'Homepage content error: ' . $e->getMessage());
            return $this->getFallbackContent();
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