import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

const Settings: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<{[key: string]: string}>({
    name: 'Sharma Metal Works',
    address: 'Plot No. 42, MIDC Area, Nagpur, Maharashtra - 440010',
    gstin: '27ABCDE1234F1Z5'
  });

  // Save to localStorage whenever companyInfo changes
  useEffect(() => {
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
  }, [companyInfo]);
  
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editFieldName, setEditFieldName] = useState('');

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

  const handleCompanyInfoChange = (field: string, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAddField = () => {
    if (newFieldName.trim()) {
      const fieldKey = newFieldName.toLowerCase().replace(/\s+/g, '_');
      setCompanyInfo(prev => ({ ...prev, [fieldKey]: '' }));
      setNewFieldName('');
      setShowAddFieldModal(false);
    }
  };

  const handleDeleteField = (field: string) => {
    const newInfo = { ...companyInfo };
    delete newInfo[field];
    setCompanyInfo(newInfo);
  };

  const handleRenameField = (oldField: string, newName: string) => {
    if (newName.trim() && newName !== oldField) {
      const newFieldKey = newName.toLowerCase().replace(/\s+/g, '_');
      const newInfo = { ...companyInfo };
      newInfo[newFieldKey] = newInfo[oldField];
      delete newInfo[oldField];
      setCompanyInfo(newInfo);
    }
    setEditingField(null);
    setEditFieldName('');
  };

  const formatFieldName = (field: string) => {
    return field.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">Save Changes</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Company Information</h2>
            <button
              onClick={() => setShowAddFieldModal(true)}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              + Add Field
            </button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(companyInfo).map(([field, value]) => (
              <div key={field}>
                <div className="flex justify-between items-center mb-2">
                  {editingField === field ? (
                    <input
                      type="text"
                      value={editFieldName}
                      onChange={(e) => setEditFieldName(e.target.value)}
                      onBlur={() => handleRenameField(field, editFieldName)}
                      onKeyPress={(e) => e.key === 'Enter' && handleRenameField(field, editFieldName)}
                      className="flex-1 px-2 py-1 border-2 border-primary rounded font-medium"
                      autoFocus
                    />
                  ) : (
                    <label className="block font-medium">{formatFieldName(field)}</label>
                  )}
                  {!['name', 'address', 'gstin'].includes(field) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingField(field);
                          setEditFieldName(formatFieldName(field));
                        }}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteField(field)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                {field === 'address' ? (
                  <textarea 
                    value={value}
                    onChange={(e) => handleCompanyInfoChange(field, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                  />
                ) : (
                  <input 
                    type="text" 
                    value={value}
                    onChange={(e) => handleCompanyInfoChange(field, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                )}
              </div>
            ))}
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

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Custom Field</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Field Name</label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Phone Number, PAN Number, Bank Details"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">This will be the label for your field</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => { setShowAddFieldModal(false); setNewFieldName(''); }}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddField}
                disabled={!newFieldName.trim()}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Settings;
