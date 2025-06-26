import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileSpreadsheet, FileText, File, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAppStore } from '../../stores/appStore';
import { processFile } from '../../utils/fileProcessor';

interface FileUploadProps {
  onClose: () => void;
  onFileProcessed?: (insights: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onClose, onFileProcessed }) => {
  const { addFile, uploadedFiles, removeFile } = useAppStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const processedFile = await processFile(file);
        addFile(processedFile);
        
        // Generate analysis insights and send to chat
        if (onFileProcessed && processedFile.insights) {
          const analysisPrompt = `I've uploaded a file: ${processedFile.name}

**File Details:**
- Size: ${(processedFile.size / 1024).toFixed(1)} KB
- Records: ${processedFile.content.length}
- Type: ${processedFile.type}

**Data Insights:**
${processedFile.insights.map(insight => `• ${insight}`).join('\n')}

Please analyze this data from a product management perspective. What insights can you provide about:
1. Key patterns and trends in the data
2. Product opportunities or concerns
3. Recommended actions based on the data
4. Metrics and KPIs we should track

${processedFile.content.length > 0 ? `Here's a sample of the data structure: ${JSON.stringify(processedFile.content[0], null, 2)}` : ''}`;

          onFileProcessed(analysisPrompt);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        // TODO: Show error toast
      }
    }
  }, [addFile, onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const getFileIcon = (type: string) => {
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
      return FileSpreadsheet;
    }
    if (type.includes('text') || type.includes('json')) {
      return FileText;
    }
    return File;
  };

  return (
    <Card padding="md" className="space-y-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Upload Data Files
          </h3>
        </div>
        <Button variant="ghost" size="sm" icon={X} onClick={onClose} />
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 scale-105'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          
          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400">Drop files here...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports CSV, Excel, JSON, and TXT files (max 10MB)
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Files will be automatically analyzed for PM insights
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
            <FileSpreadsheet className="w-4 h-4 mr-2 text-green-500" />
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {uploadedFiles.map((file) => {
              const IconComponent = getFileIcon(file.type);
              return (
                <div
                  key={file.name}
                  className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-600 flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {file.content.length} records
                        </span>
                        {file.processed && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            ✓ Processed
                          </span>
                        )}
                      </div>
                      
                      {file.insights && file.insights.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {file.insights.slice(0, 2).map((insight, index) => (
                            <p key={index} className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                              • {insight}
                            </p>
                          ))}
                          {file.insights.length > 2 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              +{file.insights.length - 2} more insights
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={X}
                    onClick={() => removeFile(file.name)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0 ml-2"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};