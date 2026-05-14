function ProductGrid({ brand, type, search, sort, onAdd, onView, onClearFilters, products = [], lang }) {
  const isEn = lang === 'en';

  const t = {
    emptyHead: isEn ? "Nothing found." : "Chưa có sản phẩm phù hợp.",
    emptyBody: isEn ? "Try adjusting your brand or type filters — or clear them all to see everything." : "Thử tìm với thương hiệu hoặc phân loại khác — hoặc xóa bộ lọc để xem toàn bộ cửa hàng.",
    clearBtn: isEn ? "Clear filters" : "Xóa bộ lọc",
    addNew: isEn ? "Add New Product" : "Thêm sản phẩm mới",
    addDesc: isEn ? "Update via Admin" : "Cập nhật từ Admin"
  };

  let list = products.filter((p) => {
    if (brand !== "all" && p.brand !== brand) return false;
    if (type !== "all" && p.type !== type) return false;
    if (search && search.trim()) {
      const q = search.toLowerCase();
      const hay = (p.name + " " + p.brand + " " + (p.specs ? p.specs.join(" ") : "")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (sort === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "newest")     list = [...list].sort((a, b) => b.id - a.id);
  if (sort === "featured")   list = [...list];

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
      {list.map((p) => <ProductCard key={p.id} p={p} onAdd={onAdd} onView={onView} lang={lang} />)}
      
      {/* Add New Product Card */}
      <article className="tph-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center', background: '#F5F4EE', border: '1px dashed #C8A97A', cursor: 'pointer' }} onClick={() => window.location.href = '/backend/admin.html'}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#C8A97A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>+</div>
        <h4 className="tph-card-name" style={{ marginBottom: '8px' }}>{t.addNew}</h4>
        <p className="tph-card-meta" style={{ margin: 0, color: '#8A7030' }}>{t.addDesc}</p>
      </article>
    </div>
  );
}

window.ProductGrid = ProductGrid;
