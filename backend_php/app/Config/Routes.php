<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();

// API Routes matching the original FastAPI structure
$routes->group('api', function($routes) {
    // Health check
    $routes->get('health', 'Health::index');
    
    // Test endpoint
    $routes->get('test/articles', 'Test::articles');
    
    // Authentication
    $routes->post('auth/register', 'Auth::register');
    $routes->post('auth/login', 'Auth::login');
    $routes->get('auth/me', 'Auth::me');
    
    // Payment endpoints
    $routes->get('payments/packages', 'Payment::packages');
    $routes->post('payments/razorpay/create-order', 'Payment::createRazorpayOrder');
    $routes->post('payments/razorpay/verify', 'Payment::verifyRazorpayPayment');
    $routes->post('payments/razorpay/webhook', 'Payment::razorpayWebhook');
    
    // Content endpoints
    $routes->get('articles', 'Articles::index');
    $routes->get('articles/(:segment)', 'Articles::show/$1');
    $routes->post('articles', 'Articles::create');
    
    $routes->get('categories', 'Categories::index');
    $routes->get('reviews', 'Reviews::index');
    $routes->get('issues', 'Issues::index');
    $routes->get('destinations', 'Destinations::index');
    $routes->get('authors', 'Authors::index');
    
    // Homepage content
    $routes->get('homepage/content', 'Homepage::content');
    
    // Admin routes
    $routes->group('admin', function($routes) {
        // Admin Authentication (no filter needed for login)
        $routes->post('login', 'Admin\Auth::login');
        $routes->get('me', 'Admin\Auth::me');
        
        // Dashboard and analytics
        $routes->get('dashboard/stats', 'Admin\Dashboard::stats');
        
        // Article management
        $routes->get('articles', 'Admin\Articles::index');
        $routes->get('articles/(:segment)', 'Admin\Articles::show/$1');
        $routes->post('articles', 'Admin\Articles::create');
        $routes->put('articles/(:segment)', 'Admin\Articles::update/$1');
        $routes->delete('articles/(:segment)', 'Admin\Articles::delete/$1');
        
        // Magazine management
        $routes->get('magazines', 'Admin\Magazines::index');
        $routes->get('magazines/(:segment)', 'Admin\Magazines::show/$1');
        $routes->post('magazines', 'Admin\Magazines::create');
        $routes->put('magazines/(:segment)', 'Admin\Magazines::update/$1');
        $routes->delete('magazines/(:segment)', 'Admin\Magazines::delete/$1');
        $routes->post('magazines/upload-cover', 'Admin\Magazines::uploadCover');
        
        // Media management
        $routes->get('media', 'Admin\Media::index');
        $routes->get('media/(:segment)', 'Admin\Media::show/$1');
        $routes->post('media/upload', 'Admin\Media::create');
        $routes->delete('media/(:segment)', 'Admin\Media::delete/$1');
        $routes->get('media/stats/overview', 'Admin\Media::stats');
        
        // Homepage management
        $routes->get('homepage/content', 'Admin\Homepage::content');
        $routes->get('homepage/articles/available', 'Admin\Homepage::availableArticles');
        $routes->put('homepage/hero', 'Admin\Homepage::updateHero');
        $routes->put('homepage/section/(:segment)', 'Admin\Homepage::updateSection/$1');
        $routes->post('homepage/auto-populate', 'Admin\Homepage::autoPopulate');
    });
    
    // Media serving
    $routes->get('media/optimized/(:any)', 'Media::optimized/$1');
    $routes->get('media/webp/(:any)', 'Media::webp/$1');
});

// Static file serving
$routes->get('uploads/(:any)', 'Media::uploads/$1');