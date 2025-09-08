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
    $routes->group('admin', ['filter' => 'auth'], function($routes) {
        $routes->get('dashboard', 'Admin\Dashboard::index');
        $routes->resource('magazines', ['controller' => 'Admin\Magazines']);
        $routes->resource('articles', ['controller' => 'Admin\Articles']);
        $routes->resource('media', ['controller' => 'Admin\Media']);
        $routes->post('homepage/config', 'Admin\Homepage::saveConfig');
    });
    
    // Media serving
    $routes->get('media/optimized/(:any)', 'Media::optimized/$1');
    $routes->get('media/webp/(:any)', 'Media::webp/$1');
});

// Static file serving
$routes->get('uploads/(:any)', 'Media::uploads/$1');