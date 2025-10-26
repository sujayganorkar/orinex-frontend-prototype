import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import ProgressBar from '@/components/ProgressBar';

const OrderDetail: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('quotation');
  const [workflowProgress, setWorkflowProgress] = useState(65);

  // Get order status from URL params or set default
  const orderStatus = router.query.status as string || 'pending';

  const orderData = {
    id: 'ORD-2024-001',
    client: 'Sharma Metal Works',
    email: 'sharma.metalworks@gmail.com',
    date: '2024-03-15',
    status: orderStatus,
    items: [
      { description: 'Precision Machined Components - MS Rod 25mm', quantity: 100, unitPrice: 450, total: 45000 },
      { description: 'Surface Treatment - Zinc Plating', quantity: 100, unitPrice: 25, total: 2500 }
    ],
    totalAmount: 47500
  };

  const tabs = [
    { id: 'quotation', label: 'Quotation', icon: '📄' },
    { id: 'email', label: 'Email', icon: '✉️' },
    { id: 'workflow', label: 'Workflow', icon: '🔄' },
    { id: 'history', label: 'History', icon: '📋' }
  ];

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">Order #{orderData.id}</h1>
              <p className="text-gray-600">{orderData.client} • {orderData.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                orderData.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : orderData.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
              </span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => router.back()} className="px-4 py-2 bg-gray-200 rounded-md">
                ← Back
              </button>
              {orderData.status !== 'completed' && (
                <button className="px-4 py-2 bg-primary text-white rounded-md">
                  Send Quotation
                </button>
              )}
            </div>
          </div>

          {/* Workflow Progress */}
          {orderData.status !== 'completed' && (
            <ProgressBar progress={workflowProgress} label="Workflow Progress" color="primary" />
          )}
          {orderData.status === 'completed' && (
            <ProgressBar progress={100} label="Order Completed" color="success" />
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'text-primary font-bold border-b-2 border-primary' 
                  : 'text-gray-600'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'quotation' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {orderData.status === 'completed' ? 'Final Quotation' : 'AI Generated Quotation'}
            </h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Item</th>
                  <th className="border p-3 text-left">Qty</th>
                  <th className="border p-3 text-left">Price</th>
                  <th className="border p-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border p-3">{item.description}</td>
                    <td className="border p-3">{item.quantity}</td>
                    <td className="border p-3">₹{item.unitPrice}</td>
                    <td className="border p-3">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-4">
              <p className="text-xl font-bold">Total: ₹{orderData.totalAmount.toLocaleString()}</p>
            </div>
            {orderData.status === 'completed' && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-green-800 font-semibold">Order completed successfully</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'email' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {orderData.status === 'completed' ? 'Email History' : 'Email Response'}
            </h2>
            <textarea 
              className="w-full px-3 py-2 border rounded-md" 
              rows={10}
              readOnly={orderData.status === 'completed'}
              defaultValue="Dear Mr. Sharma,

Thank you for your inquiry. Please find attached quotation for your requirements.

Best regards,"
            />
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Workflow Execution</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                <span className="text-green-600 text-2xl">✓</span>
                <div className="flex-1">
                  <div className="font-semibold">Order Received</div>
                  <div className="text-sm text-gray-500">Completed 2 hours ago</div>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded ${
                orderData.status === 'completed' ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                <span className={`text-2xl ${
                  orderData.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {orderData.status === 'completed' ? '✓' : '⏳'}
                </span>
                <div className="flex-1">
                  <div className="font-semibold">Quotation Generation</div>
                  <div className="text-sm text-gray-500">
                    {orderData.status === 'completed' ? 'Completed' : 'In progress...'}
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded ${
                orderData.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'
              }`}>
                <span className={`text-2xl ${
                  orderData.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {orderData.status === 'completed' ? '✓' : '○'}
                </span>
                <div className="flex-1">
                  <div className={`font-semibold ${
                    orderData.status === 'completed' ? '' : 'text-gray-400'
                  }`}>
                    Send Email
                  </div>
                  <div className="text-sm text-gray-500">
                    {orderData.status === 'completed' ? 'Completed' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            <div className="space-y-2">
              <div className="p-3 border-l-4 border-blue-500 bg-gray-50">
                <div className="font-semibold">Order received</div>
                <div className="text-sm text-gray-500">2 hours ago</div>
              </div>
              <div className="p-3 border-l-4 border-yellow-500 bg-gray-50">
                <div className="font-semibold">Processing started</div>
                <div className="text-sm text-gray-500">1 hour ago</div>
              </div>
              {orderData.status === 'completed' && (
                <div className="p-3 border-l-4 border-green-500 bg-gray-50">
                  <div className="font-semibold">Order completed</div>
                  <div className="text-sm text-gray-500">30 minutes ago</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderDetail;
