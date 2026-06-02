import React from 'react';
function Nav({ onCartOpen, cartCount = 0, onSearchChange, searchValue, lang, setLang }) {
  const isEn = lang === 'en';
  const [supportOpen, setSupportOpen] = React.useState(false);

  const t = {
    searchPlaceholder: "",
    shop: isEn ? "Shop" : "Cửa hàng",
    brands: isEn ? "Brands" : "Thương hiệu",
    visit: isEn ? "Visit" : "Ghé thăm",
    help: isEn ? "Help" : "Hỗ trợ",
    est: isEn ? "EST. HANOI · MMXXV" : "THÀNH LẬP TẠI HÀ NỘI · 2025",
    shipping: isEn ? "Free shipping over 2,000,000 ₫" : "Miễn phí vận chuyển từ 2.000.000 ₫",
    returns: isEn ? "30-day returns on unused goods" : "Đổi trả 30 ngày cho sản phẩm chưa dùng",
    popupTitle: isEn ? "Support" : "Hỗ trợ",
    popupPhone: isEn ? "Hotline:" : "Hotline:",
    popupHours: isEn ? "Hours: 8:30 AM – 6:00 PM daily" : "Giờ làm việc: 8:30 – 18:00 hàng ngày",
    popupAddr: isEn ? "17 Ngõ 2 Phố Quần Ngựa, Ngọc Hà, Hanoi" : "17 Ngõ 2 Phố Quần Ngựa, Phường Ngọc Hà, Hà Nội",
  };

  const scrollToShop = (e) => {
    e.preventDefault();
    const shopEl = document.getElementById("shop");
    if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToVisit = (e) => {
    e.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const openSupport = (e) => {
    e.preventDefault();
    setSupportOpen(true);
  };

  // Facebook SVG icon
  const FbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );

  // TikTok SVG icon
  const TkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  );

  // Instagram SVG icon
  const IgIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.98a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
    </svg>
  );

  return (
    <header className="tph-nav">
      {/* Support popup */}
      {supportOpen && (
        <div
          onClick={(e) => { if(e.currentTarget === e.target) setSupportOpen(false); }}
          style={{
            position:'fixed',inset:0,zIndex:500,background:'rgba(42,31,14,.18)',display:'flex',alignItems:'center',justifyContent:'center'
          }}
        >
          <div style={{
            background:'var(--ph-cream-100)',border:'0.75px solid var(--ph-sand-300)',
            borderRadius:'4px',padding:'40px 44px',zIndex:501,minWidth:'320px',position:'relative',
            boxShadow:'0 24px 64px -16px rgba(42,31,14,.24)'
          }}>
          <button
            onClick={() => setSupportOpen(false)}
            style={{position:'absolute',top:'14px',right:'14px',background:'transparent',border:'none',
              cursor:'pointer',color:'var(--ph-sand-500)',fontSize:'20px',lineHeight:1}}
          >✕</button>
          <div style={{fontFamily:'var(--font-serif)',fontWeight:300,fontSize:'26px',marginBottom:'24px',color:'var(--ph-cocoa-850)'}}>
            {t.popupTitle}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px',fontSize:'14px',color:'var(--ph-cocoa-850)'}}>
            <span style={{fontSize:'18px',width:'28px',textAlign:'center'}}>📞</span>
            <span>{t.popupPhone} <a href="tel:0981228826" style={{color:'var(--ph-bronze-500)',textDecoration:'none'}}>0981 228 826</a> - <a href="tel:0964117868" style={{color:'var(--ph-bronze-500)',textDecoration:'none'}}>0964 117 868</a></span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px',fontSize:'14px',color:'var(--ph-cocoa-850)'}}>
            <span style={{fontSize:'18px',width:'28px',textAlign:'center'}}>✉️</span>
            <span><a href="mailto:thepackhouse.vn@gmail.com" style={{color:'var(--ph-bronze-500)',textDecoration:'none'}}>thepackhouse.vn@gmail.com</a></span>
          </div>
          <div style={{marginTop:'20px',paddingTop:'20px',borderTop:'0.5px solid var(--ph-sand-300)',fontSize:'13px',color:'var(--ph-sand-500)',lineHeight:1.6}}>
            {t.popupHours}<br/>{t.popupAddr}
          </div>
          </div>
        </div>
      )}

      <div className="tph-nav-inner">
        <a className="tph-wordmark-container" href="/">
          <img src="./assets/logo.png" alt="Logo" className="tph-nav-logo" />
          <span className="tph-wordmark">The Pack House</span>
        </a>
        <div className="tph-nav-right">
          <div className="tph-nav-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              type="search"
              placeholder={t.searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              aria-label="Search products"
            />
          </div>
          <nav className="tph-nav-links">
            <a className="tph-nav-link" href="#shop" onClick={scrollToShop}>{t.shop}</a>
            <a className="tph-nav-link" href="#shop" onClick={scrollToShop}>{t.brands}</a>
            <a className="tph-nav-link" href="#visit" onClick={scrollToVisit}>{t.visit}</a>
            <a className="tph-nav-link" href="#support" onClick={openSupport}>{t.help}</a>
          </nav>
          
          <div className="tph-nav-socials" style={{ display: 'flex', gap: '14px', margin: '0 8px' }}>
            <a href="https://www.facebook.com/TLIVietNamPage?mibextid=wwXIfr&rdid=bTOG3EBc8K54DS7D&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BmSddELBP%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ph-sand-500)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--ph-bronze-500)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--ph-sand-500)'} aria-label="Facebook">
              <FbIcon />
            </a>
            <a href="https://www.instagram.com/thepackhousevn?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ph-sand-500)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--ph-bronze-500)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--ph-sand-500)'} aria-label="Instagram">
              <IgIcon />
            </a>
            <a href="https://www.tiktok.com/@thepackhousevn?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ph-sand-500)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--ph-bronze-500)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--ph-sand-500)'} aria-label="TikTok">
              <TkIcon />
            </a>
          </div>

          <div className="tph-lang-toggle">
            <button className={`tph-lang-btn ${isEn ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
            <span className="tph-lang-sep">|</span>
            <button className={`tph-lang-btn ${!isEn ? 'active' : ''}`} onClick={() => setLang('vi')}>VN</button>
          </div>
          <button className="tph-icon-btn" onClick={onCartOpen} aria-label={`Cart (${cartCount} items)`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 7h14l-1.5 11a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z" />
              <path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>
            {cartCount > 0 && <span className="tph-cart-dot">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Ticker band — 3 items, evenly spaced */}
      <div className="tph-nav-band">
        <span className="tph-rule" />
        <span className="tph-eyebrow">{t.est}</span>
        <span className="tph-rule" />
        <span className="tph-eyebrow tph-eyebrow-soft">{t.shipping}</span>
        <span className="tph-rule" />
        <span className="tph-eyebrow tph-eyebrow-soft">{t.returns}</span>
        <span className="tph-rule" />
      </div>
    </header>
  );
}

export default Nav;
