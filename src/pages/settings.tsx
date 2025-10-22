import React, { useState } from 'react';
import Layout from '@/components/Layout';

const Settings: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Sharma Metal Works',
    address: 'Plot No. 42, MIDC Area, Nagpur, Maharashtra - 440010',
    gstin: '27ABCDE1234F1Z5'
  });

  const [automationSettings, setAutomationSettings] = useState({
    quotationGeneration: true,
    emailDrafting: true,
    invoiceGeneration: true
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    whatsappNotifications: true
  });

  const handleToggle = (category: string, setting: string) => {
    switch(category) {
      case 'automation':
        setAutomationSettings(prev => ({
          ...prev,
          [setting]: !prev[setting as keyof typeof automationSettings]
        }));
        break;
      case 'notifications':
        setNotificationPreferences(prev => ({
          ...prev,
          [setting]: !prev[setting as keyof typeof notificationPreferences]
        }));
        break;
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">Save Changes</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Company Name</label>
              <input 
                type="text" 
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo(prev => ({...prev, name: e.target.value}))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-2">Address</label>
              <textarea 
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo(prev => ({...prev, address: e.target.value}))}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>
            <div>
              <label className="block mb-2">GSTIN</label>
              <input 
                type="text" 
                value={companyInfo.gstin}
                onChange={(e) => setCompanyInfo(prev => ({...prev, gstin: e.target.value}))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">AI Automation Settings</h2>
          <div className="space-y-4">
            {Object.entries(automationSettings).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <div>
                  <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</strong>
                  <p className="text-sm text-gray-500">
                    {key === 'quotationGeneration' && 'Let AI create quotations based on incoming emails'}
                    {key === 'emailDrafting' && 'Let AI draft response emails'}
                    {key === 'invoiceGeneration' && 'Let AI create invoices after quotation approval'}
                  </p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={value}
                    onChange={() => handleToggle('automation', key)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {Object.entries(notificationPreferences).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <div>
                  <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</strong>
                  <p className="text-sm text-gray-500">
                    {key === 'emailNotifications' && 'Receive notifications via email'}
                    {key === 'whatsappNotifications' && 'Receive notifications via WhatsApp'}
                  </p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={value}
                    onChange={() => handleToggle('notifications', key)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
