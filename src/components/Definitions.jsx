// src/components/Definitions.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Definitions = () => {
  console.log("Definitions component rendering");
  
  const definitions = [
    {
      category: "BSHO",
      fullName: "Broad-Spectrum Hospital Onset",
      description: "Antibiotics commonly used for hospital-acquired infections",
      examples: "Piperacillin/Tazobactam, Cefepime, Meropenem, Imipenem"
    },
    {
      category: "BSCA",
      fullName: "Broad-Spectrum Community-Acquired",
      description: "Antibiotics typically used for community-acquired infections",
      examples: "Ceftriaxone, Levofloxacin, Ciprofloxacin, Ertapenem"
    },
    {
      category: "GramPos",
      fullName: "Gram-Positive",
      description: "Antibiotics targeting gram-positive organisms",
      examples: "Vancomycin, Linezolid, Daptomycin, Ceftaroline"
    },
    {
      category: "NSBL",
      fullName: "Narrow-Spectrum Beta-Lactam",
      description: "Targeted beta-lactam antibiotics",
      examples: "Cefazolin, Ampicillin, Cephalexin, Nafcillin"
    },
    {
      category: "Antifungal",
      fullName: "Antifungal Agents",
      description: "Medications used to treat fungal infections",
      examples: "Micafungin, Fluconazole, Caspofungin"
    },
    {
      category: "CDI",
      fullName: "High Risk C. difficile",
      description: "Antibiotics associated with increased C. difficile risk",
      examples: "Fluoroquinolones, 3rd/4th gen Cephalosporins, Clindamycin"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>NHSN Antimicrobial Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Example Agents</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {definitions.map((def) => (
              <TableRow key={def.category}>
                <TableCell className="font-medium">{def.category}</TableCell>
                <TableCell>{def.fullName}</TableCell>
                <TableCell>{def.description}</TableCell>
                <TableCell>{def.examples}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Definitions;