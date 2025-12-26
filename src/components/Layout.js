import React from 'react';
import { FaBoxes, FaFileAlt, FaExchangeAlt, FaUserCircle } from 'react-icons/fa';

function Layout({ children }) {
  return (
    <div className="wc-root">
      <header className="wc-header">
        <div className="wc-header-left">
          <div className="wc-logo">Windchill <strong style={{fontWeight:800}}>13</strong></div>
          <div className="wc-product-name">Mini PLM</div>
        </div>

        <div className="wc-header-right">
          <FaUserCircle style={{marginRight:8}} /> User: sam
        </div>
      </header>

      <div className="wc-main">
        <nav className="wc-sidebar" aria-label="Main navigation">
          <div className="wc-brand">Mini PLM</div>
          <ul>
            <li className="active"><FaBoxes style={{minWidth:18}} /> <span>Parts</span></li>
            <li><FaFileAlt style={{minWidth:18}} /> <span>Documents</span></li>
            <li><FaExchangeAlt style={{minWidth:18}} /> <span>Changes</span></li>
          </ul>
        </nav>

        <main className="wc-content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
