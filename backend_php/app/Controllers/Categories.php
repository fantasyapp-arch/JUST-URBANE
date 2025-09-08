<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CategoryModel;

class Categories extends ResourceController
{
    protected $format = 'json';
    protected $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new CategoryModel();
    }

    public function index()
    {
        $categories = $this->categoryModel->findAll();
        
        // Parse JSON fields
        foreach ($categories as &$category) {
            if ($category['subcategories']) {
                $category['subcategories'] = json_decode($category['subcategories']);
            }
        }

        return $this->respond($categories);
    }
}