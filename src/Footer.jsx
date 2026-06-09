import React from 'react';
function Footer({ lang, onOpenFaq }) {
  const isEn = lang === 'en';

  const t = {
    tag: isEn ? "CARRY YOUR HOME · ANYWHERE" : "MANG NGÔI NHÀ CỦA BẠN · ĐI MUÔN NƠI",
    mini1: isEn ? "The Pack House — Brought to you by TL Investment Joint Stock Company" : "The Pack House — Được mang đến cho bạn bởi Công ty Cổ phần TL Investment",
    mini2: isEn ? "Business Registration Certificate No. 0110955884, issued by the Hanoi Department of Planning and Investment on 14/02/2025" : "Giấy chứng nhận ĐKKD số 0110955884 do Sở KH&ĐT thành phố Hà Nội cấp ngày 14/02/2025",
    shop: isEn ? "Shop" : "Cửa hàng",
    backpack: isEn ? "Backpacks" : "Balo",
    luggage: isEn ? "Luggage" : "Vali",
    duffel: isEn ? "Duffels" : "Túi du lịch",
    laptop: isEn ? "Laptop Bags" : "Túi laptop",
    sling: isEn ? "Sling / Fanny bags" : "Túi đeo chéo / bao tử",
    camera: isEn ? "Camera bags" : "Túi máy ảnh",
    accessory: isEn ? "Accessories" : "Phụ kiện",
    brands: isEn ? "Brands" : "Thương hiệu",
    support: isEn ? "Support" : "Hỗ trợ",
    shipping: isEn ? "Shipping & Returns" : "Vận chuyển & Trả hàng",
    warranty: isEn ? "Warranty & Repair" : "Bảo hành & Sửa chữa",
    size: isEn ? "Size Guide" : "Hướng dẫn chọn size",
    track: isEn ? "Track Order" : "Theo dõi đơn hàng",
    contact: isEn ? "Contact Us" : "Liên hệ",
    faq: isEn ? "FAQ" : "Câu Hỏi Thường Gặp (FAQ)",
    visit: isEn ? "Visit Us" : "Ghé thăm",
    open: isEn ? "Open 8:30 - 18:00" : "Mở cửa 8:30 - 18:00",
    bottom1: isEn ? "© TL Investment Joint Stock Company · Authorized Distributor" : "© CÔNG TY CỔ PHẦN TL INVESTMENT · ĐẠI LÝ PHÂN PHỐI CHÍNH HÃNG",
    bottom2: isEn ? "Privacy · Terms · Shipping & Returns" : "Bảo mật · Điều khoản · Vận chuyển & Trả hàng"
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToShop = (e, type, brand) => {
    const el = document.getElementById('shop');
    if (el) {
      e.preventDefault();
      if (type) window.dispatchEvent(new CustomEvent('tph-filter', { detail: { type } }));
      if (brand) window.dispatchEvent(new CustomEvent('tph-filter', { detail: { brand } }));
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Facebook SVG icon
  const FbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );

  // TikTok SVG icon
  const TkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  );

  // Instagram SVG icon
  const IgIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.98a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
    </svg>
  );

  const linkStyle = {
    display: 'block', cursor: 'pointer', background: 'none', border: 'none',
    padding: 0, textAlign: 'left', color: 'inherit', font: 'inherit',
    textDecoration: 'none'
  };

  return (
    <footer className="tph-footer">
      <div className="tph-footer-top">
        <div className="tph-footer-mark">
          <div>
            <div className="tph-footer-wm">The Pack House</div>
            <div className="tph-footer-tag">{t.tag}</div>
            <p style={{ marginTop: '16px', fontSize: '13px', color: '#B09060', lineHeight: 1.7, letterSpacing: '.01em' }}>{t.mini1}</p>
            <p style={{ marginTop: '6px', fontSize: '12px', color: '#9A7850', lineHeight: 1.6, letterSpacing: '.01em' }}>{t.mini2}</p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a
                href="https://www.facebook.com/TLIVietNamPage?mibextid=wwXIfr&rdid=bTOG3EBc8K54DS7D&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BmSddELBP%2F%3Fmibextid%3DwwXIfr#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)', color: '#B09060',
                  transition: 'background 0.2s, color 0.2s', textDecoration: 'none'
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(176,144,96,0.22)'; e.currentTarget.style.color='#D4AF70'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#B09060'; }}
              >
                <FbIcon />
              </a>
              <a
                href="https://www.tiktok.com/@thepackhousevn?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)', color: '#B09060',
                  transition: 'background 0.2s, color 0.2s', textDecoration: 'none'
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(176,144,96,0.22)'; e.currentTarget.style.color='#D4AF70'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#B09060'; }}
              >
                <TkIcon />
              </a>
              <a
                href="https://www.instagram.com/thepackhousevn?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)', color: '#B09060',
                  transition: 'background 0.2s, color 0.2s', textDecoration: 'none'
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(176,144,96,0.22)'; e.currentTarget.style.color='#D4AF70'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#B09060'; }}
              >
                <IgIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="tph-footer-cols">
          {/* Shop */}
          <div>
            <div className="tph-footer-h">{t.shop}</div>
            <a style={linkStyle} href="/balo.html" onClick={(e) => scrollToShop(e, 'backpacks')}>{t.backpack}</a>
            <a style={linkStyle} href="/vali.html" onClick={(e) => scrollToShop(e, 'luggage')}>{t.luggage}</a>
            <a style={linkStyle} href="/tui-xach.html" onClick={(e) => scrollToShop(e, 'duffel')}>{t.duffel}</a>
            <a style={linkStyle} href="/tui-laptop.html" onClick={(e) => scrollToShop(e, 'laptop-bags')}>{t.laptop}</a>
            <a style={linkStyle} href="/tui-deo-cheo.html" onClick={(e) => scrollToShop(e, 'sling')}>{t.sling}</a>
            <a style={linkStyle} href="/tui-may-anh.html" onClick={(e) => scrollToShop(e, 'camera')}>{t.camera}</a>
            <a style={linkStyle} href="/phu-kien.html" onClick={(e) => scrollToShop(e, 'accessory')}>{t.accessory}</a>
          </div>

          {/* Brands */}
          <div>
            <div className="tph-footer-h">{t.brands}</div>
            <a style={linkStyle} href="/thule.html" onClick={(e) => scrollToShop(e, null, 'thule')}>Thule</a>
            <a style={linkStyle} href="/case-logic.html" onClick={(e) => scrollToShop(e, null, 'case-logic')}>Case Logic</a>
            <a style={linkStyle} href="/point-65.html" onClick={(e) => scrollToShop(e, null, 'point-65')}>Point 65 North</a>
          </div>

          {/* Support */}
          <div>
            <div className="tph-footer-h">{t.support}</div>
            <a style={linkStyle} href="/return-policy.html">{t.shipping}</a>
            <a style={linkStyle} onClick={scrollToTop}>{t.warranty}</a>
            <a style={linkStyle} onClick={scrollToTop}>{t.size}</a>
            <a style={linkStyle} onClick={scrollToTop}>{t.track}</a>
            <a style={linkStyle} onClick={scrollToTop}>{t.contact}</a>
            <a style={linkStyle} onClick={(e) => { e.preventDefault(); onOpenFaq && onOpenFaq(); }}>{t.faq}</a>
          </div>

          {/* Visit */}
          <div>
            <div className="tph-footer-h">{t.visit}</div>
            <a style={linkStyle} href="https://maps.google.com/?q=17+Ngõ+2+Phố+Quần+Ngựa+Hà+Nội" target="_blank" rel="noopener noreferrer">17 Ngõ 2 Phố Quần Ngựa</a>
            <a style={linkStyle} href="https://maps.google.com/?q=17+Ngõ+2+Phố+Quần+Ngựa+Hà+Nội" target="_blank" rel="noopener noreferrer">Phường Ngọc Hà, Hà Nội, Việt Nam</a>
            <a style={linkStyle}>{t.open}</a>
            <a style={linkStyle} href="tel:0981228826">0981 228 826</a>
            <a style={linkStyle} href="tel:0964117868">0964 117 868</a>
            <a style={linkStyle} href="mailto:thepackhouse.vn@gmail.com">thepackhouse.vn@gmail.com</a>
          </div>
        </div>
      </div>

      <div className="tph-footer-bottom">
        <span>{t.bottom1}</span>
        <span style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/privacy-policy.html" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='var(--ph-bronze-500)'} onMouseLeave={e => e.target.style.color='inherit'}>
            {isEn ? "Privacy Policy" : "Chính sách bảo mật"}
          </a>
          <span style={{ color: 'var(--ph-sand-500)' }}>·</span>
          <a href="/terms-of-service.html" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='var(--ph-bronze-500)'} onMouseLeave={e => e.target.style.color='inherit'}>
            {isEn ? "Terms of Service" : "Điều khoản dịch vụ"}
          </a>
          <span style={{ color: 'var(--ph-sand-500)' }}>·</span>
          <a href="/return-policy.html" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='var(--ph-bronze-500)'} onMouseLeave={e => e.target.style.color='inherit'}>
            {isEn ? "Shipping & Returns" : "Vận chuyển & Trả hàng"}
          </a>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
