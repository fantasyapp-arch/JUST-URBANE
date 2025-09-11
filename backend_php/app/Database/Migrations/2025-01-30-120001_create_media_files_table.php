<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateMediaFilesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => '36',
            ],
            'filename' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'file_path' => [
                'type'       => 'VARCHAR',
                'constraint' => '500',
            ],
            'file_type' => [
                'type'       => 'ENUM',
                'constraint' => ['image', 'video'],
            ],
            'file_size' => [
                'type' => 'BIGINT',
                'unsigned' => true,
            ],
            'mime_type' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'alt_text' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'tags' => [
                'type' => 'JSON',
                'null' => true,
            ],
            'resolutions' => [
                'type' => 'JSON',
                'null' => true,
            ],
            'uploaded_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('file_type');
        $this->forge->addKey('uploaded_at');
        $this->forge->createTable('media_files');
    }

    public function down()
    {
        $this->forge->dropTable('media_files');
    }
}