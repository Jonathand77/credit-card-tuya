import React, { useEffect, useState } from 'react'
import { getTransactions } from '../services/api'
import { generateInvoicePDF } from '../utils/invoicePdf'
import { showToast } from '../components/Toast'

export default function History() {
  const [txs, setTxs] = useState<any[]>([])

  useEffect(() => {
    getTransactions({ page: 1, size: 20 })
      .then(r => {
        const items = r.items || []
        setTxs(items)

        if (items.length === 0) {
          showToast('Aún no tienes transacciones registradas', 'info')
        }
      })
      .catch(() => {
        showToast('No se pudo cargar el historial', 'error')
      })
  }, [])

  return (
    <div className="container fade-in">
      <div className="history-header">
        <h2 className="history-title">Historial de transacciones</h2>
        <p className="history-subtitle">
          Revisa y descarga tu historial de pagos
        </p>
      </div>

      <div className="invoice-list">
        {txs.map(tx => (
          <div key={tx.id} className="invoice-card">
            <div className="invoice-header">
              <div>
                <div className="invoice-title">
                  {tx.type === 'PAYMENT' ? 'Payment Invoice' : tx.type}
                </div>
                <div className="invoice-id">Invoice #{tx.id}</div>
              </div>

              <div className="invoice-amount">
                ${tx.amount.toFixed(2)}
              </div>
            </div>

            <div className="invoice-body">
              <div className="invoice-row">
                <span>Description</span>
                <span>{tx.description || '—'}</span>
              </div>

              <div className="invoice-row">
                <span>Date</span>
                <span>{new Date(tx.timestamp).toLocaleString()}</span>
              </div>

              <div className="invoice-row">
                <span>Status</span>
                <span className="invoice-status success">Completed</span>
              </div>
            </div>

            <div className="invoice-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  try {
                    generateInvoicePDF(tx)
                    showToast('Factura descargada correctamente', 'success')
                  } catch (err) {
                    showToast('Error al generar la factura', 'error')
                  }
                }}
              >
                Descargar PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}