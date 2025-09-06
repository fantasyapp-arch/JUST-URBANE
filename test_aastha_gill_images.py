#!/usr/bin/env python3
"""
Test Aastha Gill Article Images
Verify all 4 image URLs from customer assets are accessible
"""

import requests
import json

def test_aastha_gill_images():
    """Test all 4 Aastha Gill article images"""
    
    # Get the article data
    response = requests.get("https://urbane-dashboard.preview.emergentagent.com/api/articles/aastha-gill-buzz-queen-bollywood-singer-interview")
    
    if response.status_code != 200:
        print(f"❌ Failed to get article: HTTP {response.status_code}")
        return False
    
    article = response.json()
    
    # Get all images
    hero_image = article.get("hero_image")
    images_list = article.get("images", [])
    
    all_images = []
    if hero_image:
        all_images.append(("Hero Image", hero_image))
    
    for i, img_url in enumerate(images_list):
        all_images.append((f"Gallery Image {i+1}", img_url))
    
    print(f"🖼️ TESTING {len(all_images)} AASTHA GILL ARTICLE IMAGES")
    print("=" * 60)
    
    accessible_count = 0
    
    for img_name, img_url in all_images:
        try:
            # Test image accessibility
            img_response = requests.head(img_url, timeout=10)
            if img_response.status_code == 200:
                accessible_count += 1
                print(f"✅ {img_name}: ACCESSIBLE")
                print(f"   URL: {img_url}")
                print(f"   Content-Type: {img_response.headers.get('Content-Type', 'Unknown')}")
                print(f"   Content-Length: {img_response.headers.get('Content-Length', 'Unknown')}")
            else:
                print(f"❌ {img_name}: NOT ACCESSIBLE (HTTP {img_response.status_code})")
                print(f"   URL: {img_url}")
        except Exception as e:
            print(f"❌ {img_name}: ERROR - {str(e)}")
            print(f"   URL: {img_url}")
        print()
    
    print("=" * 60)
    print(f"📊 RESULTS: {accessible_count}/{len(all_images)} images are accessible")
    
    if accessible_count == len(all_images):
        print("🎉 ALL AASTHA GILL IMAGES ARE ACCESSIBLE!")
        return True
    else:
        print(f"⚠️ {len(all_images) - accessible_count} images are not accessible")
        return False

if __name__ == "__main__":
    success = test_aastha_gill_images()
    exit(0 if success else 1)