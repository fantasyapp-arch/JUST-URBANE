<?php
/**
 * Laravel Database Seeder for Just Urbane
 * Complete data import for Laravel deployment
 */

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class JustUrbaneCompleteSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Clear existing data
        DB::table('users')->truncate();
        DB::table('articles')->truncate();
        DB::table('categories')->truncate();
        DB::table('orders')->truncate();
        DB::table('transactions')->truncate();
        DB::table('homepage_config')->truncate();

        // Seed Categories
        $this->seedCategories();
        
        // Seed Users (sample data)
        $this->seedUsers();
        
        // Seed Articles
        $this->seedArticles();
        
        // Seed Homepage Config
        $this->seedHomepageConfig();

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('✅ Just Urbane database seeded successfully!');
    }

    private function seedCategories()
    {
        $categories = [
            [
                'id' => '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
                'name' => 'fashion',
                'display_name' => 'Fashion',
                'description' => 'Latest fashion trends, style guides, and designer insights',
                'subcategories' => json_encode(['men', 'women', 'accessories', 'designer']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7',
                'name' => 'technology',
                'display_name' => 'Technology',
                'description' => 'Tech news, gadgets, and innovation coverage',
                'subcategories' => json_encode(['gadgets', 'software', 'ai', 'mobile']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '3c4d5e6f-7g8h-9i0j-1k2l-m3n4o5p6q7r8',
                'name' => 'travel',
                'display_name' => 'Travel',
                'description' => 'Travel guides, destinations, and luxury experiences',
                'subcategories' => json_encode(['destinations', 'luxury', 'guides', 'hotels']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '4d5e6f7g-8h9i-0j1k-2l3m-n4o5p6q7r8s9',
                'name' => 'people',
                'display_name' => 'People',
                'description' => 'Interviews, profiles, and personality features',
                'subcategories' => json_encode(['interviews', 'profiles', 'celebrity', 'influencers']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '5e6f7g8h-9i0j-1k2l-3m4n-o5p6q7r8s9t0',
                'name' => 'luxury',
                'display_name' => 'Luxury',
                'description' => 'Luxury lifestyle, products, and experiences',
                'subcategories' => json_encode(['watches', 'cars', 'jewelry', 'lifestyle']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '6f7g8h9i-0j1k-2l3m-4n5o-p6q7r8s9t0u1',
                'name' => 'food',
                'display_name' => 'Food',
                'description' => 'Restaurant reviews, culinary experiences, and gastronomy',
                'subcategories' => json_encode(['restaurants', 'reviews', 'cuisine', 'fine-dining']),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        DB::table('categories')->insert($categories);
        $this->command->info('✅ Categories seeded');
    }

    private function seedUsers()
    {
        $users = [
            [
                'id' => 'admin-user-1234-5678-9012-345678901234',
                'email' => 'admin@justurbane.com',
                'full_name' => 'Just Urbane Admin',
                'hashed_password' => Hash::make('admin123'),
                'is_premium' => true,
                'subscription_type' => 'admin',
                'subscription_status' => 'active',
                'subscription_expires_at' => now()->addYears(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'demo-user-1234-5678-9012-345678901234',
                'email' => 'demo@example.com',
                'full_name' => 'Demo User',
                'hashed_password' => Hash::make('demo123'),
                'is_premium' => true,
                'subscription_type' => 'digital_annual',
                'subscription_status' => 'active',
                'subscription_expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        DB::table('users')->insert($users);
        $this->command->info('✅ Users seeded');
    }

    private function seedArticles()
    {
        $articles = [
            [
                'id' => 'article-celini-1234-5678-9012-345678901234',
                'title' => 'A bit of Italiano at the newly re-launched Celini',
                'slug' => 'celini-italian-restaurant-mumbai-review',
                'body' => '"Nowness in a little over a dozen dishes". Somewhere I had read these words, describing a new restaurant entrant in some part of the world, for its menu. And I could co-relate it to this restaurant\'s menu when I skimmed through it.\n\nMenus can do it. Capture a moment in time. Celini, Mumbai\'s classic fine dining Italian relaunched in time when the economy resurrects and ups its pace. It\'s all very 2022! Smart, keenly priced, ingredient led, it\'s a menu that understands our palate before even serving it to us at the table.',
                'summary' => 'A review of the newly relaunched Celini restaurant in Mumbai, featuring authentic Italian cuisine.',
                'hero_image' => 'https://customer-assets.emergentagent.com/job_just-urbane-revamp/artifacts/oaskh2yo_Celini.JPG',
                'author_name' => 'Team Urbane',
                'category' => 'food',
                'subcategory' => 'restaurant-review',
                'tags' => json_encode(['Italian Cuisine', 'Mumbai Restaurants', 'Fine Dining', 'Restaurant Review']),
                'featured' => true,
                'trending' => true,
                'premium' => false,
                'is_premium' => false,
                'views' => 145,
                'reading_time' => 6,
                'published_at' => now()->subDays(5),
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'id' => 'article-sunseeker-1234-5678-9012-345678901234',
                'title' => 'Sunseeker 65 Sport: The Ultimate Luxury Yacht Experience',
                'slug' => 'sunseeker-65-sport-luxury-yacht-review',
                'body' => 'The Sunseeker 65 Sport represents the pinnacle of luxury yachting, combining sleek design with unparalleled performance. This magnificent vessel offers an extraordinary blend of comfort, style, and sophistication that defines the modern luxury lifestyle.\n\nFrom its striking exterior lines to its meticulously crafted interior, every detail of the Sunseeker 65 Sport has been designed to provide an unforgettable experience on the water.',
                'summary' => 'An exclusive look at the Sunseeker 65 Sport luxury yacht and its premium features.',
                'hero_image' => 'https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/f8h9kg23_Sunseeker-Yacht.jpg',
                'author_name' => 'Luxury Editor',
                'category' => 'luxury',
                'subcategory' => 'yachts',
                'tags' => json_encode(['Luxury Yachts', 'Sunseeker', 'Marine', 'Luxury Lifestyle']),
                'featured' => true,
                'trending' => true,
                'premium' => true,
                'is_premium' => true,
                'views' => 89,
                'reading_time' => 8,
                'published_at' => now()->subDays(3),
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'id' => 'article-france-travel-1234-5678-9012-345678901234',
                'title' => 'When In France: A Luxury Travel Guide',
                'slug' => 'france-luxury-travel-guide-paris-provence',
                'body' => 'France continues to epitomize elegance, luxury, and refined living. From the bustling boulevards of Paris to the sun-kissed vineyards of Provence, this comprehensive guide explores the most exclusive destinations and experiences that France has to offer.\n\nDiscover hidden gems, Michelin-starred restaurants, luxury accommodations, and cultural experiences that define the French art de vivre.',
                'summary' => 'A comprehensive luxury travel guide to France\'s most exclusive destinations and experiences.',
                'hero_image' => 'https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/asfm7icv_Paris%20%283%29.jpg',
                'author_name' => 'Travel Correspondent',
                'category' => 'travel',
                'subcategory' => 'luxury-destinations',
                'tags' => json_encode(['France', 'Paris', 'Luxury Travel', 'European Travel']),
                'featured' => false,
                'trending' => true,
                'premium' => false,
                'is_premium' => false,
                'views' => 234,
                'reading_time' => 12,
                'published_at' => now()->subDays(7),
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ]
        ];

        DB::table('articles')->insert($articles);
        $this->command->info('✅ Articles seeded');
    }

    private function seedHomepageConfig()
    {
        $config = [
            'hero_article' => 'article-sunseeker-1234-5678-9012-345678901234',
            'featured_articles' => json_encode([
                'article-celini-1234-5678-9012-345678901234',
                'article-sunseeker-1234-5678-9012-345678901234',
                'article-france-travel-1234-5678-9012-345678901234'
            ]),
            'trending_articles' => json_encode([
                'article-sunseeker-1234-5678-9012-345678901234',
                'article-celini-1234-5678-9012-345678901234'
            ]),
            'latest_articles' => json_encode([
                'article-celini-1234-5678-9012-345678901234',
                'article-sunseeker-1234-5678-9012-345678901234',
                'article-france-travel-1234-5678-9012-345678901234'
            ]),
            'food_articles' => json_encode(['article-celini-1234-5678-9012-345678901234']),
            'luxury_articles' => json_encode(['article-sunseeker-1234-5678-9012-345678901234']),
            'travel_articles' => json_encode(['article-france-travel-1234-5678-9012-345678901234']),
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('homepage_config')->insert($config);
        $this->command->info('✅ Homepage configuration seeded');
    }
}