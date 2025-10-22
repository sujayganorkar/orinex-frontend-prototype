import React, { useState } from 'react';
import Layout from '@/components/Layout';

const Templates: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Quotations');

  const tabs = ['Quotations', 'Invoices', 'Emails'];

  const templates = {
    Quotations: [
      {
        id: 1,
        title: 'Standard Quotation',
        description: 'Basic quotation template for general orders',
        lastModified: '2024-03-10'
      },
      {
        id: 2,
        title: 'Detailed Specification',
        description: 'For orders with technical specifications',
        lastModified: '2024-03-08'
      },
      {
        id: 3,
        title: 'Bulk Order',
        description: 'Template for high volume orders',
        lastModified: '2024-03-05'
      },
      {
        id: 4,
        title: 'Custom Template',
        description: 'Customizable template for specific requirements',
        lastModified: '2024-03-01'
      }
    ],
    Invoices: [
      {
        id: 1,
        title: 'Standard Invoice',
        description: 'Basic invoice template for completed orders',
        lastModified: '2024-03-10'
      },
      {
        id: 2,
        title: 'GST Invoice',
        description: 'GST compliant invoice template',
        lastModified: '2024-03-07'
      },
      {
        id: 3,
        title: 'Export Invoice',
        description: 'Invoice template for export orders',
        lastModified: '2024-03-03'
      }
    ],
    Emails: [
      {
        id: 1,
        title: 'Quotation Response',
        description: 'Standard response template for quotation requests',
        lastModified: '2024-03-09'
      },
      {
        id: 2,
        title: 'Order Confirmation',
        description: 'Template for confirming received orders',
        lastModified: '2024-03-06'
      },
      {
        id: 3,
        title: 'Follow-up Email',
        description: 'Template for following up on pending quotations',
        lastModified: '2024-03-04'
      },
      {
        id: 4,
        title: 'Delivery Notification',
        description: 'Template for notifying order delivery',
        lastModified: '2024-03-02'
      }
    ]
  };

  const currentTemplates = templates[activeTab as keyof typeof templates];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Templates</h1>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">
            + Add New Template
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 relative
                ${activeTab === tab 
                  ? 'text-primary font-bold border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-800'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Template Preview */}
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <div className="text-sm text-gray-600">Template Preview</div>
                </div>
              </div>
              
              {/* Template Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{template.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                <p className="text-xs text-gray-500 mb-4">Last modified: {template.lastModified}</p>
                
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition text-sm">
                    Use
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Template Editor Modal (placeholder) */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Template Features:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• AI-powered template suggestions based on order type</li>
            <li>• Variable placeholders (company name, client details, etc.)</li>
            <li>• Multi-language support (English, Hindi, Marathi)</li>
            <li>• Automatic formatting and styling</li>
            <li>• Version control and backup</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Templates;