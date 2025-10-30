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

interface QuotationGenerationStepProps {
  order: Order;
  onComplete: (quotationContent: string) => void;
}

const QuotationGenerationStep: React.FC<QuotationGenerationStepProps> = ({
  order,
  onComplete,
}) => {
  const [quotationContent, setQuotationContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  // Simulate LLM-generated quotation
  useEffect(() => {
    const timer = setTimeout(() => {
      const generatedQuotation = `QUOTATION

Quote No: QT-${order.id.split('-')[2]}-${new Date().getTime().toString().slice(-4)}
Date: ${new Date().toLocaleDateString()}
Client: ${order.client}

Dear Sir/Madam,

Thank you for your inquiry. We are pleased to provide the following quotation for your requirements:

QUOTATION DETAILS:
================
Item: MS Round Bar with Cutting & Threading Service
Quantity: As per requirement
Unit Price: ₹5,000 per unit
Setup Charges: ₹2,500
Delivery Charges: ₹1,250
GST (18%): Applicable

ESTIMATED TOTAL: ${order.amount}

VALIDITY: 30 days from the date of quotation
PAYMENT TERMS: 50% advance, 50% on delivery
DELIVERY: 7-10 working days

We are confident this quotation meets your requirements. Please feel free to contact us for any clarifications or modifications.

Best Regards,
Orinex Manufacturing
`;
      setQuotationContent(generatedQuotation);
      setIsGenerating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [order]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleProceed = () => {
    if (!quotationContent.trim()) {
      alert('Please ensure quotation content is not empty');
      return;
    }
    onComplete(quotationContent);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Step 2: Quotation Generation</h3>
        <p className="text-sm text-gray-600 mt-1">
          Review and edit the generated quotation before sending
        </p>
      </div>

      {/* Generating State */}
      {isGenerating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-blue-700">Generating quotation based on inquiry...</p>
          </div>
        </div>
      )}

      {/* Quotation Content */}
      {!isGenerating && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Quotation Content</label>
          <textarea
            value={quotationContent}
            onChange={(e) => setQuotationContent(e.target.value)}
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
            ✎ You are editing the quotation. Changes will be applied.
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

export default QuotationGenerationStep;
