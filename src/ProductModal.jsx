import React from 'react';
function ProductModal({ product, onClose, onAdd, lang }) {
  if (!product) return null;
  const isEn = lang === 'en';
  const fmt = (n) => (Number(n) || 0).toLocaleString(isEn ? 'en-US' : 'vi-VN') + ' ₫';

  // Build image list from Strapi media array or legacy field
  const images = React.useMemo(() => {
    if (product.image_url) return [product.image_url];
    if (product.image) {
      const arr = Array.isArray(product.image) ? product.image : (product.image.data ? (Array.isArray(product.image.data) ? product.image.data : [product.image.data]) : [product.image]);
      return arr.map(function(m) {
        const url = m && (m.url || (m.attributes && m.attributes.url));
        if (!url) return null;
        return url.startsWith('/') ? `${window.ENV.API_URL}${url}` : url;
      }).filter(Boolean);
    }
    return [];
  }, [product]);

  const [idx, setIdx] = React.useState(0);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  const t = {
    addToCart: isEn ? "Add to Cart" : "Thêm vào giỏ",
    weight: isEn ? "Weight" : "Trọng lượng",
    origin: isEn ? "Origin" : "Xuất xứ",
    inStock: isEn ? "In Stock" : "Còn hàng",
    outOfStock: isEn ? "Out of Stock" : "Hết hàng"
  };

  const hasStock = product.quantity > 0;

  return (
    <div className="tph-modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px'
    }}>
      <div className="tph-modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="tph-modal-close">×</button>

        {/* ── Image panel with carousel ── */}
        <div className="tph-modal-left">
          {/* Main image */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', position: 'relative' }}>
            {images.length > 0 ? (
              <img
                src={images[idx]}
                alt={product.name}
                style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain', transition: 'opacity 0.2s' }}
              />
            ) : (
              <div style={{ color: '#8A7030', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                {isEn ? "No image available" : "Chưa có hình ảnh"}
              </div>
            )}

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button onClick={prev} style={{
                  position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)', border: '1px solid #E2D4BC', borderRadius: '50%',
                  width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', zIndex: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>‹</button>
                <button onClick={next} style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)', border: '1px solid #E2D4BC', borderRadius: '50%',
                  width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', zIndex: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>›</button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '0 16px 16px', flexWrap: 'wrap' }}>
              {images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  onClick={() => setIdx(i)}
                  style={{
                    width: '52px', height: '52px', objectFit: 'contain',
                    border: i === idx ? '2px solid #2A1F0E' : '2px solid transparent',
                    borderRadius: '6px', background: '#fff', cursor: 'pointer',
                    opacity: i === idx ? 1 : 0.6, transition: 'all 0.15s'
                  }}
                  alt={"Photo " + (i + 1)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Info panel ── */}
        <div className="tph-modal-right">
          <div style={{ fontSize: '12px', color: '#8A7030', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            {product.brand} · {product.sku}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '0 0 12px', color: '#2A1F0E', lineHeight: 1.15 }}>
            {product.name}
          </h2>
          {(product.original_price && product.original_price > product.price) ? (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#9A8070', textDecoration: 'line-through', marginBottom: '4px' }}>
                {fmt(product.original_price)}
              </div>
              <div style={{ fontSize: '24px', color: '#9A2A1E', fontWeight: 500 }}>{fmt(product.price)}</div>
              <div style={{ fontSize: '12px', color: '#C8401E', marginTop: '4px', fontFamily: 'var(--font-sans)', letterSpacing: '0.1em' }}>
                Tiết kiệm {fmt(product.original_price - product.price)}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '22px', color: '#2A1F0E', marginBottom: '16px', fontWeight: 500 }}>
              {fmt(product.price)}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <span style={{
              display: 'inline-block', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
              background: hasStock ? '#E8F5E9' : '#FFEBEE', color: hasStock ? '#2E7D32' : '#C62828'
            }}>
              {hasStock ? t.inStock : t.outOfStock}
            </span>
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#4A3B2A', marginBottom: '20px', whiteSpace: 'pre-line' }}>
            {product.description || (isEn ? "No description available." : "Chưa có mô tả.")}
          </p>

          <div style={{ borderTop: '1px solid #E2D4BC', paddingTop: '16px', marginBottom: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px', color: '#4A3B2A' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#8A7030', marginBottom: '4px' }}>{t.weight}</strong>
                {product.weight || '--'}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#8A7030', marginBottom: '4px' }}>{t.origin}</strong>
                {product.origin || '--'}
              </div>
            </div>
          </div>

          <button
            className="tph-btn tph-btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            disabled={!hasStock}
            onClick={() => { onAdd(product); onClose(); }}
          >
            {hasStock ? t.addToCart : t.outOfStock}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
