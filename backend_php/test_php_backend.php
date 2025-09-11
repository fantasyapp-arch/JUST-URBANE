<?php

/**
 * Just Urbane PHP Backend Test Suite
 * 
 * This script tests all admin panel functionality to ensure
 * the PHP backend is working correctly with the React frontend.
 */

class BackendTester
{
    private $baseUrl;
    private $adminToken;

    public function __construct($baseUrl = 'http://localhost:8001')
    {
        $this->baseUrl = rtrim($baseUrl, '/');
        echo "=== Just Urbane PHP Backend Test Suite ===\n";
        echo "Testing: {$this->baseUrl}\n\n";
    }

    public function runAllTests()
    {
        $testResults = [
            'health_check' => $this->testHealthCheck(),
            'admin_login' => $this->testAdminLogin(),
            'dashboard_stats' => $this->testDashboardStats(),
            'articles_crud' => $this->testArticlesCRUD(),
            'magazines_crud' => $this->testMagazinesCRUD(),
            'media_management' => $this->testMediaManagement(),
            'homepage_management' => $this->testHomepageManagement(),
        ];

        $this->displayResults($testResults);
    }

    private function testHealthCheck()
    {
        echo "🔍 Testing health check...\n";
        
        try {
            $response = $this->makeRequest('GET', '/api/health');
            
            if ($response['status'] === 200 && 
                isset($response['data']['status']) && 
                $response['data']['status'] === 'healthy') {
                echo "   ✅ Health check passed\n";
                return true;
            } else {
                echo "   ❌ Health check failed\n";
                return false;
            }
        } catch (Exception $e) {
            echo "   ❌ Health check error: " . $e->getMessage() . "\n";
            return false;
        }
    }

    private function testAdminLogin()
    {
        echo "\n🔐 Testing admin login...\n";
        
        try {
            $response = $this->makeRequest('POST', '/api/admin/login', [
                'username' => 'admin',
                'password' => 'admin123'
            ]);
            
            if ($response['status'] === 200 && isset($response['data']['access_token'])) {
                $this->adminToken = $response['data']['access_token'];
                echo "   ✅ Admin login successful\n";
                echo "   🔑 Token: " . substr($this->adminToken, 0, 20) . "...\n";
                return true;
            } else {
                echo "   ❌ Admin login failed\n";
                return false;
            }
        } catch (Exception $e) {
            echo "   ❌ Admin login error: " . $e->getMessage() . "\n";
            return false;
        }
    }

    private function testDashboardStats()
    {
        echo "\n📊 Testing dashboard stats...\n";
        
        if (!$this->adminToken) {
            echo "   ❌ No admin token available\n";
            return false;
        }

        try {
            $response = $this->makeRequest('GET', '/api/admin/dashboard/stats', null, [
                'Authorization: Bearer ' . $this->adminToken
            ]);
            
            if ($response['status'] === 200) {
                $stats = $response['data'];
                echo "   ✅ Dashboard stats retrieved\n";
                echo "   📄 Articles: " . ($stats['total_articles'] ?? 0) . "\n";
                echo "   📖 Magazines: " . ($stats['total_magazines'] ?? 0) . "\n";
                echo "   👥 Users: " . ($stats['total_users'] ?? 0) . "\n";
                echo "   💰 Revenue: ₹" . ($stats['total_revenue'] ?? 0) . "\n";
                return true;
            } else {
                echo "   ❌ Dashboard stats failed\n";
                return false;
            }
        } catch (Exception $e) {
            echo "   ❌ Dashboard stats error: " . $e->getMessage() . "\n";
            return false;
        }
    }

    private function testArticlesCRUD()
    {
        echo "\n📄 Testing articles CRUD...\n";
        
        if (!$this->adminToken) {
            echo "   ❌ No admin token available\n";
            return false;
        }

        $headers = ['Authorization: Bearer ' . $this->adminToken];
        $testsPassed = 0;
        $totalTests = 4;

        try {
            // Test: List articles
            $response = $this->makeRequest('GET', '/api/admin/articles', null, $headers);
            if ($response['status'] === 200) {
                echo "   ✅ Articles list retrieved\n";
                $testsPassed++;
            } else {
                echo "   ❌ Articles list failed\n";
            }

            // Test: Create article
            $testArticle = [
                'title' => 'Test Article ' . time(),
                'body' => 'This is a test article created by the test suite.',
                'author_name' => 'Test Author',
                'category' => 'technology',
                'summary' => 'Test article summary',
                'tags' => ['test', 'automation']
            ];

            $response = $this->makeRequest('POST', '/api/admin/articles', $testArticle, $headers);
            if ($response['status'] === 201) {
                $articleId = $response['data']['id'];
                echo "   ✅ Article created (ID: $articleId)\n";
                $testsPassed++;

                // Test: Get single article
                $response = $this->makeRequest('GET', "/api/admin/articles/$articleId", null, $headers);
                if ($response['status'] === 200) {
                    echo "   ✅ Single article retrieved\n";
                    $testsPassed++;
                } else {
                    echo "   ❌ Single article retrieval failed\n";
                }

                // Test: Delete article
                $response = $this->makeRequest('DELETE', "/api/admin/articles/$articleId", null, $headers);
                if ($response['status'] === 200) {
                    echo "   ✅ Article deleted\n";
                    $testsPassed++;
                } else {
                    echo "   ❌ Article deletion failed\n";
                }
            } else {
                echo "   ❌ Article creation failed\n";
            }

        } catch (Exception $e) {
            echo "   ❌ Articles CRUD error: " . $e->getMessage() . "\n";
        }

        return $testsPassed === $totalTests;
    }

    private function testMagazinesCRUD()
    {
        echo "\n📖 Testing magazines CRUD...\n";
        
        if (!$this->adminToken) {
            echo "   ❌ No admin token available\n";
            return false;
        }

        $headers = ['Authorization: Bearer ' . $this->adminToken];

        try {
            // Test: List magazines
            $response = $this->makeRequest('GET', '/api/admin/magazines', null, $headers);
            if ($response['status'] === 200) {
                echo "   ✅ Magazines list retrieved\n";
                return true;
            } else {
                echo "   ❌ Magazines list failed\n";
                return false;
            }
        } catch (Exception $e) {
            echo "   ❌ Magazines CRUD error: " . $e->getMessage() . "\n";
            return false;
        }
    }

    private function testMediaManagement()
    {
        echo "\n🎬 Testing media management...\n";
        
        if (!$this->adminToken) {
            echo "   ❌ No admin token available\n";
            return false;
        }

        $headers = ['Authorization: Bearer ' . $this->adminToken];

        try {
            // Test: List media files
            $response = $this->makeRequest('GET', '/api/admin/media', null, $headers);
            if ($response['status'] === 200) {
                echo "   ✅ Media files list retrieved\n";
            } else {
                echo "   ❌ Media files list failed\n";
                return false;
            }

            // Test: Media stats
            $response = $this->makeRequest('GET', '/api/admin/media/stats/overview', null, $headers);
            if ($response['status'] === 200) {
                $stats = $response['data'];
                echo "   ✅ Media stats retrieved\n";
                echo "     Files: " . ($stats['total_files'] ?? 0) . "\n";
                echo "     Images: " . ($stats['total_images'] ?? 0) . "\n";
                echo "     Videos: " . ($stats['total_videos'] ?? 0) . "\n";
                return true;
            } else {
                echo "   ❌ Media stats failed\n";
                return false;
            }
        } catch (Exception $e) {
            echo "   ❌ Media management error: " . $e->getMessage() . "\n";
            return false;
        }
    }

    private function testHomepageManagement()
    {
        echo "\n🏠 Testing homepage management...\n";
        
        if (!$this->adminToken) {
            echo "   ❌ No admin token available\n";
            return false;
        }

        $headers = ['Authorization: Bearer ' . $this->adminToken];

        try {
            // Test: Get homepage content
            $response = $this->makeRequest('GET', '/api/admin/homepage/content', null, $headers);
            if ($response['status'] === 200) {
                echo "   ✅ Homepage content retrieved\n";
            } else {
                echo "   ❌ Homepage content failed\n";
                return false;
            }

            // Test: Get available articles
            $response = $this->makeRequest('GET', '/api/admin/homepage/articles/available', null, $headers);
            if ($response['status'] === 200) {
                echo "   ✅ Available articles retrieved\n";
                return true;
            } else {
                echo "   ❌ Available articles failed\n";
                return false;
            }
        } catch (Exception $e) {
            echo "   ❌ Homepage management error: " . $e->getMessage() . "\n";
            return false;
        }
    }

    private function makeRequest($method, $endpoint, $data = null, $headers = [])
    {
        $url = $this->baseUrl . $endpoint;
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => array_merge([
                'Content-Type: application/json',
                'Accept: application/json'
            ], $headers),
            CURLOPT_TIMEOUT => 30
        ]);

        if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new Exception("cURL Error: $error");
        }

        return [
            'status' => $httpCode,
            'data' => json_decode($response, true) ?: $response
        ];
    }

    private function displayResults($results)
    {
        echo "\n" . str_repeat("=", 50) . "\n";
        echo "TEST RESULTS SUMMARY\n";
        echo str_repeat("=", 50) . "\n";

        $passed = 0;
        $total = count($results);

        foreach ($results as $test => $result) {
            $status = $result ? "✅ PASS" : "❌ FAIL";
            $testName = str_replace('_', ' ', strtoupper($test));
            echo sprintf("%-25s %s\n", $testName, $status);
            
            if ($result) $passed++;
        }

        echo str_repeat("-", 50) . "\n";
        echo sprintf("TOTAL: %d/%d tests passed (%.1f%%)\n", $passed, $total, ($passed/$total)*100);

        if ($passed === $total) {
            echo "\n🎉 ALL TESTS PASSED! PHP backend is working correctly.\n";
            echo "✅ Ready for production deployment.\n";
        } else {
            echo "\n⚠️  Some tests failed. Check the logs above for details.\n";
            echo "🔧 Fix the issues before deploying to production.\n";
        }
    }
}

// Run tests
if (php_sapi_name() === 'cli') {
    $baseUrl = $argv[1] ?? 'http://localhost:8001';
    $tester = new BackendTester($baseUrl);
    $tester->runAllTests();
} else {
    echo "This script must be run from the command line.\n";
    echo "Usage: php test_php_backend.php [base_url]\n";
}