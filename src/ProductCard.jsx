import React from 'react';
// Recursively flattens a specs value (object, array, primitive) into a display string
function flattenSpecs(val, depth) {
  if (depth === undefined) depth = 0;
  if (val === null || val === undefined) return '';
  if (Array.isArray(val)) return val.map(function(v) { return flattenSpecs(v, depth + 1); }).filter(Boolean).join(' · ');
  if (typeof val === 'object') return Object.values(val).map(function(v) { return flattenSpecs(v, depth + 1); }).filter(function(v) { return v && typeof v === 'string' && !/^\d+$/.test(v); }).join(', ');
  return String(val);
}

// Brand-aware product card. Each brand gets its own visual treatment.
function ProductCard({ p, onAdd, onView, lang }) {
  const isEn = lang === 'en';
  const fmt = (n) => (Number(n) || 0).toLocaleString(isEn ? 'en-US' : 'vi-VN') + ' ₫';
  
  const t = {
    addToCart: isEn ? "Add to cart" : "Thêm vào giỏ"
  };

  const cls = "tph-card tph-card-" + p.brand;
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
        {p.brand === "samsonite" && (
          <>
            <span className="tph-card-brand sam-brand-text">Samsonite</span>
            <span className="tph-card-yr">EST. 1910</span>
          </>
        )}
        {p.brand === "case-logic" && (
          <span className="tph-card-brand cl-brand-text">CASE LOGIC</span>
        )}
        {p.brand === "pacsafe" && (
          <>
            <div className="tph-card-grid-bg" />
            <span className="tph-card-brand pac-brand-text">PACSAFE</span>
            <span className="tph-card-cert">Anti-theft</span>
          </>
        )}
        {p.brand === "tumi" && (
          <span className="tph-card-brand tumi-brand-text">TUMI</span>
        )}
        {p.badge && <span className={"tph-card-badge tph-badge-" + p.badge.kind}>{p.badge.label}</span>}

        {(() => {
          let url = p.image_url;
          if (!url && p.image) {
            const media = Array.isArray(p.image) ? p.image[0] : (p.image.data ? (Array.isArray(p.image.data) ? p.image.data[0] : p.image.data) : p.image);
            url = media?.attributes?.url || media?.url;
            if (url && url.startsWith('/')) url = `${window.ENV.API_URL}${url}`;
          }
          if (url) {
            return <img src={url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 0 }} />;
          }
          return null;
        })() || (p.svg ? (
          <div className="tph-card-silhouette" dangerouslySetInnerHTML={{ __html: p.svg }} />
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
        <div className="tph-card-brandline" onClick={() => onView && onView(p)} style={{ cursor: 'pointer' }}>{(p.brand || '').replace('-', ' ')}</div>
        <h4 className="tph-card-name" onClick={() => onView && onView(p)} style={{ cursor: 'pointer' }}>{p.name}</h4>
        <div className="tph-card-meta">{flattenSpecs(p.specs)}</div>
        <div className="tph-card-foot">
          <span className="tph-card-price">{fmt(p.price)}</span>
          <button className="tph-card-add" onClick={() => onAdd(p)} aria-label={`Add ${p.name} to cart`}>
            {t.addToCart}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
