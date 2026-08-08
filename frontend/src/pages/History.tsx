import { useEffect, useState } from 'react'
import { getTransactions, type TransactionItem } from '../services/api'
import { generateInvoicePDF } from '../utils/invoicePdf'
import { showToast } from '../lib/toastStore'

const PAGE_SIZE = 20

/* ---------- ICONOS ---------- */

const IconReceipt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
)

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const IconDownload = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const IconEmpty = () => (
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
)

export default function History() {
  const [txs, setTxs] = useState<TransactionItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    let ignore = false

    getTransactions({ page: 1, size: PAGE_SIZE })
      .then(r => {
        if (ignore) return
        setTxs(r.items || [])
        setTotal(r.total || 0)

        if ((r.items || []).length === 0) {
          showToast('Aún no tienes transacciones registradas', 'info')
        }
      })
      .catch(() => {
        if (!ignore) showToast('No se pudo cargar el historial', 'error')
      })

    return () => { ignore = true }
  }, [])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const r = await getTransactions({ page: nextPage, size: PAGE_SIZE })
      setTxs(prev => [...prev, ...(r.items || [])])
      setPage(nextPage)
    } catch {
      showToast('No se pudo cargar más transacciones', 'error')
    } finally {
      setLoadingMore(false)
    }
  }

  const lastTxDate = txs[0] ? new Date(txs[0].timestamp) : null

  return (
    <div className="container fade-in">
      <div className="page-header">
        <h2 className="page-title">Historial de transacciones</h2>
        <p className="page-subtitle">
          Revisa y descarga tu historial de pagos
        </p>
      </div>

      {total > 0 && (
        <div className="summary-stats">
          <div className="summary-stat" style={{ animationDelay: '0s' }}>
            <div className="summary-stat-icon"><IconReceipt /></div>
            <div>
              <p className="summary-stat-label">Transacciones</p>
              <p className="summary-stat-value">{total}</p>
            </div>
          </div>

          <div className="summary-stat" style={{ animationDelay: '0.08s' }}>
            <div className="summary-stat-icon"><IconClock /></div>
            <div>
              <p className="summary-stat-label">Última transacción</p>
              <p className="summary-stat-value">
                {lastTxDate ? lastTxDate.toLocaleDateString() : '—'}
              </p>
            </div>
          </div>
        </div>
      )}

      {txs.length === 0 ? (
        <div className="card-list-empty">
          <IconEmpty />
          <p className="card-list-empty-title">Aún no tienes transacciones registradas</p>
          <p className="card-list-empty-desc">Tus pagos aparecerán aquí una vez que realices el primero</p>
        </div>
      ) : (
        <>
          <div className="invoice-list">
            {txs.map((tx, i) => (
              <div key={tx.id} className="invoice-card" style={{ animationDelay: `${Math.min(i, 6) * 0.06}s` }}>
                <div className="invoice-header">
                  <div>
                    <div className="invoice-title">Factura de pago</div>
                    <div className="invoice-id">Folio #{tx.id.slice(0, 8)}</div>
                  </div>

                  <div className="invoice-amount">
                    ${tx.amount.toFixed(2)}
                  </div>
                </div>

                <div className="invoice-body">
                  <div className="invoice-row">
                    <span>Descripción</span>
                    <span>{tx.description || '—'}</span>
                  </div>

                  <div className="invoice-row">
                    <span>Fecha</span>
                    <span>{new Date(tx.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="invoice-row">
                    <span>Estado</span>
                    <span className="invoice-status success">Completado</span>
                  </div>
                </div>

                <div className="invoice-footer">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      try {
                        generateInvoicePDF(tx)
                        showToast('Factura descargada correctamente', 'success')
                      } catch {
                        showToast('Error al generar la factura', 'error')
                      }
                    }}
                  >
                    <IconDownload />
                    Descargar PDF
                  </button>
                </div>
              </div>
            ))}
          </div>

          {txs.length < total && (
            <div className="load-more-row">
              <button className="btn-outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Cargando...' : `Cargar más (${txs.length} de ${total})`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
