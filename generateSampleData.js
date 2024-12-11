import fs from 'fs';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create samples directory if it doesn't exist
if (!fs.existsSync('./samples')) {
    fs.mkdirSync('./samples');
}

const sampleSize = 20;
const results = {
    saar: [],
    au: [],
    purchases: []
};

// Function to sample data
function sampleData(data, size) {
    let sampled = [];
    let len = data.length;
    for(let i = 0; i < size && len > 0; i++) {
        sampled.push(data[Math.floor(Math.random() * len)]);
    }
    return sampled;
}

// Helper function to process CSV files
function processCSV(filePath, dataArray) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({
                skipLines: 0,
                headers: [
                    'ABC #', 'Product Description', 'NDC', 'Account #', 
                    'Account Name', 'Contract Abbrev Name', 'Customer PO #', 
                    'Invoice #', 'Invoice Date', 'Order Qty', 'Shipped Qty',
                    'Non-Merchandise', 'Tax Amount', 'Invoice Ext Amt', 
                    'Total Ext Cost', 'Invoice Price'
                ]
            }))
            .on('data', (data) => dataArray.push(data))
            .on('end', () => resolve())
            .on('error', (error) => reject(error));
    });
}

// Process SAAR data
fs.createReadStream(path.join(__dirname, 'AU Data', 'AU_SAAR_2017 by LOC.csv'))
    .pipe(csv())
    .on('data', (data) => results.saar.push(data))
    .on('end', () => {
        const sampledSaar = sampleData(results.saar, sampleSize);
        fs.writeFileSync(
            path.join(__dirname, 'samples', 'saar_sample.json'), 
            JSON.stringify(sampledSaar, null, 2)
        );
        console.log('SAAR sample data created');
    });

// Process AU data
fs.createReadStream(path.join(__dirname, 'AU Data', 'AU_DOT by LOC.csv'))
    .pipe(csv())
    .on('data', (data) => results.au.push(data))
    .on('end', () => {
        const sampledAu = sampleData(results.au, sampleSize);
        fs.writeFileSync(
            path.join(__dirname, 'samples', 'au_sample.json'), 
            JSON.stringify(sampledAu, null, 2)
        );
        console.log('AU sample data created');
    });

// Process purchase data files
const purchaseDataDir = path.join(__dirname, 'Purchase Data');
fs.readdir(purchaseDataDir, (err, files) => {
    if (err) {
        console.error('Error reading Purchase Data directory:', err);
        return;
    }

    // Process only CSV files
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    
    // Process each CSV file
    Promise.all(csvFiles.map(file => 
        processCSV(path.join(purchaseDataDir, file), results.purchases)
    ))
    .then(() => {
        const sampledPurchases = sampleData(results.purchases, sampleSize);
        fs.writeFileSync(
            path.join(__dirname, 'samples', 'purchases_sample.json'),
            JSON.stringify(sampledPurchases, null, 2)
        );
        console.log('Purchase sample data created');
    })
    .catch(error => console.error('Error processing purchase files:', error));
});