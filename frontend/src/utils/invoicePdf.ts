import jsPDF from 'jspdf'

export function generateInvoicePDF(tx: any) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('Payment Invoice', 20, 20)

  doc.setFontSize(11)
  doc.text(`Invoice ID: ${tx.id}`, 20, 35)
  doc.text(`Date: ${new Date(tx.timestamp).toLocaleString()}`, 20, 45)

  doc.line(20, 50, 190, 50)

  doc.setFontSize(12)
  doc.text('Description:', 20, 65)
  doc.text(tx.description || '—', 60, 65)

  doc.text('Amount:', 20, 80)
  doc.text(`$${tx.amount.toFixed(2)}`, 60, 80)

  doc.text('Status:', 20, 95)
  doc.text('Completed', 60, 95)

  doc.line(20, 110, 190, 110)

  doc.setFontSize(10)
  doc.text(
    'This document serves as proof of payment.',
    20,
    125
  )

  doc.save(`invoice-${tx.id}.pdf`)
}