import React, { useState } from 'react';
import TemplateEditor from './TemplateEditor';
import VisualTemplateEditor from './VisualTemplateEditor';

interface TemplateEditorModalProps {
  onSave: (template: any) => void;
  onCancel: () => void;
  initialTemplate?: any;
}

const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({ 
  onSave, 
  onCancel, 
  initialTemplate 
}) => {
  const [editorMode, setEditorMode] = useState<'text' | 'visual'>('text');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header with Mode Toggle */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Template Editor</h2>
            
            {/* Mode Toggle */}
            <div className="flex bg-white border rounded-lg p-1">
              <button
                onClick={() => setEditorMode('text')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  editorMode === 'text' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📝 Text Editor
              </button>
              <button
                onClick={() => setEditorMode('visual')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  editorMode === 'visual' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎨 Visual Designer
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Format:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
              {initialTemplate?.type?.toUpperCase() || 'DOCX'}
            </span>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          {editorMode === 'text' ? (
            <TemplateEditor
              onSave={onSave}
              onCancel={onCancel}
              initialTemplate={initialTemplate}
            />
          ) : (
            <VisualTemplateEditor
              onSave={onSave}
              onCancel={onCancel}
              initialTemplate={initialTemplate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditorModal;
