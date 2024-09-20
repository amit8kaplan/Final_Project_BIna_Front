import Papa from 'papaparse';
import { saveAs } from 'file-saver';

// Helper function to export data as CSV
const exportToCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
};

// Function to flatten objects and arrays for CSV export
const flattenObject = (obj: any, prefix = ''): { [key: string]: any } => {
    return Object.keys(obj).reduce((acc: { [key: string]: any }, k: string) => {
        const pre = prefix.length ? prefix + '_' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else if (Array.isArray(obj[k])) {
            obj[k].forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {
                    acc[pre + k + '_' + index + '_value'] = item.value || '';
                    acc[pre + k + '_' + index + '_description'] = item.description || '';
                } else {
                    acc[pre + k + '_' + index] = item;
                }
            });
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
};

// Function to flatten Dapit object based on your schema
const flattenDapit = (dapit: any) => {
    const flattened = flattenObject(dapit);
    return flattened;
};

// Main export function for all relevant data
export const exportAllDataToCSV = (dataContext: any) => {
    const { sessions, instructors, groups, trainers, personalInstractors, dapits } = dataContext;
    //console.log('export dapits', dapits);
    exportToCSV(sessions, 'sessions.csv');
    exportToCSV(instructors, 'instructors.csv');
    exportToCSV(groups, 'groups.csv');
    exportToCSV(trainers, 'trainers.csv');
    exportToCSV(personalInstractors, 'personalInstructors.csv');
    exportToCSV(dapits.map(flattenDapit), 'dapits.csv');
};