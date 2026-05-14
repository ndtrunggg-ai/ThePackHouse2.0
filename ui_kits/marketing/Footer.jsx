function Footer({ lang }) {
  const isEn = lang === 'en';
  
  const t = {
    tag: isEn ? "CARRY YOUR HOME · ANYWHERE" : "MANG NGÔI NHÀ CỦA BẠN · ĐI MUÔN NƠI",
    mini: isEn ? "Authorized distributor of premium luggage brands. Since MMXXV." : "Đại lý phân phối các thương hiệu hành lý uy tín. Từ năm MMXXV.",
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
    open: isEn ? "Open 10:00 - 19:00" : "Mở cửa 10:00 - 19:00",
    bottom1: isEn ? "© MMXXV The Pack House Co., Hanoi · Authorized Distributor" : "© MMXXV The Pack House Co., Hà Nội · Đại lý phân phối chính hãng",
    bottom2: isEn ? "Privacy · Terms · Shipping & Returns" : "Bảo mật · Điều khoản · Vận chuyển & Trả hàng"
  };

  return (
    <footer className="tph-footer">
      <div className="tph-footer-top">
        <div className="tph-footer-mark">
          <div>
            <div className="tph-footer-wm">The Pack House</div>
            <div className="tph-footer-tag">{t.tag}</div>
            <p className="tph-footer-mini" style={{ marginTop: '12px', fontSize: '13px', color: '#B09060' }}>{t.mini}</p>
          </div>
        </div>
        <div className="tph-footer-cols">
          <div>
            <div className="tph-footer-h">{t.shop}</div>
            <a>{t.backpack}</a><a>{t.luggage}</a><a>{t.duffel}</a><a>{t.laptop}</a><a>{t.accessory}</a>
          </div>
          <div>
            <div className="tph-footer-h">{t.brands}</div>
            <a>Thule</a><a>Samsonite</a><a>Case Logic</a><a>Pacsafe</a><a>Tumi</a>
          </div>
          <div>
            <div className="tph-footer-h">{t.support}</div>
            <a>{t.shipping}</a><a>{t.warranty}</a><a>{t.size}</a><a>{t.track}</a><a>{t.contact}</a>
          </div>
          <div>
            <div className="tph-footer-h">{t.visit}</div>
            <a>17 Ngõ 2 Phố Quần Ngựa</a><a>Phường Ngọc Hà, Hà Nội, Việt Nam</a><a>{t.open}</a><a>0981 228 826</a><a>hello@thepackhouse.vn</a>
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
