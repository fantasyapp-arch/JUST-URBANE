<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\IssueModel;

class Issues extends ResourceController
{
    protected $format = 'json';
    protected $issueModel;

    public function __construct()
    {
        $this->issueModel = new IssueModel();
    }

    public function index()
    {
        $issues = $this->issueModel->orderBy('published_at', 'DESC')->findAll();
        
        // Parse JSON fields
        foreach ($issues as &$issue) {
            if ($issue['pages']) {
                $issue['pages'] = json_decode($issue['pages']);
            }
        }

        return $this->respond($issues);
    }
}