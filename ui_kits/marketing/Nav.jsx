function Nav({ onCartOpen, cartCount = 0, onSearchChange, searchValue, lang, setLang }) {
  const isEn = lang === 'en';
  
  const t = {
    searchPlaceholder: isEn ? "Search Thule, backpacks, luggage..." : "Tìm kiếm Thule, balo, túi xách...",
    shop: isEn ? "Shop" : "Cửa hàng",
    brands: isEn ? "Brands" : "Thương hiệu",
    visit: isEn ? "Visit" : "Ghé thăm",
    help: isEn ? "Help" : "Hỗ trợ",
    shipping: isEn ? "Free shipping over 2,000,000 ₫" : "Miễn phí vận chuyển từ 2,000,000 ₫",
    returns: isEn ? "60-day returns on unused goods" : "Đổi trả 60 ngày cho sản phẩm chưa dùng",
    installments: isEn ? "4-month installments via Atome" : "Trả góp 4 tháng qua Atome"
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

  return (
    <header className="tph-nav">
      <div className="tph-nav-inner">
        <a className="tph-wordmark" href="#">The Pack House</a>
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
        <div className="tph-nav-right">
          <nav className="tph-nav-links">
            <a className="tph-nav-link" href="#" onClick={scrollToShop}>{t.shop}</a>
            <a className="tph-nav-link" href="#" onClick={scrollToShop}>{t.brands}</a>
            <a className="tph-nav-link" href="#" onClick={scrollToVisit}>{t.visit}</a>
          </nav>
          <a className="tph-nav-link" href="#">{t.help}</a>
          <button className="tph-nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setLang(isEn ? 'vi' : 'en')}>
            {isEn ? 'EN' : 'VN'}
          </button>
          <button className="tph-icon-btn" onClick={onCartOpen} aria-label={`Cart (${cartCount} items)`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 7h14l-1.5 11a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z" />
              <path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>
            {cartCount > 0 && <span className="tph-cart-dot">{cartCount}</span>}
          </button>
        </div>
      </div>
      <div className="tph-nav-band">
        <span className="tph-rule" />
        <span className="tph-eyebrow">EST. HANOI · MMXXV</span>
        <span className="tph-rule" />
        <span className="tph-eyebrow tph-eyebrow-soft">{t.shipping}</span>
        <span className="tph-rule" />
        <span className="tph-eyebrow tph-eyebrow-soft">{t.returns}</span>
        <span className="tph-rule" />
        <span className="tph-eyebrow tph-eyebrow-soft">{t.installments}</span>
        <span className="tph-rule" />
      </div>
    </header>
  );
}

window.Nav = Nav;
