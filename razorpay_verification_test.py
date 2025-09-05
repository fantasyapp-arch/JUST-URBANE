#!/usr/bin/env python3
"""
Razorpay Payment Verification Test
Test the payment verification endpoint with proper signature validation
"""

import requests
import json
import hmac
import hashlib
import time
from datetime import datetime

def test_razorpay_payment_verification():
    """Test Razorpay payment verification with customer details"""
    base_url = "https://luxury-magazine.preview.emergentagent.com/api"
    
    # First, register and login to get auth token
    test_user = {
        "email": f"verifytest_{int(time.time())}@justurbane.com",
        "password": "testpass123",
        "full_name": "Verification Test User"
    }
    
    session = requests.Session()
    
    # Register user
    register_response = session.post(
        f"{base_url}/auth/register",
        json=test_user,
        headers={"Content-Type": "application/json"}
    )
    
    if register_response.status_code != 200:
        print(f"❌ Registration failed: {register_response.status_code}")
        return False
    
    auth_data = register_response.json()
    auth_token = auth_data.get("access_token")
    session.headers.update({"Authorization": f"Bearer {auth_token}"})
    
    # Create an order first
    order_data = {
        "package_id": "digital_annual",
        "customer_details": {
            "email": "verify@justurbane.com",
            "full_name": "Verification Customer",
            "phone": "+919876543210"
        },
        "payment_method": "razorpay"
    }
    
    order_response = session.post(
        f"{base_url}/payments/razorpay/create-order",
        json=order_data,
        headers={"Content-Type": "application/json"}
    )
    
    if order_response.status_code != 200:
        print(f"❌ Order creation failed: {order_response.status_code}")
        return False
    
    order_result = order_response.json()
    order_id = order_result.get("order_id")
    
    print(f"✅ Order created successfully: {order_id}")
    
    # Simulate payment verification (with invalid signature to test validation)
    payment_id = "pay_test_payment_id"
    
    # Create invalid signature for testing
    invalid_signature = "invalid_signature_for_testing"
    
    verification_data = {
        "razorpay_order_id": order_id,
        "razorpay_payment_id": payment_id,
        "razorpay_signature": invalid_signature,
        "package_id": "digital_annual",
        "customer_details": {
            "email": "verify@justurbane.com",
            "full_name": "Verification Customer",
            "phone": "+919876543210"
        }
    }
    
    verify_response = session.post(
        f"{base_url}/payments/razorpay/verify",
        json=verification_data,
        headers={"Content-Type": "application/json"}
    )
    
    # Should fail with invalid signature
    if verify_response.status_code == 400:
        error_data = verify_response.json()
        if "invalid" in error_data.get("detail", "").lower():
            print("✅ Payment verification correctly rejects invalid signature")
            return True
        else:
            print(f"❌ Wrong error message: {error_data}")
            return False
    else:
        print(f"❌ Expected 400 error for invalid signature, got: {verify_response.status_code}")
        return False

if __name__ == "__main__":
    print("🔐 Testing Razorpay Payment Verification")
    print("=" * 50)
    
    success = test_razorpay_payment_verification()
    
    if success:
        print("\n✅ Razorpay payment verification working correctly!")
    else:
        print("\n❌ Razorpay payment verification has issues!")