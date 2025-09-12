#!/usr/bin/env python3
"""
Debug RTF Upload Issue
"""

import requests
import tempfile
import os
import json

def test_rtf_upload_debug():
    base_url = "https://admin-fix-urbane.preview.emergentagent.com"
    
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
    
    # Create simple RTF content
    rtf_content = r"""{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}}
\f0\fs24 This is a simple test article.

Testing RTF upload functionality.
}"""
    
    # Create temporary RTF file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False, encoding='utf-8') as temp_file:
        temp_file.write(rtf_content)
        temp_file_path = temp_file.name
    
    print(f"✅ Created RTF file: {temp_file_path}")
    
    # Prepare minimal form data
    form_data = {
        "title": "Debug RTF Test",
        "summary": "Debug test",
        "author_name": "Debug Tester",
        "category": "technology",
        "reading_time": 1
    }
    
    print("📤 Attempting RTF upload...")
    
    try:
        # Upload RTF file
        with open(temp_file_path, 'rb') as rtf_file:
            files = {"content_file": ("debug_test.rtf", rtf_file, "application/rtf")}
            response = session.post(
                f"{base_url}/api/admin/articles/upload",
                data=form_data,
                files=files,
                timeout=15
            )
        
        print(f"Response status: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        print(f"Response text: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success: {result}")
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
    finally:
        # Cleanup
        os.unlink(temp_file_path)
        print("🧹 Cleaned up temp file")

if __name__ == "__main__":
    test_rtf_upload_debug()