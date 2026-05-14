function Hero({ onShopAll, lang }) {
  const isEn = lang === 'en';
  
  const t = {
    eyebrow: isEn ? "AUTHORIZED RETAIL DISTRIBUTOR" : "ĐẠI LÝ PHÂN PHỐI HÀNH LÝ CHÍNH HÃNG",
    title1: isEn ? "Carry your home," : "Đồng hành cùng bạn,",
    title2: isEn ? "anywhere." : "mọi nẻo đường.",
    lead: isEn ? "We curate the most durable gear for you — Thule, Samsonite, Case Logic, Pacsafe, Tumi, Boblbee. Every product on the shelf is tested for the long haul." : "Chúng tôi tuyển chọn những sản phẩm bền bỉ nhất dành cho bạn — Thule, Samsonite, Case Logic, Pacsafe, Tumi, Boblbee. Mỗi sản phẩm trên kệ đều được kiểm định chất lượng, sẵn sàng cho những chặng đường dài.",
    btnShop: isEn ? "Shop all brands" : "Xem tất cả thương hiệu",
    btnVisit: isEn ? "Visit store →" : "Ghé thăm cửa hàng →",
    strip: isEn ? "— NOW DISTRIBUTING —" : "— ĐANG PHÂN PHỐI —"
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
    <section className="tph-hero">
      <div className="tph-hero-content">
        <div className="tph-eyebrow-stack">
          <span className="tph-rule-light" />
          <span className="tph-eyebrow-light">{t.eyebrow}</span>
          <span className="tph-rule-light" />
        </div>
        <h1 className="tph-hero-title">
          {t.title1}<br/><em>{t.title2}</em>
        </h1>
        <p className="tph-hero-lead">
          {t.lead}
        </p>
        <div className="tph-hero-actions">
          <button className="tph-btn tph-btn-primary" onClick={scrollToShop}>{t.btnShop}</button>
          <button className="tph-btn tph-btn-ghost-light" onClick={scrollToVisit}>{t.btnVisit}</button>
        </div>
        <div className="tph-hero-strip">
          <span className="tph-strip-lbl">{t.strip}</span>
          <div className="tph-strip-brands">
            <span className="tph-strip-brand thule-glyph">THULE</span>
            <span className="tph-strip-brand sam-glyph">Samsonite</span>
            <span className="tph-strip-brand cl-glyph">CASE LOGIC</span>
            <span className="tph-strip-brand pac-glyph">PACSAFE</span>
            <span className="tph-strip-brand tumi-glyph">TUMI</span>
          </div>
        </div>
      </div>

      <div className="tph-hero-art" aria-hidden="true">
        <div className="tph-hero-shelf">
          {/* Shelf of curated products as silhouettes — represents the curation */}
          <div className="tph-shelf-row">
            <div className="tph-shelf-item">
              <svg viewBox="0 0 100 130" fill="none" stroke="#C8A97A" strokeWidth="1.5">
                <rect x="22" y="20" width="56" height="100" rx="6"/>
                <path d="M34,20 Q34,8 50,8 Q66,8 66,20"/>
                <line x1="22" y1="48" x2="78" y2="48"/>
                <rect x="42" y="58" width="16" height="38" rx="1"/>
              </svg>
            </div>
            <div className="tph-shelf-item">
              <svg viewBox="0 0 100 130" fill="none" stroke="#C8A97A" strokeWidth="1.5">
                <rect x="14" y="34" width="72" height="80" rx="4"/>
                <line x1="14" y1="68" x2="86" y2="68"/>
                <path d="M38,34 L38,18 L62,18 L62,34"/>
                <circle cx="50" cy="84" r="3"/>
              </svg>
            </div>
          </div>
          <div className="tph-shelf-row">
            <div className="tph-shelf-item">
              <svg viewBox="0 0 100 130" fill="none" stroke="#C8A97A" strokeWidth="1.5">
                <rect x="10" y="44" width="80" height="56" rx="3"/>
                <line x1="10" y1="86" x2="90" y2="86"/>
                <rect x="40" y="36" width="20" height="8" rx="1"/>
              </svg>
            </div>
            <div className="tph-shelf-item">
              <svg viewBox="0 0 100 130" fill="none" stroke="#C8A97A" strokeWidth="1.5">
                <path d="M30,30 Q30,16 50,16 Q70,16 70,30"/>
                <rect x="22" y="30" width="56" height="90" rx="6"/>
                <line x1="22" y1="58" x2="78" y2="58"/>
                <rect x="36" y="72" width="28" height="30" rx="2"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="tph-hero-vignette" />
      </div>
    </section>
  );
}

window.Hero = Hero;
