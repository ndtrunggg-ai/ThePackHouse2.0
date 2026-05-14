function StoreInfo({ lang }) {
  const isEn = lang === 'en';

  const t = {
    title: isEn ? "Why choose The Pack House" : "Tại sao chọn The Pack House",
    link: isEn ? "About Us →" : "Về chúng tôi →",
    p1: isEn ? "100% Authentic" : "100% Chính hãng",
    b1: isEn ? "Every product is sourced directly from the brand or authorized distributors. Full tags and warranty included." : "Mọi sản phẩm đều được nhập trực tiếp từ thương hiệu hoặc nhà phân phối uỷ quyền. Đầy đủ tem nhãn và thẻ bảo hành.",
    p2: isEn ? "In-Store Experience" : "Trải nghiệm thực tế",
    b2: isEn ? "Visit our store at Quan Ngua to try and experience the products firsthand. We want you to find the perfect fit." : "Ghé thăm cửa hàng tại Quần Ngựa để trực tiếp thử và trải nghiệm. Chúng tôi luôn mong bạn chọn được sản phẩm ưng ý nhất.",
    p3: isEn ? "Warranty Support" : "Hỗ trợ bảo hành",
    b3: isEn ? "Official warranty support, zipper repairs, strap fixes... Our team is always with you on every journey." : "Hỗ trợ bảo hành chính hãng, sửa chữa khóa kéo, quai đeo... Đội ngũ của chúng tôi luôn đồng hành cùng bạn trên mọi hành trình.",
    visitEyebrow: isEn ? "VISIT OUR STORE" : "GHÉ THĂM CỬA HÀNG",
    hours: isEn ? "Open 10:00 - 19:00 daily · Hotline: 0981 228 826" : "Mở cửa 10:00 - 19:00 hàng ngày · Hotline: 0981 228 826"
  };

  const points = [
    { num: "01", title: t.p1, blurb: t.b1 },
    { num: "02", title: t.p2, blurb: t.b2 },
    { num: "03", title: t.p3, blurb: t.b3 },
  ];

  return (
    <section className="tph-section tph-section-store" id="visit">
      <div className="tph-section-head">
        <span className="tph-section-num">03</span>
        <h2 className="tph-section-title">{t.title}</h2>
        <a className="tph-section-link">{t.link}</a>
      </div>
      <div className="tph-store-grid">
        {points.map((p) => (
          <article key={p.num} className="tph-store-point">
            <div className="tph-store-num">— No. {p.num}</div>
            <h3 className="tph-store-title">{p.title}</h3>
            <p className="tph-store-blurb">{p.blurb}</p>
          </article>
        ))}
      </div>
      <div className="tph-visit">
        <div className="tph-visit-info">
          <span className="tph-eyebrow">{t.visitEyebrow}</span>
          <h3 className="tph-visit-addr">17 Ngõ 2 Phố Quần Ngựa<br/>Phường Ngọc Hà, Hà Nội, Việt Nam</h3>
          <p className="tph-visit-hours">{t.hours}</p>
        </div>
        <div className="tph-visit-map" aria-hidden="true">
          <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
            <rect width="200" height="120" fill="#F0E6D2"/>
            <path d="M0,40 L80,40 L80,0 M80,40 L80,120 M0,80 L200,80 M120,0 L120,120 M160,40 L200,40"
                  fill="none" stroke="#B09060" strokeWidth="0.6" opacity="0.5"/>
            <path d="M30,90 Q60,70 100,60 Q140,50 170,30"
                  fill="none" stroke="#C8A97A" strokeWidth="1.5" strokeDasharray="3 3"/>
            <circle cx="100" cy="60" r="5" fill="#2A1F0E"/>
            <circle cx="100" cy="60" r="2" fill="#C8A97A"/>
            <text x="108" y="58" fontFamily="Inter, sans-serif" fontSize="6" letterSpacing="2"
                  fill="#2A1F0E">THE PACK HOUSE</text>
          </svg>
        </div>
      </div>
    </section>
  );
}

window.StoreInfo = StoreInfo;
