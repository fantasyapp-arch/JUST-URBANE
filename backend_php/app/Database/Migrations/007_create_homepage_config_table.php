<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateHomepageConfigTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'auto_increment' => true,
                'primary'        => true,
            ],
            'hero_article' => [
                'type'           => 'VARCHAR',
                'constraint'     => 36,
                'null'           => true,
            ],
            'featured_articles' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'trending_articles' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'latest_articles' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'fashion_articles' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'people_articles' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'business_articles' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'technology_articles' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'travel_articles' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'culture_articles' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'entertainment_articles' => [
                'type'           => 'JSON',
                'null'           => true,
            ],
            'active' => [
                'type'           => 'BOOLEAN',
                'default'        => false,
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

        $this->forge->createTable('homepage_config');
    }

    public function down()
    {
        $this->forge->dropTable('homepage_config');
    }
}