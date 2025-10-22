import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

const OrderDetail: React.FC = () => {
  const router = useRouter();
  const [isEditingQuotation, setIsEditingQuotation] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const orderData = {
    id: 'ORD-2024-001',
    client: 'Sharma Metal Works',
    email: 'sharma.metalworks@gmail.com',
    date: '2024-03-15',
    items: [
      {
        description: 'Precision Machined Components - MS Rod 25mm',
        quantity: 100,
        unitPrice: 450,
        total: 45000
      },
      {
        description: 'Surface Treatment - Zinc Plating',
        quantity: 100,
        unitPrice: 25,
        total: 2500
      }
    ],
    totalAmount: 47500
  };

  const emailContent = {
    subject: 'Re: Quotation Request for Precision Components',
    body: `Dear Mr. Sharma,

Thank you for your inquiry regarding precision machined components. We are pleased to provide you with the attached quotation for your requirements.

Our quotation includes:
• 100 pieces of precision machined MS Rod components (25mm)
• Complete zinc plating treatment
• Quality certification as per your specifications

Delivery timeline: 15-20 working days from order confirmation.

We look forward to your positive response and the opportunity to serve you.

Best regards,
Prakash Sharma
Sharma Metal Works`
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Order Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Order #{orderData.id}</h1>
            <p className="text-gray-600">From: {orderData.email}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              ← Back to Orders
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">
              Send Quotation
            </button>
          </div>
        </div>

        {/* AI Generated Quotation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">AI Generated Quotation</h2>
              <span className="ml-3 bg-primary text-white text-xs px-2 py-1 rounded-full">AI</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditingQuotation(!isEditingQuotation)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                {isEditingQuotation ? 'Cancel' : 'Edit'}
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">
                Approve
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Client Name</label>
                <input 
                  type="text" 
                  value={orderData.client}
                  readOnly={!isEditingQuotation}
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quotation Date</label>
                <input 
                  type="date" 
                  value={orderData.date}
                  readOnly={!isEditingQuotation}
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                />
              </div>
            </div>

            <table className="w-full border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Item Description</th>
                  <th className="border border-gray-300 p-3 text-left">Quantity</th>
                  <th className="border border-gray-300 p-3 text-left">Unit Price</th>
                  <th className="border border-gray-300 p-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-3">{item.description}</td>
                    <td className="border border-gray-300 p-3">{item.quantity} pcs</td>
                    <td className="border border-gray-300 p-3">₹{item.unitPrice.toLocaleString()}</td>
                    <td className="border border-gray-300 p-3">₹{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right">
              <p className="text-xl font-bold">Total Amount: ₹{orderData.totalAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">GST will be added as applicable</p>
            </div>
          </div>
        </div>

        {/* AI Generated Email */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">AI Generated Email Response</h2>
              <span className="ml-3 bg-primary text-white text-xs px-2 py-1 rounded-full">AI</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditingEmail(!isEditingEmail)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                {isEditingEmail ? 'Cancel' : 'Edit'}
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">
                Send
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input 
                type="text" 
                value={emailContent.subject}
                readOnly={!isEditingEmail}
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Body</label>
              <textarea 
                value={emailContent.body}
                readOnly={!isEditingEmail}
                rows={12}
                className="w-full px-3 py-2 border rounded-md bg-gray-50 whitespace-pre-wrap"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;