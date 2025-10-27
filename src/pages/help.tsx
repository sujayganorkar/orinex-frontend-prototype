import React, { useState } from 'react';
import Layout from '@/components/Layout';

const Help: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Getting Started');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Getting Started',
    'Processing Orders', 
    'Managing Templates',
    'AI Features',
    'Account Settings',
    'Troubleshooting'
  ];

  const helpContent = {
    'Getting Started': {
      title: 'Getting Started with Orinex',
      videoThumbnail: 'https://placehold.co/800x450/e2e8f0/1a365d?text=Getting+Started+Video',
      content: `Welcome to Orinex! This tutorial will help you get started with our AI-powered order processing system.

Follow these simple steps to set up your account:

1. Update your company information in Settings
   - Add your company name, address, and GSTIN
   - This information will be automatically used in all documents

2. Set up your document templates
   - Customize quotation, invoice, and email templates
   - Add your company branding and standard terms

3. Configure AI automation settings
   - Enable automatic quotation generation
   - Set up email drafting preferences
   - Configure notification preferences

4. Process your first order
   - Navigate to the Orders section
   - Click on any unread order to start processing
   - Review and approve AI-generated content

Need additional help? Contact our support team via WhatsApp at +91 XXX XXX XXXX.`
    },
    'Processing Orders': {
      title: 'How to Process Orders',
      videoThumbnail: 'https://placehold.co/800x450/e2e8f0/1a365d?text=Order+Processing+Video',
      content: `Learn how to efficiently process orders using Orinex AI automation:

Order Processing Workflow:

1. Incoming Orders
   - Orders appear in the "Unread" tab
   - AI automatically analyzes email content
   - Order details are extracted automatically

2. Review AI Suggestions
   - Check the AI-generated quotation
   - Review the suggested email response
   - Make any necessary edits

3. Approval and Sending
   - Approve the quotation if accurate
   - Send the email response to client
   - Order moves to "Pending" status

4. Follow-up Actions
   - Track client responses
   - Generate invoices after approval
   - Monitor delivery timelines

Tips for Better Results:
- Keep your templates updated
- Review AI suggestions before sending
- Use consistent naming for similar products`
    },
    'Managing Templates': {
      title: 'Template Management',
      videoThumbnail: 'https://placehold.co/800x450/e2e8f0/1a365d?text=Templates+Video',
      content: `Master template management to streamline your document creation:

Template Types:

1. Quotation Templates
   - Standard quotation for general orders
   - Detailed specification for technical orders
   - Bulk order templates for high volumes

2. Invoice Templates
   - Standard GST-compliant invoices
   - Export invoice templates
   - Custom billing formats

3. Email Templates
   - Quotation response templates
   - Order confirmation emails
   - Follow-up message templates

Best Practices:
- Use variable placeholders for dynamic content
- Maintain consistent branding across templates
- Regular backup and version control
- Test templates before going live`
    },
    'AI Features': {
      title: 'Understanding AI Features',
      videoThumbnail: 'https://placehold.co/800x450/e2e8f0/1a365d?text=AI+Features+Video',
      content: `Discover how AI enhances your order processing workflow:

AI Capabilities:

1. Automatic Email Analysis
   - Extracts order requirements from emails
   - Identifies product specifications
   - Determines quantities and deadlines

2. Intelligent Quotation Generation
   - Calculates pricing based on specifications
   - Suggests appropriate delivery timelines
   - Includes relevant terms and conditions

3. Smart Email Drafting
   - Creates professional responses
   - Maintains consistent tone and style
   - Includes all relevant order details

4. Learning and Improvement
   - Learns from your corrections
   - Improves accuracy over time
   - Adapts to your business patterns

Configuration Tips:
- Train AI with your historical data
- Provide feedback on AI suggestions
- Regular review of automation settings`
    },
    'Account Settings': {
      title: 'Account and Settings Management',
      videoThumbnail: 'https://placehold.co/800x450/e2e8f0/1a365d?text=Settings+Video',
      content: `Configure your account for optimal performance:

Settings Overview:

1. Company Information
   - Update business details regularly
   - Ensure GSTIN compliance
   - Maintain current contact information

2. AI Automation Settings
   - Toggle automatic features on/off
   - Set confidence thresholds
   - Configure approval workflows

3. Notification Preferences
   - Email notification settings
   - WhatsApp integration setup
   - Alert frequency configuration

4. Language Settings
   - Switch between English, Hindi, Marathi
   - Set default language preferences
   - Regional formatting options

Security Features:
- Two-factor authentication
- Regular password updates
- Access log monitoring`
    },
    'Troubleshooting': {
      title: 'Common Issues and Solutions',
      videoThumbnail: 'https://placehold.co/800x450/e2e8f0/1a365d?text=Troubleshooting+Video',
      content: `Resolve common issues quickly with these solutions:

Common Problems:

1. AI Not Generating Quotations
   - Check if automation is enabled in settings
   - Verify email format is recognizable
   - Ensure sufficient order details in email

2. Incorrect Pricing Calculations
   - Review pricing templates
   - Check product specifications matching
   - Update pricing databases regularly

3. Email Sending Issues
   - Verify email credentials
   - Check spam folder settings
   - Confirm recipient email addresses

4. Template Not Loading
   - Clear browser cache
   - Check template file integrity
   - Ensure template is properly saved

Getting Help:
- Use in-app chat support
- Contact via WhatsApp: +91 XXX XXX XXXX
- Email support: support@orinex.com
- Schedule a demo call

Response Times:
- WhatsApp: Within 2 hours
- Email: Within 24 hours
- Critical issues: Immediate response`
    }
  };

  const currentContent = helpContent[activeCategory as keyof typeof helpContent];

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Help & Support</h1>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2">
            <span>W</span>
            Contact Support via WhatsApp
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Categories */}
            <div className="space-y-1">
              {filteredCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    w-full text-left px-3 py-2 rounded-md transition
                    ${activeCategory === category
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left text-sm text-primary hover:underline">
                  Schedule a Demo Call
                </button>
                <button className="w-full text-left text-sm text-primary hover:underline">
                  Email Support Team
                </button>
                <button className="w-full text-left text-sm text-primary hover:underline">
                  Live Chat Support
                </button>
                <button className="w-full text-left text-sm text-primary hover:underline">
                  WhatsApp Support
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{currentContent.title}</h2>
              
              {/* Video Thumbnail */}
              <div className="mb-6">
                <div className="relative bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={currentContent.videoThumbnail} 
                    alt="Video Tutorial"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-primary bg-opacity-80 text-white rounded-full p-4 hover:bg-opacity-100 transition">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <span className="text-2xl">▶</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {currentContent.content}
                </div>
              </div>

              {/* Support Contact */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Still Need Help?</h3>
                <p className="text-blue-700 text-sm mb-3">
                  Our support team is available 24/7 to assist you with any questions or issues.
                </p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm">
                    WhatsApp: +91 XXX XXX XXXX
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm">
                    Email: support@orinex.com
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
