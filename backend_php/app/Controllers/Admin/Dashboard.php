<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ArticleModel;
use App\Models\IssueModel;
use App\Models\UserModel;
use App\Models\TransactionModel;
use App\Models\AdminUserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class Dashboard extends ResourceController
{
    protected $format = 'json';
    protected $adminUserModel;
    protected $articleModel;
    protected $issueModel;
    protected $userModel;
    protected $transactionModel;

    public function __construct()
    {
        $this->adminUserModel = new AdminUserModel();
        $this->articleModel = new ArticleModel();
        $this->issueModel = new IssueModel();
        $this->userModel = new UserModel();
        $this->transactionModel = new TransactionModel();
        helper(['date']);
    }

    public function stats()
    {
        $adminUser = $this->getCurrentAdminUser();
        if (!$adminUser) {
            return $this->fail(['detail' => 'Could not validate admin credentials'], 401);
        }

        // Get basic counts
        $totalArticles = $this->articleModel->countAllResults();
        $totalMagazines = $this->issueModel->countAllResults();
        $totalUsers = $this->userModel->countAllResults();
        $totalSubscribers = $this->userModel->where('is_premium', 1)->countAllResults();

        // Calculate total revenue from transactions
        $revenueQuery = $this->transactionModel->selectSum('amount')->where('status', 'success')->get();
        $revenueResult = $revenueQuery->getRowArray();
        $totalRevenue = ($revenueResult['amount'] ?? 0) / 100; // Convert from paise to rupees

        // Get popular articles (top 5 by views)
        $popularArticles = $this->articleModel
            ->select('id, title, views, category')
            ->orderBy('views', 'DESC')
            ->limit(5)
            ->findAll();

        // Get recent activities (recent articles and transactions)
        $recentArticles = $this->articleModel
            ->select('title, category, author_name, created_at')
            ->orderBy('created_at', 'DESC')
            ->limit(3)
            ->findAll();

        $recentTransactions = $this->transactionModel
            ->select('amount, package_id, status, created_at')
            ->orderBy('created_at', 'DESC')
            ->limit(3)
            ->findAll();

        $recentActivities = [];

        // Add article activities
        foreach ($recentArticles as $article) {
            $recentActivities[] = [
                'type' => 'article_created',
                'title' => 'New article: ' . $article['title'],
                'timestamp' => $article['created_at'],
                'details' => [
                    'category' => $article['category'] ?? '',
                    'author' => $article['author_name'] ?? ''
                ]
            ];
        }

        // Add transaction activities
        foreach ($recentTransactions as $transaction) {
            $recentActivities[] = [
                'type' => 'payment_received',
                'title' => 'Payment received: ₹' . ($transaction['amount'] / 100),
                'timestamp' => $transaction['created_at'],
                'details' => [
                    'package' => $transaction['package_id'] ?? '',
                    'status' => $transaction['status'] ?? ''
                ]
            ];
        }

        // Sort recent activities by timestamp (newest first)
        usort($recentActivities, function($a, $b) {
            return strtotime($b['timestamp']) - strtotime($a['timestamp']);
        });

        $recentActivities = array_slice($recentActivities, 0, 10);

        return $this->respond([
            'total_articles' => $totalArticles,
            'total_magazines' => $totalMagazines,
            'total_users' => $totalUsers,
            'total_subscribers' => $totalSubscribers,
            'total_revenue' => $totalRevenue,
            'revenue' => $totalRevenue, // For compatibility
            'monthly_visitors' => 0, // TODO: Implement visitor tracking
            'popular_articles' => $popularArticles,
            'recent_activities' => $recentActivities
        ]);
    }

    private function getCurrentAdminUser()
    {
        $header = $this->request->getHeader('Authorization');
        if (!$header || !$header->getValue()) {
            return null;
        }

        $token = str_replace('Bearer ', '', $header->getValue());
        
        try {
            $key = env('JWT_SECRET_KEY', 'admin-super-secret-key-2025');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            
            // Check if it's an admin token
            if (!isset($decoded->type) || $decoded->type !== 'admin') {
                return null;
            }
            
            $adminUser = $this->adminUserModel->where('username', $decoded->sub)->first();
            return $adminUser;
        } catch (Exception $e) {
            return null;
        }
    }
}