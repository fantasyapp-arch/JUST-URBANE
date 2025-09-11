<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\AdminUserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class Auth extends ResourceController
{
    protected $format = 'json';
    protected $adminUserModel;

    public function __construct()
    {
        $this->adminUserModel = new AdminUserModel();
        helper(['text', 'date']);
    }

    public function login()
    {
        $rules = [
            'username' => 'required',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getJSON(true);
        
        // Find admin user
        $adminUser = $this->adminUserModel->where('username', $data['username'])->first();
        
        if (!$adminUser || !password_verify($data['password'], $adminUser['hashed_password'])) {
            return $this->fail([
                'detail' => 'Incorrect username or password'
            ], 401);
        }

        // Update last login
        $this->adminUserModel->where('id', $adminUser['id'])->set('last_login', date('Y-m-d H:i:s'))->update();

        // Create access token (8 hours for admin)
        $token = $this->createAdminAccessToken($adminUser['username']);
        
        // Prepare user data for response
        $userData = [
            'id' => $adminUser['id'],
            'username' => $adminUser['username'],
            'full_name' => $adminUser['full_name'],
            'email' => $adminUser['email'],
            'is_super_admin' => (bool)$adminUser['is_super_admin']
        ];

        return $this->respond([
            'access_token' => $token,
            'token_type' => 'bearer',
            'admin_user' => $userData
        ]);
    }

    public function me()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        // Remove sensitive data
        unset($adminUser['hashed_password']);
        $adminUser['is_super_admin'] = (bool)$adminUser['is_super_admin'];

        return $this->respond($adminUser);
    }

    private function createAdminAccessToken($username)
    {
        $key = env('JWT_SECRET_KEY', 'admin-super-secret-key-2025');
        $payload = [
            'sub' => $username,
            'type' => 'admin',
            'iat' => time(),
            'exp' => time() + (8 * 60 * 60) // 8 hours
        ];

        return JWT::encode($payload, $key, 'HS256');
    }

    private function getCurrentAdminUser()
    {
        $header = $this->request->getHeader('Authorization');
        if (!$header || !$header->getValue()) {
            return null;
        }

        $token = str_replace('Bearer ', '', $header->getValue());
        
        try {
            $key = env('JWT_SECRET_KEY', 'admin-super-secret-key-2025');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            
            // Check if it's an admin token
            if (!isset($decoded->type) || $decoded->type !== 'admin') {
                return null;
            }
            
            $adminUser = $this->adminUserModel->where('username', $decoded->sub)->first();
            return $adminUser;
        } catch (Exception $e) {
            return null;
        }
    }
}