<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Reviews extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        // Return empty array for now - reviews functionality can be added later
        return $this->respond([]);
    }
}