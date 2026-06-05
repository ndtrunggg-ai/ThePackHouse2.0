import React, { useState } from 'react';

function OrderTrackingModal({ open, onClose, lang }) {
  if (!open) return null;

  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  const isEn = lang === 'en';
  const t = {
    title: isEn ? "Track Your Order" : "Theo dõi đơn hàng",
    orderId: isEn ? "Order ID / Number" : "Mã đơn hàng",
    phone: isEn ? "Phone Number" : "Số điện thoại",
    track: isEn ? "Track Order" : "Kiểm tra đơn",
    loading: isEn ? "Searching..." : "Đang tìm kiếm...",
    errorNotFound: isEn ? "Order not found. Please check your details." : "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.",
    errorServer: isEn ? "Could not connect to the server. (Check Strapi API permissions)" : "Không thể kết nối với máy chủ. (Kiểm tra quyền truy cập Strapi)",
    statusTitle: isEn ? "Order Status" : "Trạng thái đơn hàng",
    back: isEn ? "Search Again" : "Tìm lại",
    date: isEn ? "Order Date:" : "Ngày đặt:",
    total: isEn ? "Total:" : "Tổng cộng:"
  };

  const statuses = [
    { key: 'pending', labelVi: 'Chờ xác nhận', labelEn: 'Pending' },
    { key: 'processing', labelVi: 'Đang xử lý', labelEn: 'Processing' },
    { key: 'shipped', labelVi: 'Đang giao', labelEn: 'Shipped' },
    { key: 'delivered', labelVi: 'Đã giao', labelEn: 'Delivered' },
    { key: 'cancelled', labelVi: 'Đã hủy', labelEn: 'Cancelled' }
  ];

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId || !phone) return;
    
    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      // Direct query to Strapi. 
      // NOTE: This requires Strapi to allow public find/findOne on /api/orders,
      // and ideally filtering by documentId/id and phone.
      const res = await fetch(`${window.ENV.API_URL}/api/orders?filters[documentId][$eq]=${encodeURIComponent(orderId)}&filters[phone][$eq]=${encodeURIComponent(phone)}`);
      
      if (res.status === 403) {
        throw new Error("403");
      }
      if (!res.ok) {
        throw new Error("Network");
      }
      
      const data = await res.json();
      
      // Strapi v5 returns arrays in data
      if (data && data.data && data.data.length > 0) {
        setOrderData(data.data[0]);
      } else {
        // Fallback: maybe they entered the numerical ID instead of documentId
        const resId = await fetch(`${window.ENV.API_URL}/api/orders?filters[id][$eq]=${encodeURIComponent(orderId)}&filters[phone][$eq]=${encodeURIComponent(phone)}`);
        const dataId = await resId.json();
        if (dataId && dataId.data && dataId.data.length > 0) {
          setOrderData(dataId.data[0]);
        } else {
          setError(t.errorNotFound);
        }
      }
    } catch (err) {
      if (err.message === "403") {
        setError(t.errorServer);
      } else {
        setError(t.errorNotFound);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderTimeline = (currentStatus) => {
    if (currentStatus === 'cancelled') {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#C62828', background: '#FFEBEE', borderRadius: '8px', fontWeight: 500 }}>
          {isEn ? "This order has been cancelled." : "Đơn hàng này đã bị hủy."}
        </div>
      );
    }

    const flow = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = flow.indexOf(currentStatus) >= 0 ? flow.indexOf(currentStatus) : 0;

    return (
      <div style={{ marginTop: '32px', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', top: '14px', left: '10%', right: '10%', height: '2px', background: 'var(--ph-sand-300)', zIndex: 1 
        }} />
        <div style={{ 
          position: 'absolute', top: '14px', left: '10%', width: `${(currentIndex / 3) * 80}%`, height: '2px', background: 'var(--ph-bronze-500)', zIndex: 2, transition: 'width 0.5s ease' 
        }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 3 }}>
          {flow.map((s, i) => {
            const isCompleted = i <= currentIndex;
            const statusObj = statuses.find(x => x.key === s);
            return (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                <div style={{ 
                  width: '30px', height: '30px', borderRadius: '50%', background: isCompleted ? 'var(--ph-bronze-500)' : 'var(--ph-cream-100)', 
                  border: isCompleted ? '2px solid var(--ph-bronze-500)' : '2px solid var(--ph-sand-300)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: isCompleted ? '#fff' : 'var(--ph-sand-300)',
                  transition: 'all 0.3s ease', marginBottom: '12px'
                }}>
                  {isCompleted && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div style={{ 
                  fontSize: '12px', textAlign: 'center', color: isCompleted ? 'var(--ph-cocoa-850)' : 'var(--ph-sand-500)', 
                  fontWeight: isCompleted ? 600 : 400, transition: 'color 0.3s ease' 
                }}>
                  {isEn ? statusObj.labelEn : statusObj.labelVi}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const fmt = (n) => (Number(n) || 0).toLocaleString(isEn ? 'en-US' : 'vi-VN') + ' ₫';

  return (
    <div className="tph-modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(42,31,14,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)'
    }}>
      <div 
        onClick={e => e.stopPropagation()} 
        style={{
          background: 'var(--ph-cream-100)', border: '0.75px solid var(--ph-sand-300)',
          borderRadius: '8px', padding: '40px', width: '100%', maxWidth: '500px',
          boxShadow: '0 24px 64px -16px rgba(42,31,14,.24)', position: 'relative',
          overflow: 'hidden'
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none',
          cursor: 'pointer', color: 'var(--ph-sand-500)', fontSize: '24px', lineHeight: 1, padding: '4px'
        }}>×</button>

        {!orderData ? (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '28px', color: 'var(--ph-cocoa-850)', margin: '0 0 8px', textAlign: 'center' }}>
              {t.title}
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--ph-sand-500)', fontSize: '14px', marginBottom: '32px' }}>
              {isEn ? "Enter your order details below to check the current shipping status." : "Nhập thông tin đơn hàng của bạn dưới đây để kiểm tra trạng thái vận chuyển."}
            </p>

            <form onSubmit={handleTrack}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ph-cocoa-850)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t.orderId}
                </label>
                <input 
                  type="text" 
                  value={orderId} 
                  onChange={e => setOrderId(e.target.value)} 
                  required
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '4px', border: '1px solid var(--ph-sand-300)',
                    background: 'var(--ph-cream-50)', color: 'var(--ph-cocoa-850)', fontSize: '15px', outline: 'none'
                  }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ph-cocoa-850)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t.phone}
                </label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  required
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '4px', border: '1px solid var(--ph-sand-300)',
                    background: 'var(--ph-cream-50)', color: 'var(--ph-cocoa-850)', fontSize: '15px', outline: 'none'
                  }}
                />
              </div>

              {error && (
                <div style={{ padding: '12px', background: '#fdecea', color: '#c62828', borderRadius: '4px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%', padding: '16px', background: 'var(--ph-cocoa-850)', color: 'var(--ph-cream-200)',
                  border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 500, letterSpacing: '0.15em',
                  textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? t.loading : t.track}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '24px', color: 'var(--ph-cocoa-850)', margin: '0 0 24px', textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--ph-sand-200)' }}>
              {t.statusTitle}
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: 'var(--ph-sand-500)' }}>{t.date}</span>
              <span style={{ color: 'var(--ph-cocoa-850)', fontWeight: 500 }}>
                {new Date(orderData.createdAt || orderData.publishedAt).toLocaleDateString(isEn ? 'en-US' : 'vi-VN')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px' }}>
              <span style={{ color: 'var(--ph-sand-500)' }}>{t.total}</span>
              <span style={{ color: 'var(--ph-cocoa-850)', fontWeight: 600 }}>
                {fmt(orderData.total)}
              </span>
            </div>

            <div style={{ padding: '32px 0 40px' }}>
              {renderTimeline(orderData.orderStatus || 'pending')}
            </div>

            <button 
              onClick={() => { setOrderData(null); setOrderId(''); setPhone(''); }}
              style={{
                width: '100%', padding: '14px', background: 'transparent', color: 'var(--ph-cocoa-850)',
                border: '1px solid var(--ph-cocoa-850)', borderRadius: '4px', fontSize: '13px', fontWeight: 500, 
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {t.back}
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default OrderTrackingModal;
