import React from 'react';
import ReactDOM from 'react-dom/client';

const API_URL = window.ENV?.API_URL || 'https://whimsical-renewal-84c9832818.strapiapp.com';

function AdminApp() {
  const [token, setToken] = React.useState(localStorage.getItem("admin_token"));
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("orders");
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password })
      });
      const data = await res.json();
      if (data.data && data.data.token) {
        localStorage.setItem("admin_token", data.data.token);
        setToken(data.data.token);
      } else {
        setError("Thông tin đăng nhập không hợp lệ");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/content-manager/collection-types/api::order.order?sort=createdAt:DESC`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 401 || res.status === 403) {
        setToken(null);
        localStorage.removeItem("admin_token");
      } else {
        const data = await res.json();
        setOrders(data.results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (order, newStatus) => {
    try {
      const targetId = order.documentId || order.id;
      const res = await fetch(`${API_URL}/content-manager/collection-types/api::order.order/${targetId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => (o.documentId || o.id) === targetId ? { ...o, orderStatus: newStatus } : o));
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      } else {
        const errData = await res.json();
        console.error("Error updating status:", errData);
        alert("Không thể cập nhật trạng thái: " + (errData.error?.message || res.statusText));
      }
    } catch (e) {
      console.error('Failed to update status', e);
      alert("Lỗi mạng khi cập nhật trạng thái");
    }
  };

  React.useEffect(() => {
    if (token && activeTab === 'orders') {
      fetchOrders();
    }
  }, [token, activeTab]);

  if (!token) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <h2 className="admin-login-title">Đăng nhập Quản trị</h2>
          {error && <div className="admin-error">{error}</div>}
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              className="admin-input" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              className="admin-input" 
              placeholder="Mật khẩu" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button type="submit" className="admin-btn">Đăng nhập</button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const newOrders = orders.filter(o => (o.orderStatus || o.status) === 'pending' || (!o.orderStatus && !o.status));
  const inTransit = orders.filter(o => (o.orderStatus || o.status) === 'shipped');

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đóng gói';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return 'Chờ xử lý';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <React.Fragment>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <span className="admin-stat-label">Tổng đơn hàng</span>
                <h3 className="admin-stat-value">{orders.length}</h3>
                <span className="admin-stat-sub">Tất cả thời gian</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Đơn mới</span>
                <h3 className="admin-stat-value blue">{newOrders.length}</h3>
                <span className="admin-stat-sub">Cần xử lý</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Đang giao</span>
                <h3 className="admin-stat-value orange">{inTransit.length}</h3>
                <span className="admin-stat-sub">Trên đường</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Doanh thu</span>
                <h3 className="admin-stat-value">{totalRevenue.toLocaleString()} ₫</h3>
                <span className="admin-stat-sub">Tổng cộng</span>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Trạng thái</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" style={{textAlign:'center', padding:'40px'}}><div className="loading-spinner"></div></td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan="5"><div className="empty-state">Không có đơn hàng nào.</div></td></tr>
                  ) : (
                    orders.map(o => {
                      let itemsText = "Sản phẩm";
                      try {
                        const items = Array.isArray(o.items) ? o.items : JSON.parse(o.items || "[]");
                        if (items.length > 0) {
                          itemsText = items.map(i => `${i.name}`).join(", ");
                        }
                      } catch (e) {}

                      return (
                        <tr key={o.documentId || o.id} onClick={() => setSelectedOrder(o)}>
                          <td className="admin-td-order">#{o.id || o.documentId?.substring(0,4)}</td>
                          <td className="admin-td-customer">{o.customerName}<br/><span style={{fontSize:'12px', color:'var(--text-muted)'}}>{o.city}</span></td>
                          <td className="admin-td-items" style={{maxWidth:'240px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{itemsText}</td>
                          <td><span className={`admin-badge badge-${o.orderStatus || o.status || 'pending'}`}>{getStatusText(o.orderStatus || o.status)}</span></td>
                          <td className="admin-td-total">{(o.total || 0).toLocaleString()} ₫</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        );
      case 'products':
        return (
          <div className="empty-state" style={{marginTop:'40px'}}>
            <span style={{fontSize:'32px'}}>📦</span>
            <h3 style={{marginTop:'16px'}}>Quản lý Sản phẩm</h3>
            <p>Tính năng quản lý kho và sản phẩm trực tiếp từ Frontend đang được phát triển.<br/>Vui lòng truy cập hệ thống Strapi Cloud để thêm hoặc chỉnh sửa sản phẩm.</p>
          </div>
        );
      case 'customers':
        const customerMap = {};
        orders.forEach(o => {
          const key = o.email || o.phone || o.customerName;
          if (!key) return;
          if (!customerMap[key]) {
            customerMap[key] = {
              name: o.customerName,
              email: o.email,
              phone: o.phone,
              city: o.city,
              totalSpend: 0,
              orderCount: 0,
              lastOrder: o.createdAt
            };
          }
          if ((o.orderStatus || o.status) !== 'cancelled') {
            customerMap[key].totalSpend += (o.total || 0);
          }
          customerMap[key].orderCount += 1;
        });
        const customers = Object.values(customerMap).sort((a,b) => b.totalSpend - a.totalSpend);
        return (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Liên hệ</th>
                  <th>Khu vực</th>
                  <th>Số đơn</th>
                  <th>Tổng chi tiêu</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan="5"><div className="empty-state">Chưa có dữ liệu khách hàng.</div></td></tr>
                ) : customers.map((c, i) => (
                  <tr key={i} style={{cursor:'default'}}>
                    <td className="admin-td-customer" style={{fontWeight:500}}>{c.name}</td>
                    <td style={{fontSize:'13px'}}>{c.email}<br/><span style={{color:'var(--text-muted)'}}>{c.phone}</span></td>
                    <td>{c.city}</td>
                    <td>{c.orderCount}</td>
                    <td className="admin-td-total">{c.totalSpend.toLocaleString()} ₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'shipping':
        const shippingOrders = orders.filter(o => (o.orderStatus || o.status) === 'processing' || (o.orderStatus || o.status) === 'shipped');
        return (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Địa chỉ giao hàng</th>
                  <th>Hình thức</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {shippingOrders.length === 0 ? (
                  <tr><td colSpan="5"><div className="empty-state">Không có đơn hàng nào đang chờ vận chuyển.</div></td></tr>
                ) : shippingOrders.map(o => (
                  <tr key={o.documentId || o.id} onClick={() => setSelectedOrder(o)}>
                    <td className="admin-td-order">#{o.id || o.documentId?.substring(0,4)}</td>
                    <td className="admin-td-customer">{o.customerName}<br/><span style={{fontSize:'12px', color:'var(--text-muted)'}}>{o.phone}</span></td>
                    <td style={{maxWidth:'280px', fontSize:'13px', lineHeight:'1.5'}}>{o.address}, {o.city}</td>
                    <td>{o.shippingMethod === 'express' ? 'Hỏa tốc' : (o.shippingMethod === 'standard' ? 'Tiêu chuẩn' : 'COD')}</td>
                    <td><span className={`admin-badge badge-${o.orderStatus || o.status || 'pending'}`}>{getStatusText(o.orderStatus || o.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'analytics':
        const totalItemsSold = orders.reduce((acc, o) => {
          if ((o.orderStatus || o.status) === 'cancelled') return acc;
          try {
            const items = Array.isArray(o.items) ? o.items : JSON.parse(o.items || "[]");
            return acc + items.length;
          } catch(e) { return acc; }
        }, 0);
        
        const validOrders = orders.filter(o => (o.orderStatus || o.status) !== 'cancelled');
        const aov = validOrders.length > 0 ? (validOrders.reduce((acc, o) => acc + (o.total || 0), 0) / validOrders.length) : 0;
        const potentialRev = orders.filter(o => (o.orderStatus || o.status) === 'pending' || (o.orderStatus || o.status) === 'processing').reduce((acc, o) => acc + (o.total || 0), 0);
        const realizedRev = orders.filter(o => (o.orderStatus || o.status) === 'delivered' || (o.orderStatus || o.status) === 'shipped').reduce((acc, o) => acc + (o.total || 0), 0);
        const cancelledOrders = orders.filter(o => (o.orderStatus || o.status) === 'cancelled').length;

        return (
          <React.Fragment>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <span className="admin-stat-label">Doanh thu thực tế</span>
                <h3 className="admin-stat-value" style={{color:'var(--success)'}}>{realizedRev.toLocaleString()} ₫</h3>
                <span className="admin-stat-sub">Đã giao & Đang giao</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Doanh thu tiềm năng</span>
                <h3 className="admin-stat-value orange">{potentialRev.toLocaleString()} ₫</h3>
                <span className="admin-stat-sub">Chờ xử lý & Đóng gói</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Trung bình mỗi đơn</span>
                <h3 className="admin-stat-value">{Math.round(aov).toLocaleString()} ₫</h3>
                <span className="admin-stat-sub">Average Order Value</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Sản phẩm đã bán</span>
                <h3 className="admin-stat-value">{totalItemsSold}</h3>
                <span className="admin-stat-sub">Đã hủy {cancelledOrders} đơn</span>
              </div>
            </div>

            <div className="admin-table-wrapper" style={{padding:'60px 40px', textAlign:'center'}}>
              <span style={{fontSize:'40px'}}>📈</span>
              <h3 style={{marginTop:'16px', fontFamily:'var(--font-serif)', fontSize:'24px', color:'var(--text-main)'}}>Biểu đồ tăng trưởng</h3>
              <p style={{color:'var(--text-muted)'}}>Thu thập thêm dữ liệu đơn hàng để hiển thị biểu đồ xu hướng theo tuần.</p>
            </div>
          </React.Fragment>
        );
      default: return null;
    }
  };

  const getTitle = () => {
    switch(activeTab) {
      case 'orders': return 'Đơn hàng';
      case 'products': return 'Sản phẩm';
      case 'customers': return 'Khách hàng';
      case 'shipping': return 'Vận chuyển';
      case 'analytics': return 'Phân tích';
      default: return '';
    }
  }

  return (
    <div className="admin-layout">
      {/* LEFT SIDEBAR */}
      <div className="admin-sidebar">
        <div className="admin-brand">
          The Pack House
          <div className="admin-brand-sub">Hệ thống Quản trị</div>
        </div>
        <nav className="admin-nav">
          <a href="#orders" className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }}>
            <span className="admin-nav-icon">🛒</span>
            Đơn hàng
            {newOrders.length > 0 && <span className="admin-badge-red">{newOrders.length}</span>}
          </a>
          <a href="#products" className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('products'); }}>
            <span className="admin-nav-icon">📦</span>
            Sản phẩm
          </a>
          <a href="#customers" className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('customers'); }}>
            <span className="admin-nav-icon">👥</span>
            Khách hàng
          </a>
          <a href="#shipping" className={`admin-nav-item ${activeTab === 'shipping' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('shipping'); }}>
            <span className="admin-nav-icon">🚚</span>
            Vận chuyển
          </a>
          <a href="#analytics" className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('analytics'); }}>
            <span className="admin-nav-icon">📊</span>
            Phân tích
          </a>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-main">
        <header className="admin-header">
          <h1 className="admin-title">{getTitle()}</h1>
          <div className="admin-header-right">
            <span className="admin-bell">🔔</span>
            <div className="admin-avatar">TP</div>
          </div>
        </header>

        <div className="admin-content">
          {renderContent()}
        </div>
      </div>

      {/* ORDER SLIDE-OVER */}
      {selectedOrder && (
        <div className="admin-slide-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-slide-pane" onClick={e => e.stopPropagation()}>
            <div className="admin-slide-header">
              <h2 className="admin-slide-title">Đơn hàng #{selectedOrder.id || selectedOrder.documentId?.substring(0,4)}</h2>
              <button className="admin-slide-close" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            <div className="admin-slide-body">
              <div className="admin-detail-section">
                <div className="admin-detail-label">Khách hàng</div>
                <div className="admin-detail-text" style={{fontWeight:500}}>{selectedOrder.customerName}</div>
                <div className="admin-detail-text">{selectedOrder.email}</div>
                <div className="admin-detail-text">{selectedOrder.phone}</div>
              </div>
              <div className="admin-detail-section">
                <div className="admin-detail-label">Giao hàng</div>
                <div className="admin-detail-text">{selectedOrder.address}</div>
                <div className="admin-detail-text">{selectedOrder.city}</div>
                <div className="admin-detail-text" style={{marginTop:'8px', color:'var(--text-muted)'}}>
                  Hình thức: {selectedOrder.shippingMethod === 'express' ? 'Giao hàng hỏa tốc' : (selectedOrder.shippingMethod === 'standard' ? 'Giao hàng tiêu chuẩn' : 'COD')}
                </div>
              </div>
              <div className="admin-detail-section">
                <div className="admin-detail-label">Sản phẩm</div>
                {(() => {
                  let items = [];
                  try { items = Array.isArray(selectedOrder.items) ? selectedOrder.items : JSON.parse(selectedOrder.items || "[]"); } catch(e){}
                  if (items.length === 0) return <div className="admin-detail-text" style={{fontStyle:'italic', color:'var(--text-muted)'}}>Chưa có thông tin sản phẩm.</div>;
                  return items.map((itm, idx) => (
                    <div key={idx} className="admin-cart-item">
                      <span className="admin-cart-name">{itm.name} <span style={{color:'var(--text-muted)'}}>×1</span></span>
                      <span className="admin-cart-price">{(itm.price || 0).toLocaleString()} ₫</span>
                    </div>
                  ));
                })()}
                <div style={{display:'flex', justifyContent:'space-between', marginTop:'16px', borderTop:'1px solid var(--border-color)', paddingTop:'16px'}}>
                  <span style={{fontWeight:600, fontSize:'16px', color:'var(--text-main)'}}>Tổng tiền</span>
                  <span style={{fontWeight:500, fontSize:'20px', fontFamily:'var(--font-serif)', color:'var(--text-main)'}}>{(selectedOrder.total || 0).toLocaleString()} ₫</span>
                </div>
              </div>
              <div className="admin-detail-section">
                <div className="admin-detail-label">Cập nhật trạng thái</div>
                <select 
                  className="admin-status-select" 
                  value={selectedOrder.orderStatus || selectedOrder.status || 'pending'} 
                  onChange={(e) => handleUpdateStatus(selectedOrder, e.target.value)}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang đóng gói</option>
                  <option value="shipped">Đang giao</option>
                  <option value="delivered">Đã giao thành công</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AdminApp />);
