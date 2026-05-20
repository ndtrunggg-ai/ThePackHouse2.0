function Nav({ onCartOpen, cartCount = 0, onSearchChange, searchValue, lang, setLang }) {
  const isEn = lang === 'en';
  const [supportOpen, setSupportOpen] = React.useState(false);

  const t = {
    searchPlaceholder: isEn ? "Search Thule, backpacks, luggage..." : "Tìm kiếm Thule, balo, túi xách...",
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
            <span>{t.popupPhone} <a href="tel:0981228826" style={{color:'var(--ph-bronze-500)',textDecoration:'none'}}>0981 228 826</a></span>
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
        <a className="tph-wordmark-container" href="#">
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
            <a className="tph-nav-link" href="#" onClick={scrollToShop}>{t.shop}</a>
            <a className="tph-nav-link" href="#" onClick={scrollToShop}>{t.brands}</a>
            <a className="tph-nav-link" href="#" onClick={scrollToVisit}>{t.visit}</a>
            <a className="tph-nav-link" href="#" onClick={openSupport}>{t.help}</a>
          </nav>
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

window.Nav = Nav;
