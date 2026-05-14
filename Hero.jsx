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

      <div className="tph-hero-art" aria-hidden="true" style={{ backgroundImage: 'url(http://localhost:5000/uploads/hero-image.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '500px', borderRadius: '12px' }}>
        <div className="tph-hero-vignette" />
      </div>
    </section>
  );
}

window.Hero = Hero;
