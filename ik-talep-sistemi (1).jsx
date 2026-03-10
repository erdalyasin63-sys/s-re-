import { useState } from "react";

const CATEGORIES = {
  zimmet: {
    label: "Zimmet",
    icon: "📦",
    color: "#E8572A",
    fields: ["Ekipman Türü", "Marka/Model", "Seri No (varsa)", "Teslim Tarihi", "Açıklama"],
    statuses: ["Beklemede", "Onaylandı", "Teslim Edildi", "İade Edildi"],
  },
  vize: {
    label: "Vize & Seyahat",
    icon: "✈️",
    color: "#2A7BE8",
    fields: ["Gidilecek Ülke", "Seyahat Tarihi", "Dönüş Tarihi", "Amaç", "Konaklama Gerekiyor mu?"],
    statuses: ["Beklemede", "Belgeler İstendi", "Onaylandı", "Reddedildi"],
  },
  bordro: {
    label: "Bordro & Maaş",
    icon: "💰",
    color: "#2AE88C",
    fields: ["Talep Türü", "İlgili Dönem", "Tutar (varsa)", "IBAN", "Açıklama"],
    statuses: ["Beklemede", "İnceleniyor", "İşleme Alındı", "Tamamlandı"],
  },
  destek: {
    label: "Destek / IT",
    icon: "🛠️",
    color: "#C72AE8",
    fields: ["Sorun Türü", "Kullanılan Cihaz", "İşletim Sistemi", "Hata Mesajı", "Öncelik"],
    statuses: ["Beklemede", "Atandı", "Çözüm Sürecinde", "Çözüldü"],
  },
};

const PRIORITY = ["Düşük", "Normal", "Yüksek", "Kritik"];

const MOCK_REQUESTS = [
  { id: 1, category: "zimmet", title: "MacBook Pro Talebi", requester: "Ayşe Kaya", date: "2024-03-01", status: "Onaylandı", priority: "Normal", fields: {} },
  { id: 2, category: "vize", title: "Almanya İş Vizesi", requester: "Mehmet Demir", date: "2024-03-05", status: "Belgeler İstendi", priority: "Yüksek", fields: {} },
  { id: 3, category: "bordro", title: "Avans Talebi", requester: "Zeynep Arslan", date: "2024-03-07", status: "Tamamlandı", priority: "Normal", fields: {} },
  { id: 4, category: "destek", title: "VPN Bağlantı Sorunu", requester: "Can Yıldız", date: "2024-03-08", status: "Çözüm Sürecinde", priority: "Yüksek", fields: {} },
  { id: 5, category: "zimmet", title: "Monitör Talebi", requester: "Elif Şahin", date: "2024-03-09", status: "Beklemede", priority: "Düşük", fields: {} },
  { id: 6, category: "vize", title: "ABD Seyahati", requester: "Burak Çelik", date: "2024-03-10", status: "Beklemede", priority: "Kritik", fields: {} },
];

const statusColor = {
  "Beklemede": "#F59E0B",
  "Onaylandı": "#10B981",
  "Teslim Edildi": "#3B82F6",
  "İade Edildi": "#6B7280",
  "Belgeler İstendi": "#F59E0B",
  "Reddedildi": "#EF4444",
  "İnceleniyor": "#8B5CF6",
  "İşleme Alındı": "#3B82F6",
  "Tamamlandı": "#10B981",
  "Atandı": "#3B82F6",
  "Çözüm Sürecinde": "#8B5CF6",
  "Çözüldü": "#10B981",
};

const priorityColor = {
  "Düşük": "#6B7280",
  "Normal": "#3B82F6",
  "Yüksek": "#F59E0B",
  "Kritik": "#EF4444",
};

export default function App() {
  const [view, setView] = useState("dashboard");
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newRequest, setNewRequest] = useState({ category: "", title: "", priority: "Normal", requester: "", fields: {} });
  const [formStep, setFormStep] = useState(1);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const stats = Object.entries(CATEGORIES).map(([key, cat]) => ({
    key,
    label: cat.label,
    icon: cat.icon,
    color: cat.color,
    count: requests.filter((r) => r.category === key).length,
    pending: requests.filter((r) => r.category === key && r.status === "Beklemede").length,
  }));

  const filtered = requests.filter((r) => {
    const catOk = filterCat === "all" || r.category === filterCat;
    const statusOk = filterStatus === "all" || r.status === filterStatus;
    return catOk && statusOk;
  });

  const submitRequest = () => {
    const nr = {
      ...newRequest,
      id: requests.length + 1,
      date: new Date().toISOString().split("T")[0],
      status: "Beklemede",
    };
    setRequests([nr, ...requests]);
    setShowNewForm(false);
    setNewRequest({ category: "", title: "", priority: "Normal", requester: "", fields: {} });
    setFormStep(1);
    showToast("Talebiniz başarıyla oluşturuldu!");
    setView("list");
  };

  const updateStatus = (id, status) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast("Durum güncellendi.");
  };

  const allStatuses = [...new Set(Object.values(CATEGORIES).flatMap((c) => c.statuses))];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0F0F13", minHeight: "100vh", color: "#E8E8F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #1A1A22; } ::-webkit-scrollbar-thumb { background: #333345; border-radius: 3px; }
        .nav-btn { background: none; border: none; color: #888; cursor: pointer; padding: 10px 16px; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 500; transition: all .2s; display: flex; align-items: center; gap: 8px; }
        .nav-btn:hover { background: #1E1E2A; color: #E8E8F0; }
        .nav-btn.active { background: #1E1E2A; color: #fff; }
        .card { background: #16161E; border: 1px solid #22222E; border-radius: 16px; padding: 24px; transition: all .2s; }
        .card:hover { border-color: #33334A; }
        .stat-card { cursor: pointer; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 16px 16px 0 0; }
        .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: .5px; }
        .btn { border: none; cursor: pointer; font-family: inherit; font-weight: 600; border-radius: 10px; transition: all .2s; }
        .btn-primary { background: #4F46E5; color: #fff; padding: 10px 20px; font-size: 14px; }
        .btn-primary:hover { background: #4338CA; transform: translateY(-1px); }
        .btn-ghost { background: #1E1E2A; color: #AAA; padding: 8px 16px; font-size: 13px; }
        .btn-ghost:hover { background: #252535; color: #E8E8F0; }
        .input { background: #1A1A24; border: 1px solid #2A2A38; border-radius: 10px; color: #E8E8F0; padding: 10px 14px; font-family: inherit; font-size: 14px; width: 100%; transition: border .2s; }
        .input:focus { outline: none; border-color: #4F46E5; }
        select.input option { background: #1A1A24; }
        .row-item { display: grid; grid-template-columns: 1fr 140px 120px 100px 120px 80px; gap: 12px; align-items: center; padding: 14px 20px; border-radius: 12px; border: 1px solid #1E1E2A; margin-bottom: 8px; background: #13131A; transition: all .2s; cursor: pointer; }
        .row-item:hover { border-color: #2E2E42; background: #16161E; }
        .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.7); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; }
        .modal { background: #16161E; border: 1px solid #2A2A3A; border-radius: 20px; padding: 32px; width: 540px; max-width: 95vw; max-height: 85vh; overflow-y: auto; }
        .step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: all .3s; }
        .toast { position: fixed; bottom: 24px; right: 24px; background: #16161E; border: 1px solid #2A2A3A; border-radius: 12px; padding: 14px 20px; z-index: 999; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; animation: slideIn .3s ease; }
        @keyframes slideIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .cat-pill { border: 1px solid; border-radius: 10px; padding: 8px 14px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all .2s; background: none; font-family: inherit; }
        .timeline-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
      `}</style>

      {/* Sidebar */}
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div style={{ width: 220, background: "#0C0C10", borderRight: "1px solid #1A1A24", padding: "24px 12px", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0 }}>
          <div style={{ padding: "0 8px 28px" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>İK Portal</div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>Talep Yönetim Sistemi</div>
          </div>

          {[
            { id: "dashboard", label: "Dashboard", icon: "◈" },
            { id: "list", label: "Talepler", icon: "☰" },
          ].map((n) => (
            <button key={n.id} className={`nav-btn ${view === n.id ? "active" : ""}`} onClick={() => setView(n.id)} style={{ width: "100%", justifyContent: "flex-start", marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span> {n.label}
            </button>
          ))}

          <div style={{ borderTop: "1px solid #1A1A24", margin: "16px 0 12px", paddingTop: 16 }}>
            <div style={{ fontSize: 10, color: "#444", padding: "0 8px", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Kategoriler</div>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button key={key} className={`nav-btn ${activeCategory === key ? "active" : ""}`} onClick={() => { setActiveCategory(key === activeCategory ? null : key); setFilterCat(key === activeCategory ? "all" : key); setView("list"); }} style={{ width: "100%", justifyContent: "flex-start", marginBottom: 2 }}>
                <span>{cat.icon}</span> {cat.label}
                <span style={{ marginLeft: "auto", fontSize: 11, color: cat.color, background: cat.color + "22", padding: "1px 7px", borderRadius: 20 }}>
                  {requests.filter((r) => r.category === key).length}
                </span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: "auto" }}>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 6 }} onClick={() => setShowNewForm(true)}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Yeni Talep
            </button>
          </div>
        </div>

        {/* Main */}
        <div style={{ marginLeft: 220, flex: 1, padding: "32px" }}>

          {view === "dashboard" && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>Genel Bakış</div>
                <div style={{ color: "#666", marginTop: 4, fontSize: 14 }}>{new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
              </div>

              {/* Summary strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Toplam Talep", value: requests.length, sub: "Tüm kategoriler", color: "#4F46E5" },
                  { label: "Bekleyen", value: requests.filter((r) => r.status === "Beklemede").length, sub: "Aksiyon gerektiriyor", color: "#F59E0B" },
                  { label: "Bu Hafta", value: requests.filter((r) => r.date >= "2024-03-07").length, sub: "Yeni talep", color: "#10B981" },
                ].map((s) => (
                  <div key={s.label} className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: s.color, fontWeight: 800 }}>{s.value}</div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{s.value}</div>
                      <div style={{ fontSize: 13, color: "#888" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 28 }}>
                {stats.map((s) => (
                  <div key={s.key} className="card stat-card" style={{ cursor: "pointer" }} onClick={() => { setFilterCat(s.key); setView("list"); }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: "16px 16px 0 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{s.label}</div>
                        <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{s.count} toplam talep</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.count}</div>
                        {s.pending > 0 && (
                          <div style={{ fontSize: 11, color: "#F59E0B", background: "#F59E0B22", padding: "2px 8px", borderRadius: 20, marginTop: 4 }}>
                            {s.pending} beklemede
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: 16, height: 4, background: "#1A1A24", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min((s.count / requests.length) * 100, 100)}%`, background: s.color, borderRadius: 2, transition: "width 1s" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent */}
              <div className="card">
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#fff" }}>Son Talepler</div>
                {requests.slice(0, 5).map((r) => {
                  const cat = CATEGORIES[r.category];
                  return (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1A1A24" }} onClick={() => { setSelectedRequest(r); }} className="row-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 10, marginBottom: 6, background: "#0F0F13", border: "1px solid #1A1A24", cursor: "pointer", transition: "all .2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 20 }}>{cat.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#E0E0F0" }}>{r.title}</div>
                          <div style={{ fontSize: 11, color: "#666" }}>{r.requester} · {r.date}</div>
                        </div>
                      </div>
                      <span className="badge" style={{ background: (statusColor[r.status] || "#888") + "22", color: statusColor[r.status] || "#888" }}>{r.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === "list" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff" }}>Talepler</div>
                  <div style={{ color: "#666", fontSize: 13, marginTop: 2 }}>{filtered.length} talep listeleniyor</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowNewForm(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 18 }}>+</span> Yeni Talep
                </button>
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                {[{ key: "all", label: "Tümü" }, ...Object.entries(CATEGORIES).map(([k, v]) => ({ key: k, label: v.icon + " " + v.label }))].map((f) => (
                  <button key={f.key} onClick={() => setFilterCat(f.key)} style={{ background: filterCat === f.key ? "#4F46E5" : "#1A1A24", color: filterCat === f.key ? "#fff" : "#888", border: "1px solid " + (filterCat === f.key ? "#4F46E5" : "#2A2A38"), borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 500, transition: "all .2s" }}>
                    {f.label}
                  </button>
                ))}
                <select className="input" style={{ width: "auto", marginLeft: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">Tüm Durumlar</option>
                  {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 120px 100px 120px 80px", gap: 12, padding: "8px 20px", fontSize: 11, color: "#555", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>
                <span>Talep</span><span>Başvuran</span><span>Kategori</span><span>Öncelik</span><span>Durum</span><span>Tarih</span>
              </div>

              {filtered.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: 48, color: "#666" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                  <div>Bu filtreye uygun talep bulunamadı.</div>
                </div>
              ) : filtered.map((r) => {
                const cat = CATEGORIES[r.category];
                return (
                  <div key={r.id} className="row-item" onClick={() => setSelectedRequest(r)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{cat.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#E0E0F0" }}>{r.title}</div>
                        <div style={{ fontSize: 11, color: "#555" }}>#{r.id}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: "#AAA" }}>{r.requester}</div>
                    <span className="badge" style={{ background: cat.color + "18", color: cat.color }}>{cat.label}</span>
                    <span className="badge" style={{ background: (priorityColor[r.priority] || "#888") + "22", color: priorityColor[r.priority] || "#888" }}>{r.priority}</span>
                    <span className="badge" style={{ background: (statusColor[r.status] || "#888") + "22", color: statusColor[r.status] || "#888" }}>{r.status}</span>
                    <div style={{ fontSize: 12, color: "#555" }}>{r.date}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (() => {
        const r = selectedRequest;
        const cat = CATEGORIES[r.category];
        return (
          <div className="modal-bg" onClick={() => setSelectedRequest(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 28 }}>{cat.icon}</span>
                    <span className="badge" style={{ background: cat.color + "22", color: cat.color, fontSize: 12 }}>{cat.label}</span>
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>#{r.id} · {r.requester} · {r.date}</div>
                </div>
                <button onClick={() => setSelectedRequest(null)} style={{ background: "#1E1E2A", border: "none", color: "#888", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div style={{ background: "#0F0F13", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Durum</div>
                  <span className="badge" style={{ background: (statusColor[r.status] || "#888") + "22", color: statusColor[r.status] || "#888", fontSize: 13 }}>{r.status}</span>
                </div>
                <div style={{ background: "#0F0F13", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Öncelik</div>
                  <span className="badge" style={{ background: (priorityColor[r.priority] || "#888") + "22", color: priorityColor[r.priority] || "#888", fontSize: 13 }}>{r.priority}</span>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#888", marginBottom: 10 }}>Durumu Güncelle</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {cat.statuses.map((s) => (
                    <button key={s} onClick={() => { updateStatus(r.id, s); setSelectedRequest({ ...r, status: s }); }} style={{ background: r.status === s ? (statusColor[s] || "#4F46E5") : "#1A1A24", color: r.status === s ? "#fff" : "#888", border: "1px solid " + (r.status === s ? (statusColor[s] || "#4F46E5") : "#2A2A38"), borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 500, transition: "all .2s" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: "#0F0F13", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Süreç Akışı</div>
                {cat.statuses.map((s, i) => {
                  const isDone = cat.statuses.indexOf(r.status) >= i;
                  return (
                    <div key={s} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: i < cat.statuses.length - 1 ? 16 : 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: isDone ? (statusColor[s] || "#4F46E5") : "#2A2A38", marginTop: 3, transition: "background .3s", flexShrink: 0 }} />
                        {i < cat.statuses.length - 1 && <div style={{ width: 1, flex: 1, background: isDone ? "#2A3A2A" : "#1A1A24", marginTop: 4 }} />}
                      </div>
                      <div style={{ fontSize: 13, color: isDone ? "#E0E0F0" : "#444", fontWeight: isDone ? 500 : 400, paddingBottom: 4 }}>{s}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* New Request Modal */}
      {showNewForm && (
        <div className="modal-bg" onClick={() => { setShowNewForm(false); setFormStep(1); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>Yeni Talep Oluştur</div>
              <button onClick={() => { setShowNewForm(false); setFormStep(1); }} style={{ background: "#1E1E2A", border: "none", color: "#888", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            {/* Steps */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              {["Kategori", "Detaylar", "Öncelik"].map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="step-dot" style={{ background: formStep > i + 1 ? "#10B981" : formStep === i + 1 ? "#4F46E5" : "#1E1E2A", color: formStep >= i + 1 ? "#fff" : "#555", border: "2px solid " + (formStep >= i + 1 ? (formStep > i + 1 ? "#10B981" : "#4F46E5") : "#2A2A38") }}>
                    {formStep > i + 1 ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: formStep === i + 1 ? "#E0E0F0" : "#555", fontWeight: formStep === i + 1 ? 600 : 400 }}>{label}</span>
                  {i < 2 && <div style={{ width: 24, height: 1, background: "#2A2A38" }} />}
                </div>
              ))}
            </div>

            {formStep === 1 && (
              <div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>Talep türünü seçin:</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <div key={key} onClick={() => setNewRequest({ ...newRequest, category: key })} style={{ padding: 16, borderRadius: 12, border: "2px solid " + (newRequest.category === key ? cat.color : "#2A2A38"), background: newRequest.category === key ? cat.color + "15" : "#0F0F13", cursor: "pointer", transition: "all .2s" }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: newRequest.category === key ? cat.color : "#CCC" }}>{cat.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn btn-primary" disabled={!newRequest.category} onClick={() => setFormStep(2)} style={{ opacity: newRequest.category ? 1 : 0.4 }}>Devam →</button>
                </div>
              </div>
            )}

            {formStep === 2 && newRequest.category && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: "#888", marginBottom: 6, display: "block" }}>Talep Başlığı *</label>
                  <input className="input" placeholder="Kısa bir başlık girin..." value={newRequest.title} onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: "#888", marginBottom: 6, display: "block" }}>Adınız *</label>
                  <input className="input" placeholder="Ad Soyad" value={newRequest.requester} onChange={(e) => setNewRequest({ ...newRequest, requester: e.target.value })} />
                </div>
                {CATEGORIES[newRequest.category].fields.map((field) => (
                  <div key={field} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: "#888", marginBottom: 6, display: "block" }}>{field}</label>
                    <input className="input" placeholder={field + " girin..."} value={newRequest.fields[field] || ""} onChange={(e) => setNewRequest({ ...newRequest, fields: { ...newRequest.fields, [field]: e.target.value } })} />
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button className="btn btn-ghost" onClick={() => setFormStep(1)}>← Geri</button>
                  <button className="btn btn-primary" disabled={!newRequest.title || !newRequest.requester} onClick={() => setFormStep(3)} style={{ opacity: newRequest.title && newRequest.requester ? 1 : 0.4 }}>Devam →</button>
                </div>
              </div>
            )}

            {formStep === 3 && (
              <div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>Talep önceliğini belirleyin:</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                  {PRIORITY.map((p) => (
                    <div key={p} onClick={() => setNewRequest({ ...newRequest, priority: p })} style={{ padding: 14, borderRadius: 10, border: "2px solid " + (newRequest.priority === p ? (priorityColor[p] || "#4F46E5") : "#2A2A38"), background: newRequest.priority === p ? (priorityColor[p] || "#4F46E5") + "15" : "#0F0F13", cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: priorityColor[p] || "#888" }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: newRequest.priority === p ? (priorityColor[p] || "#fff") : "#AAA" }}>{p}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#0F0F13", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Özet</div>
                  <div style={{ fontSize: 13, color: "#888" }}>Kategori: <span style={{ color: CATEGORIES[newRequest.category].color }}>{CATEGORIES[newRequest.category].label}</span></div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Başlık: <span style={{ color: "#E0E0F0" }}>{newRequest.title}</span></div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Başvuran: <span style={{ color: "#E0E0F0" }}>{newRequest.requester}</span></div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button className="btn btn-ghost" onClick={() => setFormStep(2)}>← Geri</button>
                  <button className="btn btn-primary" onClick={submitRequest}>✓ Talebi Gönder</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast">
          <span style={{ color: "#10B981", fontSize: 16 }}>✓</span>
          <span style={{ fontSize: 14 }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
