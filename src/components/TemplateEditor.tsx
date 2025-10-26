import React, { useState, useEffect } from 'react';

interface Variable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown';
  defaultValue?: string;
  options?: string[];
}

interface TemplateEditorProps {
  onSave: (template: any) => void;
  onCancel: () => void;
  initialTemplate?: any;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ onSave, onCancel, initialTemplate }) => {
  const [templateName, setTemplateName] = useState(initialTemplate?.name || '');
  const [templateType, setTemplateType] = useState<'docx' | 'xlsx' | 'pdf' | 'html'>(
    initialTemplate?.type || 'docx'
  );
  const [content, setContent] = useState(initialTemplate?.content || '');
  const [variables, setVariables] = useState<Variable[]>(initialTemplate?.variables || []);
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [newVariable, setNewVariable] = useState<Partial<Variable>>({
    type: 'text'
  });

  // Load company info from localStorage
  const [companyInfo, setCompanyInfo] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    const saved = localStorage.getItem('companyInfo');
    if (saved) {
      setCompanyInfo(JSON.parse(saved));
    }
  }, []);

  // Formatting states
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(12);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  const handleAddVariable = () => {
    if (newVariable.name) {
      const variable: Variable = {
        id: `var_${Date.now()}`,
        name: newVariable.name,
        type: newVariable.type || 'text',
        defaultValue: newVariable.defaultValue,
        options: newVariable.options
      };
      setVariables([...variables, variable]);
      setNewVariable({ type: 'text' });
      setShowVariableModal(false);
    }
  };

  const handleInsertVariable = (varName: string) => {
    setContent(content + ` {{${varName}}} `);
  };

  const handleInsertCompanyInfo = (field: string, value: string) => {
    setContent(content + value);
  };

  const handleDeleteVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  const handleSave = () => {
    const template = {
      id: initialTemplate?.id || `template_${Date.now()}`,
      name: templateName,
      type: templateType,
      content,
      variables,
      formatting: {
        fontFamily,
        fontSize,
        isBold,
        isItalic,
        textAlign
      },
      createdAt: initialTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(template);
  };

  const formatFieldName = (field: string) => {
    return field.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Template Editor</h2>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Save Template
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left: Template Settings */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Standard Quotation"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Document Type</label>
                <select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="docx">Word Document (.docx)</option>
                  <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
                  <option value="pdf">PDF Document (.pdf)</option>
                  <option value="html">HTML Page (.html)</option>
                </select>
              </div>

              {/* Formatting Options */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Formatting</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 text-sm">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option>Arial</option>
                      <option>Times New Roman</option>
                      <option>Calibri</option>
                      <option>Helvetica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">Font Size</label>
                    <input
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      min="8"
                      max="72"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsBold(!isBold)}
                      className={`flex-1 px-3 py-2 border rounded-md font-bold ${
                        isBold ? 'bg-primary text-white' : 'bg-white'
                      }`}
                    >
                      B
                    </button>
                    <button
                      onClick={() => setIsItalic(!isItalic)}
                      className={`flex-1 px-3 py-2 border rounded-md italic ${
                        isItalic ? 'bg-primary text-white' : 'bg-white'
                      }`}
                    >
                      I
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {['left', 'center', 'right'].map((align) => (
                      <button
                        key={align}
                        onClick={() => setTextAlign(align as any)}
                        className={`flex-1 px-3 py-2 border rounded-md text-xs ${
                          textAlign === align ? 'bg-primary text-white' : 'bg-white'
                        }`}
                      >
                        {align.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Company Info Section */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Company Details</h3>
                <p className="text-xs text-gray-500 mb-3">Click to insert into document</p>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {Object.entries(companyInfo).map(([field, value]) => (
                    <button
                      key={field}
                      onClick={() => handleInsertCompanyInfo(field, value)}
                      className="w-full text-left p-2 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition"
                    >
                      <div className="font-medium text-xs text-purple-900">{formatFieldName(field)}</div>
                      <div className="text-xs text-gray-600 truncate">{value}</div>
                    </button>
                  ))}
                  {Object.keys(companyInfo).length === 0 && (
                    <div className="text-xs text-gray-400 p-2">
                      Add company details in Settings
                    </div>
                  )}
                </div>
              </div>

              {/* Variables Section */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Variables</h3>
                  <button
                    onClick={() => setShowVariableModal(true)}
                    className="px-3 py-1 bg-primary text-white rounded-md text-sm"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-auto">
                  {variables.map((variable) => (
                    <div
                      key={variable.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{variable.name}</div>
                        <div className="text-xs text-gray-500">{variable.type}</div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleInsertVariable(variable.name)}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          Insert
                        </button>
                        <button
                          onClick={() => handleDeleteVariable(variable.id)}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center & Right: Document Editor */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">Document Content</label>
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                {/* Toolbar */}
                <div className="border-b p-2 bg-gray-50 flex gap-2 flex-wrap">
                  <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">
                    📄 New
                  </button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">
                    📁 Open
                  </button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">
                    💾 Save
                  </button>
                  <div className="border-l mx-2"></div>
                  <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">
                    ↩️ Undo
                  </button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">
                    ↪️ Redo
                  </button>
                  <div className="border-l mx-2"></div>
                  <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">
                    📋 Table
                  </button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">
                    🖼️ Image
                  </button>
                </div>

                {/* Editor Area */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-6 min-h-[500px] resize-none focus:outline-none"
                  style={{
                    fontFamily,
                    fontSize: `${fontSize}px`,
                    fontWeight: isBold ? 'bold' : 'normal',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    textAlign
                  }}
                  placeholder="Start typing your template content here...

Use {{variable_name}} to insert variables.

Example:
Dear {{client_name}},

Thank you for your inquiry dated {{inquiry_date}}.
We are pleased to provide you with a quotation for {{product_name}}.

Quantity: {{quantity}}
Unit Price: {{unit_price}}
Total Amount: {{total_amount}}

Best regards,
{{company_name}}"
                />
              </div>

              {/* Preview Info */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Quick Tips:</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Use <code className="bg-white px-1 rounded">{'{{variable_name}}'}</code> to insert dynamic content</li>
                  <li>• Click company details buttons to insert static info</li>
                  <li>• Variables will be replaced with actual values during generation</li>
                  <li>• Add custom company fields in Settings page</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Variable Modal */}
      {showVariableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Variable</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Variable Name</label>
                <input
                  type="text"
                  value={newVariable.name || ''}
                  onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., client_name"
                />
              </div>

              <div>
                <label className="block mb-2">Variable Type</label>
                <select
                  value={newVariable.type}
                  onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="dropdown">Dropdown</option>
                </select>
              </div>

              {newVariable.type === 'dropdown' && (
                <div>
                  <label className="block mb-2">Options (comma-separated)</label>
                  <input
                    type="text"
                    onChange={(e) => setNewVariable({ 
                      ...newVariable, 
                      options: e.target.value.split(',').map(o => o.trim()) 
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Option 1, Option 2, Option 3"
                  />
                </div>
              )}

              <div>
                <label className="block mb-2">Default Value (optional)</label>
                <input
                  type="text"
                  value={newVariable.defaultValue || ''}
                  onChange={(e) => setNewVariable({ ...newVariable, defaultValue: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowVariableModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVariable}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md"
              >
                Add Variable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateEditor;
