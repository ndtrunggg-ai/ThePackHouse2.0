import React from 'react';

const BRANDS = [
  ['thule', 'Thule'],
  ['case-logic', 'Case Logic'],
  ['alpaka', 'Alpaka'],
  ['bamkel', 'Bamkel'],
  ['point-65', 'Point 65 North']
];

const TYPES = [
  ['backpacks', 'Balo'],
  ['duffel', 'Túi Duffel'],
  ['luggage', 'Vali'],
  ['daypacks', 'Balo nhỏ'],
  ['laptop-bags', 'Túi laptop'],
  ['accessory', 'Phụ kiện']
];

const NEW_PRODUCT = {
  id: null, sku: '', name: '', brand: 'thule', type: 'backpacks', price: 0, original_price: 0, quantity: 0,
  weight: '', origin: '', specsText: '', description: '', published: true, images: []
};

const MAX_IMAGE_EDGE = 1600;

const toForm = (p) => ({
  id: p.id,
  sku: p.sku,
  name: p.name,
  brand: p.brand,
  type: p.type,
  price: p.price,
  original_price: p.original_price,
  quantity: p.quantity,
  weight: p.weight,
  origin: p.origin,
  specsText: (p.specs || []).join('\n'),
  description: p.description,
  published: p.published,
  images: p.image.map(i => i.url)
});

const canvasToBlob = (canvas, type) => new Promise(resolve => canvas.toBlob(resolve, type, 0.85));

// Shrinks photos in the browser so the 1 vCPU server only has to store them.
async function shrinkImage(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    // Safari cannot encode WebP and returns a large PNG instead
    const webp = await canvasToBlob(canvas, 'image/webp');
    const blob = webp && webp.type === 'image/webp' ? webp : await canvasToBlob(canvas, 'image/jpeg');
    return blob && blob.size < file.size ? blob : file;
  } catch (err) {
    return file;
  }
}

function AdminProducts({ apiUrl, token, onUnauthorized }) {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [onlyMissing, setOnlyMissing] = React.useState(false);
  const [form, setForm] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState('');
  const [error, setError] = React.useState('');

  const request = React.useCallback(async (path, options = {}) => {
    const res = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: { 'Authorization': `Bearer ${token}`, ...options.headers }
    });
    if (res.status === 401) {
      onUnauthorized();
      throw new Error('Phiên đăng nhập đã hết hạn');
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error?.message || res.statusText);
    return body.data;
  }, [apiUrl, token, onUnauthorized]);

  React.useEffect(() => {
    request('/api/admin/products')
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [request]);

  const keepProduct = (saved) => {
    setProducts(list => list.some(p => p.id === saved.id) ? list.map(p => p.id === saved.id ? saved : p) : [...list, saved]);
    setForm(toForm(saved));
  };

  const openForm = (next) => {
    setError('');
    setUploadStatus('');
    setForm(next);
  };

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: value }));
  };

  const payload = (f, images) => JSON.stringify({
    sku: f.sku,
    name: f.name,
    brand: f.brand,
    type: f.type,
    price: Number(f.price),
    original_price: Number(f.original_price),
    quantity: Number(f.quantity),
    weight: f.weight,
    origin: f.origin,
    specs: f.specsText.split('\n'),
    description: f.description,
    published: f.published,
    images
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const saved = await request(form.id ? `/api/admin/products/${form.id}` : '/api/admin/products', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload(form, form.images)
      });
      keepProduct(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Xóa sản phẩm "${form.name}"? Không thể hoàn tác.`)) return;
    setError('');
    try {
      await request(`/api/admin/products/${form.id}`, { method: 'DELETE' });
      setProducts(list => list.filter(p => p.id !== form.id));
      setForm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = '';
    setError('');
    try {
      for (let i = 0; i < files.length; i++) {
        setUploadStatus(`Đang tải ảnh ${i + 1}/${files.length}...`);
        const image = await shrinkImage(files[i]);
        const saved = await request(`/api/admin/products/${form.id}/images`, {
          method: 'POST',
          headers: { 'Content-Type': image.type || 'application/octet-stream' },
          body: image
        });
        setProducts(list => list.map(p => p.id === saved.id ? saved : p));
        setForm(f => ({ ...f, images: saved.image.map(img => img.url) }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadStatus('');
    }
  };

  // Saves the stored product with a new image list, leaving any unsaved edits in the form alone.
  const saveImages = async (images) => {
    setError('');
    try {
      const stored = toForm(products.find(p => p.id === form.id));
      const saved = await request(`/api/admin/products/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: payload(stored, images)
      });
      setProducts(list => list.map(p => p.id === saved.id ? saved : p));
      setForm(f => ({ ...f, images: saved.image.map(img => img.url) }));
    } catch (err) {
      setError(err.message);
    }
  };

  const missingImages = products.filter(p => p.image.length === 0).length;
  const query = search.trim().toLowerCase();
  const visible = products.filter(p =>
    (!onlyMissing || p.image.length === 0) &&
    (!query || `${p.sku} ${p.name} ${p.brand} ${p.id}`.toLowerCase().includes(query))
  );

  return (
    <React.Fragment>
      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Tổng sản phẩm</span>
          <h3 className="admin-stat-value">{products.length}</h3>
          <span className="admin-stat-sub">Trong hệ thống</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Thiếu ảnh</span>
          <h3 className="admin-stat-value orange">{missingImages}</h3>
          <span className="admin-stat-sub">Cần tải ảnh lên</span>
        </div>
      </div>

      <div className="admin-toolbar">
        <input className="admin-input" placeholder="Tìm theo tên, SKU..." value={search} onChange={e => setSearch(e.target.value)} />
        <label className="admin-check">
          <input type="checkbox" checked={onlyMissing} onChange={e => setOnlyMissing(e.target.checked)} />
          Chỉ hiện sản phẩm thiếu ảnh
        </label>
        <button className="admin-btn admin-btn-inline" onClick={() => openForm(NEW_PRODUCT)}>+ Thêm sản phẩm</button>
      </div>

      {error && !form && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>SKU</th>
              <th>Tên sản phẩm</th>
              <th>Thương hiệu</th>
              <th>Giá</th>
              <th>Kho</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center', padding:'40px'}}><div className="loading-spinner"></div></td></tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan="6"><div className="empty-state">Không có sản phẩm nào.</div></td></tr>
            ) : visible.map(p => (
              <tr key={p.id} onClick={() => openForm(toForm(p))} style={p.published ? undefined : {opacity:0.5}}>
                <td>
                  {p.image.length > 0
                    ? <img className="admin-thumb" src={`${apiUrl}${p.image[0].url}`} alt="" loading="lazy" />
                    : <div className="admin-thumb admin-thumb-empty">Chưa có</div>}
                </td>
                <td className="admin-td-order">{p.sku}</td>
                <td className="admin-td-customer">{p.name}</td>
                <td>{(BRANDS.find(b => b[0] === p.brand) || [])[1] || p.brand}</td>
                <td className="admin-td-total">{(p.price || 0).toLocaleString()} ₫</td>
                <td>{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="admin-slide-overlay" onClick={() => setForm(null)}>
          <div className="admin-slide-pane" onClick={e => e.stopPropagation()}>
            <div className="admin-slide-header">
              <h2 className="admin-slide-title">{form.id ? `Sản phẩm #${form.id}` : 'Sản phẩm mới'}</h2>
              <button className="admin-slide-close" onClick={() => setForm(null)}>×</button>
            </div>
            <div className="admin-slide-body">
              {error && <div className="admin-error">{error}</div>}

              <div className="admin-detail-section">
                <div className="admin-detail-label">Hình ảnh (ảnh đầu tiên là ảnh chính)</div>
                {form.id ? (
                  <React.Fragment>
                    <div className="admin-image-grid">
                      {form.images.map((url, i) => (
                        <div key={url} className="admin-image-cell">
                          <img src={`${apiUrl}${url}`} alt="" />
                          <div className="admin-image-actions">
                            {i > 0 && <button type="button" onClick={() => saveImages([url, ...form.images.filter(u => u !== url)])}>Đặt chính</button>}
                            <button type="button" onClick={() => saveImages(form.images.filter(u => u !== url))}>Xóa</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {uploadStatus ? (
                      <div className="admin-detail-text">{uploadStatus}</div>
                    ) : (
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" multiple onChange={handleUpload} />
                    )}
                  </React.Fragment>
                ) : (
                  <div className="admin-detail-text" style={{color:'var(--text-muted)'}}>Lưu sản phẩm trước, sau đó có thể tải ảnh lên.</div>
                )}
              </div>

              <form onSubmit={handleSave}>
                <label className="admin-field-label">Tên sản phẩm</label>
                <input className="admin-input" value={form.name} onChange={update('name')} required />

                <label className="admin-field-label">SKU</label>
                <input className="admin-input" value={form.sku} onChange={update('sku')} required />

                <div className="admin-field-row">
                  <div>
                    <label className="admin-field-label">Thương hiệu</label>
                    <select className="admin-input" value={form.brand} onChange={update('brand')}>
                      {BRANDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="admin-field-label">Loại</label>
                    <select className="admin-input" value={form.type} onChange={update('type')}>
                      {TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="admin-field-row">
                  <div>
                    <label className="admin-field-label">Giá bán (₫)</label>
                    <input className="admin-input" type="number" min="0" step="1" value={form.price} onChange={update('price')} required />
                  </div>
                  <div>
                    <label className="admin-field-label">Giá gốc (₫)</label>
                    <input className="admin-input" type="number" min="0" step="1" value={form.original_price} onChange={update('original_price')} />
                  </div>
                </div>

                <div className="admin-field-row">
                  <div>
                    <label className="admin-field-label">Tồn kho</label>
                    <input className="admin-input" type="number" min="0" step="1" value={form.quantity} onChange={update('quantity')} />
                  </div>
                  <div>
                    <label className="admin-field-label">Trọng lượng</label>
                    <input className="admin-input" value={form.weight} onChange={update('weight')} />
                  </div>
                </div>

                <label className="admin-field-label">Xuất xứ</label>
                <input className="admin-input" value={form.origin} onChange={update('origin')} />

                <label className="admin-field-label">Thông số (mỗi dòng một thông số)</label>
                <textarea className="admin-input" rows="5" value={form.specsText} onChange={update('specsText')} />

                <label className="admin-field-label">Mô tả</label>
                <textarea className="admin-input" rows="6" value={form.description} onChange={update('description')} />

                <label className="admin-check" style={{marginBottom:'20px'}}>
                  <input type="checkbox" checked={form.published} onChange={update('published')} />
                  Hiển thị trên cửa hàng
                </label>

                <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu sản phẩm'}</button>
                {form.id && <button type="button" className="admin-btn admin-btn-danger" onClick={handleDelete}>Xóa sản phẩm</button>}
              </form>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default AdminProducts;
