<?php

namespace App\Models;

use CodeIgniter\Model;

class AdminUserModel extends Model
{
    protected $table = 'admin_users';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'id',
        'username', 
        'hashed_password',
        'full_name',
        'email',
        'is_super_admin',
        'created_at',
        'last_login'
    ];

    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    protected $validationRules = [
        'username' => 'required|is_unique[admin_users.username,id,{id}]|min_length[3]|max_length[50]',
        'full_name' => 'required|min_length[2]|max_length[100]',
        'email' => 'required|valid_email|is_unique[admin_users.email,id,{id}]',
        'hashed_password' => 'required'
    ];

    protected $validationMessages = [
        'username' => [
            'is_unique' => 'Username already exists'
        ],
        'email' => [
            'is_unique' => 'Email already exists'
        ]
    ];

    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    protected $allowCallbacks = true;
    protected $beforeInsert = ['generateId', 'hashPassword'];
    protected $beforeUpdate = ['hashPasswordIfProvided'];

    protected function generateId(array $data)
    {
        if (empty($data['data']['id'])) {
            $data['data']['id'] = sprintf(
                '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );
        }
        return $data;
    }

    protected function hashPassword(array $data)
    {
        if (isset($data['data']['password'])) {
            $data['data']['hashed_password'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
            unset($data['data']['password']);
        }
        return $data;
    }

    protected function hashPasswordIfProvided(array $data)
    {
        if (isset($data['data']['password'])) {
            $data['data']['hashed_password'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
            unset($data['data']['password']);
        }
        return $data;
    }

    public function createDefaultAdmin()
    {
        $existingAdmin = $this->where('username', 'admin')->first();
        if (!$existingAdmin) {
            $defaultAdmin = [
                'username' => 'admin',
                'password' => 'admin123', // This will be hashed automatically
                'full_name' => 'Just Urbane Admin',
                'email' => 'admin@justurbane.com',
                'is_super_admin' => true
            ];
            return $this->insert($defaultAdmin);
        }
        return false;
    }
}