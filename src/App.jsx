// src/App.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataLoader from './components/DataLoader';
import SystemOverview from './components/SystemOverview';
import HospitalView from './components/HospitalView';
import Definitions from './components/Definitions';

function App() {
  const [saarData, setSaarData] = useState([]);
  const [auData, setAuData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: new Date(2020, 0, 1),
    to: new Date()
  });

  const handleDataLoad = (type, data) => {
    switch(type) {
      case 'saar':
        setSaarData(data);
        break;
      case 'au':
        setAuData(data);
        break;
      case 'purchases':
        setPurchaseData(data);
        break;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Scripps NHSN Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <DataLoader onDataLoad={handleDataLoad} />
          
          <Tabs defaultValue="system" className="space-y-4">
            <TabsList>
              <TabsTrigger value="system">System Overview</TabsTrigger>
              <TabsTrigger value="SD">San Diego</TabsTrigger>
              <TabsTrigger value="LJ">La Jolla</TabsTrigger>
              <TabsTrigger value="CV">Chula Vista</TabsTrigger>
              <TabsTrigger value="EN">Encinitas</TabsTrigger>
              <TabsTrigger value="GR">Green</TabsTrigger>
              <TabsTrigger value="definitions">Definitions</TabsTrigger>
            </TabsList>

            <TabsContent value="system">
              <SystemOverview 
                saarData={saarData}
                auData={auData}
                dateRange={dateRange}
              />
            </TabsContent>

            {['SD', 'LJ', 'CV', 'EN', 'GR'].map(hospital => (
              <TabsContent key={hospital} value={hospital}>
                <HospitalView
                  hospital={hospital}
                  saarData={saarData}
                  auData={auData}
                  purchaseData={purchaseData}
                  dateRange={dateRange}
                />
              </TabsContent>
            ))}

            <TabsContent value="definitions">
              <Definitions />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;