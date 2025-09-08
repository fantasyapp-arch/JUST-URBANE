<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $header = $request->getHeader('Authorization');
        if (!$header || !$header->getValue()) {
            return service('response')->setJSON(['error' => 'Unauthorized'])->setStatusCode(401);
        }

        $token = str_replace('Bearer ', '', $header->getValue());
        
        try {
            $key = env('jwt.secret_key', 'your-secret-key');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            
            // Store user info in request for use in controllers
            $userModel = new \App\Models\UserModel();
            $user = $userModel->where('email', $decoded->sub)->first();
            
            if (!$user) {
                return service('response')->setJSON(['error' => 'User not found'])->setStatusCode(401);
            }
            
            $request->user = $user;
            
        } catch (Exception $e) {
            return service('response')->setJSON(['error' => 'Invalid token'])->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Nothing to do here
    }
}