// src/components/SystemOverview.jsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine} from 'recharts';

const SystemOverview = ({ saarData, dateRange }) => {
  const latestSAARData = useMemo(() => {
    if (!saarData?.length) return [];

    // Get the latest year from the data
    const maxYear = Math.max(...saarData.map(d => d.summaryYR));
    
    // Filter for Adult_All-Antibacterial_2017 type and latest year
    const filtered = saarData.filter(d => 
      d.SAARType_2017 === "Adult_All-Antibacterial_2017" && 
      d.summaryYR === maxYear
    );

    // Group by hospital and calculate average SAAR
    const hospitalData = filtered.reduce((acc, curr) => {
      if (!acc[curr.orgID]) {
        acc[curr.orgID] = {
          hospital: curr.orgID,
          totalSAAR: 0,
          count: 0
        };
      }
      acc[curr.orgID].totalSAAR += curr.locSAAR;
      acc[curr.orgID].count += 1;
      return acc;
    }, {});

    // Calculate averages and convert to array
    return Object.values(hospitalData).map(h => ({
      hospital: h.hospital,
      saar: h.totalSAAR / h.count
    }));
  }, [saarData]);

  const SAARCategories = useMemo(() => ({
    BSHO: "Broad-Spectrum Hospital Onset",
    BSCA: "Broad-Spectrum Community-Acquired",
    GramPos: "Gram-Positive",
    NSBL: "Narrow-Spectrum Beta-Lactam",
    Antifungal: "Antifungal",
    CDI: "High Risk C. difficile"
  }), []);

  const getCategoryData = (category) => {
    if (!saarData?.length) return [];

    const filtered = saarData.filter(d => 
      d.SAARType_2017.includes(category) &&
      new Date(d.summaryYM) >= dateRange.from &&
      new Date(d.summaryYM) <= dateRange.to
    );

    return filtered.reduce((acc, curr) => {
      if (!acc[curr.orgID]) {
        acc[curr.orgID] = {
          hospital: curr.orgID,
          totalSAAR: 0,
          count: 0
        };
      }
      acc[curr.orgID].totalSAAR += curr.locSAAR;
      acc[curr.orgID].count += 1;
      return acc;
    }, {});
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Overall SAAR by Hospital</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latestSAARData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hospital" />
                <YAxis domain={[0, 'auto']} />
                <Tooltip />
                <Legend />
                <Bar dataKey="saar" fill="#2E86AB" />
                {/* Add reference line for SAAR = 1 */}
                <ReferenceLine y={1} stroke="red" strokeDasharray="3 3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category-specific SAAR charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(SAARCategories).map(([key, title]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.values(getCategoryData(key))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hospital" />
                    <YAxis domain={[0, 'auto']} />
                    <Tooltip />
                    <Bar 
                      dataKey={d => d.totalSAAR / d.count} 
                      name="SAAR" 
                      fill="#2E86AB" 
                    />
                    <ReferenceLine y={1} stroke="red" strokeDasharray="3 3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SystemOverview;