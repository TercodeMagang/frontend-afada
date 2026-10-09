// ─── HALAMAN UNDANGAN PUBLIK (untuk tamu) ───────────────────────────────────
// ✅ Refactoring bertahap: fitur baru hidup di file sendiri, tidak menumpuk di App.tsx
import { useEffect, useState } from "react"
import { Heart, Clock, Send, MessageCircle, Gift } from "lucide-react"
import { toast } from "sonner"

const API = "http://localhost:5000"

// Pasangan nama tema → foto (fallback hero kalau tidak ada background custom)
const THEME_IMG: Record<string, string> = {
    Elegant: "1519225421980-715cb0215aed",
    Floral: "1550005809-91ad75fb315f",
    Minimalist: "1464366400600-7168b8af9bc3",
    Modern: "1469371670807-013ccf25f16a",
    Traditional: "1583939003579-730e3918a45a",
    Luxury: "1519741497674-611481863552",
}

type Ucapan = {
    id: number
    invitation_id: number | null
    name: string
    message: string | null
    attendance_status: string
    number_of_guests: number | null
    created_at: string
}

export default function GuestInvitationPage() {
    // ✅ Identitas undangan & nama tamu dibaca dari URL: ?undangan=ID&tamu=Nama
    const params = new URLSearchParams(window.location.search)
    const invitationId = params.get("undangan") ?? ""
    const guestName = params.get("tamu") ?? ""

    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [inv, setInv] = useState<any>(null)
    const [opened, setOpened] = useState(false)

    // Form RSVP
    const [rsvpName, setRsvpName] = useState(guestName)
    const [status, setStatus] = useState<"Hadir" | "Tidak Hadir">("Hadir")
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)

    // Dinding ucapan
    const [ucapan, setUcapan] = useState<Ucapan[]>([])
    // Form amplop digital
    const [envName, setEnvName] = useState(guestName)
    const [envAmount, setEnvAmount] = useState("")
    const [envMessage, setEnvMessage] = useState("")
    const [envSending, setEnvSending] = useState(false)

    // ✅ COUNTER KUNJUNGAN: hitung sekali per tab/sesi supaya tidak dobel saat refresh
    const countVisit = () => {
        const key = `invito_visited_${invitationId}`
        if (sessionStorage.getItem(key)) return
        sessionStorage.setItem(key, "1")
        fetch(`${API}/api/invitations/${invitationId}/visit`, { method: "PATCH" }).catch(() => { })
    }

    // ✅ Muat data undangan dari database
    useEffect(() => {
        if (!invitationId) { setNotFound(true); setLoading(false); return }
        fetch(`${API}/api/invitations/${invitationId}`)
            .then(r => r.json())
            .then(d => { if (d.success && d.data) { setInv(d.data); countVisit() } else setNotFound(true) })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [invitationId])

    // ✅ Muat ucapan (milik undangan ini + yang umum supaya demo tidak kosong)
    const loadUcapan = async () => {
        try {
            const r = await fetch(`${API}/api/rsvps`)
            const d = await r.json()
            if (d.success) {
                const list = (d.data as Ucapan[])
                    .filter(x => x.invitation_id === Number(invitationId) || x.invitation_id == null)
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                setUcapan(list)
            }
        } catch (e) { console.error(e) }
    }
    useEffect(() => { loadUcapan() }, [invitationId])

    // ✅ Muat Google Fonts supaya font tersimpan benar-benar terlihat
    useEffect(() => {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:wght@400;600&family=Great+Vibes&family=Lora:wght@400;600&family=Montserrat:wght@400;600&display=swap"
        document.head.appendChild(link)
        return () => { document.head.removeChild(link) }
    }, [])

    // ✅ Kirim RSVP + ucapan ke database
    const handleSend = async () => {
        if (!rsvpName.trim()) { toast.error("Nama wajib diisi dulu!"); return }
        setSending(true)
        try {
            const res = await fetch(`${API}/api/rsvps`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    invitation_id: Number(invitationId) || null,
                    name: rsvpName.trim(),
                    message: message.trim() || null,
                    attendance_status: status,
                    number_of_guests: status === "Hadir" ? 1 : 0,
                    is_anonymous: false,
                }),
            })
            const d = await res.json()
            if (d.success) {
                toast.success(`Terima kasih, ${rsvpName.trim()}! RSVP & ucapan terkirim.`)
                setMessage("")
                loadUcapan()
            } else {
                toast.error(d.message || "Gagal mengirim RSVP.")
            }
        } catch {
            toast.error("Tidak dapat terhubung ke server.")
        } finally {
            setSending(false)
        }
    }

    // ✅ Kirim amplop digital ke database (tertaut ke undangan)
    const handleSendEnvelope = async () => {
        if (!envName.trim()) { toast.error("Nama pengirim wajib diisi!"); return }
        const amount = Number(envAmount)
        if (!amount || amount <= 0) { toast.error("Nominal amplop tidak valid!"); return }
        setEnvSending(true)
        try {
            const res = await fetch(`${API}/api/envelopes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    invitation_id: Number(invitationId) || null,
                    sender_name: envName.trim(),
                    amount,
                    message: envMessage.trim() || null,
                    withdrawal_status: "Belum Ditarik",
                }),
            })
            const d = await res.json()
            if (d.success) {
                toast.success(`Terima kasih, ${envName.trim()}! Amplop digital terkirim.`)
                setEnvAmount("")
                setEnvMessage("")
            } else {
                toast.error(d.message || "Gagal mengirim amplop.")
            }
        } catch {
            toast.error("Tidak dapat terhubung ke server.")
        } finally {
            setEnvSending(false)
        }
    }

    // ✅ Semua tampilan mengikuti settings yang disimpan owner di editor
    const s = inv?.settings ?? {}
    const coupleName = inv?.coupleName ?? inv?.couple_name ?? "Undangan Digital"
    const brideName = s.brideName ?? "Mempelai Wanita"
    const groomName = s.groomName ?? "Mempelai Pria"
    const weddingDate = s.weddingDate ?? ""
    const bgColor = s.bgColor ?? "#FAF8F4"
    const textColor = s.textColor ?? "#2A1F1A"
    const accentColor = s.accentColor ?? "#C4954A"
    const fontFamily = s.selectedFont ? `'${s.selectedFont}', serif` : "'Playfair Display', serif"
    const heroImg = s.background ?? (THEME_IMG[inv?.theme] ? `https://images.unsplash.com/photo-${THEME_IMG[inv.theme]}?w=800&h=600&fit=crop&auto=format` : null)
    const photos: { id: number; url: string }[] = s.couplePhotos ?? []

    const fmtDate = (iso: string) => {
        if (!iso) return ""
        const d = new Date(iso)
        if (isNaN(d.getTime())) return iso
        return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    }
    const timeAgo = (iso: string) => {
        if (!iso) return ""
        const diff = Date.now() - new Date(iso).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return "Baru saja"
        if (mins < 60) return `${mins} mnt lalu`
        const hours = Math.floor(mins / 60)
        if (hours < 24) return `${hours} jam lalu`
        return `${Math.floor(hours / 24)} hari lalu`
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary font-sans">
                <p className="text-sm text-muted-foreground">Memuat undangan...</p>
            </div>
        )
    }

    if (notFound || !inv) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-secondary font-sans px-6 text-center">
                <Heart className="w-10 h-10 text-primary fill-primary/20 mb-4" />
                <h1 className="font-serif text-2xl font-semibold mb-2">Undangan tidak ditemukan</h1>
                <p className="text-sm text-muted-foreground max-w-xs">Link yang Anda buka tidak valid atau undangan sudah dihapus oleh pemiliknya.</p>
            </div>
        )
    }

    // ── COVER: tamu wajib menekan "Buka Undangan" dulu ──
    if (!opened) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 font-sans" style={{ backgroundColor: bgColor, color: textColor }}>
                <div className="w-full max-w-sm text-center py-10">
                    {heroImg && (
                        <div className="w-40 h-40 mx-auto mb-6 rounded-full border-4 overflow-hidden" style={{ borderColor: accentColor }}>
                            <img src={heroImg} alt="cover" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ opacity: 0.65 }}>The Wedding of</p>
                    <h1 className="font-serif text-3xl font-semibold mb-3" style={{ fontFamily }}>{coupleName}</h1>
                    {weddingDate && <p className="text-xs mb-6" style={{ opacity: 0.7 }}>{fmtDate(weddingDate)}</p>}
                    {guestName && (
                        <div className="mx-auto mb-6 px-4 py-3 rounded-xl border text-xs" style={{ borderColor: accentColor, backgroundColor: `${accentColor}10` }}>
                            <p style={{ opacity: 0.7 }}>Kepada Yth. Bapak/Ibu/Saudara/i</p>
                            <p className="font-semibold mt-0.5">{guestName}</p>
                        </div>
                    )}
                    <button onClick={() => setOpened(true)} className="px-6 py-3 rounded-full text-sm font-medium text-white shadow-lg hover:opacity-90 transition-all" style={{ backgroundColor: accentColor }}>
                        Buka Undangan
                    </button>
                </div>
            </div>
        )
    }

    // ── ISI UNDANGAN ──
    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: bgColor, color: textColor }}>
            <div className="max-w-md mx-auto">
                <div className="relative">
                    {heroImg ? <img src={heroImg} alt="hero" className="w-full h-72 object-cover" /> : <div className="w-full h-72" style={{ backgroundColor: `${accentColor}25` }} />}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                    <div className="absolute bottom-4 inset-x-0 text-center text-white px-6">
                        <p className="text-[10px] tracking-[0.25em] uppercase mb-1">The Wedding of</p>
                        <h1 className="font-serif text-2xl font-semibold" style={{ fontFamily }}>{coupleName}</h1>
                    </div>
                </div>

                <section className="px-6 py-10 text-center space-y-3">
                    <p className="text-xs leading-relaxed" style={{ opacity: 0.75 }}>
                        Dengan memohon rahmat dan ridha Tuhan Yang Maha Esa, kami mengundang Anda untuk hadir di acara pernikahan kami:
                    </p>
                    {weddingDate && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                            <Clock className="w-3.5 h-3.5" /> {fmtDate(weddingDate)}
                        </div>
                    )}
                </section>

                <section className="px-6 pb-10 text-center space-y-6">
                    <div>
                        {s.bridePhoto && <img src={s.bridePhoto} alt="mempelai wanita" className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2" style={{ borderColor: accentColor }} />}
                        <h2 className="font-serif text-xl font-semibold" style={{ fontFamily }}>{brideName}</h2>
                    </div>
                    <p className="font-serif text-2xl" style={{ color: accentColor }}>&</p>
                    <div>
                        {s.groomPhoto && <img src={s.groomPhoto} alt="mempelai pria" className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2" style={{ borderColor: accentColor }} />}
                        <h2 className="font-serif text-xl font-semibold" style={{ fontFamily }}>{groomName}</h2>
                    </div>
                </section>

                {photos.length > 0 && (
                    <section className="px-6 pb-10">
                        <h3 className="text-center text-[11px] tracking-[0.25em] uppercase mb-4" style={{ opacity: 0.65 }}>Galeri</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {photos.map(p => <img key={p.id} src={p.url} alt="galeri" className="w-full aspect-square object-cover rounded-lg" />)}
                        </div>
                    </section>
                )}

                <section className="px-6 pb-10">
                    <h3 className="text-center text-[11px] tracking-[0.25em] uppercase mb-4" style={{ opacity: 0.65 }}>Konfirmasi Kehadiran</h3>
                    <div className="space-y-3 p-4 rounded-2xl border" style={{ borderColor: `${accentColor}40`, backgroundColor: "#ffffff" }}>
                        <input value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Nama Anda" className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-muted/40 outline-none focus:border-primary" style={{ color: "#2A1F1A" }} />
                        <div className="flex gap-2">
                            {(["Hadir", "Tidak Hadir"] as const).map(opt => (
                                <button key={opt} onClick={() => setStatus(opt)} className="flex-1 py-2 rounded-full text-xs font-medium transition-all" style={status === opt ? { backgroundColor: accentColor, color: "#fff" } : { border: "1px solid #e5e0d8", color: "#6b5f55" }}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tuliskan ucapan & doa..." className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-muted/40 outline-none focus:border-primary h-20 resize-none" style={{ color: "#2A1F1A" }} />
                        <button onClick={handleSend} disabled={sending} className="w-full py-2.5 rounded-full text-xs font-medium text-white flex items-center justify-center gap-1.5 disabled:opacity-60" style={{ backgroundColor: accentColor }}>
                            <Send className="w-3.5 h-3.5" /> {sending ? "Mengirim..." : "Kirim RSVP & Ucapan"}
                        </button>
                    </div>
                </section>

                <section className="px-6 pb-10">
                    <h3 className="text-center text-[11px] tracking-[0.25em] uppercase mb-4 flex items-center justify-center gap-1.5" style={{ opacity: 0.65 }}>
                        <MessageCircle className="w-3.5 h-3.5" /> Ucapan ({ucapan.length})
                    </h3>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {ucapan.length === 0 ? (
                            <p className="text-center text-xs py-6" style={{ opacity: 0.6 }}>Belum ada ucapan. Jadilah yang pertama!</p>
                        ) : (
                            ucapan.map(u => (
                                <div key={u.id} className="p-3 rounded-xl border text-left" style={{ borderColor: `${accentColor}30`, backgroundColor: "#ffffff", color: "#2A1F1A" }}>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-semibold">{u.name}</p>
                                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: u.attendance_status === "Hadir" ? "#e8f5e9" : u.attendance_status === "Tidak Hadir" ? "#ffebee" : "#fff8e1", color: u.attendance_status === "Hadir" ? "#2e7d32" : u.attendance_status === "Tidak Hadir" ? "#c62828" : "#f9a825" }}>
                                            {u.attendance_status}
                                        </span>
                                    </div>
                                    {u.message && <p className="text-xs" style={{ opacity: 0.75 }}>"{u.message}"</p>}
                                    <p className="text-[9px] mt-1" style={{ opacity: 0.5 }}>{timeAgo(u.created_at)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* ── Amplop Digital ── */}
                <section className="px-6 pb-10">
                    <h3 className="text-center text-[11px] tracking-[0.25em] uppercase mb-4" style={{ opacity: 0.65 }}>Amplop Digital</h3>
                    <div className="space-y-3 p-4 rounded-2xl border" style={{ borderColor: `${accentColor}40`, backgroundColor: "#ffffff", color: "#2A1F1A" }}>
                        <p className="text-[11px]" style={{ opacity: 0.7 }}>Doa & hadiah Anda adalah kebahagiaan bagi kami. Kirim amplop digital melalui rekening berikut:</p>
                        <div className="space-y-2">
                            {[
                                { bank: "BCA", no: "8808 8888 1234", an: "Anisa Rahmawati" },
                                { bank: "GoPay", no: "0812 3456 7890", an: "Anisa Rahmawati" },
                            ].map(r => (
                                <div key={r.bank} className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-muted/40">
                                    <div className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">{r.bank}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-mono font-semibold">{r.no}</p>
                                        <p className="text-[9px]" style={{ opacity: 0.6 }}>a.n. {r.an}</p>
                                    </div>
                                    <button onClick={() => { navigator.clipboard.writeText(r.no.replace(/\s/g, "")); toast.success("Nomor rekening disalin!") }} className="text-[10px] text-primary hover:underline">Salin</button>
                                </div>
                            ))}
                        </div>
                        <div className="h-px bg-border" />
                        <p className="text-[11px] font-semibold">Konfirmasi Kirim Amplop</p>
                        <input value={envName} onChange={e => setEnvName(e.target.value)} placeholder="Nama Anda" className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-muted/40 outline-none focus:border-primary" style={{ color: "#2A1F1A" }} />
                        <input value={envAmount} onChange={e => setEnvAmount(e.target.value)} type="number" min={0} placeholder="Nominal (Rp)" className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-muted/40 outline-none focus:border-primary" style={{ color: "#2A1F1A" }} />
                        <textarea value={envMessage} onChange={e => setEnvMessage(e.target.value)} placeholder="Pesan / doa (opsional)" className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-muted/40 outline-none focus:border-primary h-16 resize-none" style={{ color: "#2A1F1A" }} />
                        <button onClick={handleSendEnvelope} disabled={envSending} className="w-full py-2.5 rounded-full text-xs font-medium text-white flex items-center justify-center gap-1.5 disabled:opacity-60" style={{ backgroundColor: accentColor }}>
                            <Gift className="w-3.5 h-3.5" /> {envSending ? "Mengirim..." : "Kirim Amplop Digital"}
                        </button>
                    </div>
                </section>

                <footer className="px-6 py-10 text-center space-y-3" style={{ backgroundColor: `${accentColor}10` }}>
                    <p className="text-xs leading-relaxed" style={{ opacity: 0.75 }}>
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
                    </p>
                    <p className="text-xs" style={{ opacity: 0.6 }}>Kami yang mengundang,</p>
                    <p className="font-serif text-lg font-semibold" style={{ fontFamily }}>{coupleName}</p>
                </footer>
            </div>
        </div>
    )
}