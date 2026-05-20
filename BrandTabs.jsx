const BRANDS = [
  { id: "all",        name: "all",         cls: "" },
  { id: "thule",      name: "THULE",       cls: "thule-glyph", origin: "Sweden · 1942" },
  { id: "case-logic", name: "CASE LOGIC",  cls: "cl-glyph",    origin: "USA · 1984" },
  { id: "alpaka",     name: "ALPAKA",      cls: "alpaka-glyph", origin: "Australia · 2016", link: "https://alpakagear.com/" },
  { id: "bamkel",     name: "BAMKEL",      cls: "bamkel-glyph", origin: "South Korea", link: "https://www.bamkel.com/" },
];

function BrandTabs({ selected, onSelect, lang }) {
  const isEn = lang === 'en';
  return (
    <div className="tph-brand-tabs" role="tablist" aria-label="Filter by brand">
      {BRANDS.map((b) => {
        const isActive = selected === b.id;
        return (
          <button
            key={b.id}
            role="tab"
            aria-selected={isActive}
            className={"tph-brand-tab" + (isActive ? " active" : "")}
            onClick={() => onSelect(b.id)}
          >
            <span className={"tph-brand-glyph " + b.cls}>{b.id === 'all' ? (isEn ? "All Brands" : "Tất cả") : b.name}</span>
            {b.origin && <span className="tph-brand-origin">{b.origin}</span>}
            {!b.origin && <span className="tph-brand-origin">{isEn ? "Show everything" : "Xem tất cả"}</span>}
          </button>
        );
      })}
    </div>
  );
}

window.BRANDS = BRANDS;
window.BrandTabs = BrandTabs;
