import React from 'react';
function Hero({ onShopAll, lang }) {
  const isEn = lang === 'en';
  
  const t = {
    eyebrow: isEn ? "AUTHORIZED RETAIL DISTRIBUTOR" : "ĐẠI LÝ PHÂN PHỐI HÀNH LÝ CHÍNH HÃNG",
    title1: isEn ? "Carry your home," : "Đồng hành cùng",
    title2: isEn ? "anywhere." : "bạn,",
    title3: isEn ? "" : "mọi nẻo đường.",
    lead: isEn ? "We curate the most durable gear for you — Thule, Case Logic, Point 65 North. Every product on the shelf is tested for the long haul." : "Chúng tôi tuyển chọn những sản phẩm bền bỉ nhất dành cho bạn — Thule, Case Logic, Point 65 North. Mỗi sản phẩm trên kệ đều được kiểm định chất lượng, sẵn sàng cho những chặng đường dài.",
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
          {isEn ? (
            <>{t.title1}<br/><em>{t.title2}</em></>
          ) : (
            <>{t.title1} <em>{t.title2}</em><br/>{t.title3}</>
          )}
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
            <span className="tph-strip-brand cl-glyph">CASE LOGIC</span>
            <span className="tph-strip-brand point65-glyph">POINT 65 NORTH</span>
          </div>
        </div>
      </div>

      {/* Hero art: real photo fills the right panel */}
      <div className="tph-hero-art" aria-hidden="true">
        <img
          src="./assets/Thule background main page.jpg"
          alt=""
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            objectPosition: 'center', display: 'block'
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="tph-hero-vignette" />
      </div>
    </section>
  );
}

export default Hero;
