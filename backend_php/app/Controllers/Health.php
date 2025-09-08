<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Health extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        return $this->respond([
            'status' => 'healthy',
            'message' => 'Just Urbane API is running'
        ]);
    }
}