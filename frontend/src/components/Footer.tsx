import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid #fee2e2',
      padding: '24px 16px',
      textAlign: 'center',
      background: '#fafafa',
      color: '#666'
    }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
          © 2026 Credit Card App. Todos los derechos reservados.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', fontSize: '12px' }}>
          <a href="#" style={{ color: '#dc2626', textDecoration: 'none' }}>Privacidad</a>
          <span>•</span>
          <a href="#" style={{ color: '#dc2626', textDecoration: 'none' }}>Términos</a>
          <span>•</span>
          <a href="#" style={{ color: '#dc2626', textDecoration: 'none' }}>Contacto</a>
        </div>
      </div>
    </footer>
  )
}
