<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTransactionsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 36,
                'primary'        => true,
            ],
            'user_id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 36,
            ],
            'customer_details' => [
                'type'           => 'JSON',
            ],
            'razorpay_order_id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 100,
            ],
            'razorpay_payment_id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 100,
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
                'default'        => 'success',
            ],
            'payment_method' => [
                'type'           => 'VARCHAR',
                'constraint'     => 20,
                'default'        => 'razorpay',
            ],
            'created_at' => [
                'type'           => 'DATETIME',
                'default'        => 'CURRENT_TIMESTAMP',
            ],
        ]);

        $this->forge->addKey('user_id');
        $this->forge->addKey('status');
        $this->forge->createTable('transactions');
    }

    public function down()
    {
        $this->forge->dropTable('transactions');
    }
}