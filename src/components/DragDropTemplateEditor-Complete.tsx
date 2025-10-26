import React, { useState, useRef, useEffect } from 'react';

interface CanvasElement {
  id: string;
  type: 'textbox' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  content?: string;
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

interface HistoryState {
  elements: CanvasElement[];
  timestamp: number;
}

interface DragDropTemplateEditorProps {
  onSave: (template: any) => void;
  onCancel: () => void;
  initialTemplate?: any;
}

const DragDropTemplateEditor: React.FC<DragDropTemplateEditorProps> = ({ 
  onSave, 
  onCancel, 
  initialTemplate 
}) => {
  const [templateName, setTemplateName] = useState(initialTemplate?.name || '');
  const [format, setFormat] = useState<'docx' | 'pptx' | 'xlsx'>(initialTemplate?.format || 'pptx');
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<CanvasElement[][]>(initialTemplate?.pages || [[]]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<CanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [copiedElement, setCopiedElement] = useState<CanvasElement | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const gridSize = 10;
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([{ elements: pages[currentPage] || [], timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
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
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ 
      elements: typeof newElements === 'function' ? newElements(elements) : newElements, 
      timestamp: Date.now() 
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const elementTypes = [
    { type: 'textbox', icon: '📝', label: 'Text Box' },
    { type: 'image', icon: '🖼️', label: 'Image' },
    { type: 'shape-rectangle', icon: '⬜', label: 'Rectangle' },
    { type: 'shape-circle', icon: '⭕', label: 'Circle' },
    { type: 'shape-triangle', icon: '🔺', label: 'Triangle' },
    { type: 'shape-arrow', icon: '➡️', label: 'Arrow' },
    { type: 'shape-line', icon: '➖', label: 'Line' }
  ];

  const handleDragFromSidebar = (type: string) => {
    const isShape = type.startsWith('shape-');
    const shapeType = isShape ? type.replace('shape-', '') : undefined;
    const maxZ = elements.length > 0 ? Math.max(...elements.map(e => e.zIndex)) : 0;
    
    const newElement: CanvasElement = {
      id: `elem_${Date.now()}`,
      type: isShape ? 'shape' : type as any,
      shapeType: shapeType as any,
      x: 50,
      y: 50,
      width: type === 'textbox' ? 200 : type.includes('line') ? 150 : 100,
      height: type === 'textbox' ? 100 : type.includes('line') ? 5 : 100,
      zIndex: maxZ + 1,
      content: type === 'textbox' ? 'Double-click to edit' : '',
      imageUrl: type === 'image' ? '' : undefined,
      style: {
        fontSize: 14,
        fontFamily: 'Arial',
        color: '#000000',
        backgroundColor: isShape ? '#e2e8f0' : 'transparent',
        borderColor: '#94a3b8',
        borderWidth: 1,
        bold: false,
        italic: false,
        underline: false,
        textAlign: 'left'
      }
    };
    setElements([...elements, newElement]);
  };

  // Undo/Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const prevState = history[historyIndex - 1];
      setPages(prev => {
        const updated = [...prev];
        updated[currentPage] = prevState.elements;
        return updated;
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      setPages(prev => {
        const updated = [...prev];
        updated[currentPage] = nextState.elements;
        return updated;
      });
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          handleRedo();
        } else if (e.key === 'c' && selectedElement) {
          e.preventDefault();
          handleCopy();
        } else if (e.key === 'v' && copiedElement) {
          e.preventDefault();
          handlePaste();
        }
      } else if (e.key === 'Delete' && selectedElement) {
        e.preventDefault();
        handleDeleteElement();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, copiedElement, historyIndex]);

  // Copy/Paste
  const handleCopy = () => {
    const elem = elements.find(e => e.id === selectedElement);
    if (elem) setCopiedElement(elem);
  };

  const handlePaste = () => {
    if (copiedElement) {
      const newElement = {
        ...copiedElement,
        id: `elem_${Date.now()}`,
        x: copiedElement.x + 20,
        y: copiedElement.y + 20,
        zIndex: Math.max(...elements.map(e => e.zIndex)) + 1
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement.id);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    setSelectedElement(element.id);
    setIsDragging(true);
    setDraggedElement(element);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedElement || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    let newX = e.clientX - canvasRect.left - dragOffset.x;
    let newY = e.clientY - canvasRect.top - dragOffset.y;

    // Snap to grid
    if (snapToGrid) {
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    setElements(elements.map(elem => 
      elem.id === draggedElement.id 
        ? { ...elem, x: Math.max(0, newX), y: Math.max(0, newY) }
        : elem
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedElement(null);
  };

  const handleElementDoubleClick = (element: CanvasElement) => {
    if (element.type === 'textbox') {
      const newContent = prompt('Edit text:', element.content);
      if (newContent !== null) {
        setElements(elements.map(elem =>
          elem.id === element.id ? { ...elem, content: newContent } : elem
        ));
      }
    } else if (element.type === 'image' && !element.imageUrl) {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedElement) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setElements(elements.map(elem =>
          elem.id === selectedElement ? { ...elem, imageUrl } : elem
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  // Layer controls
  const handleBringToFront = () => {
    if (!selectedElement) return;
    const maxZ = Math.max(...elements.map(e => e.zIndex));
    setElements(elements.map(elem =>
      elem.id === selectedElement ? { ...elem, zIndex: maxZ + 1 } : elem
    ));
  };

  const handleSendToBack = () => {
    if (!selectedElement) return;
    const minZ = Math.min(...elements.map(e => e.zIndex));
    setElements(elements.map(elem =>
      elem.id === selectedElement ? { ...elem, zIndex: minZ - 1 } : elem
    ));
  };

  // Alignment tools
  const handleAlignLeft = () => {
    if (!selectedElement) return;
    setElements(elements.map(elem =>
      elem.id === selectedElement ? { ...elem, x: 0 } : elem
    ));
  };

  const handleAlignCenter = () => {
    if (!selectedElement || !canvasRef.current) return;
    const canvasWidth = 800;
    const elem = elements.find(e => e.id === selectedElement);
    if (elem) {
      setElements(elements.map(e =>
        e.id === selectedElement ? { ...e, x: (canvasWidth - elem.width) / 2 } : e
      ));
    }
  };

  const handleAlignRight = () => {
    if (!selectedElement || !canvasRef.current) return;
    const canvasWidth = 800;
    const elem = elements.find(e => e.id === selectedElement);
    if (elem) {
      setElements(elements.map(e =>
        e.id === selectedElement ? { ...e, x: canvasWidth - elem.width } : e
      ));
    }
  };

  // Page management
  const handleAddPage = () => {
    setPages([...pages, []]);
    setCurrentPage(pages.length);
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) return;
    const updated = pages.filter((_, i) => i !== currentPage);
    setPages(updated);
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleDeleteElement = () => {
    if (selectedElement) {
      setElements(elements.filter(elem => elem.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const handleStyleChange = (property: string, value: any) => {
    if (!selectedElement) return;
    
    setElements(elements.map(elem =>
      elem.id === selectedElement
        ? { ...elem, style: { ...elem.style, [property]: value } }
        : elem
    ));
  };

  const handleSave = () => {
    const template = {
      id: initialTemplate?.id || `template_${Date.now()}`,
      name: templateName,
      format,
      pages,
      canvasSize: { width: 800, height: 600 },
      createdAt: initialTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(template);
  };

  const selectedElementData = elements.find(e => e.id === selectedElement);

  // Render shape based on type
  const renderShape = (element: CanvasElement) => {
    const { shapeType, style } = element;
    
    if (shapeType === 'circle') {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: style?.backgroundColor,
          border: `${style?.borderWidth}px solid ${style?.borderColor}`
        }} />
      );
    } else if (shapeType === 'triangle') {
      return (
        <div style={{
          width: 0,
          height: 0,
          borderLeft: `${element.width / 2}px solid transparent`,
          borderRight: `${element.width / 2}px solid transparent`,
          borderBottom: `${element.height}px solid ${style?.backgroundColor}`
        }} />
      );
    } else if (shapeType === 'arrow') {
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill={style?.borderColor} />
            </marker>
          </defs>
          <line x1="0" y1="50" x2="100" y2="50" 
            stroke={style?.borderColor} 
            strokeWidth={style?.borderWidth} 
            markerEnd="url(#arrowhead)" />
        </svg>
      );
    } else if (shapeType === 'line') {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: style?.borderColor
        }} />
      );
    } else {
      // Rectangle (default)
      return null;
    }
  };

  // Sort elements by zIndex for rendering
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b shadow-sm">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Template Editor</h2>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg w-80 focus:border-primary focus:outline-none text-sm"
                placeholder="Enter template name..."
              />
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-sm font-medium bg-white"
              >
                <option value="pptx">📊 PowerPoint (.pptx)</option>
                <option value="docx">📄 Word (.docx)</option>
                <option value="xlsx">📈 Excel (.xlsx)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={onCancel} 
                className="px-5 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm text-gray-700 transition-all">
                Cancel
              </button>
              <button onClick={handleSave} 
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium text-sm shadow-md transition-all">
                Save Template
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="px-4 pb-3 flex items-center gap-3">
            {/* History */}
            <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
              <button onClick={handleUndo} disabled={historyIndex === 0} 
                className="px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors" 
                title="Undo (Ctrl+Z)">
                <span className="text-base">↩️</span>
                <span>Undo</span>
              </button>
              <div className="w-px h-6 bg-gray-200"></div>
              <button onClick={handleRedo} disabled={historyIndex === history.length - 1} 
                className="px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors" 
                title="Redo (Ctrl+Y)">
                <span className="text-base">↪️</span>
                <span>Redo</span>
              </button>
            </div>

            {/* Clipboard */}
            <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
              <button onClick={handleCopy} disabled={!selectedElement} 
                className="px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors" 
                title="Copy (Ctrl+C)">
                <span className="text-base">📋</span>
                <span>Copy</span>
              </button>
              <div className="w-px h-6 bg-gray-200"></div>
              <button onClick={handlePaste} disabled={!copiedElement} 
                className="px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors" 
                title="Paste (Ctrl+V)">
                <span className="text-base">📄</span>
                <span>Paste</span>
              </button>
            </div>

            {/* Alignment */}
            {selectedElement && (
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                <button onClick={handleAlignLeft} 
                  className="px-3 py-1.5 rounded hover:bg-gray-100 flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors" 
                  title="Align Left">
                  <span className="text-base">⬅️</span>
                  <span>Left</span>
                </button>
                <div className="w-px h-6 bg-gray-200"></div>
                <button onClick={handleAlignCenter} 
                  className="px-3 py-1.5 rounded hover:bg-gray-100 flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors" 
                  title="Align Center">
                  <span className="text-base">↔️</span>
                  <span>Center</span>
                </button>
                <div className="w-px h-6 bg-gray-200"></div>
                <button onClick={handleAlignRight} 
                  className="px-3 py-1.5 rounded hover:bg-gray-100 flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors" 
                  title="Align Right">
                  <span className="text-base">➡️</span>
                  <span>Right</span>
                </button>
              </div>
            )}

            {/* Layers */}
            {selectedElement && (
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                <button onClick={handleBringToFront} 
                  className="px-3 py-1.5 rounded hover:bg-gray-100 flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors" 
                  title="Bring to Front">
                  <span className="text-base">⬆️</span>
                  <span>Front</span>
                </button>
                <div className="w-px h-6 bg-gray-200"></div>
                <button onClick={handleSendToBack} 
                  className="px-3 py-1.5 rounded hover:bg-gray-100 flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors" 
                  title="Send to Back">
                  <span className="text-base">⬇️</span>
                  <span>Back</span>
                </button>
              </div>
            )}

            {/* Snap Grid */}
            <label className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
              <input 
                type="checkbox" 
                checked={snapToGrid} 
                onChange={(e) => setSnapToGrid(e.target.checked)} 
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Snap to Grid</span>
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-64 border-r bg-gradient-to-b from-gray-50 to-white p-4 overflow-auto">
            <h3 className="font-bold mb-4 text-gray-800 text-sm uppercase tracking-wide">Add Elements</h3>
            <div className="space-y-2">
              {elementTypes.map((elem) => (
                <button
                  key={elem.type}
                  onClick={() => handleDragFromSidebar(elem.type)}
                  className="w-full bg-white p-3 rounded-lg cursor-pointer hover:shadow-lg hover:scale-105 transition-all border-2 border-gray-200 hover:border-primary group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg group-hover:from-primary-light group-hover:to-primary transition-all">
                      <span className="text-2xl">{elem.icon}</span>
                    </div>
                    <span className="font-semibold text-sm text-gray-700 group-hover:text-primary transition-colors">{elem.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Pages */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Pages</h3>
                <button 
                  onClick={handleAddPage} 
                  className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition-all shadow-sm hover:shadow-md">
                  + Add Page
                </button>
              </div>
              <div className="space-y-2">
                {pages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg text-sm cursor-pointer flex justify-between items-center transition-all border-2 ${
                      currentPage === idx 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                    }`} 
                    onClick={() => setCurrentPage(idx)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Page {idx + 1}</span>
                      <span className={`text-xs ${currentPage === idx ? 'text-white/80' : 'text-gray-500'}`}>
                        ({pages[idx]?.length || 0} elements)
                      </span>
                    </div>
                    {pages.length > 1 && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (currentPage === idx) handleDeletePage(); 
                        }} 
                        className={`w-6 h-6 rounded flex items-center justify-center font-bold transition-colors ${
                          currentPage === idx 
                            ? 'hover:bg-red-600 text-white' 
                            : 'hover:bg-red-100 text-red-500'
                        }`}
                        title="Delete Page"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <h4 className="font-bold text-sm mb-2 text-blue-900">💡 Quick Tips</h4>
              <ul className="text-xs space-y-1 text-blue-800">
                <li>• Click elements to add</li>
                <li>• Drag to reposition</li>
                <li>• Double-click to edit</li>
                <li>• Use Ctrl+Z/Y for undo/redo</li>
              </ul>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-100 overflow-auto p-8">
            <div
              ref={canvasRef}
              className="bg-white shadow-xl mx-auto relative"
              style={{ 
                width: '800px', 
                height: '600px',
                backgroundImage: snapToGrid ? 'radial-gradient(circle, #d1d5db 1px, transparent 1px)' : 'none',
                backgroundSize: snapToGrid ? `${gridSize}px ${gridSize}px` : 'auto'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => setSelectedElement(null)}
            >
              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📄</div>
                    <div className="text-lg font-semibold">Click elements to add</div>
                  </div>
                </div>
              )}

              {sortedElements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-move ${
                    selectedElement === element.id ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    zIndex: element.zIndex,
                    fontSize: `${element.style?.fontSize}px`,
                    fontFamily: element.style?.fontFamily,
                    color: element.style?.color,
                    backgroundColor: element.style?.backgroundColor,
                    border: `${element.style?.borderWidth}px solid ${element.style?.borderColor}`,
                    fontWeight: element.style?.bold ? 'bold' : 'normal',
                    fontStyle: element.style?.italic ? 'italic' : 'normal',
                    textDecoration: element.style?.underline ? 'underline' : 'none',
                    textAlign: element.style?.textAlign,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: element.type === 'shape' ? 'center' : 'flex-start',
                    padding: element.type === 'textbox' ? '8px' : '0'
                  }}
                  onMouseDown={(e) => handleElementMouseDown(e, element)}
                  onDoubleClick={() => handleElementDoubleClick(element)}
                >
                  {element.type === 'textbox' && element.content}
                  {element.type === 'image' && (
                    element.imageUrl ? (
                      <img src={element.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🖼️</span>
                    )
                  )}
                  {element.type === 'shape' && renderShape(element)}
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-72 border-l bg-gradient-to-b from-gray-50 to-white p-4 overflow-auto">
            <h3 className="font-bold mb-4 text-gray-800 text-sm uppercase tracking-wide">Properties</h3>
            
            {!selectedElement && (
              <div className="text-center text-gray-400 mt-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">⚙️</span>
                </div>
                <div className="text-sm font-medium">Select an element</div>
                <div className="text-xs mt-1">Click any element on canvas to edit</div>
              </div>
            )}

            {selectedElement && selectedElementData && (
              <div className="space-y-4">
                {/* Element Info */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-3 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <span className="text-xl">
                      {selectedElementData.type === 'textbox' && '📝'}
                      {selectedElementData.type === 'image' && '🖼️'}
                      {selectedElementData.type === 'shape' && (
                        selectedElementData.shapeType === 'circle' ? '⭕' :
                        selectedElementData.shapeType === 'triangle' ? '🔺' :
                        selectedElementData.shapeType === 'arrow' ? '➡️' :
                        selectedElementData.shapeType === 'line' ? '➖' : '⬜'
                      )}
                    </span>
                    <span className="capitalize">{selectedElementData.type}</span>
                  </div>
                </div>

                {/* Layer Controls */}
                <div className="bg-white rounded-lg border-2 border-gray-200 p-3">
                  <div className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Layer Order</div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleBringToFront} 
                      className="flex-1 px-3 py-2 bg-gradient-to-b from-white to-gray-50 border-2 border-gray-300 rounded-lg hover:border-primary hover:shadow-md transition-all text-sm font-medium text-gray-700">
                      ⬆️ Front
                    </button>
                    <button 
                      onClick={handleSendToBack} 
                      className="flex-1 px-3 py-2 bg-gradient-to-b from-white to-gray-50 border-2 border-gray-300 rounded-lg hover:border-primary hover:shadow-md transition-all text-sm font-medium text-gray-700">
                      ⬇️ Back
                    </button>
                  </div>
                </div>

                {/* Position & Size */}
                <div className="bg-white rounded-lg border-2 border-gray-200 p-3">
                  <div className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Position & Size</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">X Position</label>
                      <input 
                        type="number" 
                        value={selectedElementData.x} 
                        onChange={(e) => setElements(elements.map(el => el.id === selectedElement ? {...el, x: Number(e.target.value)} : el))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Y Position</label>
                      <input 
                        type="number" 
                        value={selectedElementData.y} 
                        onChange={(e) => setElements(elements.map(el => el.id === selectedElement ? {...el, y: Number(e.target.value)} : el))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Width</label>
                      <input 
                        type="number" 
                        value={selectedElementData.width} 
                        onChange={(e) => setElements(elements.map(el => el.id === selectedElement ? {...el, width: Number(e.target.value)} : el))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Height</label>
                      <input 
                        type="number" 
                        value={selectedElementData.height} 
                        onChange={(e) => setElements(elements.map(el => el.id === selectedElement ? {...el, height: Number(e.target.value)} : el))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Text Formatting */}
                {selectedElementData.type === 'textbox' && (
                  <>
                    <div className="bg-white rounded-lg border-2 border-gray-200 p-3">
                      <div className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Text Style</div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">Font Size</label>
                          <input 
                            type="number" 
                            value={selectedElementData.style?.fontSize} 
                            onChange={(e) => handleStyleChange('fontSize', Number(e.target.value))}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">Font Family</label>
                          <select 
                            value={selectedElementData.style?.fontFamily} 
                            onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none bg-white">
                            <option>Arial</option>
                            <option>Times New Roman</option>
                            <option>Calibri</option>
                            <option>Georgia</option>
                            <option>Verdana</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStyleChange('bold', !selectedElementData.style?.bold)}
                            className={`flex-1 px-3 py-2 border-2 rounded-lg font-bold text-sm transition-all ${
                              selectedElementData.style?.bold 
                                ? 'bg-primary text-white border-primary shadow-md' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                            }`}>
                            B
                          </button>
                          <button 
                            onClick={() => handleStyleChange('italic', !selectedElementData.style?.italic)}
                            className={`flex-1 px-3 py-2 border-2 rounded-lg italic text-sm transition-all ${
                              selectedElementData.style?.italic 
                                ? 'bg-primary text-white border-primary shadow-md' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                            }`}>
                            I
                          </button>
                          <button 
                            onClick={() => handleStyleChange('underline', !selectedElementData.style?.underline)}
                            className={`flex-1 px-3 py-2 border-2 rounded-lg underline text-sm transition-all ${
                              selectedElementData.style?.underline 
                                ? 'bg-primary text-white border-primary shadow-md' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                            }`}>
                            U
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border-2 border-gray-200 p-3">
                      <div className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Text Color</div>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={selectedElementData.style?.color} 
                          onChange={(e) => handleStyleChange('color', e.target.value)}
                          className="w-16 h-10 border-2 border-gray-300 rounded-lg cursor-pointer" 
                        />
                        <input 
                          type="text" 
                          value={selectedElementData.style?.color} 
                          onChange={(e) => handleStyleChange('color', e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none font-mono"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Image Upload */}
                {selectedElementData.type === 'image' && (
                  <div className="bg-white rounded-lg border-2 border-gray-200 p-3">
                    <div className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Image</div>
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="w-full px-4 py-3 bg-gradient-to-b from-primary to-primary-dark text-white rounded-lg hover:shadow-lg font-semibold text-sm transition-all">
                      📤 Upload Image
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {selectedElementData.imageUrl && (
                      <div className="mt-2 text-xs text-green-600 font-medium">✓ Image uploaded</div>
                    )}
                  </div>
                )}

                {/* Colors */}
                <div className="bg-white rounded-lg border-2 border-gray-200 p-3">
                  <div className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Colors</div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Background</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={selectedElementData.style?.backgroundColor} 
                          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                          className="w-16 h-10 border-2 border-gray-300 rounded-lg cursor-pointer" 
                        />
                        <input 
                          type="text" 
                          value={selectedElementData.style?.backgroundColor} 
                          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Border Color</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={selectedElementData.style?.borderColor} 
                          onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                          className="w-16 h-10 border-2 border-gray-300 rounded-lg cursor-pointer" 
                        />
                        <input 
                          type="text" 
                          value={selectedElementData.style?.borderColor} 
                          onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Border Width</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="10"
                        value={selectedElementData.style?.borderWidth} 
                        onChange={(e) => handleStyleChange('borderWidth', Number(e.target.value))}
                        className="w-full accent-primary" 
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">{selectedElementData.style?.borderWidth}px</div>
                    </div>
                  </div>
                </div>

                {/* Delete */}
                <button 
                  onClick={handleDeleteElement} 
                  className="w-full px-4 py-3 bg-gradient-to-b from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg font-semibold text-sm transition-all">
                  🗑️ Delete Element
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropTemplateEditor;
