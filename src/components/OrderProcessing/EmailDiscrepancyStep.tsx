import React, { useState } from 'react';

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

interface EmailDiscrepancyStepProps {
  order: Order;
  onComplete: (customEmail?: string) => void;
}

const EmailDiscrepancyStep: React.FC<EmailDiscrepancyStepProps> = ({
  order,
  onComplete,
}) => {
  const [hasDiscrepancy, setHasDiscrepancy] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProceed = async () => {
    if (hasDiscrepancy && !customEmail.trim()) {
      alert('Please provide a custom email');
      return;
    }

    setIsLoading(true);
    // Simulate sending custom email if needed
    setTimeout(() => {
      setIsLoading(false);
      onComplete(hasDiscrepancy ? customEmail : undefined);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Step 1: Email Verification</h3>
        <p className="text-sm text-gray-600 mt-1">
          Review the received email for any discrepancies
        </p>
      </div>

      {/* Email Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.enquiryEmail}</p>
      </div>

      {/* Discrepancy Question */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasDiscrepancy}
            onChange={(e) => setHasDiscrepancy(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700">
            There is a discrepancy in the email. I want to send a custom email.
          </span>
        </label>
      </div>

      {/* Custom Email Input */}
      {hasDiscrepancy && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Custom Email</label>
          <textarea
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            placeholder="Write your custom email here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={5}
          />
        </div>
      )}

      {/* Info Message */}
      {!hasDiscrepancy && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            Email verified. Proceeding to next step...
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleProceed}
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Processing...' : 'Proceed'}
        </button>
      </div>
    </div>
  );
};

export default EmailDiscrepancyStep;
