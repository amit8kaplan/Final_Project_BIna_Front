import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const exportToCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
};

export const exportAllDataToCSV = (dataContext: any) => {
    const { sessions, instructors, groups, trainers, personalInstractors, dapits } = dataContext;

    exportToCSV(sessions, 'sessions.csv');
    exportToCSV(instructors, 'instructors.csv');
    exportToCSV(groups, 'groups.csv');
    exportToCSV(trainers, 'trainers.csv');
    exportToCSV(personalInstractors, 'personalInstructors.csv');
    exportToCSV(dapits, 'dapits.csv');
};

