function ProductModal({ product, onClose, onAdd, lang }) {
  if (!product) return null;
  const isEn = lang === 'en';

  const fmt = (n) => n.toLocaleString(isEn ? "en-US" : "vi-VN") + " ₫";

  const t = {
    addToCart: isEn ? "Add to Cart" : "Thêm vào giỏ",
    description: isEn ? "Description" : "Mô tả",
    weight: isEn ? "Weight" : "Trọng lượng",
    origin: isEn ? "Origin" : "Xuất xứ",
    specs: isEn ? "Features" : "Tính năng",
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
      <div className="tph-modal-content" onClick={e => e.stopPropagation()} style={{
        background: '#fff', width: '100%', maxWidth: '800px', borderRadius: '12px',
        display: 'flex', overflow: 'hidden', position: 'relative', maxHeight: '90vh'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', background: 'transparent',
          border: 'none', fontSize: '24px', cursor: 'pointer', zIndex: 10
        }}>×</button>

        <div className="tph-modal-img" style={{
          flex: 1, background: '#F5F4EE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'
        }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
          ) : (
            <div style={{ color: '#8A7030', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              {isEn ? "No image available" : "Chưa có hình ảnh"}
            </div>
          )}
        </div>

        <div className="tph-modal-info" style={{
          flex: 1, padding: '40px', overflowY: 'auto'
        }}>
          <div style={{ fontSize: '12px', color: '#8A7030', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            {product.brand} · {product.sku}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: '0 0 16px', color: '#2A1F0E', lineHeight: 1.1 }}>
            {product.name}
          </h2>
          <div style={{ fontSize: '24px', color: '#2A1F0E', marginBottom: '24px' }}>
            {fmt(product.price)}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span style={{ 
              display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
              background: hasStock ? '#E8F5E9' : '#FFEBEE', color: hasStock ? '#2E7D32' : '#C62828'
            }}>
              {hasStock ? t.inStock : t.outOfStock}
            </span>
          </div>

          <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#4A3B2A', marginBottom: '24px' }}>
            {product.description || (isEn ? "No description available." : "Chưa có mô tả.")}
          </p>

          <div style={{ borderTop: '1px solid #E2D4BC', paddingTop: '20px', marginBottom: '32px' }}>
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
            style={{ width: '100%', padding: '16px', fontSize: '16px' }}
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

window.ProductModal = ProductModal;
