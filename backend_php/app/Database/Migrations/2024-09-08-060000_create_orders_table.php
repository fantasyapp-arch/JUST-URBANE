<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 36,
                'primary'        => true,
            ],
            'razorpay_order_id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 100,
                'unique'         => true,
            ],
            'user_id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 36,
                'null'           => true,
            ],
            'customer_details' => [
                'type'           => 'JSON',
            ],
            'package_id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 50,
            ],
            'amount' => [
                'type'           => 'DECIMAL',
                'constraint'     => '10,2',
            ],
            'currency' => [
                'type'           => 'VARCHAR',
                'constraint'     => 3,
                'default'        => 'INR',
            ],
            'status' => [
                'type'           => 'VARCHAR',
                'constraint'     => 20,
                'default'        => 'created',
            ],
            'payment_method' => [
                'type'           => 'VARCHAR',
                'constraint'     => 20,
                'default'        => 'razorpay',
            ],
            'razorpay_payment_id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 100,
                'null'           => true,
            ],
            'razorpay_signature' => [
                'type'           => 'VARCHAR',
                'constraint'     => 255,
                'null'           => true,
            ],
            'webhook_received' => [
                'type'           => 'BOOLEAN',
                'default'        => false,
            ],
            'webhook_at' => [
                'type'           => 'DATETIME',
                'null'           => true,
            ],
            'completed_at' => [
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

        $this->forge->addKey('user_id');
        $this->forge->addKey('status');
        $this->forge->createTable('orders');
    }

    public function down()
    {
        $this->forge->dropTable('orders');
    }
}