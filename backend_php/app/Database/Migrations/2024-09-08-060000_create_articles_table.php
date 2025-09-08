<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateArticlesTable extends Migration
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
                'constraint'     => 500,
            ],
            'slug' => [
                'type'           => 'VARCHAR',
                'constraint'     => 255,
                'unique'         => true,
                'null'           => true,
            ],
            'body' => [
                'type'           => 'LONGTEXT',
            ],
            'summary' => [
                'type'           => 'TEXT',
                'null'           => true,
            ],
            'hero_image' => [
                'type'           => 'VARCHAR',
                'constraint'     => 500,
                'null'           => true,
            ],
            'author_name' => [
                'type'           => 'VARCHAR',
                'constraint'     => 255,
            ],
            'category' => [
                'type'           => 'VARCHAR',
                'constraint'     => 100,
            ],
            'subcategory' => [
                'type'           => 'VARCHAR',
                'constraint'     => 100,
                'null'           => true,
            ],
            'tags' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'featured' => [
                'type'           => 'BOOLEAN',
                'default'        => false,
            ],
            'trending' => [
                'type'           => 'BOOLEAN',
                'default'        => false,
            ],
            'premium' => [
                'type'           => 'BOOLEAN',
                'default'        => false,
            ],
            'is_premium' => [
                'type'           => 'BOOLEAN',
                'default'        => false,
            ],
            'views' => [
                'type'           => 'INT',
                'default'        => 0,
            ],
            'reading_time' => [
                'type'           => 'INT',
                'null'           => true,
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

        $this->forge->addKey(['category', 'subcategory']);
        $this->forge->addKey('featured');
        $this->forge->addKey('trending');
        $this->forge->addKey('premium');
        $this->forge->addKey('views');
        $this->forge->addKey('published_at');
        $this->forge->createTable('articles');
    }

    public function down()
    {
        $this->forge->dropTable('articles');
    }
}