import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CostAnalysis = ({ auData, purchaseData, dateRange }) => {
  const costAnalysis = useMemo(() => {
    if (!auData?.length || !purchaseData?.length) return [];

    // Group purchases by drug category
    const costs = purchaseData.reduce((acc, purchase) => {
      const category = getCategoryFromDrug(purchase.drugDescription);
      if (!acc[category]) {
        acc[category] = {
          category,
          totalCost: 0,
          yearlyTrend: {}
        };
      }
      
      const year = new Date(purchase.invoiceDate).getFullYear();
      if (!acc[category].yearlyTrend[year]) {
        acc[category].yearlyTrend[year] = 0;
      }
      
      acc[category].totalCost += Number(purchase.totalCost) || 0;
      acc[category].yearlyTrend[year] += Number(purchase.totalCost) || 0;
      
      return acc;
    }, {});

    return Object.values(costs);
  }, [auData, purchaseData, dateRange]);

  const yearlyTrends = useMemo(() => {
    const years = [...new Set(costAnalysis.flatMap(c => 
      Object.keys(c.yearlyTrend)
    ))].sort();

    return years.map(year => ({
      year,
      ...costAnalysis.reduce((acc, category) => ({
        ...acc,
        [category.category]: category.yearlyTrend[year] || 0
      }), {})
    }));
  }, [costAnalysis]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Cost by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => 
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(value)
                  }
                />
                <Legend />
                <Bar dataKey="totalCost" fill="#2E86AB" name="Total Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Trends by Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => 
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(value)
                  }
                />
                <Legend />
                {costAnalysis.map(category => (
                  <Bar 
                    key={category.category}
                    dataKey={category.category}
                    name={category.category}
                    stackId="a"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to categorize drugs
const getCategoryFromDrug = (drugName) => {
  const categories = {
    BSHO: /(PIPERACILLIN|CEFEPIME|MEROPENEM|IMIPENEM|AZTREONAM|AMIKACIN|TOBRAMYCIN|GENTAMICIN)/i,
    BSCA: /(CEFTRIAXONE|LEVOFLOXACIN|CIPROFLOXACIN|ERTAPENEM)/i,
    GramPos: /(VANCOMYCIN|LINEZOLID|DAPTOMYCIN|CEFTAROLINE)/i,
    NSBL: /(CEFAZOLIN|AMPICILLIN|AMOXICILLIN|CEPHALEXIN)/i,
    Antifungal: /(MICAFUNGIN|FLUCONAZOLE|CASPOFUNGIN)/i,
    CDI: /(CLINDAMYCIN|CEFEPIME|CEFTRIAXONE)/i
  };

  for (const [category, pattern] of Object.entries(categories)) {
    if (pattern.test(drugName)) return category;
  }
  return 'Other';
};

export default CostAnalysis;