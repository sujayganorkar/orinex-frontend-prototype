import React, { useState, useEffect } from 'react';
import EmailDiscrepancyStep from './OrderProcessing/EmailDiscrepancyStep';
import QuotationGenerationStep from './OrderProcessing/QuotationGenerationStep';
import InvoiceGenerationStep from './OrderProcessing/InvoiceGenerationStep';
import EmailDraftingStep from './OrderProcessing/EmailDraftingStep';
import ProcessSuccessStep from './OrderProcessing/ProcessSuccessStep';

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

interface OrderProcessingModalProps {
  order: Order;
  onClose: () => void;
  onProcessed: (order: Order) => void;
}

type ProcessingStep = 'email-check' | 'quotation' | 'invoice' | 'email-draft' | 'success' | 'view-history';

const OrderProcessingModal: React.FC<OrderProcessingModalProps> = ({
  order,
  onClose,
  onProcessed,
}) => {
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('email-check');
  const [processedOrder, setProcessedOrder] = useState<Order>(order);
  const [executionSteps, setExecutionSteps] = useState<string[]>([]);

  // Determine the initial step based on order status
  useEffect(() => {
    if (order.status === 'unread' || order.status === 'pending') {
      setCurrentStep('email-check');
    } else if (order.status === 'quotations' || order.status === 'invoices') {
      setCurrentStep('view-history');
    }
  }, [order.status]);

  const handleEmailCheckComplete = (customEmail?: string) => {
    setExecutionSteps([...executionSteps, customEmail ? 'Custom email sent' : 'Email verified']);

    if (order.type === 'enquiry') {
      setCurrentStep('quotation');
    } else if (order.type === 'purchase_order') {
      setCurrentStep('invoice');
    }
  };

  const handleQuotationComplete = (quotationContent: string) => {
    setExecutionSteps([...executionSteps, 'Quotation generated']);
    setCurrentStep('email-draft');
  };

  const handleInvoiceComplete = (invoiceContent: string) => {
    setExecutionSteps([...executionSteps, 'Invoice generated']);
    setCurrentStep('email-draft');
  };

  const handleEmailDraftComplete = () => {
    setExecutionSteps([...executionSteps, 'Email sent with attachment']);

    const updatedOrder: Order = {
      ...processedOrder,
      status: order.type === 'enquiry' ? 'quotations' : 'invoices',
      processedDetails: {
        steps: executionSteps,
        timestamp: new Date(),
      },
    };

    setProcessedOrder(updatedOrder);
    setCurrentStep('success');
  };

  const handleSuccess = () => {
    onProcessed(processedOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-4/5 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{order.id}</h2>
            <p className="text-sm text-gray-600">{order.client}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'email-check' && (
            <EmailDiscrepancyStep
              order={order}
              onComplete={handleEmailCheckComplete}
            />
          )}

          {currentStep === 'quotation' && order.type === 'enquiry' && (
            <QuotationGenerationStep
              order={order}
              onComplete={handleQuotationComplete}
            />
          )}

          {currentStep === 'invoice' && order.type === 'purchase_order' && (
            <InvoiceGenerationStep
              order={order}
              onComplete={handleInvoiceComplete}
            />
          )}

          {currentStep === 'email-draft' && (
            <EmailDraftingStep
              order={order}
              documentType={order.type === 'enquiry' ? 'quotation' : 'invoice'}
              onComplete={handleEmailDraftComplete}
            />
          )}

          {currentStep === 'success' && (
            <ProcessSuccessStep
              order={processedOrder}
              executionSteps={executionSteps}
              onComplete={handleSuccess}
            />
          )}

          {currentStep === 'view-history' && processedOrder.processedDetails && (
            <ProcessSuccessStep
              order={processedOrder}
              executionSteps={processedOrder.processedDetails.steps}
              onComplete={onClose}
              isHistory={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderProcessingModal;
