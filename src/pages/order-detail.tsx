import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import ProgressBar from '@/components/ProgressBar';

const OrderDetail: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('quotation');

  // Get order data from URL params
  const orderId = router.query.id as string || 'ORD-2024-001';
  const orderStatus = router.query.status as string || 'pending';
  const clientName = router.query.client as string || 'Unknown Client';

  // Different order data based on order ID
  const getOrderData = (id: string) => {
    switch(id) {
      case 'ORD-2024-001': // Unread order
        return {
          id: 'ORD-2024-001',
          client: 'Sharma Metal Works',
          email: 'sharma.metalworks@gmail.com',
          date: '2024-03-15',
          status: 'unread',
          workflowProgress: 25,
          items: [
            { description: 'MS Round Bar 20mm x 6m', quantity: 50, unitPrice: 180, total: 9000 },
            { description: 'Cutting & Threading Service', quantity: 50, unitPrice: 35, total: 1750 }
          ],
          totalAmount: 10750
        };
      case 'ORD-2024-002': // Pending order
        return {
          id: 'ORD-2024-002',
          client: 'Sai Engineering',
          email: 'orders@saiengineering.com',
          date: '2024-03-14',
          status: 'pending',
          workflowProgress: 75,
          items: [
            { description: 'Custom Machined Components - Aluminum', quantity: 25, unitPrice: 850, total: 21250 },
            { description: 'Anodizing Treatment', quantity: 25, unitPrice: 120, total: 3000 }
          ],
          totalAmount: 24250
        };
      case 'ORD-2024-003': // Completed order
        return {
          id: 'ORD-2024-003',
          client: 'Patel Fabricators',
          email: 'purchase@patelfab.co.in',
          date: '2024-03-13',
          status: 'completed',
          workflowProgress: 100,
          items: [
            { description: 'Steel Plates 10mm x 1200x2400', quantity: 10, unitPrice: 2500, total: 25000 },
            { description: 'Plasma Cutting Service', quantity: 10, unitPrice: 300, total: 3000 },
            { description: 'Edge Finishing', quantity: 10, unitPrice: 150, total: 1500 }
          ],
          totalAmount: 29500
        };
      default:
        return {
          id: orderId,
          client: clientName,
          email: 'contact@example.com',
          date: '2024-03-15',
          status: orderStatus,
          workflowProgress: 50,
          items: [],
          totalAmount: 0
        };
    }
  };

  const orderData = getOrderData(orderId);

  const tabs = [
    { id: 'quotation', label: 'Quotation', icon: 'Q' },
    { id: 'email', label: 'Email', icon: 'E' },
    { id: 'workflow', label: 'Workflow', icon: 'W' },
    { id: 'history', label: 'History', icon: 'H' }
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
            <ProgressBar progress={orderData.workflowProgress} label="Workflow Progress" color="primary" />
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
              <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs font-bold">
                {tab.icon}
              </span>
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
                  <div className="text-sm text-gray-500">
                    {orderData.status === 'unread' && 'Just received'}
                    {orderData.status === 'pending' && 'Completed 2 hours ago'}
                    {orderData.status === 'completed' && 'Completed 2 days ago'}
                  </div>
                </div>
              </div>
              
              {/* Quotation step */}
              <div className={`flex items-center gap-3 p-3 rounded ${
                orderData.status === 'unread' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <span className={`text-2xl ${
                  orderData.status === 'unread' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {orderData.status === 'unread' ? 'P' : '✓'}
                </span>
                <div className="flex-1">
                  <div className="font-semibold">Quotation Generation</div>
                  <div className="text-sm text-gray-500">
                    {orderData.status === 'unread' && 'Analyzing requirements...'}
                    {orderData.status === 'pending' && 'Generated - awaiting approval'}
                    {orderData.status === 'completed' && 'Approved and sent'}
                  </div>
                </div>
              </div>

              {/* Email step */}
              <div className={`flex items-center gap-3 p-3 rounded ${
                orderData.status === 'completed' ? 'bg-green-50' : 
                orderData.status === 'pending' ? 'bg-blue-50' : 'bg-gray-50'
              }`}>
                <span className={`text-2xl ${
                  orderData.status === 'completed' ? 'text-green-600' : 
                  orderData.status === 'pending' ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {orderData.status === 'completed' ? '✓' : 
                   orderData.status === 'pending' ? 'P' : 'O'}
                </span>
                <div className="flex-1">
                  <div className={`font-semibold ${
                    orderData.status === 'unread' ? 'text-gray-400' : ''
                  }`}>
                    Email Communication
                  </div>
                  <div className="text-sm text-gray-500">
                    {orderData.status === 'unread' && 'Pending'}
                    {orderData.status === 'pending' && 'Ready to send'}
                    {orderData.status === 'completed' && 'Sent and confirmed'}
                  </div>
                </div>
              </div>

              {/* Delivery step (only for completed) */}
              {orderData.status === 'completed' && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                  <span className="text-green-600 text-2xl">✓</span>
                  <div className="flex-1">
                    <div className="font-semibold">Order Delivered</div>
                    <div className="text-sm text-gray-500">Completed 1 day ago</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            <div className="space-y-2">
              {orderData.status === 'unread' && (
                <div className="p-3 border-l-4 border-blue-500 bg-gray-50">
                  <div className="font-semibold">Order received</div>
                  <div className="text-sm text-gray-500">10 minutes ago</div>
                </div>
              )}
              
              {orderData.status === 'pending' && (
                <>
                  <div className="p-3 border-l-4 border-blue-500 bg-gray-50">
                    <div className="font-semibold">Order received</div>
                    <div className="text-sm text-gray-500">2 hours ago</div>
                  </div>
                  <div className="p-3 border-l-4 border-yellow-500 bg-gray-50">
                    <div className="font-semibold">Quotation generated</div>
                    <div className="text-sm text-gray-500">45 minutes ago</div>
                  </div>
                </>
              )}

              {orderData.status === 'completed' && (
                <>
                  <div className="p-3 border-l-4 border-blue-500 bg-gray-50">
                    <div className="font-semibold">Order received</div>
                    <div className="text-sm text-gray-500">2 days ago</div>
                  </div>
                  <div className="p-3 border-l-4 border-yellow-500 bg-gray-50">
                    <div className="font-semibold">Quotation sent</div>
                    <div className="text-sm text-gray-500">2 days ago</div>
                  </div>
                  <div className="p-3 border-l-4 border-purple-500 bg-gray-50">
                    <div className="font-semibold">Quotation approved</div>
                    <div className="text-sm text-gray-500">1 day ago</div>
                  </div>
                  <div className="p-3 border-l-4 border-green-500 bg-gray-50">
                    <div className="font-semibold">Order completed & delivered</div>
                    <div className="text-sm text-gray-500">1 day ago</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderDetail;
