import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { geminiService } from './geminiService';
import type { FileData } from '../types';

export const processFile = async (file: File): Promise<FileData> => {
  const fileData: FileData = {
    name: file.name,
    size: file.size,
    type: file.type,
    content: [],
    processed: false,
  };

  try {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      fileData.content = await processCSV(file);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    ) {
      fileData.content = await processExcel(file);
    } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
      fileData.content = await processJSON(file);
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      fileData.content = await processText(file);
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    fileData.processed = true;
    
    return fileData;
  } catch (error) {
    console.error('File processing error:', error);
    throw error;
  }
};

const processCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        resolve(results.data);
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
};

const processExcel = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(new Error(`Excel parsing error: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

const processJSON = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        
        try {
          // Try standard JSON parsing first
          const jsonData = JSON.parse(text);
          // Ensure we return an array
          const data = Array.isArray(jsonData) ? jsonData : [jsonData];
          resolve(data);
        } catch (parseError) {
          // If standard parsing fails, try JSON Lines (JSONL) format
          console.warn('Standard JSON parsing failed, trying JSONL format:', parseError);
          
          const lines = text.split('\n').filter(line => line.trim());
          const jsonObjects: any[] = [];
          
          for (const line of lines) {
            try {
              const obj = JSON.parse(line.trim());
              jsonObjects.push(obj);
            } catch (lineError) {
              console.warn(`Failed to parse line as JSON: ${line.substring(0, 50)}...`, lineError);
              // Continue processing other lines
            }
          }
          
          if (jsonObjects.length > 0) {
            resolve(jsonObjects);
          } else {
            reject(new Error(`JSON parsing error: ${parseError.message}`));
          }
        }
      } catch (error) {
        reject(new Error(`JSON parsing error: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read JSON file'));
    };
    
    reader.readAsText(file);
  });
};

const processText = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        
        // Try to detect if it's structured data (JSON-like, CSV-like, etc.)
        const lines = text.split('\n').filter(line => line.trim());
        
        // Check if it looks like CSV data
        if (lines.length > 1 && lines[0].includes(',')) {
          // Try to parse as CSV
          try {
            const result = Papa.parse(text, {
              header: true,
              skipEmptyLines: true,
            });
            if (result.data && result.data.length > 0) {
              resolve(result.data);
              return;
            }
          } catch (csvError) {
            console.warn('Failed to parse as CSV, treating as plain text');
          }
        }
        
        // Check if it looks like JSON
        if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
          try {
            const jsonData = JSON.parse(text);
            const data = Array.isArray(jsonData) ? jsonData : [jsonData];
            resolve(data);
            return;
          } catch (jsonError) {
            console.warn('Failed to parse as JSON, treating as plain text');
          }
        }
        
        // Fallback: treat as plain text with line-by-line structure
        const data = lines.map((line, index) => ({
          line_number: index + 1,
          content: line.trim(),
        }));
        resolve(data);
      } catch (error) {
        reject(new Error(`Text parsing error: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read text file'));
    };
    
    reader.readAsText(file);
  });
};

export const exportData = (data: any[], filename: string, format: 'csv' | 'json' | 'xlsx') => {
  switch (format) {
    case 'csv':
      exportCSV(data, filename);
      break;
    case 'json':
      exportJSON(data, filename);
      break;
    case 'xlsx':
      exportExcel(data, filename);
      break;
  }
};

const exportCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);
  downloadFile(csv, `${filename}.csv`, 'text/csv');
};

const exportJSON = (data: any[], filename: string) => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, 'application/json');
};

const exportExcel = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};