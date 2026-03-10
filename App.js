import { useState } from "react";

// ─── SABIT VERİLER ───────────────────────────────────────────────────────────

const USERS = [
  { id: 1, name: "İK Admin", email: "admin@sirket.com", password: "admin123", role: "admin" },
  { id: 2, name: "Ayşe Kaya", email: "ayse@sirket.com", password: "123456", role: "employee", department: "Pazarlama" },
  { id: 3, name: "Mehmet Demir", email: "mehmet@sirket.com", password: "123456", role: "employee", department: "Yazılım" },
  { id: 4, name: "Zeynep Arslan", email: "zeynep@sirket.com", password: "123456", role: "employee", department: "Finans" },
  { id: 5, name: "Can Yıldız", email: "can@sirket.com", password: "123456", role: "employee", department: "Operasyon" },
];

const CATEGORIES = {
  zimmet: { label: "Zimmet", icon: "📦", color: "#F97316", fields: ["Ekipman Türü", "Marka / Model", "Seri No (varsa)", "Açıklama"] },
  vize: { label: "Vize & Seyahat", icon: "✈️", color: "#3B82F6", fields: ["Gidilecek Ülke", "Seyahat Tarihi", "Dönüş Tarihi", "Seyahat Amacı"] },
  bordro: { label: "Bordro & Maaş", icon: "💰", color: "#10B981", fields: ["Talep Türü", "İlgili Dönem", "IBAN", "Açıklama"] },
  destek: { label: "Destek / IT", icon: "🛠️", color: "#8B5CF6", fields: ["Sorun Türü", "Cihaz Adı", "Hata Mesajı", "Öncelik Durumu"] },
};

const STATUS_FLOW = {
  zimmet: ["Beklemede", "İnceleniyor", "Onaylandı", "Teslim Edildi", "Reddedildi"],
  vize: ["Beklemede", "Belgeler İstendi", "İşlemde", "Onaylandı", "Reddedildi"],
  bordro: ["Beklemede", "İnceleniyor", "İşleme Alındı", "Tamamlandı", "Reddedildi"],
  destek: ["Beklemede", "Atandı", "Çözüm Sürecinde", "Çözüldü", "Reddedildi"],
};

const STATUS_COLOR = {
  "Beklemede": "#F59E0B",
  "İnceleniyor": "#3B82F6",
  "Onaylandı": "#10B981",
  "Teslim Edildi": "#10B981",
  "Reddedildi": "#EF4444",
  "Belgeler İstendi": "#F59E0B",
  "İşlemde": "#3B82F6",
  "İşleme Alındı": "#3B82F6",
  "Tamamlandı": "#10B981",
  "Atandı": "#3B82F6",
  "Çözüm Sürecinde": "#8B5CF6",
  "Çözüldü": "#10B981",
};

const INITIAL_REQUESTS = [
  { id: 1, userId: 2, category: "zimmet", title: "MacBook Pro Talebi", status: "Onaylandı", priority: "Normal", date: "2024-03-01", fields: { "Ekipman Türü": "Laptop", "Marka / Model": "MacBook Pro 14\"", "Seri No (varsa)": "-", "Açıklama": "Mevcut cihazım yavaşladı." }, adminNote: "Onaylandı, IT departmanına iletildi." },
  { id: 2, userId: 3, category: "vize", title: "Almanya İş Vizesi", status: "Belgeler İstendi", priority: "Yüksek", date: "2024-03-05", fields: { "Gidilecek Ülke": "Almanya", "Seyahat Tarihi": "2024-04-10", "Dönüş Tarihi": "2024-04-17", "Seyahat Amacı": "Müşteri toplantısı" }, adminNote: "Pasaport fotokopisi ve davet mektubu bekleniyor." },
  { id: 3, userId: 4, category: "bordro", title: "Avans Talebi", status: "Tamamlandı", priority: "Normal", date: "2024-03-07", fields: { "Talep Türü": "Maaş Avansı", "İlgili Dönem": "Mart 2024", "IBAN": "TR12 0000 0000 0000 0000 0000 00", "Açıklama": "Acil ihtiyaç." }, adminNote: "Ödeme gerçekleştirildi." },
  { id: 4, userId: 5, category: "destek", title: "VPN Bağlantı Sorunu", status: "Çözüm Sürecinde", priority: "Yüksek", date: "2024-03-08", fields: { "Sorun Türü": "Ağ / Bağlantı", "Cihaz Adı": "DESKTOP-CAN01", "Hata Mesajı": "Authentication failed", "Öncelik Durumu": "Yüksek" }, adminNote: "" },
  { id: 5, userId: 2, category: "zimmet", title: "Monitör Talebi", status: "Beklemede", priority: "Düşük", date: "2024-03-09", fields: { "Ekipman Türü": "Monitör", "Marka / Model": "Dell 27\"", "Seri No (varsa)": "-", "Açıklama": "İkinci monitör ihtiyacı." }, adminNote: "" },
];

// ─── YARDIMCI BİLEŞENLER ─────────────────────────────────────────────────────

const Badge = ({ text, color }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, background: (color || "#888") + "22", color: color || "#888", border: `1px solid ${(color || "#888")}33` }}>
    {text}
  </span>
);

const Toast = ({ msg }) => (
  <div style={{ position: "fixed", bottom: 28, right: 28, background: "#1C1C28", border: "1px solid #2E2E42", borderRadius: 12, padding: "14px 20px", zIndex: 9999, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,.5)", animation: "slideUp .3s ease" }}>
    <span style={{ color: "#10B981", fontSize: 18 }}>✓</span>
    <span style={{ fontSize: 14, color: "#E0E0F0" }}>{msg}</span>
  </div>
);

// ─── GİRİŞ EKRANI ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = USERS.find(u => u.email === email && u.password === password);
      if (user) { onLogin(user); }
      else { setError("E-posta veya şifre hatalı."); setLoading(false); }
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A10", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .login-input { width: 100%; background: #13131C; border: 1.5px solid #22222E; border-radius: 10px; color: #E0E0F0; padding: 13px 16px; font-family: inherit; font-size: 14px; transition: border .2s; outline: none; }
        .login-input:focus { border-color: #4F46E5; }
        .demo-pill { background: #13131C; border: 1px solid #22222E; border-radius: 8px; padding: 8px 12px; cursor: pointer; transition: all .15s; font-size: 12px; color: #888; font-family: inherit; }
        .demo-pill:hover { border-color: #4F46E5; color: #A5A3FF; background: #16162A; }
      `}</style>

      <div style={{ width: 420, animation: "fadeIn .5s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", borderRadius: 16, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🏢</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>İK Portal</div>
          <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>Talep Yönetim Sistemi</div>
        </div>

        {/* Kart */}
        <div style={{ background: "#10101A", border: "1px solid #1E1E2E", borderRadius: 20, padding: 32 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Giriş Yap</div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6, fontWeight: 500 }}>E-posta</div>
            <input className="login-input" type="email" placeholder="ornek@sirket.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6, fontWeight: 500 }}>Şifre</div>
            <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>

          {error && <div style={{ background: "#EF444422", border: "1px solid #EF444444", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#EF4444", marginBottom: 16 }}>{error}</div>}

          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", background: "linear-gradient(135deg, #4F46E5, #7C3AED)", border: "none", color: "#fff", padding: "13px", borderRadius: 10, fontFamily: "inherit", fontWeight: 700, fontSize: 14, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1, transition: "all .2s" }}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

          {/* Demo hesaplar */}
          <div style={{ marginTop: 24, borderTop: "1px solid #1A1A28", paddingTop: 20 }}>
            <div style={{ fontSize: 11, color: "#444", marginBottom: 10, textAlign: "center", textTransform: "uppercase", letterSpacing: 0.8 }}>Demo Hesaplar</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button className="demo-pill" onClick={() => { setEmail("admin@sirket.com"); setPassword("admin123"); }}>
                👑 Admin (İK)
              </button>
              <button className="demo-pill" onClick={() => { setEmail("ayse@sirket.com"); setPassword("123456"); }}>
                👤 Ayşe (Çalışan)
              </button>
              <button className="demo-pill" onClick={() => { setEmail("mehmet@sirket.com"); setPassword("123456"); }}>
                👤 Mehmet (Çalışan)
              </button>
              <button className="demo-pill" onClick={() => { setEmail("zeynep@sirket.com"); setPassword("123456"); }}>
                👤 Zeynep (Çalışan)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ÇALIŞAN PANELİ ───────────────────────────────────────────────────────────

function EmployeePanel({ user, requests, setRequests, onLogout, showToast }) {
  const myRequests = requests.filter(r => r.userId === user.id);
  const [view, setView] = useState("home");
  const [selectedReq, setSelectedReq] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ category: "", title: "", priority: "Normal", fields: {} });

  const submitRequest = () => {
    const nr = { id: requests.length + 1 + Date.now(), userId: user.id, ...form, status: "Beklemede", date: new Date().toISOString().split("T")[0], adminNote: "" };
    setRequests(prev => [nr, ...prev]);
    setView("home");
    setForm({ category: "", title: "", priority: "Normal", fields: {} });
    setStep(1);
    showToast("Talebiniz başarıyla gönderildi!");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A10", fontFamily: "'DM Sans', sans-serif", color: "#E0E0F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .e-input { width: 100%; background: #13131C; border: 1.5px solid #22222E; border-radius: 10px; color: #E0E0F0; padding: 11px 14px; font-family: inherit; font-size: 14px; transition: border .2s; outline: none; }
        .e-input:focus { border-color: #4F46E5; }
        .e-card { background: #10101A; border: 1px solid #1E1E2E; border-radius: 16px; padding: 20px; }
        .req-row { background: #10101A; border: 1px solid #1E1E2E; border-radius: 12px; padding: 16px 20px; margin-bottom: 10px; cursor: pointer; transition: all .18s; display: flex; justify-content: space-between; align-items: center; }
        .req-row:hover { border-color: #2E2E44; background: #13131E; }
        .nav-tab { background: none; border: none; color: #666; font-family: inherit; font-size: 14px; font-weight: 500; padding: 10px 20px; cursor: pointer; border-bottom: 2px solid transparent; transition: all .2s; }
        .nav-tab.active { color: #A5A3FF; border-bottom-color: #4F46E5; }
        .step-circle { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; transition: all .3s; }
        .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.75); backdrop-filter: blur(6px); z-index: 100; display: flex; align-items: center; justify-content: center; animation: fadeIn .2s; }
        .modal { background: #10101A; border: 1px solid #2A2A3E; border-radius: 20px; padding: 28px; width: 500px; max-width: 95vw; max-height: 85vh; overflow-y: auto; }
      `}</style>

      {/* Top bar */}
      <div style={{ background: "#0C0C14", borderBottom: "1px solid #1A1A28", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>İK Portal</div>
          <div style={{ width: 1, height: 20, background: "#1E1E2E" }} />
          {["home", "new"].map(v => (
            <button key={v} className={`nav-tab ${view === v ? "active" : ""}`} onClick={() => setView(v)}>
              {v === "home" ? "📋 Taleplerim" : "➕ Yeni Talep"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#E0E0F0" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#555" }}>{user.department}</div>
          </div>
          <button onClick={onLogout} style={{ background: "#1A1A26", border: "1px solid #2A2A38", color: "#888", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>Çıkış</button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>

        {/* ANA EKRAN */}
        {view === "home" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>Merhaba, {user.name.split(" ")[0]} 👋</div>
              <div style={{ color: "#555", fontSize: 14, marginTop: 4 }}>Taleplerinizin durumunu buradan takip edebilirsiniz.</div>
            </div>

            {/* Özet */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Toplam", value: myRequests.length, color: "#4F46E5" },
                { label: "Beklemede", value: myRequests.filter(r => r.status === "Beklemede" || r.status === "İnceleniyor" || r.status === "Atandı" || r.status === "İşlemde" || r.status === "Belgeler İstendi" || r.status === "Çözüm Sürecinde" || r.status === "İşleme Alındı").length, color: "#F59E0B" },
                { label: "Tamamlanan", value: myRequests.filter(r => ["Onaylandı", "Teslim Edildi", "Tamamlandı", "Çözüldü"].includes(r.status)).length, color: "#10B981" },
              ].map(s => (
                <div key={s.label} className="e-card" style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {myRequests.length === 0 ? (
              <div className="e-card" style={{ textAlign: "center", padding: 48 }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>📭</div>
                <div style={{ color: "#666", marginBottom: 16 }}>Henüz bir talebiniz yok.</div>
                <button onClick={() => setView("new")} style={{ background: "#4F46E5", border: "none", color: "#fff", borderRadius: 10, padding: "10px 24px", fontFamily: "inherit", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>İlk Talebimi Oluştur</button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 13, color: "#555", marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Taleplerim</div>
                {myRequests.map(r => {
                  const cat = CATEGORIES[r.category];
                  return (
                    <div key={r.id} className="req-row" onClick={() => setSelectedReq(r)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{ fontSize: 22 }}>{cat.icon}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#E0E0F0" }}>{r.title}</div>
                          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{cat.label} · {r.date}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Badge text={r.status} color={STATUS_COLOR[r.status]} />
                        <span style={{ color: "#444", fontSize: 16 }}>›</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* YENİ TALEP */}
        {view === "new" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>Yeni Talep</div>
            </div>

            {/* Adım göstergesi */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
              {["Kategori Seç", "Detayları Gir", "Onayla"].map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="step-circle" style={{ background: step > i + 1 ? "#10B981" : step === i + 1 ? "#4F46E5" : "#1A1A26", color: step >= i + 1 ? "#fff" : "#555", border: `2px solid ${step > i + 1 ? "#10B981" : step === i + 1 ? "#4F46E5" : "#2A2A38"}` }}>
                      {step > i + 1 ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: 12, color: step === i + 1 ? "#E0E0F0" : "#444", fontWeight: step === i + 1 ? 600 : 400, whiteSpace: "nowrap" }}>{label}</span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? "#10B98155" : "#1E1E2E", margin: "0 12px" }} />}
                </div>
              ))}
            </div>

            {/* Adım 1 */}
            {step === 1 && (
              <div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>Talep türünü seçin:</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <div key={key} onClick={() => setForm({ ...form, category: key })} style={{ padding: 20, borderRadius: 14, border: `2px solid ${form.category === key ? cat.color : "#1E1E2E"}`, background: form.category === key ? cat.color + "15" : "#10101A", cursor: "pointer", transition: "all .2s" }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>{cat.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: form.category === key ? cat.color : "#CCC" }}>{cat.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button disabled={!form.category} onClick={() => setStep(2)} style={{ background: form.category ? "#4F46E5" : "#1A1A26", border: "none", color: form.category ? "#fff" : "#555", borderRadius: 10, padding: "11px 24px", fontFamily: "inherit", fontWeight: 600, cursor: form.category ? "pointer" : "not-allowed", fontSize: 14 }}>
                    Devam →
                  </button>
                </div>
              </div>
            )}

            {/* Adım 2 */}
            {step === 2 && form.category && (
              <div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Talep Başlığı *</div>
                  <input className="e-input" placeholder="Kısa bir başlık..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                {CATEGORIES[form.category].fields.map(field => (
                  <div key={field} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{field}</div>
                    <input className="e-input" placeholder={field + "..."} value={form.fields[field] || ""} onChange={e => setForm({ ...form, fields: { ...form.fields, [field]: e.target.value } })} />
                  </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Öncelik</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Düşük", "Normal", "Yüksek", "Kritik"].map(p => {
                      const pc = { "Düşük": "#6B7280", "Normal": "#3B82F6", "Yüksek": "#F59E0B", "Kritik": "#EF4444" }[p];
                      return (
                        <button key={p} onClick={() => setForm({ ...form, priority: p })} style={{ background: form.priority === p ? pc + "33" : "#13131C", border: `1.5px solid ${form.priority === p ? pc : "#22222E"}`, color: form.priority === p ? pc : "#666", borderRadius: 8, padding: "7px 16px", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{p}</button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button onClick={() => setStep(1)} style={{ background: "#13131C", border: "1px solid #22222E", color: "#888", borderRadius: 10, padding: "11px 20px", fontFamily: "inherit", cursor: "pointer", fontSize: 14 }}>← Geri</button>
                  <button disabled={!form.title} onClick={() => setStep(3)} style={{ background: form.title ? "#4F46E5" : "#1A1A26", border: "none", color: form.title ? "#fff" : "#555", borderRadius: 10, padding: "11px 24px", fontFamily: "inherit", fontWeight: 600, cursor: form.title ? "pointer" : "not-allowed", fontSize: 14 }}>Devam →</button>
                </div>
              </div>
            )}

            {/* Adım 3 - Özet */}
            {step === 3 && (
              <div>
                <div className="e-card" style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: "#555", marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>Talep Özeti</div>
                  {[
                    ["Kategori", CATEGORIES[form.category]?.label],
                    ["Başlık", form.title],
                    ["Öncelik", form.priority],
                    ...Object.entries(form.fields).filter(([, v]) => v),
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1A1A28" }}>
                      <span style={{ fontSize: 13, color: "#666" }}>{k}</span>
                      <span style={{ fontSize: 13, color: "#E0E0F0", fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button onClick={() => setStep(2)} style={{ background: "#13131C", border: "1px solid #22222E", color: "#888", borderRadius: 10, padding: "11px 20px", fontFamily: "inherit", cursor: "pointer", fontSize: 14 }}>← Geri</button>
                  <button onClick={submitRequest} style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", border: "none", color: "#fff", borderRadius: 10, padding: "11px 28px", fontFamily: "inherit", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>✓ Talebi Gönder</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Talep Detay Modal */}
      {selectedReq && (() => {
        const r = selectedReq;
        const cat = CATEGORIES[r.category];
        const flow = STATUS_FLOW[r.category];
        const curIdx = flow.indexOf(r.status);
        return (
          <div className="modal-bg" onClick={() => setSelectedReq(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 24 }}>{cat.icon}</span>
                    <Badge text={cat.label} color={cat.color} />
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{r.date}</div>
                </div>
                <button onClick={() => setSelectedReq(null)} style={{ background: "#1A1A26", border: "none", color: "#888", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 18 }}>✕</button>
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <Badge text={r.status} color={STATUS_COLOR[r.status]} />
                <Badge text={r.priority} color={{ "Düşük": "#6B7280", "Normal": "#3B82F6", "Yüksek": "#F59E0B", "Kritik": "#EF4444" }[r.priority]} />
              </div>

              {/* Süreç */}
              <div style={{ background: "#0C0C14", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Talep Süreci</div>
                {flow.filter(s => s !== "Reddedildi").map((s, i) => {
                  const done = r.status === "Reddedildi" ? false : curIdx >= flow.indexOf(s);
                  const isCurrent = r.status === s;
                  return (
                    <div key={s} style={{ display: "flex", gap: 12, paddingBottom: i < flow.length - 2 ? 14 : 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: done ? (STATUS_COLOR[s] || "#4F46E5") : "#1E1E2E", border: `2px solid ${isCurrent ? (STATUS_COLOR[s] || "#4F46E5") : done ? (STATUS_COLOR[s] || "#4F46E5") + "88" : "#2A2A38"}`, marginTop: 2, transition: "all .3s", flexShrink: 0 }} />
                        {i < flow.length - 2 && <div style={{ width: 1, flex: 1, minHeight: 16, background: done ? "#2A3A2A" : "#1A1A26", marginTop: 3 }} />}
                      </div>
                      <div style={{ fontSize: 13, color: isCurrent ? "#E0E0F0" : done ? "#888" : "#444", fontWeight: isCurrent ? 700 : 400, paddingBottom: 4 }}>
                        {s} {isCurrent && <span style={{ color: STATUS_COLOR[s], fontSize: 11 }}>← Mevcut</span>}
                      </div>
                    </div>
                  );
                })}
                {r.status === "Reddedildi" && (
                  <div style={{ marginTop: 8, background: "#EF444422", border: "1px solid #EF444444", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#EF4444" }}>❌ Bu talep reddedildi.</div>
                )}
              </div>

              {/* Detaylar */}
              <div style={{ background: "#0C0C14", borderRadius: 12, padding: 16, marginBottom: r.adminNote ? 16 : 0 }}>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Talep Detayları</div>
                {Object.entries(r.fields).map(([k, v]) => v ? (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #13131C" }}>
                    <span style={{ fontSize: 12, color: "#666" }}>{k}</span>
                    <span style={{ fontSize: 12, color: "#AAA" }}>{v}</span>
                  </div>
                ) : null)}
              </div>

              {/* Admin notu */}
              {r.adminNote && (
                <div style={{ marginTop: 16, background: "#4F46E522", border: "1px solid #4F46E544", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 11, color: "#7C78D4", marginBottom: 6, fontWeight: 600 }}>💬 İK Notu</div>
                  <div style={{ fontSize: 13, color: "#A5A3FF" }}>{r.adminNote}</div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── ADMİN PANELİ ─────────────────────────────────────────────────────────────

function AdminPanel({ user, requests, setRequests, onLogout, showToast }) {
  const [view, setView] = useState("dashboard");
  const [selectedReq, setSelectedReq] = useState(null);
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [adminNote, setAdminNote] = useState("");

  const filtered = requests.filter(r => {
    const catOk = filterCat === "all" || r.category === filterCat;
    const statusOk = filterStatus === "all" || r.status === filterStatus;
    return catOk && statusOk;
  });

  const updateStatus = (id, status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, adminNote: adminNote || r.adminNote } : r));
    setSelectedReq(prev => prev ? { ...prev, status, adminNote: adminNote || prev.adminNote } : null);
    showToast("Durum güncellendi.");
  };

  const saveNote = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, adminNote } : r));
    setSelectedReq(prev => prev ? { ...prev, adminNote } : null);
    showToast("Not kaydedildi.");
  };

  const getUser = (userId) => USERS.find(u => u.id === userId);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "Beklemede").length,
    inProgress: requests.filter(r => !["Beklemede", "Onaylandı", "Teslim Edildi", "Tamamlandı", "Çözüldü", "Reddedildi"].includes(r.status)).length,
    done: requests.filter(r => ["Onaylandı", "Teslim Edildi", "Tamamlandı", "Çözüldü"].includes(r.status)).length,
    rejected: requests.filter(r => r.status === "Reddedildi").length,
  };

  const allStatuses = [...new Set(Object.values(STATUS_FLOW).flat())];

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A10", fontFamily: "'DM Sans', sans-serif", color: "#E0E0F0", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #0A0A10; } ::-webkit-scrollbar-thumb { background: #2A2A38; border-radius: 3px; }
        .a-nav { background: none; border: none; color: #666; font-family: inherit; font-size: 13px; font-weight: 500; padding: 10px 14px; cursor: pointer; border-radius: 9px; transition: all .15s; display: flex; align-items: center; gap: 8px; width: 100%; }
        .a-nav.active { background: #1A1A28; color: #E0E0F0; }
        .a-nav:hover { background: #141420; color: #CCC; }
        .a-card { background: #10101A; border: 1px solid #1E1E2E; border-radius: 14px; padding: 20px; }
        .a-input { width: 100%; background: #0D0D16; border: 1.5px solid #1E1E2E; border-radius: 9px; color: #E0E0F0; padding: 10px 13px; font-family: inherit; font-size: 13px; transition: border .2s; outline: none; }
        .a-input:focus { border-color: #4F46E5; }
        .trow { display: grid; grid-template-columns: 1fr 130px 120px 100px 130px 90px; gap: 10px; align-items: center; padding: 13px 18px; border-radius: 10px; border: 1px solid #1A1A26; margin-bottom: 7px; background: #0D0D16; transition: all .18s; cursor: pointer; }
        .trow:hover { border-color: #2A2A3E; background: #11111E; }
        .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.8); backdrop-filter: blur(6px); z-index: 100; display: flex; align-items: center; justify-content: center; animation: fadeIn .2s; }
        .modal { background: #10101A; border: 1px solid #2A2A3E; border-radius: 20px; padding: 28px; width: 560px; max-width: 96vw; max-height: 88vh; overflow-y: auto; }
        .status-btn { border: 1.5px solid; border-radius: 8px; padding: 7px 14px; cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 600; transition: all .18s; background: none; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 210, background: "#08080E", borderRight: "1px solid #14141E", padding: "20px 10px", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0 }}>
        <div style={{ padding: "4px 10px 24px" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: "#fff" }}>İK Portal</div>
          <div style={{ fontSize: 10, color: "#4F46E5", marginTop: 2, fontWeight: 600, letterSpacing: 0.5 }}>ADMIN PANELİ</div>
        </div>

        {[
          { id: "dashboard", label: "Dashboard", icon: "◈" },
          { id: "requests", label: "Tüm Talepler", icon: "☰" },
        ].map(n => (
          <button key={n.id} className={`a-nav ${view === n.id ? "active" : ""}`} onClick={() => setView(n.id)}>
            <span style={{ fontSize: 15 }}>{n.icon}</span> {n.label}
            {n.id === "requests" && stats.pending > 0 && (
              <span style={{ marginLeft: "auto", background: "#EF4444", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{stats.pending}</span>
            )}
          </button>
        ))}

        <div style={{ borderTop: "1px solid #14141E", margin: "14px 0 12px", paddingTop: 14 }}>
          <div style={{ fontSize: 9, color: "#333", padding: "0 8px", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Kategoriler</div>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button key={key} className={`a-nav ${filterCat === key && view === "requests" ? "active" : ""}`} onClick={() => { setFilterCat(key); setView("requests"); }}>
              <span>{cat.icon}</span> {cat.label}
              <span style={{ marginLeft: "auto", fontSize: 11, color: cat.color }}>{requests.filter(r => r.category === key).length}</span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: "auto", padding: "0 4px" }}>
          <div style={{ fontSize: 12, color: "#666", padding: "8px 10px" }}>👑 {user.name}</div>
          <button onClick={onLogout} className="a-nav" style={{ color: "#EF4444" }}>↩ Çıkış Yap</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 210, flex: 1, padding: "28px 32px" }}>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Dashboard</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 3 }}>{new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            </div>

            {/* Stat kartları */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Toplam", value: stats.total, color: "#4F46E5", icon: "📋" },
                { label: "Beklemede", value: stats.pending, color: "#F59E0B", icon: "⏳" },
                { label: "İşlemde", value: stats.inProgress, color: "#3B82F6", icon: "🔄" },
                { label: "Tamamlandı", value: stats.done, color: "#10B981", icon: "✅" },
              ].map(s => (
                <div key={s.label} className="a-card" style={{ position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color }} />
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Kategori kartları */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 28 }}>
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const catReqs = requests.filter(r => r.category === key);
                const pending = catReqs.filter(r => r.status === "Beklemede").length;
                return (
                  <div key={key} className="a-card" style={{ cursor: "pointer", borderLeft: `3px solid ${cat.color}` }} onClick={() => { setFilterCat(key); setView("requests"); }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 28 }}>{cat.icon}</span>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{cat.label}</div>
                          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{catReqs.length} talep</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: cat.color }}>{catReqs.length}</div>
                        {pending > 0 && <div style={{ fontSize: 11, color: "#F59E0B" }}>{pending} beklemede</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bekleyen talepler */}
            {stats.pending > 0 && (
              <div className="a-card">
                <div style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B", marginBottom: 14 }}>⏳ Aksiyon Bekleyen Talepler</div>
                {requests.filter(r => r.status === "Beklemede").map(r => {
                  const cat = CATEGORIES[r.category];
                  const reqUser = getUser(r.userId);
                  return (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, background: "#0D0D16", border: "1px solid #1A1A26", marginBottom: 8, cursor: "pointer" }} onClick={() => { setSelectedReq(r); setAdminNote(r.adminNote || ""); }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 20 }}>{cat.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#E0E0F0" }}>{r.title}</div>
                          <div style={{ fontSize: 11, color: "#555" }}>{reqUser?.name} · {r.date}</div>
                        </div>
                      </div>
                      <Badge text="Beklemede" color="#F59E0B" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAM LİSTE */}
        {view === "requests" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>Tüm Talepler</div>
                <div style={{ color: "#555", fontSize: 13, marginTop: 2 }}>{filtered.length} talep</div>
              </div>
            </div>

            {/* Filtreler */}
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
              {[{ key: "all", label: "Tümü" }, ...Object.entries(CATEGORIES).map(([k, v]) => ({ key: k, label: v.icon + " " + v.label }))].map(f => (
                <button key={f.key} onClick={() => setFilterCat(f.key)} style={{ background: filterCat === f.key ? "#4F46E5" : "#13131C", color: filterCat === f.key ? "#fff" : "#666", border: `1px solid ${filterCat === f.key ? "#4F46E5" : "#1E1E2E"}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 500, transition: "all .15s" }}>
                  {f.label}
                </button>
              ))}
              <select className="a-input" style={{ width: "auto", marginLeft: "auto" }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">Tüm Durumlar</option>
                {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Tablo başlık */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 120px 100px 130px 90px", gap: 10, padding: "6px 18px", fontSize: 10, color: "#444", fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 4 }}>
              <span>Talep</span><span>Çalışan</span><span>Kategori</span><span>Öncelik</span><span>Durum</span><span>Tarih</span>
            </div>

            {filtered.length === 0 ? (
              <div className="a-card" style={{ textAlign: "center", padding: 40, color: "#555" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                Bu filtreye uygun talep yok.
              </div>
            ) : filtered.map(r => {
              const cat = CATEGORIES[r.category];
              const reqUser = getUser(r.userId);
              const pc = { "Düşük": "#6B7280", "Normal": "#3B82F6", "Yüksek": "#F59E0B", "Kritik": "#EF4444" }[r.priority];
              return (
                <div key={r.id} className="trow" onClick={() => { setSelectedReq(r); setAdminNote(r.adminNote || ""); }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#E0E0F0" }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: "#444" }}>#{r.id}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>{reqUser?.name}</div>
                  <Badge text={cat.label} color={cat.color} />
                  <Badge text={r.priority} color={pc} />
                  <Badge text={r.status} color={STATUS_COLOR[r.status]} />
                  <div style={{ fontSize: 11, color: "#444" }}>{r.date}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Detay Modal */}
      {selectedReq && (() => {
        const r = selectedReq;
        const cat = CATEGORIES[r.category];
        const flow = STATUS_FLOW[r.category];
        const reqUser = getUser(r.userId);
        return (
          <div className="modal-bg" onClick={() => setSelectedReq(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>{cat.icon}</span>
                    <Badge text={cat.label} color={cat.color} />
                    <Badge text={r.status} color={STATUS_COLOR[r.status]} />
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 19, fontWeight: 800, color: "#fff" }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>{reqUser?.name} ({reqUser?.department}) · {r.date}</div>
                </div>
                <button onClick={() => setSelectedReq(null)} style={{ background: "#1A1A26", border: "none", color: "#888", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 18 }}>✕</button>
              </div>

              {/* Detaylar */}
              <div style={{ background: "#0C0C14", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: "#444", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.6 }}>Talep Detayları</div>
                {Object.entries(r.fields).map(([k, v]) => v ? (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #12121A" }}>
                    <span style={{ fontSize: 12, color: "#555" }}>{k}</span>
                    <span style={{ fontSize: 12, color: "#AAA", textAlign: "right", maxWidth: "60%" }}>{v}</span>
                  </div>
                ) : null)}
              </div>

              {/* Durum güncelle */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 10, fontWeight: 600 }}>Durumu Güncelle</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {flow.map(s => (
                    <button key={s} className="status-btn" onClick={() => updateStatus(r.id, s)} style={{ borderColor: r.status === s ? (STATUS_COLOR[s] || "#4F46E5") : "#1E1E2E", color: r.status === s ? (STATUS_COLOR[s] || "#4F46E5") : "#666", background: r.status === s ? (STATUS_COLOR[s] || "#4F46E5") + "22" : "transparent" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin notu */}
              <div>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 8, fontWeight: 600 }}>💬 İK Notu (Çalışana Görünür)</div>
                <textarea className="a-input" rows={3} placeholder="Çalışana iletmek istediğiniz bir not ekleyin..." value={adminNote} onChange={e => setAdminNote(e.target.value)} style={{ resize: "none" }} />
                <button onClick={() => saveNote(r.id)} style={{ marginTop: 10, background: "#4F46E5", border: "none", color: "#fff", borderRadius: 8, padding: "9px 20px", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Notu Kaydet</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── ANA UYGULAMA ─────────────────────────────────────────────────────────────

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!currentUser) return <LoginScreen onLogin={setCurrentUser} />;

  return (
    <>
      {currentUser.role === "admin"
        ? <AdminPanel user={currentUser} requests={requests} setRequests={setRequests} onLogout={() => setCurrentUser(null)} showToast={showToast} />
        : <EmployeePanel user={currentUser} requests={requests} setRequests={setRequests} onLogout={() => setCurrentUser(null)} showToast={showToast} />
      }
      {toast && <Toast msg={toast} />}
    </>
  );
}
