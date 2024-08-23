import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export const downloadPdf = async (content :HTMLDivElement |null, fileName : string) => {
    if (content) {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
  
        pdf.html(content, {
          callback: function (doc) {
            doc.save(fileName+'.pdf');
          },
          x: 10,
          y: 10,
          width: 190, // Set width to match A4 size, allowing for margins
          windowWidth: content.scrollWidth,
        });
    }
}


