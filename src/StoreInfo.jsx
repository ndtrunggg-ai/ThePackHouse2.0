import React from 'react';
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
    hours: isEn ? "Open 8:30 - 18:00 daily · Hotline: 0981 228 826 - 0964 117 868" : "Mở cửa 8:30 - 18:00 hàng ngày · Hotline: 0981 228 826 - 0964 117 868"
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
        <div className="tph-visit-map" style={{ borderRadius: '3px', overflow: 'hidden' }}>
          <iframe
            title="The Pack House location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.7778823795456!2d105.81327667665015!3d21.041571687335697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abaee9eaf5db%3A0x6a144f595323ae09!2sThe%20Pack%20House!5e0!3m2!1sen!2s!4v1779639384479!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block', minHeight: '280px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export default StoreInfo;
