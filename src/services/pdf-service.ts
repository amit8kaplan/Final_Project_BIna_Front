import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export const downloadPdf = async (content: HTMLDivElement | null, fileName: string) => {
  console.log('content: ', content);
  if (content) {
    // Clone the content to avoid modifying the actual DOM
    const clonedContent = content.cloneNode(true) as HTMLDivElement;

    // Remove SVG elements
    const svgElements = clonedContent.querySelectorAll('svg');
    svgElements.forEach((svg) => svg.remove());

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    pdf.html(clonedContent, {
      callback: function (doc) {
        doc.save(fileName + '.pdf');
      },
      x: 10,
      y: 10,
      width: 190, // Set width to match A4 size, allowing for margins
      windowWidth: content.scrollWidth,
    });
  }
};
