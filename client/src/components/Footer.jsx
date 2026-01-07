import { Link } from 'react-router-dom';
import './location-footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-column">
            <h3 className="footer-heading">CHINNU TEX</h3>
            <div className="footer-info">
              <p>52, Periya Thottam West Street</p>
              <p>Periya Semur (PO)</p>
              <p>Erode - 638004</p>
              <p>Tamil Nadu, India</p>
            </div>
            <div className="footer-contact">
              <p>+91 7305207628</p>
              <p>info@chinnutex.com</p>
            </div>
          </div>

          {/* Services */}
          <div className="footer-column">
            <Link to="/services" className="footer-heading-link">
              <h3 className="footer-heading">Services</h3>
            </Link>
            <ul className="footer-links">
              <li><Link to="/services/">Sizing</Link></li>
              <li><Link to="/services/weaving/">Weaving</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="footer-column">
            <h3 className="footer-heading">Our Solutions</h3>
            <ul className="footer-links">
              <li><Link to="/savings">Cost Savings</Link></li>
              <li><Link to="/sustainability">Sustainability</Link></li>
              <li><Link to="/about">Quality Assurance</Link></li>
              <li><Link to="/services">Fast Processing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/my-orders">My Orders</Link></li>
            </ul>
          </div>
        </div>

        <section className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CHINNU TEX – Online Fabric Processing Platform</p>
        </section>
      </div>
    </footer>
  );
}
