function Footer({ lang }) {
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
    accessory: isEn ? "Accessories" : "Phụ kiện",
    brands: isEn ? "Brands" : "Thương hiệu",
    support: isEn ? "Support" : "Hỗ trợ",
    shipping: isEn ? "Shipping & Returns" : "Vận chuyển & Trả hàng",
    warranty: isEn ? "Warranty & Repair" : "Bảo hành & Sửa chữa",
    size: isEn ? "Size Guide" : "Hướng dẫn chọn size",
    track: isEn ? "Track Order" : "Theo dõi đơn hàng",
    contact: isEn ? "Contact Us" : "Liên hệ",
    visit: isEn ? "Visit Us" : "Ghé thăm",
    open: isEn ? "Open 8:30 - 18:00" : "Mở cửa 8:30 - 18:00",
    bottom1: isEn ? "© TL Investment Joint Stock Company · Authorized Distributor" : "© CÔNG TY CỔ PHẦN TL INVESTMENT · ĐẠI LÝ PHÂN PHỐI CHÍNH HÃNG",
    bottom2: isEn ? "Privacy · Terms · Shipping & Returns" : "Bảo mật · Điều khoản · Vận chuyển & Trả hàng"
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToShop = (e) => {
    e.preventDefault();
    const el = document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                href="https://www.tiktok.com/@tlivietnam?_t=ZP-8wj3yVKbfiQ&_r=1"
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
            </div>
          </div>
        </div>

        <div className="tph-footer-cols">
          {/* Shop */}
          <div>
            <div className="tph-footer-h">{t.shop}</div>
            <a style={linkStyle} onClick={scrollToShop}>{t.backpack}</a>
            <a style={linkStyle} onClick={scrollToShop}>{t.luggage}</a>
            <a style={linkStyle} onClick={scrollToShop}>{t.duffel}</a>
            <a style={linkStyle} onClick={scrollToShop}>{t.laptop}</a>
            <a style={linkStyle} onClick={scrollToShop}>{t.accessory}</a>
          </div>

          {/* Brands */}
          <div>
            <div className="tph-footer-h">{t.brands}</div>
            <a style={linkStyle} onClick={scrollToShop}>Thule</a>
            <a style={linkStyle} onClick={scrollToShop}>Case Logic</a>
            <a style={linkStyle} onClick={scrollToShop}>ALPAKA</a>
            <a style={linkStyle} onClick={scrollToShop}>Bamkel</a>
          </div>

          {/* Support */}
          <div>
            <div className="tph-footer-h">{t.support}</div>
            <a style={linkStyle} onClick={scrollToTop}>{t.shipping}</a>
            <a style={linkStyle} onClick={scrollToTop}>{t.warranty}</a>
            <a style={linkStyle} onClick={scrollToTop}>{t.size}</a>
            <a style={linkStyle} onClick={scrollToTop}>{t.track}</a>
            <a style={linkStyle} onClick={scrollToTop}>{t.contact}</a>
          </div>

          {/* Visit */}
          <div>
            <div className="tph-footer-h">{t.visit}</div>
            <a style={linkStyle} href="https://maps.google.com/?q=17+Ngõ+2+Phố+Quần+Ngựa+Hà+Nội" target="_blank" rel="noopener noreferrer">17 Ngõ 2 Phố Quần Ngựa</a>
            <a style={linkStyle} href="https://maps.google.com/?q=17+Ngõ+2+Phố+Quần+Ngựa+Hà+Nội" target="_blank" rel="noopener noreferrer">Phường Ngọc Hà, Hà Nội, Việt Nam</a>
            <a style={linkStyle}>{t.open}</a>
            <a style={linkStyle} href="tel:0981228826">0981 228 826</a>
            <a style={linkStyle} href="mailto:hello@thepackhouse.vn">hello@thepackhouse.vn</a>
          </div>
        </div>
      </div>

      <div className="tph-footer-bottom">
        <span>{t.bottom1}</span>
        <span>{t.bottom2}</span>
      </div>
    </footer>
  );
}

window.Footer = Footer;
