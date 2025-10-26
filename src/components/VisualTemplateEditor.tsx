import React, { useState, useRef, useEffect } from 'react';

interface Variable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown';
  defaultValue?: string;
  options?: string[];
}

interface CanvasElement {
  id: string;
  type: 'textbox' | 'image' | 'shape' | 'variable';
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  content?: string;
  variableName?: string; // For variable elements
  imageUrl?: string;
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'arrow' | 'line';
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    textAlign?: 'left' | 'center' | 'right';
  };
}

interface VisualTemplateEditorProps {
  onSave: (template: any) => void;
  onCancel: () => void;
  initialTemplate?: any;
}

const VisualTemplateEditor: React.FC<VisualTemplateEditorProps> = ({ 
  onSave, 
  onCancel, 
  initialTemplate 
}) => {
  const [templateName, setTemplateName] = useState(initialTemplate?.name || '');
  const [format, setFormat] = useState<'docx' | 'pptx' | 'xlsx'>(initialTemplate?.type || 'docx');
  const [variables, setVariables] = useState<Variable[]>(initialTemplate?.variables || []);
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [newVariable, setNewVariable] = useState<Partial<Variable>>({ type: 'text' });
  
  // Multi-format support
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<CanvasElement[][]>(
    initialTemplate?.pages || [format === 'xlsx' ? [] : []]
  );
  
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const elements = pages[currentPage] || [];
  
  const setElements = (newElements: CanvasElement[] | ((prev: CanvasElement[]) => CanvasElement[])) => {
    setPages(prev => {
      const updated = [...prev];
      updated[currentPage] = typeof newElements === 'function' 
        ? newElements(updated[currentPage] || []) 
        : newElements;
      return updated;
    });
  };

  // Format-specific configurations
  const getFormatConfig = () => {
    switch(format) {
      case 'docx':
        return {
          name: 'Word Document',
          icon: '📄',
          canvasSize: { width: 816, height: 1056 }, // A4 at 96 DPI
          multiPage: true,
          gridSize: 10
        };
      case 'pptx':
        return {
          name: 'Presentation',
          icon: '📊',
          canvasSize: { width: 960, height: 720 }, // 16:9 slide
          multiPage: true,
          gridSize: 10
        };
      case 'xlsx':
        return {
          name: 'Spreadsheet',
          icon: '📈',
          canvasSize: { width: 1200, height: 800 }, // Spreadsheet view
          multiPage: false,
          gridSize: 20 // Larger grid for cells
        };
      default:
        return {
          name: 'Document',
          icon: '📄',
          canvasSize: { width: 816, height: 1056 },
          multiPage: true,
          gridSize: 10
        };
    }
  };

  const formatConfig = getFormatConfig();

  const elementTypes = [
    { type: 'textbox', icon: '📝', label: 'Text Box' },
    { type: 'variable', icon: '🔤', label: 'Variable' },
    { type: 'image', icon: '🖼️', label: 'Image' },
    { type: 'shape-rectangle', icon: '⬜', label: 'Rectangle' },
    { type: 'shape-circle', icon: '⭕', label: 'Circle' },
    ...(format === 'xlsx' ? [
      { type: 'table', icon: '📋', label: 'Table' },
      { type: 'chart', icon: '📊', label: 'Chart' }
    ] : [])
  ];

  const handleAddElement = (type: string) => {
    const isShape = type.startsWith('shape-');
    const shapeType = isShape ? type.replace('shape-', '') : undefined;
    const maxZ = elements.length > 0 ? Math.max(...elements.map(e => e.zIndex)) : 0;
    
    const newElement: CanvasElement = {
      id: `elem_${Date.now()}`,
      type: isShape ? 'shape' : type as any,
      shapeType: shapeType as any,
      x: 50,
      y: 50,
      width: getDefaultWidth(type),
      height: getDefaultHeight(type),
      zIndex: maxZ + 1,
      content: getDefaultContent(type),
      style: getDefaultStyle(type, isShape)
    };
    
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const getDefaultWidth = (type: string) => {
    if (format === 'xlsx') return 120; // Cell width
    return type === 'textbox' ? 200 : type.includes('line') ? 150 : 100;
  };

  const getDefaultHeight = (type: string) => {
    if (format === 'xlsx') return 30; // Cell height
    return type === 'textbox' ? 60 : type.includes('line') ? 5 : 100;
  };

  const getDefaultContent = (type: string) => {
    switch(type) {
      case 'textbox': return 'Double-click to edit';
      case 'variable': return '{{Click to select variable}}';
      default: return '';
    }
  };

  const getDefaultStyle = (type: string, isShape: boolean) => ({
    fontSize: format === 'xlsx' ? 11 : 14,
    fontFamily: format === 'xlsx' ? 'Calibri' : 'Arial',
    color: '#000000',
    backgroundColor: isShape ? '#e2e8f0' : (format === 'xlsx' ? '#ffffff' : 'transparent'),
    borderColor: format === 'xlsx' ? '#d1d5db' : '#94a3b8',
    borderWidth: format === 'xlsx' ? 1 : (isShape ? 1 : 0),
    bold: false,
    italic: false,
    underline: false,
    textAlign: 'left' as const
  });

  // Variable management
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

  const handleVariableSelect = (variableName: string) => {
    if (selectedElement) {
      setElements(elements.map(el => 
        el.id === selectedElement 
          ? { ...el, type: 'variable', variableName, content: `{{${variableName}}}` }
          : el
      ));
    }
  };

  // Page management
  const addPage = () => {
    if (formatConfig.multiPage) {
      setPages([...pages, []]);
      setCurrentPage(pages.length);
    }
  };

  const deletePage = (pageIndex: number) => {
    if (pages.length > 1) {
      const newPages = pages.filter((_, i) => i !== pageIndex);
      setPages(newPages);
      setCurrentPage(Math.min(currentPage, newPages.length - 1));
    }
  };

  const handleSave = () => {
    const template = {
      id: initialTemplate?.id || `template_${Date.now()}`,
      name: templateName,
      type: format,
      isVisual: true,
      pages,
      variables,
      formatConfig,
      createdAt: initialTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(template);
  };

  // Mouse handlers for drag and drop
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setSelectedElement(elementId);
    setIsDragging(true);
    
    const element = elements.find(el => el.id === elementId);
    if (element) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left - element.x,
          y: e.clientY - rect.top - element.y
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedElement) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const newX = e.clientX - rect.left - dragOffset.x;
        const newY = e.clientY - rect.top - dragOffset.y;
        
        setElements(elements.map(el => 
          el.id === selectedElement 
            ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
            : el
        ));
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectedElementData = elements.find(e => e.id === selectedElement);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar - Tools */}
      <div className="w-64 bg-white border-r p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Template Info */}
          <div>
            <label className="block text-sm font-semibold mb-2">Template Name</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Template name..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="docx">📄 Word Document</option>
              <option value="pptx">📊 Presentation</option>
              <option value="xlsx">📈 Spreadsheet</option>
            </select>
          </div>

          {/* Elements */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Elements</h3>
            <div className="grid grid-cols-2 gap-2">
              {elementTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => handleAddElement(type.type)}
                  className="p-3 border rounded-lg hover:bg-gray-50 text-center text-xs"
                >
                  <div className="text-lg mb-1">{type.icon}</div>
                  <div>{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Variables */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold">Variables</h3>
              <button
                onClick={() => setShowVariableModal(true)}
                className="px-2 py-1 bg-primary text-white rounded text-xs"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {variables.map((variable) => (
                <button
                  key={variable.id}
                  onClick={() => handleVariableSelect(variable.name)}
                  className="w-full p-2 bg-blue-50 hover:bg-blue-100 rounded border text-left text-xs"
                >
                  <div className="font-medium">{variable.name}</div>
                  <div className="text-gray-500">{variable.type}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Header */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">{formatConfig.icon}</span>
              <span className="font-medium">{formatConfig.name}</span>
            </div>
            
            {formatConfig.multiPage && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Page:</span>
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="px-2 py-1 border rounded text-sm"
                >
                  {pages.map((_, i) => (
                    <option key={i} value={i}>Page {i + 1}</option>
                  ))}
                </select>
                <button
                  onClick={addPage}
                  className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                >
                  + Page
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm"
            >
              Save Template
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-8 bg-gray-100">
          <div
            ref={canvasRef}
            className="relative bg-white shadow-lg mx-auto"
            style={{
              width: formatConfig.canvasSize.width,
              height: formatConfig.canvasSize.height,
              backgroundImage: format === 'xlsx' 
                ? `linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)`
                : `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
              backgroundSize: format === 'xlsx' 
                ? `${formatConfig.gridSize}px ${formatConfig.gridSize}px`
                : `${formatConfig.gridSize}px ${formatConfig.gridSize}px`
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move border-2 ${
                  selectedElement === element.id ? 'border-primary' : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  zIndex: element.zIndex,
                  backgroundColor: element.style?.backgroundColor,
                  borderColor: selectedElement === element.id ? undefined : element.style?.borderColor,
                  borderWidth: element.style?.borderWidth,
                  fontSize: element.style?.fontSize,
                  fontFamily: element.style?.fontFamily,
                  color: element.style?.color,
                  fontWeight: element.style?.bold ? 'bold' : 'normal',
                  fontStyle: element.style?.italic ? 'italic' : 'normal',
                  textDecoration: element.style?.underline ? 'underline' : 'none',
                  textAlign: element.style?.textAlign,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: element.style?.textAlign === 'center' ? 'center' : 
                                 element.style?.textAlign === 'right' ? 'flex-end' : 'flex-start',
                  padding: element.type === 'textbox' || element.type === 'variable' ? '4px' : '0'
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
              >
                {element.type === 'textbox' && (
                  <div className="w-full h-full overflow-hidden">
                    {element.content}
                  </div>
                )}
                {element.type === 'variable' && (
                  <div className="w-full h-full overflow-hidden text-blue-600 font-medium">
                    {element.content}
                  </div>
                )}
                {element.type === 'image' && (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                    {element.imageUrl ? 'Image' : 'No Image'}
                  </div>
                )}
                {element.type === 'shape' && (
                  <div className="w-full h-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-64 bg-white border-l p-4 overflow-y-auto">
        {selectedElementData ? (
          <div className="space-y-4">
            <h3 className="font-semibold">Element Properties</h3>
            
            {/* Basic properties */}
            <div>
              <label className="block text-sm font-medium mb-1">Width</label>
              <input
                type="number"
                value={selectedElementData.width}
                onChange={(e) => setElements(elements.map(el => 
                  el.id === selectedElement ? {...el, width: Number(e.target.value)} : el
                ))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <input
                type="number"
                value={selectedElementData.height}
                onChange={(e) => setElements(elements.map(el => 
                  el.id === selectedElement ? {...el, height: Number(e.target.value)} : el
                ))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            {/* Content editing for text/variable elements */}
            {(selectedElementData.type === 'textbox' || selectedElementData.type === 'variable') && (
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                {selectedElementData.type === 'variable' ? (
                  <select
                    value={selectedElementData.variableName || ''}
                    onChange={(e) => setElements(elements.map(el => 
                      el.id === selectedElement 
                        ? {...el, variableName: e.target.value, content: `{{${e.target.value}}}`}
                        : el
                    ))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    <option value="">Select variable...</option>
                    {variables.map(v => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                ) : (
                  <textarea
                    value={selectedElementData.content || ''}
                    onChange={(e) => setElements(elements.map(el => 
                      el.id === selectedElement ? {...el, content: e.target.value} : el
                    ))}
                    className="w-full px-2 py-1 border rounded text-sm"
                    rows={3}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm mt-8">
            Select an element to edit properties
          </div>
        )}
      </div>

      {/* Variable Modal */}
      {showVariableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Add Variable</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newVariable.name || ''}
                onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                placeholder="Variable name..."
                className="w-full px-3 py-2 border rounded-md"
              />
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
            <div className="flex gap-2 mt-4">
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
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualTemplateEditor;
