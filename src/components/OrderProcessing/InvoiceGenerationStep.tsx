import React, { useState, useEffect } from 'react';

interface Order {
  id: string;
  client: string;
  summary: string;
  time: string;
  status: 'unread' | 'pending' | 'quotations' | 'invoices';
  amount: string;
  priority: 'high' | 'medium' | 'low';
  enquiryEmail?: string;
  type?: 'enquiry' | 'purchase_order';
}

interface InvoiceGenerationStepProps {
  order: Order;
  onComplete: (invoiceContent: string) => void;
}

const InvoiceGenerationStep: React.FC<InvoiceGenerationStepProps> = ({
  order,
  onComplete,
}) => {
  const [invoiceContent, setInvoiceContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  // Simulate LLM-generated invoice
  useEffect(() => {
    const timer = setTimeout(() => {
      const generatedInvoice = `INVOICE

Invoice No: INV-${order.id.split('-')[2]}-${new Date().getTime().toString().slice(-4)}
Date: ${new Date().toLocaleDateString()}
Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

BILL TO:
${order.client}

FROM:
Orinex Manufacturing
123 Industrial Area
Business District
City - 100001

===============================================

DESCRIPTION OF SERVICES/GOODS:

Item 1: Steel Plates - Plasma Cutting
Quantity: As per PO
Unit Rate: ₹8,500
Amount: ₹18,700

Item 2: Edge Finishing Service
Quantity: As per PO
Unit Rate: ₹4,200
Amount: ₹9,200

Item 3: Quality Inspection & Documentation
Quantity: 1
Unit Rate: ₹2,000
Amount: ₹2,000

===============================================

SUBTOTAL: ₹29,900
GST (18%): ₹5,382
TOTAL AMOUNT DUE: ${order.amount}

===============================================

PAYMENT TERMS:
- Invoice due within 30 days of receipt
- 2% early payment discount if paid within 7 days
- Payment method: Bank Transfer / Cheque

BANK DETAILS:
Bank: ICICI Bank
Account Name: Orinex Manufacturing
Account Number: XXXXXXXXXXXXXX
IFSC Code: ICIXXXXXXXX

Thank you for your business!

For any queries, please contact:
Email: accounts@orinex.com
Phone: +91-XXX-XXXX-XXXX
`;
      setInvoiceContent(generatedInvoice);
      setIsGenerating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [order]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleProceed = () => {
    if (!invoiceContent.trim()) {
      alert('Please ensure invoice content is not empty');
      return;
    }
    onComplete(invoiceContent);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Step 2: Invoice Generation</h3>
        <p className="text-sm text-gray-600 mt-1">
          Review and edit the generated invoice before sending
        </p>
      </div>

      {/* Generating State */}
      {isGenerating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-blue-700">Generating invoice based on purchase order...</p>
          </div>
        </div>
      )}

      {/* Invoice Content */}
      {!isGenerating && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Invoice Content</label>
          <textarea
            value={invoiceContent}
            onChange={(e) => setInvoiceContent(e.target.value)}
            readOnly={!isEditing}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
            rows={10}
          />
        </div>
      )}

      {/* Edit Status */}
      {!isGenerating && isEditing && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-700">
            ✎ You are editing the invoice. Changes will be applied.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {!isGenerating && (
        <div className="flex gap-3 justify-end">
          {!isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Edit
              </button>
              <button
                onClick={handleProceed}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Proceed
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel Edit
              </button>
              <button
                onClick={handleProceed}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Proceed
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerationStep;
