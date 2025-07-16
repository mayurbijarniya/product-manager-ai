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
        
        // File uploaded successfully - no notification needed, just close upload UI
        if (onFileProcessed) {
          onFileProcessed(''); // Empty string to close upload UI without adding message
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
    <Card padding="md" className="space-y-6 bg-white dark:bg-dark-surface border-2 border-light-border dark:border-dark-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 dark:bg-primary-400 rounded-xl flex items-center justify-center shadow-light dark:shadow-dark">
            <BarChart3 className="w-4 h-4 text-white dark:text-dark-primary" />
          </div>
          <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
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
            ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20 scale-105'
            : 'border-light-border dark:border-dark-border hover:border-primary-400 dark:hover:border-primary-500 hover:bg-light-surface dark:hover:bg-dark-surface'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="w-16 h-16 bg-light-surface dark:bg-dark-surface rounded-2xl flex items-center justify-center mx-auto shadow-light dark:shadow-dark">
            <Upload className="w-8 h-8 text-light-text-muted dark:text-dark-text-muted" />
          </div>
          
          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-primary-600 dark:text-primary-400">Drop files here...</p>
              <p className="text-sm text-light-text-muted dark:text-dark-text-muted">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Supports CSV, Excel, JSON, and TXT files (max 10MB)
              </p>
              <p className="text-xs text-light-text-muted dark:text-dark-text-muted mt-2">
                Files will be automatically analyzed for PM insights
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary flex items-center">
            <FileSpreadsheet className="w-4 h-4 mr-2 text-success-light dark:text-success-dark" />
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {uploadedFiles.map((file) => {
              const IconComponent = getFileIcon(file.type);
              return (
                <div
                  key={file.name}
                  className="flex items-start justify-between p-4 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border hover:shadow-light dark:hover:shadow-dark transition-all duration-200"
                >
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-white dark:bg-dark-primary rounded-xl flex items-center justify-center border border-light-border dark:border-dark-border flex-shrink-0 shadow-light dark:shadow-dark">
                      <IconComponent className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-light-text-muted dark:text-dark-text-muted">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                        <span className="text-xs text-light-text-muted dark:text-dark-text-muted">
                          {file.content.length} records
                        </span>
                        {file.processed && (
                          <span className="text-xs text-success-light dark:text-success-dark font-medium">
                            ✓ Processed
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-xs text-success-light dark:text-success-dark bg-success-light/10 dark:bg-success-dark/10 px-2 py-1 rounded-lg">
                          📎 Ready for analysis - Ask me questions about this data
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={X}
                    onClick={() => removeFile(file.name)}
                    className="text-error-light hover:text-error-light/80 hover:bg-error-light/10 dark:text-error-dark dark:hover:text-error-dark/80 dark:hover:bg-error-dark/10 flex-shrink-0 ml-2"
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