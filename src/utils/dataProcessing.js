// src/utils/dataProcessing.js
import Papa from 'papaparse';

export const loadCSVData = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// In your App.jsx or a data loading component:
import { useEffect, useState } from 'react';
import { loadCSVData } from './utils/dataProcessing';

const DataLoader = () => {
  const [saarData, setSaarData] = useState([]);
  const [auData, setAuData] = useState([]);
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    try {
      const data = await loadCSVData(file);
      // Determine which data to update based on file name or user selection
      if (file.name.includes('SAAR')) {
        setSaarData(data);
      } else if (file.name.includes('AU_DOT')) {
        setAuData(data);
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Upload SAAR Data CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mt-1 block w-full"
          />
        </label>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Upload AU Data CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mt-1 block w-full"
          />
        </label>
      </div>

      {/* Display upload status or preview */}
      <div className="mt-4">
        <p>SAAR Data Records: {saarData.length}</p>
        <p>AU Data Records: {auData.length}</p>
      </div>
    </div>
  );
};

export default DataLoader;