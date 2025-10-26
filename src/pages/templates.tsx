import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TemplateEditor from '@/components/TemplateEditor';

const Templates: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Templates');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Standard Quotation',
      type: 'docx',
      description: 'Basic quotation template',
      variables: ['client_name', 'product', 'quantity', 'price'],
      lastModified: '2024-03-10'
    },
    {
      id: 2,
      name: 'Invoice Template',
      type: 'docx',
      description: 'GST compliant invoice',
      variables: ['client_name', 'invoice_no', 'total_amount'],
      lastModified: '2024-03-08'
    }
  ]);

  const handleSaveTemplate = (template: any) => {
    if (selectedTemplate) {
      setTemplates(templates.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates([...templates, template]);
    }
    setShowEditor(false);
    setSelectedTemplate(null);
  };

  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Templates</h1>
          <button 
            onClick={() => { setSelectedTemplate(null); setShowEditor(true); }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            + Create Template
          </button>
        </div>

        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('Templates')}
            className={`px-4 py-2 ${activeTab === 'Templates' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : 'text-gray-600'}`}
          >
            Templates
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <div key={template.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <div className="text-sm text-gray-600">{template.type.toUpperCase()}</div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-500 mb-1">Variables:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((v: string) => (
                      <span key={v} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4">Last modified: {template.lastModified}</p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSelectedTemplate(template); setShowEditor(true); }}
                    className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEditor && (
        <TemplateEditor
          onSave={handleSaveTemplate}
          onCancel={() => { setShowEditor(false); setSelectedTemplate(null); }}
          initialTemplate={selectedTemplate}
        />
      )}
    </Layout>
  );
};

export default Templates;
