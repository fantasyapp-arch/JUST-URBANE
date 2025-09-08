<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class Auth extends ResourceController
{
    protected $format = 'json';
    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
        helper('text');
    }

    public function register()
    {
        $rules = [
            'email' => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[6]',
            'full_name' => 'required|min_length[2]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getPost();
        
        // Check if user exists
        $existingUser = $this->userModel->where('email', $data['email'])->first();
        if ($existingUser) {
            return $this->fail('Email already registered', 400);
        }

        // Create new user
        $userData = [
            'id' => $this->generateUUID(),
            'email' => $data['email'],
            'full_name' => $data['full_name'],
            'hashed_password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'is_premium' => false,
            'subscription_type' => null,
            'subscription_status' => null,
            'subscription_expires_at' => null
        ];

        if (!$this->userModel->insert($userData)) {
            return $this->fail('Failed to create user', 500);
        }

        // Create access token
        $token = $this->createAccessToken($data['email']);
        
        // Remove password from response
        unset($userData['hashed_password']);

        return $this->respond([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $userData
        ]);
    }

    public function login()
    {
        $rules = [
            'email' => 'required|valid_email',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getPost();
        
        // Find user
        $user = $this->userModel->where('email', $data['email'])->first();
        
        if (!$user || !password_verify($data['password'], $user['hashed_password'])) {
            return $this->fail('Incorrect email or password', 400);
        }

        // Create access token
        $token = $this->createAccessToken($data['email']);
        
        // Remove password from response
        unset($user['hashed_password']);

        return $this->respond([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $user
        ]);
    }

    public function me()
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return $this->fail('Unauthorized', 401);
        }

        unset($user['hashed_password']);
        return $this->respond($user);
    }

    private function createAccessToken($email)
    {
        $key = env('jwt.secret_key', 'your-secret-key');
        $payload = [
            'sub' => $email,
            'iat' => time(),
            'exp' => time() + (30 * 60) // 30 minutes
        ];

        return JWT::encode($payload, $key, 'HS256');
    }

    private function getCurrentUser()
    {
        $header = $this->request->getHeader('Authorization');
        if (!$header || !$header->getValue()) {
            return null;
        }

        $token = str_replace('Bearer ', '', $header->getValue());
        
        try {
            $key = env('jwt.secret_key', 'your-secret-key');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            
            $user = $this->userModel->where('email', $decoded->sub)->first();
            return $user;
        } catch (Exception $e) {
            return null;
        }
    }

    private function generateUUID()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}