import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { FileData } from '../types';

export const processFile = async (file: File): Promise<FileData> => {
  const fileData: FileData = {
    name: file.name,
    size: file.size,
    type: file.type,
    content: [],
    processed: false,
    insights: [],
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
    fileData.insights = generateInsights(fileData.content);
    
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
        const jsonData = JSON.parse(e.target?.result as string);
        // Ensure we return an array
        const data = Array.isArray(jsonData) ? jsonData : [jsonData];
        resolve(data);
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
        // Split by lines and create array of objects
        const lines = text.split('\n').filter(line => line.trim());
        const data = lines.map((line, index) => ({
          line: index + 1,
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

const generateInsights = (data: any[]): string[] => {
  const insights: string[] = [];
  
  if (data.length === 0) {
    insights.push('No data found in file');
    return insights;
  }

  // Basic statistics
  insights.push(`Dataset contains ${data.length} records`);
  
  // Column analysis for structured data
  if (typeof data[0] === 'object' && data[0] !== null) {
    const columns = Object.keys(data[0]);
    insights.push(`${columns.length} columns detected: ${columns.slice(0, 5).join(', ')}${columns.length > 5 ? '...' : ''}`);
    
    // Detect potential numeric columns
    const numericColumns = columns.filter(col => {
      const sample = data.slice(0, 100).map(row => row[col]);
      const numericValues = sample.filter(val => !isNaN(Number(val)) && val !== '');
      return numericValues.length > sample.length * 0.8;
    });
    
    if (numericColumns.length > 0) {
      insights.push(`Numeric columns found: ${numericColumns.join(', ')}`);
    }
    
    // Detect potential date columns
    const dateColumns = columns.filter(col => {
      const sample = data.slice(0, 20).map(row => row[col]);
      const dateValues = sample.filter(val => {
        const parsed = new Date(val);
        return !isNaN(parsed.getTime()) && val !== '';
      });
      return dateValues.length > sample.length * 0.5;
    });
    
    if (dateColumns.length > 0) {
      insights.push(`Date columns found: ${dateColumns.join(', ')}`);
    }
  }
  
  return insights;
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