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
    fileData.insights = await generateAIInsights(fileData.content, file.name);
    
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

const generateAIInsights = async (data: any[], fileName: string): Promise<string[]> => {
  if (data.length === 0) {
    return ['No data found in file'];
  }

  try {
    console.log('🔍 Starting AI analysis for file:', fileName);
    
    // Prepare data sample for AI analysis (limit to prevent token overflow)
    const sampleSize = Math.min(data.length, 100);
    const dataSample = data.slice(0, sampleSize);
    
    // Create structured data representation
    const dataStructure = typeof data[0] === 'object' && data[0] !== null 
      ? {
          columns: Object.keys(data[0]),
          totalRows: data.length,
          sampleRows: dataSample
        }
      : {
          totalRows: data.length,
          sampleData: dataSample
        };

    console.log('📊 Data structure prepared:', { 
      fileName, 
      totalRows: data.length, 
      sampleSize: dataSample.length,
      hasColumns: typeof data[0] === 'object' && data[0] !== null
    });

    const analysisPrompt = `You are a Senior Product Manager AI assistant. Analyze this uploaded business data and provide actionable product management insights.

**File:** ${fileName}
**Total Records:** ${data.length}
**Data Structure:** ${JSON.stringify(dataStructure, null, 2)}

**Analysis Requirements:**
1. **Key Patterns & Trends** - Identify meaningful patterns by product, category, time, region, user behavior, etc.
2. **Opportunities & Concerns** - Highlight business opportunities, potential issues, performance gaps, or areas needing attention
3. **Actionable Next Steps** - Provide specific, implementable recommendations for product features, pricing, targeting, or strategy
4. **Strategic KPIs to Track** - Suggest relevant metrics like AOV, churn rate, NPS, conversion rates, retention, etc.

**Important:** 
- Analyze the ACTUAL DATA VALUES, not just column names
- Provide specific insights based on the data patterns you see
- Focus on product management implications
- Be concise but actionable
- If data appears incomplete or unclear, mention what additional data would be helpful

Return your analysis as a structured response with clear sections for each requirement above.`;

    console.log('🤖 Sending analysis request to AI...');
    const aiResponse = await geminiService.sendMessage(analysisPrompt);
    console.log('✅ AI analysis completed, processing response...');
    
    // Split AI response into insight bullets for display
    const insights = aiResponse
      .split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 8) // Limit to 8 key insights for UI display
      .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
      .filter(line => line.length > 10); // Filter out very short lines
    
    console.log('📋 Generated insights:', insights.length, 'items');
    return insights.length > 0 ? insights : [`AI analysis completed for ${data.length} records`];
    
  } catch (error) {
    console.error('AI analysis error:', error);
    // Fallback to basic analysis if AI fails
    return [
      `Dataset contains ${data.length} records`,
      'AI analysis temporarily unavailable - basic file processing completed',
      'Upload successful - you can now ask questions about this data'
    ];
  }
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