#!/usr/bin/env python3
"""
Test Working Admin APIs to verify what's functional
"""

import requests
import json
import time

def test_working_admin_apis():
    base_url = "https://content-phoenix.preview.emergentagent.com"
    
    # Login first
    admin_credentials = {
        "username": "admin",
        "password": "admin123"
    }
    
    session = requests.Session()
    
    # Login
    response = session.post(
        f"{base_url}/api/admin/login",
        json=admin_credentials,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    
    if response.status_code != 200:
        print(f"Login failed: {response.status_code} - {response.text}")
        return
    
    data = response.json()
    token = data["access_token"]
    session.headers.update({"Authorization": f"Bearer {token}"})
    
    print("✅ Admin login successful")
    
    # Test 1: Get articles list
    print("\n📋 Testing GET /api/admin/articles")
    response = session.get(f"{base_url}/api/admin/articles", timeout=10)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        articles = data.get("articles", [])
        print(f"✅ Retrieved {len(articles)} articles")
        
        if articles:
            test_article_id = articles[0].get("id")
            print(f"Test article ID: {test_article_id}")
            
            # Test 2: Get article for edit
            print(f"\n✏️ Testing GET /api/admin/articles/{test_article_id}/edit")
            response = session.get(f"{base_url}/api/admin/articles/{test_article_id}/edit", timeout=10)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                article = response.json()
                print(f"✅ Retrieved article for editing: {article.get('title', 'Unknown')}")
                
                # Test 3: Update article
                print(f"\n🔄 Testing PUT /api/admin/articles/{test_article_id}")
                update_data = {
                    "title": f"Updated Test Article {int(time.time())}",
                    "summary": "Updated via API test",
                    "featured": True
                }
                response = session.put(
                    f"{base_url}/api/admin/articles/{test_article_id}",
                    data=update_data,
                    timeout=10
                )
                print(f"Status: {response.status_code}")
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Article updated: {result}")
                else:
                    print(f"❌ Update failed: {response.text}")
                
                # Test 4: Update article status
                print(f"\n📢 Testing PUT /api/admin/articles/{test_article_id}/status")
                response = session.put(
                    f"{base_url}/api/admin/articles/{test_article_id}/status",
                    data={"status": "published"},
                    timeout=10
                )
                print(f"Status: {response.status_code}")
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Status updated: {result}")
                else:
                    print(f"❌ Status update failed: {response.text}")
                
                # Test 5: Duplicate article
                print(f"\n📋 Testing POST /api/admin/articles/{test_article_id}/duplicate")
                response = session.post(f"{base_url}/api/admin/articles/{test_article_id}/duplicate", timeout=10)
                print(f"Status: {response.status_code}")
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Article duplicated: {result}")
                    
                    # Clean up - delete the duplicate
                    new_article_id = result.get("new_article_id")
                    if new_article_id:
                        print(f"\n🗑️ Cleaning up duplicate article {new_article_id}")
                        response = session.delete(f"{base_url}/api/admin/articles/{new_article_id}", timeout=10)
                        print(f"Delete status: {response.status_code}")
                else:
                    print(f"❌ Duplication failed: {response.text}")
            else:
                print(f"❌ Get for edit failed: {response.text}")
    else:
        print(f"❌ Get articles failed: {response.text}")
    
    # Test 6: Check if article appears on public website
    print(f"\n🌐 Testing public article visibility")
    response = session.get(f"{base_url}/api/articles?limit=10", timeout=10)
    print(f"Public articles status: {response.status_code}")
    if response.status_code == 200:
        articles = response.json()
        print(f"✅ Public articles accessible: {len(articles)} articles")
        
        if articles:
            # Test single article access
            article_id = articles[0].get("id")
            response = session.get(f"{base_url}/api/articles/{article_id}", timeout=10)
            print(f"Single article status: {response.status_code}")
            if response.status_code == 200:
                article = response.json()
                print(f"✅ Single article accessible: {article.get('title', 'Unknown')}")
            else:
                print(f"❌ Single article failed: {response.text}")
    else:
        print(f"❌ Public articles failed: {response.text}")

if __name__ == "__main__":
    test_working_admin_apis()