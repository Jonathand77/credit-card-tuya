import jsPDF from 'jspdf'
import type { TransactionItem } from '../services/api'

export function generateInvoicePDF(tx: TransactionItem) {
  const doc = new jsPDF()

  // Barra de color de marca
  doc.setFillColor(220, 38, 38)
  doc.rect(0, 0, 210, 16, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.text('Credit Card App', 20, 11)

  doc.setTextColor(17, 24, 39)
  doc.setFontSize(20)
  doc.text('Factura de pago', 20, 34)

  doc.setFontSize(11)
  doc.setTextColor(107, 114, 128)
  doc.text(`Folio: ${tx.id}`, 20, 44)
  doc.text(`Fecha: ${new Date(tx.timestamp).toLocaleString()}`, 20, 51)

  doc.setDrawColor(229, 231, 235)
  doc.line(20, 58, 190, 58)

  doc.setFontSize(12)
  doc.setTextColor(17, 24, 39)
  doc.text('Descripción:', 20, 72)
  doc.text(tx.description || '—', 65, 72)

  doc.text('Monto:', 20, 86)
  doc.text(`$${tx.amount.toFixed(2)}`, 65, 86)

  doc.text('Estado:', 20, 100)
  doc.setTextColor(16, 185, 129)
  doc.text('Completado', 65, 100)

  doc.setDrawColor(229, 231, 235)
  doc.line(20, 112, 190, 112)

  doc.setFontSize(9)
  doc.setTextColor(156, 163, 175)
  doc.text(
    'Este documento sirve como comprobante de pago.',
    20,
    124
  )

  doc.save(`factura-${tx.id}.pdf`)
}