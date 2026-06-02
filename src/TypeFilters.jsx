import React from 'react';
const TYPES = [
  { id: "all",         name: "Tất cả sản phẩm" },
  { id: "backpacks",   name: "Balo" },
  { id: "duffel",      name: "Túi xách (Duffel)" },
  { id: "luggage",     name: "Vali" },
  { id: "daypacks",    name: "Balo Mô Tô" },
  { id: "laptop-bags", name: "Túi laptop" },
  { id: "sling",       name: "Túi đeo chéo / bao tử" },
  { id: "camera",      name: "Túi máy ảnh" },
  { id: "accessory",   name: "Phụ kiện" },
];

function TypeFilters({ selected, onSelect, resultCount, sort, onSort, lang }) {
  const isEn = lang === 'en';
  
  const TYPE_NAMES = {
    "all": isEn ? "All products" : "Tất cả sản phẩm",
    "backpacks": isEn ? "Backpacks" : "Balo",
    "duffel": isEn ? "Duffel" : "Túi xách/ túi du lịch",
    "luggage": isEn ? "Luggage" : "Vali",
    "daypacks": isEn ? "Motorbike Backpacks" : "Balo Mô Tô",
    "laptop-bags": isEn ? "Laptop bags" : "Túi laptop",
    "sling": isEn ? "Sling / Fanny bags" : "Túi đeo chéo / bao tử",
    "camera": isEn ? "Camera bags" : "Túi máy ảnh",
    "accessory": isEn ? "Accessories" : "Phụ kiện"
  };

  const t = {
    pieces: isEn ? (resultCount === 1 ? "piece" : "pieces") : "sản phẩm",
    sortLbl: isEn ? "Sort" : "Sắp xếp",
    featured: isEn ? "Featured" : "Nổi bật",
    priceAsc: isEn ? "Price · low to high" : "Giá · thấp đến cao",
    priceDesc: isEn ? "Price · high to low" : "Giá · cao xuống thấp",
    newest: isEn ? "Newest in store" : "Mới nhất"
  };

  return (
    <div className="tph-filter-bar">
      <div className="tph-chips" role="tablist" aria-label="Filter by product type">
        {TYPES.map((tObj) => {
          const typeHrefs = {
            "all": "/",
            "backpacks": "/balo.html",
            "duffel": "/tui-xach.html",
            "luggage": "/vali.html",
            "daypacks": "/balo-mo-to.html",
            "laptop-bags": "/tui-laptop.html",
            "sling": "/tui-deo-cheo.html",
            "camera": "/tui-may-anh.html",
            "accessory": "/phu-kien.html"
          };
          const href = typeHrefs[tObj.id] || "/";
          return (
            <a
              key={tObj.id}
              href={href}
              role="tab"
              aria-selected={selected === tObj.id}
              className={"tph-chip" + (selected === tObj.id ? " on" : "")}
              onClick={(e) => { e.preventDefault(); onSelect(tObj.id); }}
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              {TYPE_NAMES[tObj.id]}
            </a>
          );
        })}
      </div>
      <div className="tph-filter-right">
        <span className="tph-result-count">{resultCount} {t.pieces}</span>
        <label className="tph-sort">
          <span className="tph-sort-lbl">{t.sortLbl}</span>
          <select value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Sort products">
            <option value="featured">{t.featured}</option>
            <option value="price-asc">{t.priceAsc}</option>
            <option value="price-desc">{t.priceDesc}</option>
            <option value="newest">{t.newest}</option>
          </select>
        </label>
      </div>
    </div>
  );
}

window.TYPES = TYPES;
export default TypeFilters;
