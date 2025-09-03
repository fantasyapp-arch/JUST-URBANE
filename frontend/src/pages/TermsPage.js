import React from 'react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-gray-600 text-lg">
            Effective Date: January 1, 2025 | Last Updated: January 3, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Just Urbane ("we," "us," or "our"). These Terms and Conditions ("Terms") govern your use of our website justurbane.com and our premium digital magazine services (collectively, the "Service") operated by Just Urbane Digital Magazine.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
            </p>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Just Urbane is a premium digital magazine platform that provides luxury lifestyle content covering:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Fashion and luxury accessories</li>
              <li>Technology and gadgets</li>
              <li>Grooming and wellness</li>
              <li>Automotive and transportation</li>
              <li>Travel and destinations</li>
              <li>Food and dining experiences</li>
              <li>Aviation and private jets</li>
              <li>People and culture</li>
              <li>Luxury real estate and lifestyle</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              We offer both free content and premium subscription-based services including digital magazine issues, exclusive articles, and premium features.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Account Registration</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of our Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Account Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to terminate or suspend your account at any time for violations of these Terms or for any other reason at our sole discretion.
            </p>
          </section>

          {/* Subscription Terms */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Subscription Terms</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Subscription Plans</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer the following subscription plans:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>Digital Subscription:</strong> ₹499/month - Access to all digital content and magazine issues</li>
              <li><strong>Print Subscription:</strong> ₹499/month - Physical magazine delivery to India</li>
              <li><strong>Combined Subscription:</strong> ₹999/month - Both digital and print access</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Payment and Billing</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Subscriptions are billed monthly in advance</li>
              <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
              <li>Payment is processed securely through our payment partners</li>
              <li>Failed payments may result in service suspension</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Auto-Renewal</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Subscriptions automatically renew unless cancelled before the next billing cycle. You can cancel your subscription at any time through your account settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4 Refund Policy</h3>
            <p className="text-gray-700 leading-relaxed">
              We offer a 7-day money-back guarantee for new subscribers. Refunds for cancelled subscriptions will be processed within 5-10 business days. No refunds are provided for partial months of service.
            </p>
          </section>

          {/* Content and Intellectual Property */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Our Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on Just Urbane, including articles, images, videos, logos, and design elements, is owned by us or our licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Limited License</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We grant you a limited, non-exclusive, non-transferable license to access and use our content for personal, non-commercial purposes only.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Prohibited Uses</h3>
            <p className="text-gray-700 leading-relaxed mb-4">You may not:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Reproduce, distribute, or publicly display our content</li>
              <li>Create derivative works from our content</li>
              <li>Use our content for commercial purposes</li>
              <li>Remove copyright or proprietary notices</li>
              <li>Share your subscription access with others</li>
            </ul>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. User Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Post or transmit harmful, offensive, or inappropriate content</li>
              <li>Engage in spam, phishing, or other fraudulent activities</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your personal information.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Disclaimers</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Service Availability</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to provide uninterrupted service but cannot guarantee 100% uptime. The Service is provided "as is" and "as available" without warranties of any kind.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Content Accuracy</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              While we strive for accuracy, we do not warrant that the content on our Service is always accurate, complete, or up-to-date. You rely on such content at your own risk.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.3 External Links</h3>
            <p className="text-gray-700 leading-relaxed">
              Our Service may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the fullest extent permitted by law, Just Urbane shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Loss of profits or revenue</li>
              <li>Loss of data or content</li>
              <li>Business interruption</li>
              <li>Loss of goodwill or reputation</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Our total liability to you for any damages shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Just Urbane and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the Service or violation of these Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on our website and updating the "Last Updated" date. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">13. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the remaining Terms will otherwise remain in full force and effect.
            </p>
          </section>

          {/* Entire Agreement */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">14. Entire Agreement</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Just Urbane regarding the use of the Service and supersede all prior agreements and understandings.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Just Urbane Digital Magazine</strong></p>
              <p className="text-gray-700 mb-2">10th floor, Gokhale Business Bay</p>
              <p className="text-gray-700 mb-2">A-1001, opp. City Pride, Paschimanagri</p>
              <p className="text-gray-700 mb-2">Kothrud, Pune, Maharashtra 411038, India</p>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@justurbane.com</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> +91 20 2992989</p>
              <p className="text-gray-700"><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsPage;