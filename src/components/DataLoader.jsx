// src/components/DataLoader.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DataLoader = ({ onDataLoad }) => {
  const [loadingStatus, setLoadingStatus] = useState({
    saar: false,
    au: false,
    purchases: false
  });
  const [error, setError] = useState(null);

  const processDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('M')) {
      // Handle SAAR date format (e.g., "2023M01")
      const [year, month] = dateStr.split('M');
      return new Date(year, parseInt(month) - 1);
    }
    // Handle other date formats
    return new Date(dateStr);
  };

  const handleFileUpload = (fileType) => async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoadingStatus(prev => ({ ...prev, [fileType]: true }));
    setError(null);

    try {
      const result = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const processedData = results.data.filter(row => 
              // Filter out empty rows
              Object.values(row).some(value => value !== null && value !== '')
            ).map(row => {
              // Process dates based on file type
              if (fileType === 'saar' && row.summaryYM) {
                row.summaryYM = processDate(row.summaryYM);
              }
              if (fileType === 'au' && row.summaryYM) {
                row.summaryYM = processDate(row.summaryYM);
              }
              if (fileType === 'purchases' && row['Invoice Date']) {
                row['Invoice Date'] = processDate(row['Invoice Date']);
              }
              return row;
            });
            resolve(processedData);
          },
          error: (error) => reject(error)
        });
      });

      onDataLoad(fileType, result);
    } catch (error) {
      console.error('Error parsing file:', error);
      setError(`Error loading ${fileType} data: ${error.message}`);
    } finally {
      setLoadingStatus(prev => ({ ...prev, [fileType]: false }));
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Load Dashboard Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              SAAR Data
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload('saar')}
                className="mt-1 block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
                disabled={loadingStatus.saar}
              />
            </label>
            {loadingStatus.saar && <p className="text-sm text-gray-500">Loading SAAR data...</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              AU Data
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload('au')}
                className="mt-1 block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
                disabled={loadingStatus.au}
              />
            </label>
            {loadingStatus.au && <p className="text-sm text-gray-500">Loading AU data...</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Purchase Data
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload('purchases')}
                className="mt-1 block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
                disabled={loadingStatus.purchases}
              />
            </label>
            {loadingStatus.purchases && <p className="text-sm text-gray-500">Loading purchase data...</p>}
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DataLoader;