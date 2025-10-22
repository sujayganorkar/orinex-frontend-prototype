import React from 'react';
import Layout from '@/components/Layout';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Orders Processed Today', value: '12' },
    { title: 'Time Saved This Week', value: '37.5 hours' },
    { title: 'Pending Actions', value: '3' },
    { title: 'Error Rate', value: '0%' }
  ];

  const recentActivities = [
    { 
      client: 'Tata Precision Components', 
      action: 'Quotation sent', 
      time: '25 min ago' 
    },
    { 
      client: 'Mahindra Engineering', 
      action: 'Invoice generated', 
      time: '2 hours ago' 
    },
    { 
      client: 'Bharat Forge Ltd.', 
      action: 'New order received', 
      time: '4 hours ago' 
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Hello, Prakash!</h1>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search orders, clients, or documents..."
              className="w-80 px-4 py-2 rounded-full border border-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-sm text-gray-500 mb-2">{stat.title}</h3>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <div className="font-bold">{activity.client}</div>
                <div className="text-sm text-gray-500">{activity.action} - {activity.time}</div>
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">View</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
