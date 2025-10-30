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

interface EmailDraftingStepProps {
  order: Order;
  documentType: 'quotation' | 'invoice';
  onComplete: () => void;
}

const EmailDraftingStep: React.FC<EmailDraftingStepProps> = ({
  order,
  documentType,
  onComplete,
}) => {
  const [emailContent, setEmailContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Simulate LLM-generated email draft
  useEffect(() => {
    const timer = setTimeout(() => {
      const generatedEmail = documentType === 'quotation'
        ? `Dear ${order.client},

Thank you for reaching out to us with your inquiry. We are pleased to provide you with a detailed quotation for your requirements.

Attached please find our comprehensive quotation document which includes:
- Itemized product/service breakdown
- Pricing details
- Delivery timeline
- Payment terms and conditions
- Validity period

Our team is committed to delivering high-quality solutions that meet your specifications. Should you have any questions or require modifications to this quotation, please do not hesitate to contact us.

We look forward to the opportunity to work with you.

Best regards,
Orinex Manufacturing Team
Contact: sales@orinex.com | +91-XXX-XXXX-XXXX

---
Quotation will be attached as PDF`
        : `Dear ${order.client},

Thank you for your purchase order. We are pleased to confirm receipt of your order and have processed it immediately.

Please find the detailed invoice attached, which includes:
- Itemized service/product breakdown
- Payment terms and due date
- Bank transfer details
- Invoice number and date

Your order is now in our system and will be processed with highest priority. We will keep you updated on the progress and delivery status.

If you have any questions regarding the invoice or your order, please feel free to reach out.

Thank you for choosing us!

Best regards,
Orinex Manufacturing Team
Contact: accounts@orinex.com | +91-XXX-XXXX-XXXX

---
Invoice will be attached as PDF`;

      setEmailContent(generatedEmail);
      setIsGenerating(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [order, documentType]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSend = async () => {
    if (!emailContent.trim()) {
      alert('Please ensure email content is not empty');
      return;
    }

    setIsSending(true);
    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Step 3: Email Drafting</h3>
        <p className="text-sm text-gray-600 mt-1">
          Review and edit the email before sending {documentType === 'quotation' ? 'quotation' : 'invoice'}
        </p>
      </div>

      {/* Generating State */}
      {isGenerating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-blue-700">Generating professional email draft...</p>
          </div>
        </div>
      )}

      {/* Email Content */}
      {!isGenerating && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Email Content</label>
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            readOnly={!isEditing}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
            rows={10}
          />
        </div>
      )}

      {/* File Attachment Info */}
      {!isGenerating && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">
            📎 {documentType === 'quotation' ? 'Quotation' : 'Invoice'} will be attached as PDF when sent
          </p>
        </div>
      )}

      {/* Edit Status */}
      {!isGenerating && isEditing && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-700">
            ✎ You are editing the email. Changes will be applied to the sent message.
          </p>
        </div>
      )}

      {/* Sending State */}
      {isSending && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            📧 Sending email with attachment...
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {!isGenerating && !isSending && (
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
                onClick={handleSend}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Send with Attachment
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
                onClick={handleSend}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Send with Attachment
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailDraftingStep;
