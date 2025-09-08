<?php
// Direct PHP test to check what's happening
require_once '/app/backend_php/vendor/autoload.php';

// Test database connection
try {
    $db = new PDO('mysql:host=localhost;dbname=just_urbane_php', 'urbane_user', 'urbane_password');
    echo "✅ Database connection successful\n";
    
    // Test articles query
    $stmt = $db->query("SELECT COUNT(*) as count FROM articles");
    $result = $stmt->fetch();
    echo "✅ Articles count: " . $result['count'] . "\n";
    
    // Test specific articles
    $stmt = $db->query("SELECT id, title, category FROM articles LIMIT 3");
    $articles = $stmt->fetchAll();
    echo "✅ Sample articles:\n";
    foreach ($articles as $article) {
        echo "  - {$article['title']} ({$article['category']})\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>