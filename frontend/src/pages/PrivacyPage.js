import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 text-lg">
            Effective Date: January 1, 2025 | Last Updated: January 3, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Just Urbane ("we," "our," or "us"). Just Urbane is a premium digital magazine platform that provides luxury lifestyle content, including fashion, technology, grooming, automotive, travel, food, aviation, people, and luxury real estate content.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website justurbane.com and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access our website or services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Register for an account</li>
              <li>Subscribe to our digital or print magazine</li>
              <li>Sign up for our newsletter</li>
              <li>Contact us via email or contact forms</li>
              <li>Participate in surveys or promotions</li>
              <li>Leave comments or reviews on our content</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Information Collected Automatically</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you visit our website, we automatically collect certain information about your device and usage patterns:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring websites</li>
              <li>Device information and screen resolution</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Cookies and Tracking Technologies</h3>
            <p className="text-gray-700 leading-relaxed">
              We use cookies, web beacons, and similar tracking technologies to enhance your browsing experience, analyze website traffic, and provide personalized content recommendations.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>To provide and maintain our magazine services</li>
              <li>To process subscription payments and renewals</li>
              <li>To send newsletters and promotional content</li>
              <li>To personalize your content experience</li>
              <li>To improve our website and services</li>
              <li>To respond to customer service inquiries</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Third-Party Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your information with trusted third-party service providers who assist us in:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Payment processing (Stripe, Razorpay)</li>
              <li>Email marketing (SendGrid, Mailchimp)</li>
              <li>Analytics (Google Analytics)</li>
              <li>Content delivery networks</li>
              <li>Customer support services</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed">
              We may disclose your information if required by law, court order, or government regulation, or to protect our rights, property, or safety.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              To exercise these rights, please contact us at <strong>privacy@justurbane.com</strong> or through our contact form.
            </p>
          </section>

          {/* Cookies Policy */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Cookies Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the following types of cookies:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>Essential Cookies:</strong> Required for website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You can manage your cookie preferences through your browser settings or our cookie consent banner.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than India, including the United States and European Union countries. We ensure that appropriate safeguards are in place to protect your personal information in accordance with applicable data protection laws.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Subscription information is typically retained for 7 years after account closure for tax and legal compliance purposes.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Just Urbane Digital Magazine</strong></p>
              <p className="text-gray-700 mb-2">10th floor, Gokhale Business Bay</p>
              <p className="text-gray-700 mb-2">A-1001, opp. City Pride, Paschimanagri</p>
              <p className="text-gray-700 mb-2">Kothrud, Pune, Maharashtra 411038, India</p>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@justurbane.com</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> +91 20 2992989</p>
              <p className="text-gray-700"><strong>Data Protection Officer:</strong> dpo@justurbane.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;