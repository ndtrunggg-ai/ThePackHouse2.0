import React from 'react';

function Faq({ open, onClose, lang }) {
  if (!open) return null;
  const isEn = lang === 'en';

  const title = isEn ? "Frequently Asked Questions" : "Các Câu Hỏi Thường Gặp";
  
  const faqs = [
    {
      q: isEn ? "Does The Pack House sell authentic Thule backpacks?" : "The Pack House có bán balo Thule chính hãng không?",
      a: isEn ? "Yes. The Pack House is an authorized distributor. We guarantee 100% authenticity for all backpacks, luggage, and bags from Thule, Case Logic, and Point 65 North." : "Có. The Pack House là đại lý phân phối ủy quyền, cam kết 100% balo, vali và túi xách từ Thule, Case Logic, Point 65 North đều là hàng chính hãng."
    },
    {
      q: isEn ? "Where can I buy authentic Thule bags in Hanoi?" : "Mua balo Thule tại Hà Nội ở đâu uy tín?",
      a: isEn ? "You can experience our premium luggage and backpacks directly at our store: 17 Ngo 2 Pho Quan Ngua, Ngoc Ha Ward, Hanoi." : "Bạn có thể trải nghiệm trực tiếp các sản phẩm balo, vali cao cấp tại cửa hàng The Pack House (Địa chỉ: 17 Ngõ 2 Phố Quần Ngựa, Phường Ngọc Hà, Hà Nội)."
    },
    {
      q: isEn ? "What is your warranty and return policy?" : "Chính sách bảo hành và đổi trả như thế nào?",
      a: isEn ? "The Pack House offers a 30-day return policy for unused items, and we apply the full official manufacturer's warranty for all products." : "The Pack House hỗ trợ đổi trả trong vòng 30 ngày cho các sản phẩm chưa qua sử dụng, và áp dụng chính sách bảo hành chính hãng từ nhà sản xuất."
    },
    {
      q: isEn ? "Do you offer nationwide shipping?" : "Cửa hàng có giao hàng toàn quốc không?",
      a: isEn ? "Yes. We offer free nationwide shipping for all orders over 2,000,000 ₫." : "Có. Chúng tôi miễn phí giao hàng (freeship) trên toàn quốc cho mọi đơn hàng từ 2.000.000 ₫."
    }
  ];

  return (
    <div
      onClick={(e) => { if(e.currentTarget === e.target) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(42,31,14,.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div style={{
        background: 'var(--ph-cream-100)', border: '0.75px solid var(--ph-sand-300)',
        borderRadius: '4px', padding: '40px 44px', zIndex: 501, minWidth: '320px', position: 'relative',
        boxShadow: '0 24px 64px -16px rgba(42,31,14,.24)',
        maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '14px', right: '14px', background: 'transparent', border: 'none',
            cursor: 'pointer', color: 'var(--ph-sand-500)', fontSize: '20px', lineHeight: 1
          }}
          aria-label="Close modal"
        >✕</button>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '26px', marginBottom: '32px', color: 'var(--ph-cocoa-850)' }}>
          {title}
        </div>
        <div className="tph-faq-list" itemScope itemType="https://schema.org/FAQPage">
          {faqs.map((faq, i) => (
            <div key={i} className="tph-faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question" style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: i === faqs.length - 1 ? 'none' : '0.5px solid var(--ph-sand-300)' }}>
              <h3 className="tph-faq-q" itemProp="name" style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', fontWeight: 400, color: 'var(--ph-cocoa-850)', margin: '0 0 10px' }}>{faq.q}</h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="tph-faq-a" itemProp="text" style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ph-cocoa-850)', margin: 0 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faq;
