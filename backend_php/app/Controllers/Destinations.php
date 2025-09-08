<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Destinations extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        // Return empty array for now - destinations functionality can be added later
        return $this->respond([]);
    }
}