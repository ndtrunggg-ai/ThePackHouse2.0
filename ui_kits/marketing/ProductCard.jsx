// ─── ProductCard + ProductGrid bundled together ───────────────────────────────
// Keeping them in one file eliminates the Babel async cross-script timing bug.

function flattenSpecs(val) {
  if (val === null || val === undefined || val === '') return '';
  if (Array.isArray(val)) return val.map(flattenSpecs).filter(Boolean).join(' · ');
  if (typeof val === 'object') return Object.values(val).map(flattenSpecs).filter(function(v) { return v && typeof v === 'string' && !/^\d+$/.test(v); }).join(', ');
  return String(val);
}

function ProductCard({ p, onAdd, onView, lang }) {
  const isEn = lang === 'en';
  const fmt = (n) => (Number(n) || 0).toLocaleString(isEn ? 'en-US' : 'vi-VN') + ' ₫';
  const t = { addToCart: isEn ? "Add to cart" : "Thêm vào giỏ" };

  // Resolve image from Strapi media array or legacy image_url
  let imgUrl = p.image_url;
  if (!imgUrl && p.image) {
    const media = Array.isArray(p.image) ? p.image[0] : (p.image.data ? (Array.isArray(p.image.data) ? p.image.data[0] : p.image.data) : p.image);
    const url = media && (media.url || (media.attributes && media.attributes.url));
    if (url) imgUrl = url.startsWith('/') ? 'http://localhost:1337' + url : url;
  }

  const cls = "tph-card tph-card-" + (p.brand || '');
  return (
    <article className={cls}>
      <div className="tph-card-img" onClick={() => onView && onView(p)} style={{ cursor: 'pointer' }}>
        {p.brand === "thule" && (
          <>
            <span className="tph-card-brand">THULE</span>
            <span className="tph-card-flag">SWEDEN · 1942</span>
            <div className="tph-card-mountains">
              <svg viewBox="0 0 300 100" preserveAspectRatio="xMidYMax slice">
                <polygon points="0,100 60,42 110,78 160,28 220,68 270,46 300,72 300,100" fill="#DDE0D5" opacity="0.4"/>
                <polygon points="0,100 40,62 95,85 150,52 210,82 260,66 300,82 300,100" fill="#DDE0D5" opacity="0.55"/>
              </svg>
            </div>
          </>
        )}
        {p.brand === "case-logic" && <span className="tph-card-brand cl-brand-text">CASE LOGIC</span>}
        {p.badge && <span className={"tph-card-badge tph-badge-" + p.badge.kind}>{p.badge.label}</span>}

        {imgUrl ? (
          <img src={imgUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 0 }} />
        ) : (
          <div className="tph-card-silhouette">
            <svg viewBox="0 0 100 130" fill="none" stroke="currentColor" strokeWidth="1.5" style={{opacity: 0.5}}>
              <rect x="22" y="20" width="56" height="100" rx="6"/>
              <path d="M34,20 Q34,8 50,8 Q66,8 66,20"/>
            </svg>
          </div>
        )}
      </div>
      <div className="tph-card-body" style={{ zIndex: 1, position: 'relative' }}>
        <div className="tph-card-brandline" onClick={() => onView && onView(p)} style={{ cursor: 'pointer' }}>{(p.brand || '').replace(/-/g, ' ')}</div>
        <h4 className="tph-card-name" onClick={() => onView && onView(p)} style={{ cursor: 'pointer' }}>{p.name}</h4>
        <div className="tph-card-meta">{flattenSpecs(p.specs)}</div>
        <div className="tph-card-foot">
          <span className="tph-card-price">{fmt(p.price)}</span>
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
      const specsStr = flattenSpecs(p.specs);
      const hay = ((p.name || '') + ' ' + (p.brand || '') + ' ' + specsStr).toLowerCase();
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
