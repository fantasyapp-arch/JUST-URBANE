<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Authors extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        // Return empty array for now - authors functionality can be added later
        return $this->respond([]);
    }
}