import React from 'react';

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
  processedDetails?: {
    steps: string[];
    timestamp: Date;
  };
}

interface ProcessSuccessStepProps {
  order: Order;
  executionSteps: string[];
  onComplete: () => void;
  isHistory?: boolean;
}

const ProcessSuccessStep: React.FC<ProcessSuccessStepProps> = ({
  order,
  executionSteps,
  onComplete,
  isHistory = false,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'quotations':
        return '📋';
      case 'invoices':
        return '💰';
      default:
        return '✓';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'quotations':
        return 'Quotation Sent';
      case 'invoices':
        return 'Invoice Sent';
      default:
        return 'Completed';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {isHistory ? 'Process History' : 'Order Processing Complete!'}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          {order.id} has been moved to {getStatusLabel(order.status)}
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Order ID</span>
          <span className="text-sm font-medium text-gray-900">{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Client</span>
          <span className="text-sm font-medium text-gray-900">{order.client}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Amount</span>
          <span className="text-sm font-medium text-gray-900">{order.amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <span className="text-sm font-medium">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order.status === 'quotations'
                ? 'bg-green-100 text-green-700'
                : order.status === 'invoices'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </span>
        </div>
        {order.processedDetails?.timestamp && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Processed At</span>
            <span className="text-sm font-medium text-gray-900">
              {formatDate(order.processedDetails.timestamp)}
            </span>
          </div>
        )}
      </div>

      {/* Processing Steps Timeline */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          {isHistory ? 'Processing History' : 'Steps Executed'}
        </h4>
        <div className="space-y-3">
          {executionSteps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-700">{index + 1}</span>
                </div>
                {index < executionSteps.length - 1 && (
                  <div className="w-0.5 h-8 bg-green-200 mt-2"></div>
                )}
              </div>
              <div className="pt-1">
                <p className="text-sm font-medium text-gray-900">{step}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date().toLocaleTimeString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Next Steps:</span> The order has been successfully processed and moved to the {order.status} section.
          You can now view details and track any follow-ups from the main orders page.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={onComplete}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          {isHistory ? 'Close' : 'Done'}
        </button>
      </div>
    </div>
  );
};

export default ProcessSuccessStep;
