export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <p className="app-footer-copy">
          © {year} Credit Card App. Todos los derechos reservados.
        </p>

        <div className="app-footer-links">
          <a href="#" className="app-footer-link">Privacidad</a>
          <span className="app-footer-dot">•</span>
          <a href="#" className="app-footer-link">Términos</a>
          <span className="app-footer-dot">•</span>
          <a href="#" className="app-footer-link">Contacto</a>
        </div>
      </div>
    </footer>
  )
}
