<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAdminUsersTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => '36',
            ],
            'username' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'unique'     => true,
            ],
            'hashed_password' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'full_name' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'unique'     => true,
            ],
            'is_super_admin' => [
                'type'       => 'BOOLEAN',
                'default'    => false,
            ],
            'last_login' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->createTable('admin_users');

        // Insert default admin user
        $data = [
            'id' => sprintf(
                '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            ),
            'username' => 'admin',
            'hashed_password' => password_hash('admin123', PASSWORD_DEFAULT),
            'full_name' => 'Just Urbane Admin',
            'email' => 'admin@justurbane.com',
            'is_super_admin' => true,
            'created_at' => date('Y-m-d H:i:s'),
        ];

        $this->db->table('admin_users')->insert($data);
    }

    public function down()
    {
        $this->forge->dropTable('admin_users');
    }
}