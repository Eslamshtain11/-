import { Payment } from '../types';

// These variables will be available globally because the scripts are loaded in index.html
declare var XLSX: any;

export const exportToXLSX = (payments: Payment[], fileName: string): void => {
  const worksheetData = payments.map(({ studentName, groupName, amount, date }) => ({
    'اسم الطالب': studentName,
    'المجموعة': groupName,
    'المبلغ': amount,
    'التاريخ': new Date(date).toLocaleDateString('ar-EG'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'المدفوعات');

  // Set column widths
  worksheet['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 20 }];

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportMonthlyReportToPDF = (payments: Payment[], month: string, total: number): void => {
    const { jsPDF: JSPDF } = (window as any).jspdf;
    const doc = new JSPDF();

    // IMPORTANT: For Arabic text to render correctly, a font supporting Arabic characters
    // must be embedded. This version uses standard PDF fonts which might not render Arabic
    // correctly on all systems. For a production app, embedding a font like Amiri (using Base64) is recommended.
    doc.addFont('https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpQdkhYl0E.ttf', 'Cairo', 'normal');
    doc.setFont('Cairo');

    doc.setR2L(true); // Enable Right-to-Left text direction

    doc.setFontSize(22);
    doc.text(`تقرير مرتب شهر ${month}`, 210 - 20, 20, { align: 'right' });

    doc.setFontSize(16);
    doc.text(`الإجمالي: ${total.toLocaleString('ar-EG')} جنيه`, 210 - 20, 35, { align: 'right' });

    const tableColumn = ["اسم الطالب", "المجموعة", "المبلغ", "التاريخ"];
    const tableRows: (string | number)[][] = [];

    // Reverse payments for chronological order in the PDF report
    const reversedPayments = [...payments].reverse();

    reversedPayments.forEach(payment => {
        const paymentData = [
            payment.studentName,
            payment.groupName,
            payment.amount.toLocaleString('ar-EG'),
            new Date(payment.date).toLocaleDateString('ar-EG'),
        ];
        tableRows.push(paymentData);
    });

    (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'grid',
        headStyles: { halign: 'center', fillColor: [10, 25, 47], font: 'Cairo' },
        styles: { halign: 'right', font: 'Cairo' },
    });

    doc.save(`تقرير-${month}.pdf`);
};
