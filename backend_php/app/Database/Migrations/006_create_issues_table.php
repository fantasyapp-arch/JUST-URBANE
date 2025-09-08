<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateIssuesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 36,
                'primary'        => true,
            ],
            'title' => [
                'type'           => 'VARCHAR',
                'constraint'     => 255,
            ],
            'cover_image' => [
                'type'           => 'VARCHAR',
                'constraint'     => 500,
            ],
            'description' => [
                'type'           => 'TEXT',
            ],
            'month' => [
                'type'           => 'VARCHAR',
                'constraint'     => 20,
            ],
            'year' => [
                'type'           => 'INT',
            ],
            'pages' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'is_digital' => [
                'type'           => 'BOOLEAN',
                'default'        => true,
            ],
            'published_at' => [
                'type'           => 'DATETIME',
                'default'        => 'CURRENT_TIMESTAMP',
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

        $this->forge->createTable('issues');
    }

    public function down()
    {
        $this->forge->dropTable('issues');
    }
}