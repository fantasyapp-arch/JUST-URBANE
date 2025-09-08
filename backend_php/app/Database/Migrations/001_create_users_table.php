<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUsersTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 36,
                'primary'        => true,
            ],
            'email' => [
                'type'           => 'VARCHAR',
                'constraint'     => 255,
                'unique'         => true,
            ],
            'full_name' => [
                'type'           => 'VARCHAR',
                'constraint'     => 255,
            ],
            'hashed_password' => [
                'type'           => 'VARCHAR',
                'constraint'     => 255,
            ],
            'is_premium' => [
                'type'           => 'BOOLEAN',
                'default'        => false,
            ],
            'subscription_type' => [
                'type'           => 'VARCHAR',
                'constraint'     => 50,
                'null'           => true,
            ],
            'subscription_status' => [
                'type'           => 'VARCHAR',
                'constraint'     => 50,
                'null'           => true,
            ],
            'subscription_expires_at' => [
                'type'           => 'DATETIME',
                'null'           => true,
            ],
            'created_at' => [
                'type'           => 'DATETIME',
                'default'        => 'CURRENT_TIMESTAMP',
            ],
            'updated_at' => [
                'type'           => 'DATETIME',
                'default'        => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
            ],
        ]);

        $this->forge->addKey('email');
        $this->forge->createTable('users');
    }

    public function down()
    {
        $this->forge->dropTable('users');
    }
}