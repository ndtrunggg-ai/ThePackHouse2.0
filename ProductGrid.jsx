// ─── ProductCard + ProductGrid (bundled) ─────────────────────────────────────

function flattenSpecs(val) {
  if (val === null || val === undefined || val === '') return '';
  if (Array.isArray(val)) return val.map(flattenSpecs).filter(Boolean).join(' · ');
  if (typeof val === 'object') return Object.values(val).map(flattenSpecs).filter(function(v) { return v && typeof v === 'string' && !/^\d+$/.test(v); }).join(', ');
  return String(val);
}

// Extract all image URLs from a Strapi product
function getImageUrls(p) {
  if (p.image_url) return [p.image_url];
  if (p.image) {
    const arr = Array.isArray(p.image) ? p.image : (p.image.data ? (Array.isArray(p.image.data) ? p.image.data : [p.image.data]) : [p.image]);
    return arr.map(function(media) {
      const url = media && (media.url || (media.attributes && media.attributes.url));
      if (!url) return null;
      return url.startsWith('/') ? `${window.ENV.API_URL}${url}` : url;
    }).filter(Boolean);
  }
  return [];
}

function ProductCard({ p, onAdd, onView, lang }) {
  const isEn = lang === 'en';
  const fmt = (n) => (parseInt(n, 10) || 0).toLocaleString(isEn ? 'en-US' : 'vi-VN') + ' ₫';
  const t = { addToCart: isEn ? "Add to cart" : "Thêm vào giỏ" };

  const images = getImageUrls(p);
  const [imgIdx, setImgIdx] = React.useState(0);

  const prevImg = (e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length); };
  const nextImg = (e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length); };

  const cls = "tph-card tph-card-" + (p.brand || '');
  return (
    <article className={cls}>
      <div className="tph-card-img" onClick={() => onView && onView(p)} style={{ cursor: 'pointer', position: 'relative', background: '#F5F3EF' }}>
        {p.badge && <span className={"tph-card-badge tph-badge-" + p.badge.kind}>{p.badge.label}</span>}
        {(p.original_price && p.original_price > p.price) && (
          <span className="tph-card-badge tph-badge-sale" style={{ top: '10px', left: '14px', bottom: 'auto' }}>Sale</span>
        )}

        {/* Image or silhouette */}
        {images.length > 0 ? (
          <img
            src={images[imgIdx]}
            alt={p.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', inset: 0, zIndex: 0, padding: '12px', boxSizing: 'border-box' }}
          />
        ) : (
          <div className="tph-card-silhouette">
            <svg viewBox="0 0 100 130" fill="none" stroke="currentColor" strokeWidth="1.5" style={{opacity: 0.3}}>
              <rect x="22" y="20" width="56" height="100" rx="6"/>
              <path d="M34,20 Q34,8 50,8 Q66,8 66,20"/>
            </svg>
          </div>
        )}

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prevImg} style={{
              position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 5, background: 'rgba(255,255,255,0.90)', border: 'none', borderRadius: '50%',
              width: '28px', height: '28px', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
            }}>‹</button>
            <button onClick={nextImg} style={{
              position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 5, background: 'rgba(255,255,255,0.90)', border: 'none', borderRadius: '50%',
              width: '28px', height: '28px', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
            }}>›</button>
            <div style={{ position: 'absolute', bottom: '6px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '4px', zIndex: 5 }}>
              {images.map((_, i) => (
                <span key={i} style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: i === imgIdx ? '#2A1F0E' : 'rgba(0,0,0,0.20)',
                  transition: 'background 0.2s'
                }} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="tph-card-body" style={{ zIndex: 1, position: 'relative' }}>
        <div className="tph-card-brandline" onClick={() => onView && onView(p)} style={{ cursor: 'pointer' }}>{(p.brand || '').replace(/-/g, ' ')}</div>
        <h4 className="tph-card-name" onClick={() => onView && onView(p)} style={{ cursor: 'pointer' }}>{p.name}</h4>
        <div className="tph-card-meta">{flattenSpecs(p.specs)}</div>
        <div className="tph-card-foot">
          <div>
            {(p.original_price && p.original_price > p.price) && (
              <div style={{ fontSize: '12px', color: '#9A8070', textDecoration: 'line-through', marginBottom: '2px' }}>
                {fmt(p.original_price)}
              </div>
            )}
            <span className="tph-card-price" style={(p.original_price && p.original_price > p.price) ? { color: '#9A2A1E' } : {}}>{fmt(p.price)}</span>
          </div>
          <button className="tph-card-add" onClick={() => onAdd(p)} aria-label={"Add " + p.name + " to cart"}>
            {t.addToCart}
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductGrid({ brand, type, search, sort, onAdd, onView, onClearFilters, products = [], lang }) {
  const isEn = lang === 'en';
  const t = {
    emptyHead: isEn ? "Nothing found." : "Chưa có sản phẩm phù hợp.",
    emptyBody: isEn ? "Try adjusting your filters." : "Thử tìm với thương hiệu hoặc phân loại khác.",
    clearBtn: isEn ? "Clear filters" : "Xóa bộ lọc",
    addNew: isEn ? "Add New Product" : "Thêm sản phẩm mới",
    addDesc: isEn ? "Update via Admin" : "Cập nhật từ Admin"
  };

  let list = products.filter((p) => {
    if (brand !== "all" && p.brand !== brand) return false;
    if (type !== "all" && p.type !== type) return false;
    if (search && search.trim()) {
      const q = search.toLowerCase();
      const hay = ((p.name || '') + ' ' + (p.brand || '') + ' ' + flattenSpecs(p.specs)).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (sort === "price-asc")  list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
  if (sort === "price-desc") list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
  if (sort === "newest")     list = [...list].sort((a, b) => b.id - a.id);

  if (list.length === 0) {
    return (
      <div className="tph-empty">
        <div className="tph-empty-mark">∅</div>
        <h3>{t.emptyHead}</h3>
        <p>{t.emptyBody}</p>
        <button className="tph-btn tph-btn-secondary" onClick={onClearFilters}>{t.clearBtn}</button>
      </div>
    );
  }

  return (
    <div className="tph-grid">
      {list.map((p) => <ProductCard key={p.id || p.documentId} p={p} onAdd={onAdd} onView={onView} lang={lang} />)}
      <article className="tph-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center', background: '#F5F4EE', border: '1px dashed #C8A97A', cursor: 'pointer' }} onClick={() => window.location.href = '/backend/admin.html'}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#C8A97A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>+</div>
        <h4 className="tph-card-name" style={{ marginBottom: '8px' }}>{t.addNew}</h4>
        <p className="tph-card-meta" style={{ margin: 0, color: '#8A7030' }}>{t.addDesc}</p>
      </article>
    </div>
  );
}

window.ProductCard = ProductCard;
window.ProductGrid = ProductGrid;
