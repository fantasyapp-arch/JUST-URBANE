<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Models\OrderModel;
use App\Models\TransactionModel;
use Razorpay\Api\Api;
use Firebase\JWT\JWT;
use Exception;

class Payment extends ResourceController
{
    protected $format = 'json';
    protected $userModel;
    protected $orderModel;
    protected $transactionModel;
    protected $razorpayApi;
    protected $subscriptionPackages;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->orderModel = new OrderModel();
        $this->transactionModel = new TransactionModel();
        
        // Initialize Razorpay
        $keyId = env('razorpay.key_id');
        $keySecret = env('razorpay.key_secret');
        
        if ($keyId && $keySecret) {
            $this->razorpayApi = new Api($keyId, $keySecret);
        }

        // Subscription packages matching the original
        $this->subscriptionPackages = [
            'digital_annual' => [
                'name' => 'Digital Subscription',
                'price' => 1.0,
                'currency' => 'INR',
                'features' => [
                    'Unlimited premium articles access',
                    'Ad-free reading experience',
                    'Weekly exclusive newsletter',
                    'Mobile app with offline reading',
                    'Digital magazine archive',
                    'Premium podcast episodes',
                    'Early access to new content',
                    'Cross-device synchronization'
                ],
                'billing_period' => 'annual',
                'popular' => true
            ],
            'print_annual' => [
                'name' => 'Print Subscription',
                'price' => 499.0,
                'currency' => 'INR',
                'features' => [
                    'Monthly premium print magazine',
                    'High-quality paper and printing',
                    'Collector\'s edition covers',
                    'Exclusive print-only content',
                    'Free shipping across India',
                    'Gift subscription options',
                    'Premium packaging',
                    'Vintage cover reprints access'
                ],
                'billing_period' => 'annual',
                'popular' => false
            ],
            'combined_annual' => [
                'name' => 'Print + Digital Subscription',
                'price' => 999.0,
                'currency' => 'INR',
                'features' => [
                    'Everything in Digital Subscription',
                    'Everything in Print Subscription',
                    'Monthly premium print delivery',
                    'Complete digital library access',
                    'Exclusive subscriber events',
                    'Priority customer support',
                    'Behind-the-scenes content',
                    'Special edition magazines'
                ],
                'billing_period' => 'annual',
                'popular' => false
            ]
        ];
    }

    public function packages()
    {
        $packages = [];
        foreach ($this->subscriptionPackages as $id => $package) {
            $packages[] = array_merge(['id' => $id], $package);
        }

        return $this->respond(['packages' => $packages]);
    }

    public function createRazorpayOrder()
    {
        if (!$this->razorpayApi) {
            return $this->fail('Razorpay not configured', 500);
        }

        $rules = [
            'package_id' => 'required',
            'customer_details.email' => 'required|valid_email',
            'customer_details.full_name' => 'required',
            'customer_details.phone' => 'required',
            'customer_details.password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getJSON(true);
        $packageId = $data['package_id'];
        $customerDetails = $data['customer_details'];

        // Get package details
        if (!isset($this->subscriptionPackages[$packageId])) {
            return $this->fail('Package not found', 404);
        }

        $package = $this->subscriptionPackages[$packageId];

        // Validate address for print subscriptions
        if (in_array($packageId, ['print_annual', 'combined_annual'])) {
            $requiredFields = ['address_line_1', 'city', 'state', 'postal_code'];
            foreach ($requiredFields as $field) {
                if (empty($customerDetails[$field])) {
                    return $this->fail("Address field required for print subscription: {$field}", 400);
                }
            }
        }

        try {
            // Create Razorpay order
            $amountInPaise = (int)($package['price'] * 100);
            $receiptId = substr('ord_' . $packageId . '_' . substr($customerDetails['email'], 0, 8) . '_' . time(), 0, 40);
            
            $razorpayOrder = $this->razorpayApi->order->create([
                'amount' => $amountInPaise,
                'currency' => $package['currency'],
                'receipt' => $receiptId,
                'notes' => [
                    'package_id' => $packageId,
                    'user_email' => $customerDetails['email'],
                    'customer_name' => $customerDetails['full_name']
                ]
            ]);

            // Store order in database
            $orderData = [
                'id' => $this->generateUUID(),
                'razorpay_order_id' => $razorpayOrder['id'],
                'user_id' => null, // Guest order
                'customer_details' => json_encode($customerDetails),
                'package_id' => $packageId,
                'amount' => $package['price'],
                'currency' => $package['currency'],
                'status' => 'created',
                'payment_method' => 'razorpay'
            ];

            $this->orderModel->insert($orderData);

            return $this->respond([
                'order_id' => $razorpayOrder['id'],
                'amount' => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'key_id' => env('razorpay.key_id'),
                'package_id' => $packageId,
                'package_name' => $package['name'],
                'customer_details' => $customerDetails
            ]);

        } catch (Exception $e) {
            return $this->fail('Failed to create order: ' . $e->getMessage(), 500);
        }
    }

    public function verifyRazorpayPayment()
    {
        if (!$this->razorpayApi) {
            return $this->fail('Razorpay not configured', 500);
        }

        $rules = [
            'razorpay_order_id' => 'required',
            'razorpay_payment_id' => 'required',
            'razorpay_signature' => 'required',
            'package_id' => 'required',
            'customer_details.email' => 'required|valid_email',
            'customer_details.password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        try {
            $data = $this->request->getJSON(true);
            
            // Verify payment signature
            $signature = $data['razorpay_signature'];
            $orderId = $data['razorpay_order_id'];
            $paymentId = $data['razorpay_payment_id'];
            
            $generatedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, env('razorpay.key_secret'));
            
            if ($signature !== $generatedSignature) {
                return $this->fail('Invalid payment signature', 400);
            }

            // Get package details
            if (!isset($this->subscriptionPackages[$data['package_id']])) {
                return $this->fail('Package not found', 404);
            }

            $package = $this->subscriptionPackages[$data['package_id']];

            // Update order status
            $this->orderModel->where('razorpay_order_id', $orderId)->set([
                'status' => 'completed',
                'razorpay_payment_id' => $paymentId,
                'razorpay_signature' => $signature,
                'completed_at' => date('Y-m-d H:i:s')
            ])->update();

            // Check if user exists, if not create new user
            $customerEmail = $data['customer_details']['email'];
            $existingUser = $this->userModel->where('email', $customerEmail)->first();
            
            // Determine if user gets digital magazine access
            $hasDigitalAccess = in_array($data['package_id'], ['digital_annual', 'combined_annual']);
            
            if (!$existingUser) {
                // Create new user
                $userData = [
                    'id' => $this->generateUUID(),
                    'email' => $customerEmail,
                    'full_name' => $data['customer_details']['full_name'],
                    'hashed_password' => password_hash($data['customer_details']['password'], PASSWORD_DEFAULT),
                    'is_premium' => $hasDigitalAccess,
                    'subscription_type' => $data['package_id'],
                    'subscription_status' => 'active',
                    'subscription_expires_at' => date('Y-m-d H:i:s', strtotime('+1 year'))
                ];
                $this->userModel->insert($userData);
                $userId = $userData['id'];
            } else {
                // Update existing user
                $this->userModel->where('email', $customerEmail)->set([
                    'hashed_password' => password_hash($data['customer_details']['password'], PASSWORD_DEFAULT),
                    'is_premium' => $hasDigitalAccess,
                    'subscription_type' => $data['package_id'],
                    'subscription_status' => 'active',
                    'subscription_expires_at' => date('Y-m-d H:i:s', strtotime('+1 year'))
                ])->update();
                $userId = $existingUser['id'];
            }

            // Store transaction record
            $transactionData = [
                'id' => $this->generateUUID(),
                'user_id' => $userId,
                'customer_details' => json_encode($data['customer_details']),
                'razorpay_order_id' => $orderId,
                'razorpay_payment_id' => $paymentId,
                'package_id' => $data['package_id'],
                'amount' => $package['price'],
                'currency' => $package['currency'],
                'status' => 'success',
                'payment_method' => 'razorpay'
            ];

            $this->transactionModel->insert($transactionData);

            // Generate access token for auto-login
            $accessToken = $this->createAccessToken($customerEmail);

            // Get user data for response
            $userData = $this->userModel->where('email', $customerEmail)->first();
            unset($userData['hashed_password']);

            return $this->respond([
                'status' => 'success',
                'message' => 'Payment verified and subscription activated',
                'subscription_type' => $data['package_id'],
                'has_digital_access' => $hasDigitalAccess,
                'expires_at' => date('c', strtotime('+1 year')),
                'user_created' => $existingUser === null,
                'access_token' => $accessToken,
                'token_type' => 'bearer',
                'user' => $userData
            ]);

        } catch (Exception $e) {
            return $this->fail('Payment verification failed: ' . $e->getMessage(), 500);
        }
    }

    public function razorpayWebhook()
    {
        try {
            $input = $this->request->getBody();
            $signature = $this->request->getHeader('X-Razorpay-Signature');
            
            if (!$signature) {
                return $this->fail('Missing signature', 400);
            }

            $webhookData = json_decode($input, true);
            $event = $webhookData['event'] ?? '';

            if ($event === 'payment.captured') {
                $paymentEntity = $webhookData['payload']['payment']['entity'] ?? [];
                $orderId = $paymentEntity['order_id'] ?? '';

                if ($orderId) {
                    // Update order with webhook confirmation
                    $this->orderModel->where('razorpay_order_id', $orderId)->set([
                        'webhook_received' => true,
                        'webhook_at' => date('Y-m-d H:i:s')
                    ])->update();
                }
            }

            return $this->respond(['status' => 'success']);

        } catch (Exception $e) {
            return $this->fail('Webhook processing failed: ' . $e->getMessage(), 500);
        }
    }

    private function createAccessToken($email)
    {
        $key = env('jwt.secret_key', 'your-secret-key');
        $payload = [
            'sub' => $email,
            'iat' => time(),
            'exp' => time() + (30 * 60) // 30 minutes
        ];

        return JWT::encode($payload, $key, 'HS256');
    }

    private function generateUUID()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}