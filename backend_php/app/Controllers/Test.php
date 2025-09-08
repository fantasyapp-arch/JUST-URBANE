<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ArticleModel;

class Test extends ResourceController
{
    protected $format = 'json';

    public function articles()
    {
        try {
            $articleModel = new ArticleModel();
            $articles = $articleModel->limit(3)->findAll();
            
            return $this->respond([
                'status' => 'success',
                'count' => count($articles),
                'articles' => $articles
            ]);
        } catch (Exception $e) {
            return $this->fail('Error: ' . $e->getMessage());
        }
    }
}