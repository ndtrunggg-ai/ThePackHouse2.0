function CartDrawer({ open, items, onClose, onRemove, lang }) {
  const isEn = lang === 'en';
  const total = items.reduce((s, i) => s + i.price, 0);
  const fmt = (n) => n.toLocaleString(isEn ? "en-US" : "vi-VN") + " ₫";

  const handleCheckout = () => {
    try { sessionStorage.setItem('tph_cart', JSON.stringify(items)); } catch(e) {}
    window.location.href = 'checkout.html';
  };

  const t = {
    yourCart: isEn ? "YOUR CART" : "GIỎ HÀNG CỦA BẠN",
    empty: isEn ? "Your cart is unpacked." : "Giỏ hàng đang trống.",
    find: isEn ? "Find something to carry." : "Hãy chọn cho mình một sản phẩm.",
    remove: isEn ? "Remove" : "Xóa",
    subtotal: isEn ? "Subtotal" : "Tổng cộng",
    shipping: isEn ? "Shipping & taxes calculated at checkout." : "Phí vận chuyển sẽ được tính khi thanh toán.",
    checkout: isEn ? "Checkout" : "Thanh toán"
  };

  return (
    <>
      <div className={"tph-scrim" + (open ? " on" : "")} onClick={onClose} />
      <aside className={"tph-drawer" + (open ? " on" : "")} aria-hidden={!open}>
        <header className="tph-drawer-head">
          <span className="tph-eyebrow">{t.yourCart}</span>
          <button className="tph-icon-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </header>

        <div className="tph-drawer-body">
          {items.length === 0 && (
            <div className="tph-drawer-empty">
              <div className="tph-drawer-empty-mark">∅</div>
              <p>{t.empty}</p>
              <small>{t.find}</small>
            </div>
          )}
          {items.map((it, i) => (
            <div key={i} className="tph-cart-line">
              <div className="tph-cart-thumb">
                {it.image ? (
                  <img src={it.image} alt={it.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '2px', background: '#F5F3EF', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: it.swatch || "linear-gradient(180deg,#C8A97A,#8A7030)", borderRadius: '2px' }} />
                )}
              </div>
              <div className="tph-cart-info">
                <div className="tph-cart-name">{it.name}</div>
                <div className="tph-cart-meta">{it.color}</div>
                <button className="tph-cart-rm" onClick={() => onRemove(i)}>{t.remove}</button>
              </div>
              <div className="tph-cart-price">{fmt(it.price)}</div>
            </div>
          ))}
        </div>

        <footer className="tph-drawer-foot">
          <div className="tph-cart-sub">
            <span>{t.subtotal}</span>
            <span className="tph-cart-sub-val">{fmt(total)}</span>
          </div>
          <p className="tph-cart-note">{t.shipping}</p>
          <button className="tph-btn tph-btn-primary tph-btn-block" disabled={items.length === 0} onClick={handleCheckout}>
            {t.checkout}
          </button>
        </footer>
      </aside>
    </>
  );
}

window.CartDrawer = CartDrawer;
