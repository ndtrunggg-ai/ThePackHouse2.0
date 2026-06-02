import React from 'react';
import ReactDOM from 'react-dom/client';
import Nav from './Nav';
import Hero from './Hero';
import BrandTabs from './BrandTabs';
import TypeFilters from './TypeFilters';
import ProductGrid from './ProductGrid';
import ProductModal from './ProductModal';
import StoreInfo from './StoreInfo';
import Faq from './Faq';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return React.createElement('div', { style: { padding: '40px', fontFamily: 'monospace', background: '#fff3f3', border: '2px solid red', margin: '20px', borderRadius: '8px' } },
        React.createElement('h2', null, '⚠ React Error'),
        React.createElement('pre', { style: { whiteSpace: 'pre-wrap', color: 'red' } }, this.state.error.message),
        React.createElement('pre', { style: { whiteSpace: 'pre-wrap', fontSize: '11px', color: '#555' } }, this.state.error.stack)
      );
    }
    return this.props.children;
  }
}

function App() {
  const [products, setProducts] = React.useState([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [brand, setBrand] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("featured");

  const [lang, setLang] = React.useState("vi");
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [faqOpen, setFaqOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchProducts = React.useCallback(async (retries = 5) => {
    setLoading(true);
    setError(null);
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for cold starts
        
        const res = await fetch(`${window.ENV.API_URL}/api/products?populate[image][fields][0]=url&pagination[pageSize]=100`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        const normalized = data.data.map(p => {
          let overrideType = p.type;
          let overrideBrand = p.brand;
          const nameLower = (p.name || '').toLowerCase();
          if (nameLower.includes('tote') || nameLower.includes('spira vertical') || nameLower.includes('crossover 44l')) overrideType = 'duffel';
          if (nameLower.includes('mt carrier 5l') || nameLower.includes('point 65')) overrideBrand = 'point-65';
          if (nameLower.includes('gtx 25l') || nameLower.includes('gtx 20l')) overrideType = 'daypacks';
          if (nameLower.includes('chéo') || nameLower.includes('bao tử') || nameLower.includes('sling') || nameLower.includes('crossbody')) overrideType = 'sling';
          if (nameLower.includes('máy ảnh') || nameLower.includes('camera')) overrideType = 'camera';
          return {
            ...p,
            type: overrideType,
            brand: overrideBrand,
            price: parseInt(p.price, 10) || 0,
            original_price: p.original_price ? (parseInt(p.original_price, 10) || 0) : undefined
          };
        });
        
        setProducts(normalized);
        setLoading(false);
        return; // Success, exit loop
      } catch (err) {
        console.warn(`Fetch attempt ${i + 1} failed:`, err);
        if (i === retries - 1) {
          setError(err.name === 'AbortError' ? 'timeout' : 'network');
          setLoading(false);
        } else {
          // Wait before retrying (exponential backoff: 2s, 4s, etc.)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 2000));
        }
      }
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();

    const handleFilter = (e) => {
      if (e.detail.brand) setBrand(e.detail.brand);
      if (e.detail.type) setType(e.detail.type);
    };
    window.addEventListener('tph-filter', handleFilter);
    return () => window.removeEventListener('tph-filter', handleFilter);
  }, []);

  React.useEffect(() => {
    if (products.length > 0 && !window.__productModalOpened) {
      const match = window.location.pathname.match(/\/product-([a-zA-Z0-9_]+)\.html/);
      if (match) {
        window.__productModalOpened = true;
        const id = match[1];
        const p = products.find(x => String(x.id) === id || String(x.documentId) === id);
        if (p) {
          setSelectedProduct(p);
        }
      }
    }
  }, [products]);

  const getFirstImage = (p) => {
    if (p.image_url) return p.image_url;
    if (p.image) {
      const arr = Array.isArray(p.image) ? p.image : (p.image.data ? (Array.isArray(p.image.data) ? p.image.data : [p.image.data]) : [p.image]);
      for (const media of arr) {
        const url = media && (media.url || (media.attributes && media.attributes.url));
        if (url) return url.startsWith('/') ? `${window.ENV.API_URL}${url}` : url;
      }
    }
    return null;
  };

  const handleAdd = (p) => {
    const image = getFirstImage(p);
    setItems((arr) => [...arr, { name: p.name, color: p.brand, price: p.price, image }]);
    setCartOpen(true);
  };
  const handleRemove = (i) => setItems((arr) => arr.filter((_, j) => j !== i));
  const handleClear = () => { setBrand("all"); setType("all"); setSearch(""); };

  const filteredCount = products.filter(p =>
    (brand === "all" || p.brand === brand) &&
    (type === "all" || p.type === type) &&
    (!search.trim() || (p.name + ' ' + p.brand + ' ' + (Array.isArray(p.specs) ? p.specs.join(' ') : (p.specs && typeof p.specs === 'object' ? Object.values(p.specs).join(' ') : (p.specs || '')))).toLowerCase().includes(search.toLowerCase()))
  ).length;

  const scrollToShop = () => {
    const el = document.getElementById("shop");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isEn = lang === 'en';
  const t = {
    shopEye: isEn ? "01 — Shop" : "01 — Cửa hàng",
    shopTitle: isEn ? "Explore the Collection" : "Khám phá sản phẩm",
    shopSub: isEn ? "Every product here is available at our Quan Ngua store. Filter by brand, type, or just browse." : "Mọi sản phẩm trên trang này đều có sẵn tại cửa hàng Quần Ngựa. Lọc theo thương hiệu, phân loại hoặc chỉ cần lướt xem."
  };

  const handleViewProduct = (p) => {
    setSelectedProduct(p);
    if (p) window.history.pushState(null, '', `/product-${p.id}.html`);
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    window.history.pushState(null, '', '/');
  };

  return (
    <>
      <Nav
        onCartOpen={() => setCartOpen(true)} cartCount={items.length}
        searchValue={search} onSearchChange={setSearch}
        lang={lang} setLang={setLang}
      />

      <Hero onShopAll={scrollToShop} lang={lang} />

      <section id="shop" className="tph-shop">
        <div className="tph-shop-head">
          <div>
            <div className="tph-shop-eye">{t.shopEye}</div>
            <h2 className="tph-shop-title">{t.shopTitle}</h2>
          </div>
          <p className="tph-shop-sub">{t.shopSub}</p>
        </div>

        <BrandTabs selected={brand} onSelect={setBrand} lang={lang} />
        <TypeFilters
          selected={type}
          onSelect={setType}
          resultCount={filteredCount}
          sort={sort}
          onSort={setSort}
          lang={lang}
        />
        <ProductGrid
          products={products}
          brand={brand}
          type={type}
          search={search}
          sort={sort}
          onAdd={handleAdd}
          onView={handleViewProduct}
          onClearFilters={handleClear}
          loading={loading}
          error={error}
          onRetry={() => fetchProducts()}
          lang={lang}
        />
      </section>

      <StoreInfo lang={lang} />
      
      <Faq open={faqOpen} onClose={() => setFaqOpen(false)} lang={lang} />

      <Footer onOpenFaq={() => setFaqOpen(true)} lang={lang} />

      <CartDrawer
        open={cartOpen}
        items={items}
        onClose={() => setCartOpen(false)}
        onRemove={handleRemove}
        lang={lang}
      />

      <ProductModal
        product={selectedProduct}
        onClose={handleCloseProduct}
        onAdd={handleAdd}
        lang={lang}
      />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ErrorBoundary><App /></ErrorBoundary>);
