// src/components/HospitalView.jsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DataTable } from './DataTable.jsx';
import  CostAnalysis from './CostAnalysis';

const HospitalView = ({ hospital, saarData, auData, purchaseData, dateRange }) => {
    const categories = {
      all: 'All Antibacterials',
      BSHO: 'Broad-Spectrum Hospital Onset',
      BSCA: 'Broad-Spectrum Community-Acquired',
      GramPos: 'Gram-Positive',
      NSBL: 'Narrow-Spectrum Beta-Lactam',
      Antifungal: 'Antifungal',
      CDI: 'High Risk C. difficile'
    };
  
    const filteredSAARData = useMemo(() => {
      if (!saarData?.length) return {};
  
      return Object.keys(categories).reduce((acc, category) => {
        const categoryData = saarData.filter(d => 
          d.orgID === hospital &&
          new Date(d.summaryYM) >= dateRange.from &&
          new Date(d.summaryYM) <= dateRange.to &&
          (category === 'all' 
            ? d.SAARType_2017.includes('All-Antibacterial')
            : d.SAARType_2017.includes(category))
        );
  
        acc[category] = categoryData.sort((a, b) => 
          new Date(a.summaryYM) - new Date(b.summaryYM)
        );
  
        return acc;
      }, {});
    }, [saarData, hospital, dateRange]);
  
    const antibioticUsage = useMemo(() => {
      if (!auData?.length) return {};
  
      return Object.keys(categories).reduce((acc, category) => {
        let flagField = '';
        switch(category) {
          case 'BSHO': flagField = 'bshoFlag'; break;
          case 'BSCA': flagField = 'bscaFlag'; break;
          case 'GramPos': flagField = 'gramposFlag'; break;
          case 'NSBL': flagField = 'nsblFlag'; break;
          case 'Antifungal': flagField = 'afFlag'; break;
          case 'CDI': flagField = 'cdiFlag'; break;
          default: flagField = null;
        }
  
        const filteredData = auData.filter(d => 
          d.orgID === hospital &&
          new Date(d.summaryYM) >= dateRange.from &&
          new Date(d.summaryYM) <= dateRange.to &&
          (flagField ? d[flagField] : true)
        );
  
        acc[category] = filteredData.reduce((sum, record) => {
          const drugKey = record.drugDescription;
          if (!sum[drugKey]) {
            sum[drugKey] = {
              drug: drugKey,
              antimicrobialDays: 0,
              ivCount: 0,
              poCount: 0
            };
          }
          sum[drugKey].antimicrobialDays += record.antimicrobialDays || 0;
          sum[drugKey].ivCount += record.IV_Count || 0;
          sum[drugKey].poCount += record.digestive_Count || 0;
          return sum;
        }, {});
  
        return acc;
      }, {});
    }, [auData, hospital, dateRange]);
  
    const columns = [
      {
        accessorKey: 'drug',
        header: 'Antibiotic'
      },
      {
        accessorKey: 'antimicrobialDays',
        header: 'Days of Therapy'
      },
      {
        accessorKey: 'ivCount',
        header: 'IV Days'
      },
      {
        accessorKey: 'poCount',
        header: 'PO Days'
      }
    ];
  
    return (
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid grid-cols-8 lg:grid-cols-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="BSHO">BSHO</TabsTrigger>
          <TabsTrigger value="BSCA">BSCA</TabsTrigger>
          <TabsTrigger value="GramPos">Gram+</TabsTrigger>
          <TabsTrigger value="NSBL">NSBL</TabsTrigger>
          <TabsTrigger value="Antifungal">Antifungal</TabsTrigger>
          <TabsTrigger value="CDI">CDI</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
        </TabsList>
  
        {/* SAAR and Usage Tabs */}
        {Object.entries(categories).map(([key, label]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{label} SAAR Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredSAARData[key]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="summaryYM" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <YAxis domain={[0, 'auto']} />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="locSAAR" 
                        stroke="#2E86AB" 
                        name="SAAR"
                      />
                      <ReferenceLine y={1} stroke="red" strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader>
                <CardTitle>Antibiotic Usage Details</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={columns}
                  data={Object.values(antibioticUsage[key])}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
  
        {/* Cost Analysis Tab */}
        <TabsContent value="costs">
          <CostAnalysis 
            auData={auData.filter(d => d.orgID === hospital)}
            purchaseData={purchaseData.filter(d => d.orgID === hospital)}
            dateRange={dateRange}
          />
        </TabsContent>
      </Tabs>
    );
  };
  
  export default HospitalView;