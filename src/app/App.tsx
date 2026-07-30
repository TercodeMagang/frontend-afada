import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"
import {
  Heart, Menu, X, Smartphone, Globe, Music, Users, MapPin,
  QrCode, Edit3, Layout, Type, Image, Palette, Settings,
  LogOut, Eye, Share2, MessageCircle, Clock, Gift, Camera, Home,
  FileText, Bell, Headphones, Check, ArrowRight, Layers,
  Zap, User, TrendingUp, ChevronRight, Monitor, Plus, Sparkles,
  Play, Instagram, Facebook, Twitter,
  CreditCard, Wallet, Building2, Store, Download, RefreshCw,
  CheckCircle2, XCircle, AlertCircle, Copy, Phone, Mail,
  Shield, Search, Filter, Receipt, Star, Package
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Toaster, toast } from "sonner"

// ─── SCROLL RESTORATION HOOK ─────────────────────────────────────────────────
function useScrollRestoration(pageName: string) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Restore scroll position on mount
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(`scroll-${pageName}`)
    if (savedPosition && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedPosition, 10)
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [pageName])

  // Save scroll position before unmount
  useEffect(() => {
    return () => {
      if (scrollRef.current) {
        sessionStorage.setItem(`scroll-${pageName}`, scrollRef.current.scrollTop.toString())
      }
    }
  }, [pageName])

  // Save scroll position on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (scrollRef.current) {
        sessionStorage.setItem(`scroll-${pageName}`, scrollRef.current.scrollTop.toString())
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [pageName])

  return scrollRef
}

type Page =
  | "landing"
  | "login"
  | "dashboard"
  | "editor"
  | "checkout"
  | "payment-method"
  | "payment-waiting"
  | "payment-success"
  | "payment-failed"
  | "templates"
  | "pricing"
  | "features"
  | "about"
  | "faq"
  | "contact"
  | "terms"
  | "privacy"
  | "my-invitations"
  | "edit-profile"
  | "purchase-history"  // ← TAMBAHKAN INI
  | "invitation-editor" // ← TAMBAHKAN INI
  | "guest-invitation"  // ← TAMBAHKAN INI
  | "history"  // ← Tambahkan ini
  | "template-selection"
type AuthTab = "login" | "register"

// ─── DATA ────────────────────────────────────────────────────────────────────
const WHY_US = [
  { icon: Smartphone, title: "Mudah Digunakan", desc: "Buat undangan dalam hitungan menit, tanpa keahlian desain apapun" },
  { icon: Edit3, title: "Edit Lewat HP", desc: "Akses dan edit undangan kapan saja dari perangkat apapun" },
  { icon: Zap, title: "Proses Cepat", desc: "Undangan siap dibagikan hanya dalam waktu singkat" },
  { icon: Sparkles, title: "Tampilan Elegan", desc: "Desain premium yang memukau setiap tamu undangan Anda" },
  { icon: Gift, title: "Harga Terjangkau", desc: "Paket lengkap dengan harga yang ramah di kantong" },
  { icon: Layers, title: "Banyak Pilihan Tema", desc: "Ratusan tema siap pakai untuk setiap selera dan konsep" },
  { icon: Headphones, title: "Support 24/7", desc: "Tim kami selalu siap membantu kapanpun Anda butuhkan" },
]

const FEATURES = [
  { icon: Globe, label: "Custom Domain" },
  { icon: Users, label: "Custom Nama Tamu" },
  { icon: Music, label: "Custom Musik Latar" },
  { icon: Palette, label: "Tema & Custom Penuh" },
  { icon: MessageCircle, label: "Form RSVP & Ucapan" },
  { icon: Gift, label: "Amplop Digital" },
  { icon: Clock, label: "Hitung Mundur Acara" },
  { icon: MapPin, label: "Google Maps" },
  { icon: Camera, label: "Galeri Foto & Video" },
  { icon: Monitor, label: "Live Streaming" },
  { icon: QrCode, label: "QR Code Check-In" },
  { icon: Users, label: "Layar Sapa & Counter" },
  { icon: Smartphone, label: "Edit via HP" },
  { icon: Plus, label: "Tambah/Kurangi Halaman" },
  { icon: Layers, label: "Atur Urutan Halaman" },
  { icon: Layout, label: "Beragam Layout" },
  { icon: Image, label: "Custom Background" },
  { icon: Palette, label: "Custom Warna" },
  { icon: Type, label: "Custom Font" },
  { icon: Edit3, label: "Custom Ukuran Font" },
]

const THEMES = [
  { name: "Elegant", img: "1519225421980-715cb0215aed", badge: "Populer" },
  { name: "Floral", img: "1550005809-91ad75fb315f", badge: "" },
  { name: "Minimalist", img: "1464366400600-7168b8af9bc3", badge: "Baru" },
  { name: "Modern", img: "1469371670807-013ccf25f16a", badge: "" },
  { name: "Traditional", img: "1583939003579-730e3918a45a", badge: "" },
  { name: "Luxury", img: "1519741497674-611481863552", badge: "Premium" },
]

const TESTIMONIALS = [
  {
    name: "Anisa & Raka Pratama",
    avatar: "1438761681033-6461ffad8d80",
    rating: 5,
    text: "Undangan digital kami begitu cantik dan mudah dibagikan ke seluruh keluarga. Tamu sangat terkesan dengan tampilannya!",
    date: "Menikah 12 Januari 2025",
  },
  {
    name: "Putri & Dimas Santoso",
    avatar: "1494790108755-2616b612b977",
    rating: 5,
    text: "Proses pembuatannya sangat cepat, hanya 30 menit sudah jadi. Fitur RSVP-nya membantu kami mengelola daftar tamu dengan efisien.",
    date: "Menikah 8 Maret 2025",
  },
  {
    name: "Sari & Budi Hartono",
    avatar: "1507003211169-0a1dd7228f2d",
    rating: 5,
    text: "Harga sangat terjangkau untuk kualitas yang luar biasa. Amplop digital-nya memudahkan tamu memberikan hadiah secara online.",
    date: "Menikah 22 Februari 2025",
  },
]

const STEPS = [
  { num: "01", title: "Daftar atau Login", desc: "Buat akun gratis dan mulai perjalanan undangan impian Anda", icon: User },
  { num: "02", title: "Pilih Template", desc: "Pilih dari ratusan tema elegan yang sesuai selera Anda", icon: Layout },
  { num: "03", title: "Edit Undangan", desc: "Kustomisasi setiap detail dengan editor yang mudah digunakan", icon: Edit3 },
  { num: "04", title: "Bagikan ke Tamu", desc: "Kirim link undangan via WhatsApp, Instagram, atau media sosial", icon: Share2 },
]

const CHART_DATA = [
  { day: "Sen", views: 120 },
  { day: "Sel", views: 185 },
  { day: "Rab", views: 148 },
  { day: "Kam", views: 220 },
  { day: "Jum", views: 390 },
  { day: "Sab", views: 530 },
  { day: "Min", views: 447 },
]

const SIDEBAR_NAV = [
  { icon: Home, label: "Dashboard" },
  { icon: Layout, label: "Template" },
  { icon: FileText, label: "Undangan Saya" },
  { icon: Edit3, label: "Edit Undangan" },
  { icon: Users, label: "Data Tamu" },
  { icon: MessageCircle, label: "RSVP" },
  { icon: Gift, label: "Amplop Digital" },
  { icon: QrCode, label: "QR Check-In" },
  { icon: Globe, label: "Domain" },
  { icon: Receipt, label: "Transaksi" },
  { icon: Settings, label: "Pengaturan" },
]

const EDITOR_TABS = [
  { icon: Layout, label: "Halaman" },
  { icon: Palette, label: "Tema" },
  { icon: Image, label: "Background" },
  { icon: Type, label: "Font" },
  { icon: Music, label: "Musik" },
  { icon: Camera, label: "Foto" },
]

const PAGES_LIST = ["Opening", "Mempelai", "Akad", "Resepsi", "Galeri", "RSVP", "Ucapan", "Penutup"]

// ─── PAYMENT DATA ─────────────────────────────────────────────────────────────
const PACKAGES = [
  {
    id: "basic",
    name: "Basic",
    subtitle: "Untuk pasangan yang ingin memulai",
    price: 99000,
    originalPrice: null as number | null,
    features: ["1 tema pilihan", "Link undangan digital", "RSVP & ucapan tamu", "Galeri foto 10 item", "Tanpa custom domain", "Berlaku 6 bulan"],
    popular: false,
    color: "border-border",
  },
  {
    id: "standard",
    name: "Standard",
    subtitle: "Paling populer untuk pasangan",
    price: 199000,
    originalPrice: 299000 as number | null,
    features: ["Semua tema + custom", "Custom domain .id", "RSVP & amplop digital", "Galeri foto & video tak terbatas", "Musik latar", "Hitung mundur & Google Maps", "Berlaku 1 tahun"],
    popular: true,
    color: "border-primary",
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Pengalaman undangan paling lengkap",
    price: 349000,
    originalPrice: 499000 as number | null,
    features: ["Semua fitur Standard", "Live streaming", "QR Code Check-In", "Layar sapa & counter", "Custom nama tamu", "Support prioritas 24/7", "Berlaku selamanya"],
    popular: false,
    color: "border-border",
  },
]

type MethodItem = { code: string; name: string; fee: string; badge?: string; bg: string; fg: string }
type MethodGroup = { id: string; label: string; icon: React.ElementType; items: MethodItem[] }

const PAYMENT_GROUPS: MethodGroup[] = [
  {
    id: "va",
    label: "Virtual Account",
    icon: Building2,
    items: [
      { code: "BCA", name: "BCA Virtual Account", fee: "Gratis", bg: "#003D6E", fg: "#FFFFFF" },
      { code: "BNI", name: "BNI Virtual Account", fee: "Gratis", bg: "#E65C00", fg: "#FFFFFF" },
      { code: "BRI", name: "BRI Virtual Account", fee: "Gratis", bg: "#003F87", fg: "#FFFFFF" },
      { code: "MANDIRI", name: "Mandiri Virtual Account", fee: "Gratis", bg: "#1A3A6B", fg: "#F5C842" },
      { code: "PERMATA", name: "Permata Virtual Account", fee: "Gratis", bg: "#6B1740", fg: "#FFFFFF" },
      { code: "BSI", name: "BSI Virtual Account", fee: "Gratis", bg: "#00703C", fg: "#FFFFFF" },
    ],
  },
  {
    id: "ewallet",
    label: "E-Wallet",
    icon: Wallet,
    items: [
      { code: "GOPAY", name: "GoPay", fee: "Gratis", badge: "Populer", bg: "#00AED6", fg: "#FFFFFF" },
      { code: "OVO", name: "OVO", fee: "Gratis", bg: "#4C3494", fg: "#FFFFFF" },
      { code: "DANA", name: "DANA", fee: "Gratis", bg: "#118EEA", fg: "#FFFFFF" },
      { code: "SHOPEEPAY", name: "ShopeePay", fee: "Gratis", bg: "#EE4D2D", fg: "#FFFFFF" },
      { code: "LINKAJA", name: "LinkAja", fee: "Gratis", bg: "#E2173F", fg: "#FFFFFF" },
    ],
  },
  {
    id: "qris",
    label: "QRIS",
    icon: QrCode,
    items: [
      { code: "QRIS", name: "QRIS", fee: "Gratis", badge: "Semua E-Wallet", bg: "#CC0000", fg: "#FFFFFF" },
    ],
  },
  {
    id: "card",
    label: "Kartu Kredit",
    icon: CreditCard,
    items: [
      { code: "VISA", name: "Visa", fee: "2,9%", bg: "#1A1F71", fg: "#FFFFFF" },
      { code: "MASTERCARD", name: "Mastercard", fee: "2,9%", bg: "#EB001B", fg: "#FFFFFF" },
      { code: "JCB", name: "JCB", fee: "2,9%", bg: "#003087", fg: "#FFFFFF" },
    ],
  },
  {
    id: "retail",
    label: "Gerai",
    icon: Store,
    items: [
      { code: "ALFAMART", name: "Alfamart", fee: "Rp 2.500", bg: "#E31E24", fg: "#FFFFFF" },
      { code: "INDOMARET", name: "Indomaret", fee: "Rp 2.500", bg: "#003087", fg: "#FFFFFF" },
    ],
  },
  {
    id: "paylater",
    label: "PayLater",
    icon: Receipt,
    items: [
      { code: "KREDIVO", name: "Kredivo", fee: "0% s/d 3 bln", bg: "#E31E24", fg: "#FFFFFF" },
      { code: "AKULAKU", name: "Akulaku", fee: "0% s/d 3 bln", bg: "#0091EA", fg: "#FFFFFF" },
    ],
  },
]

const MOCK_TRANSACTIONS = [
  { id: "INV-20250112-001", date: "12 Jan 2025", package: "Premium", customer: "Anisa & Raka", method: "BCA Virtual Account", amount: 349000, status: "Paid" },
  { id: "INV-20250110-002", date: "10 Jan 2025", package: "Standard", customer: "Dewi & Fandi", method: "GoPay", amount: 199000, status: "Paid" },
  { id: "INV-20250108-003", date: "8 Jan 2025", package: "Basic", customer: "Rina & Ahmad", method: "QRIS", amount: 99000, status: "Expired" },
  { id: "INV-20250105-004", date: "5 Jan 2025", package: "Premium", customer: "Maya & Bimo", method: "OVO", amount: 349000, status: "Pending" },
  { id: "INV-20250103-005", date: "3 Jan 2025", package: "Standard", customer: "Sari & Deni", method: "BNI Virtual Account", amount: 199000, status: "Failed" },
  { id: "INV-20241228-006", date: "28 Des 2024", package: "Premium", customer: "Hani & Rizki", method: "Mandiri Virtual Account", amount: 349000, status: "Paid" },
  { id: "INV-20241225-007", date: "25 Des 2024", package: "Basic", customer: "Lia & Yusuf", method: "ShopeePay", amount: 99000, status: "Paid" },
]

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────
function QRCodeDisplay() {
  const size = 23
  const pattern = Array.from({ length: size * size }, (_, i) => {
    const r = Math.floor(i / size)
    const c = i % size
    const inTopLeft = r < 7 && c < 7
    const inTopRight = r < 7 && c >= size - 7
    const inBotLeft = r >= size - 7 && c < 7
    if (inTopLeft || inTopRight || inBotLeft) {
      const lr = inTopLeft ? r : inBotLeft ? r - (size - 7) : r
      const lc = inTopRight ? c - (size - 7) : c
      return lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4)
    }
    if (r === 6 || c === 6) return (r + c) % 2 === 0
    return ((r * 3 + c * 7 + r * c * 2) % 4) < 2
  })
  return (
    <div className="p-4 bg-white rounded-2xl border border-border shadow-sm inline-block">
      <div
        style={{ display: "grid", gridTemplateColumns: `repeat(${size}, 1fr)`, width: 184, height: 184, gap: 0 }}
      >
        {pattern.map((on, i) => (
          <div key={i} style={{ backgroundColor: on ? "#2A1F1A" : "white" }} />
        ))}
      </div>
      <p className="text-center text-[9px] text-muted-foreground mt-2.5 font-mono tracking-widest uppercase">
        Scan untuk membayar
      </p>
    </div>
  )
}

function CountdownTimer({ initialSeconds }: { initialSeconds: number }) {
  const [left, setLeft] = useState(initialSeconds)
  useEffect(() => {
    const t = setInterval(() => setLeft((p) => Math.max(0, p - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  const blocks = [
    { v: h, l: "Jam" },
    { v: m, l: "Menit" },
    { v: s, l: "Detik" },
  ]
  return (
    <div className="flex items-center gap-2">
      {blocks.map(({ v, l }, i) => (
        <div key={l} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-xl font-mono font-bold text-primary">
              {String(v).padStart(2, "0")}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">{l}</span>
          </div>
          {i < 2 && <span className="text-primary font-bold text-xl mb-4">:</span>}
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    Paid: "bg-green-50 text-green-600 border-green-200",
    Pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
    Expired: "bg-gray-100 text-gray-500 border-gray-200",
    Failed: "bg-red-50 text-red-500 border-red-200",
  }
  return (
    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${cfg[status] ?? cfg.Expired}`}>
      {status}
    </span>
  )
}

function BankChip({ code, bg, fg }: { code: string; bg: string; fg: string }) {
  return (
    <div
      className="px-2 py-1 rounded-md text-[10px] font-bold tracking-wide flex-shrink-0"
      style={{ backgroundColor: bg, color: fg, minWidth: 40, textAlign: "center" }}
    >
      {code}
    </div>
  )
}

// ─ NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({
  setPage,
  setAuthTab,
  isAuthenticated,
  currentUser,
  onLogout
}: {
  setPage: (p: Page) => void
  setAuthTab: (t: AuthTab) => void
  isAuthenticated: boolean
  currentUser: { name: string; email: string } | null
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => { window.scrollTo(0, 0); setPage("landing") }} className="flex items-center gap-2 group">
          <Heart className="w-5 h-5 text-primary fill-primary/20 group-hover:fill-primary/50 transition-all" />
          <span className="font-serif text-xl font-semibold italic">Invito</span>
        </button>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => { window.scrollTo(0, 0); setPage("features") }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fitur</button>
          <button onClick={() => { window.scrollTo(0, 0); setPage("templates") }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tema</button>
          <button onClick={() => { window.scrollTo(0, 0); setPage("pricing") }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Harga</button>
          <button onClick={() => { window.scrollTo(0, 0); setPage("faq") }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</button>
          {isAuthenticated && (
            <button onClick={() => { window.scrollTo(0, 0); setPage("history") }} className="text-sm text-primary font-medium hover:text-primary/80 transition-colors">Riwayat</button>
          )}
        </div>
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <button
              onClick={() => { setAuthTab("login"); setPage("login") }}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-4 py-2 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors">
                <User className="w-4 h-4" />
                <span className="font-medium">{currentUser?.name.split(' ')[0]}</span>
                <ChevronRight className={`w-3 h-3 transition-transform ${profileOpen ? 'rotate-90' : ''}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl border border-border shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={() => { setPage("edit-profile"); setProfileOpen(false) }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Profil
                  </button>
                  <div className="border-t border-border mt-2 pt-2">
                    <button
                      onClick={() => { onLogout(); setProfileOpen(false) }}
                      className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-background border-t border-border px-6 py-4">
          {["Fitur", "Tema", "Harga", "FAQ"].map((item) => (
            <div key={item} className="py-3 text-sm border-b border-border/40">
              <button onClick={() => {
                window.scrollTo(0, 0)
                if (item === "Fitur") setPage("features")
                else if (item === "Tema") setPage("templates")
                else if (item === "Harga") setPage("pricing")
                else if (item === "FAQ") setPage("faq")
                setOpen(false)
              }}>{item}</button>
            </div>
          ))}
          {isAuthenticated && (
            <div className="py-3 text-sm border-b border-border/40">
              <button onClick={() => {
                window.scrollTo(0, 0)
                setPage("history")
                setOpen(false)
              }} className="text-primary font-medium">Riwayat</button>
            </div>
          )}
          <div className="pt-4 flex flex-col gap-2">
            {!isAuthenticated ? (
              <button
                onClick={() => { setAuthTab("login"); setPage("login"); setOpen(false) }}
                className="w-full py-3 text-sm bg-primary text-primary-foreground rounded-full"
              >
                Login
              </button>
            ) : (
              <>
                <button onClick={() => { setPage("edit-profile"); setOpen(false) }} className="w-full py-3 text-sm bg-muted rounded-full flex items-center gap-2"><Edit3 className="w-4 h-4" /> Edit Profil</button>
                <button onClick={() => { onLogout(); setOpen(false) }} className="w-full py-3 text-sm text-red-500 border border-red-200 rounded-full">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({
  setPage,
  setAuthTab,
  isAuthenticated,
  currentUser,
  onLogout
}: {
  setPage: (p: Page) => void
  setAuthTab: (t: AuthTab) => void
  isAuthenticated: boolean
  currentUser: { name: string; email: string } | null
  onLogout: () => void
}) {
  const scrollRef = useScrollRestoration("landing")

  return (
    <div ref={scrollRef} className="min-h-screen bg-background font-sans overflow-auto">
      <Navbar
        setPage={setPage}
        setAuthTab={setAuthTab}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      {/* HERO */}
      <section className="pt-28 pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-7">
              <Sparkles className="w-3 h-3" />
              Platform Undangan Digital #1 Indonesia
            </div>
            <h1 className="font-serif text-5xl lg:text-[3.5rem] font-semibold leading-[1.15] mb-6">
              Buat Undangan<br />Pernikahan{" "}
              <span className="text-primary italic">Impianmu</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-sm">
              Undangan digital elegan yang bisa dibagikan via WhatsApp. Tanpa keahlian desain, siap dalam hitungan menit.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => isAuthenticated ? setPage("checkout") : (setAuthTab("register"), setPage("login"))}
                className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_8px_28px_rgba(196,149,74,0.4)] flex items-center gap-2"
              >
                Mulai Buat Undangan <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => setPage("templates")} className="px-7 py-3.5 border border-border rounded-full font-medium hover:border-primary/60 hover:text-primary transition-all flex items-center gap-2 text-sm">
                <Play className="w-3.5 h-3.5 fill-current" /> Lihat Template
              </button>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex -space-x-2.5">
                {["1438761681033-6461ffad8d80", "1494790108755-2616b612b977", "1507003211169-0a1dd7228f2d", "1534528741775-53994a69daeb"].map((id, i) => (
                  <img key={i} src={`https://images.unsplash.com/photo-${id}?w=48&h=48&fit=crop&auto=format`} className="w-9 h-9 rounded-full border-2 border-background object-cover" alt="pengguna" />
                ))}
              </div>
              <div>
                <div className="flex text-yellow-400 text-sm mb-0.5">{"★★★★★"}</div>
                <p className="text-xs text-muted-foreground">10.000+ pasangan telah memilih kami</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/15 blur-3xl rounded-full scale-75 translate-y-10" />
              <div className="relative w-64 h-[530px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-background rounded-[2.4rem] overflow-hidden">
                  <div className="px-6 pt-4 pb-2 flex justify-between items-center">
                    <span className="text-[10px] text-foreground/50">9:41</span>
                    <div className="w-20 h-4 bg-foreground rounded-full opacity-80" />
                    <div className="flex gap-1">{[0, 1, 2].map(i => <div key={i} className="w-1 h-1 bg-foreground/30 rounded-full" />)}</div>
                  </div>
                  <div className="mx-3 rounded-2xl overflow-hidden shadow-md">
                    <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=320&h=200&fit=crop&auto=format" alt="invitation preview" className="w-full h-44 object-cover" />
                    <div className="bg-white px-5 py-4">
                      <p className="text-center text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">The Wedding of</p>
                      <h3 className="font-serif text-center text-lg font-semibold">Anisa & Raka</h3>
                      <div className="my-2.5 h-px bg-primary/25 mx-4" />
                      <p className="text-center text-[10px] text-muted-foreground">Sabtu, 12 Januari 2025</p>
                      <p className="text-center text-[10px] text-muted-foreground mb-3.5">Ballroom Hotel Mulia, Jakarta</p>
                      <button className="w-full py-2 bg-primary text-white text-[10px] rounded-full">Buka Undangan</button>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div animate={{ y: [0, -9, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-14 top-24 bg-card rounded-2xl px-3.5 py-2.5 shadow-lg border border-border flex items-center gap-2.5">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-green-500" /></div>
                <div><p className="text-xs font-semibold leading-tight">RSVP Diterima</p><p className="text-[10px] text-muted-foreground">+48 tamu baru</p></div>
              </motion.div>
              <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="absolute -right-14 bottom-32 bg-card rounded-2xl px-3.5 py-2.5 shadow-lg border border-border flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"><Gift className="w-4 h-4 text-primary" /></div>
                <div><p className="text-xs font-semibold leading-tight">Amplop Digital</p><p className="text-[10px] text-muted-foreground">Rp 12.450.000</p></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 px-6 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3">Keunggulan Kami</p>
            <h2 className="font-serif text-4xl font-semibold">Mengapa Memilih Invito?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_US.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="bg-card rounded-2xl p-6 border border-border hover:shadow-[0_8px_32px_rgba(196,149,74,0.1)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-primary" /></div>
                <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3">Produk Kami</p>
            <h2 className="font-serif text-4xl font-semibold">Pilihan Produk Undangan</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative bg-card rounded-3xl p-8 border-2 border-primary/50 hover:border-primary transition-all hover:shadow-[0_12px_48px_rgba(196,149,74,0.15)]">
              <div className="absolute top-7 right-7 px-3 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-medium tracking-wide">TERLARIS</div>
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5"><Smartphone className="w-6 h-6 text-primary" /></div>
              <h3 className="font-serif text-2xl font-semibold mb-2">Undangan Digital</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Undangan interaktif modern yang mudah dibagikan ke semua tamu</p>
              <ul className="space-y-3 mb-8">
                {["Bisa dibagikan via WhatsApp & sosmed", "Fitur RSVP & amplop digital", "100+ tema pilihan tersedia", "Edit kapan saja dari HP", "Animasi & musik latar"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm"><Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <button onClick={() => setPage("checkout")} className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-all">Lihat Detail</button>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border hover:border-muted-foreground/30 transition-all hover:shadow-[0_12px_48px_rgba(0,0,0,0.07)]">
              <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-5"><FileText className="w-6 h-6 text-muted-foreground" /></div>
              <h3 className="font-serif text-2xl font-semibold mb-2">Undangan Cetak</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Undangan fisik premium dengan desain yang menawan dan elegan</p>
              <ul className="space-y-3 mb-8">
                {["Desain premium profesional", "Beragam pilihan kertas", "Cetak sesuai jumlah tamu", "Amplop & pita hias eksklusif", "Bisa digabung dengan digital"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm"><Check className="w-4 h-4 text-muted-foreground/60 flex-shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <button onClick={() => {
                alert("Fitur Undangan Cetak akan segera hadir! Silakan pilih Undangan Digital.");
              }} className="w-full py-3.5 border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-all">Lihat Detail</button>
            </div>
          </div>
        </div>
      </section>

      {/* THEMES */}
      <section className="py-24 px-6 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3">Koleksi Tema</p>
            <h2 className="font-serif text-4xl font-semibold">Pilihan Tema yang Memukau</h2>
            <p className="text-muted-foreground mt-3 text-sm max-w-sm mx-auto">Ratusan tema tersedia untuk setiap selera dan konsep pernikahan Anda</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {THEMES.map(({ name, img, badge }, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.09 }} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-${img}?w=600&h=400&fit=crop&auto=format`} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                  {badge && <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-medium">{badge}</div>}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div><h3 className="font-semibold text-sm">{name}</h3><p className="text-[11px] text-muted-foreground mt-0.5">24 variasi tersedia</p></div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        alert(`Preview tema ${name} - Fitur ini akan segera hadir!`)
                      }}
                      className="px-3 py-1.5 text-[11px] border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
                    >
                      Preview
                    </button>
                    <button onClick={() => setPage("checkout")} className="px-3 py-1.5 text-[11px] bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                      Gunakan
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3">Fitur Lengkap</p>
            <h2 className="font-serif text-4xl font-semibold">Semua yang Anda Butuhkan</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {FEATURES.map(({ icon: Icon, label }, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.035 }} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/35 hover:bg-primary/[0.03] transition-all group cursor-default">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"><Icon className="w-4 h-4 text-primary" /></div>
                <span className="text-xs font-medium leading-tight">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3">Harga</p>
            <h2 className="font-serif text-4xl font-semibold">Pilihan Paket yang Tepat</h2>
            <p className="text-muted-foreground mt-3 text-sm">Mulai dari Rp 99.000 untuk undangan digital impian Anda</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PACKAGES.map((pkg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative bg-card rounded-3xl p-7 border-2 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(196,149,74,0.12)] ${pkg.popular ? "border-primary" : "border-border"}`}>
                {pkg.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-medium whitespace-nowrap">PALING POPULER</div>}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${pkg.popular ? "bg-primary/15" : "bg-muted"}`}>
                  <Package className={`w-5 h-5 ${pkg.popular ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-1">{pkg.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{pkg.subtitle}</p>
                <div className="mb-5">
                  {pkg.originalPrice && <p className="text-xs text-muted-foreground line-through mb-0.5">{fmt(pkg.originalPrice)}</p>}
                  <p className="text-2xl font-bold text-foreground">{fmt(pkg.price)}</p>
                </div>
                <ul className="space-y-2 mb-7">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${pkg.popular ? "text-primary" : "text-muted-foreground"}`} />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setPage("checkout")} className={`w-full py-3 rounded-full text-sm transition-all ${pkg.popular ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_4px_16px_rgba(196,149,74,0.35)]" : "border border-border hover:border-primary hover:text-primary"}`}>
                  Pilih Paket {pkg.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO USE */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3">Cara Kerja</p>
            <h2 className="font-serif text-4xl font-semibold">Mudah dalam 4 Langkah</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map(({ num, title, desc, icon: Icon }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(196,149,74,0.4)]"><Icon className="w-6 h-6" /></div>
                  <span className="absolute -top-2 -right-2 text-[10px] font-mono text-primary/50 bg-card border border-primary/20 rounded-full w-5 h-5 flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-serif font-semibold mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3">Testimoni</p>
            <h2 className="font-serif text-4xl font-semibold">Kata Mereka tentang Invito</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, avatar, rating, text, date }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-3xl p-7 border border-border hover:shadow-[0_8px_32px_rgba(196,149,74,0.1)] transition-all">
                <div className="flex text-yellow-400 text-sm mb-4">{"★".repeat(rating)}</div>
                <p className="text-sm leading-relaxed text-foreground/80 mb-6 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={`https://images.unsplash.com/photo-${avatar}?w=80&h=80&fit=crop&auto=format`} alt={name} className="w-10 h-10 rounded-full object-cover" />
                  <div><p className="text-sm font-semibold">{name}</p><p className="text-[11px] text-muted-foreground">{date}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-primary/8 via-secondary to-accent/20 rounded-3xl p-14 border border-primary/20 overflow-hidden text-center">
            <div className="absolute -top-10 -right-10 w-56 h-56 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <Heart className="w-10 h-10 text-primary fill-primary/15 mx-auto mb-5" />
              <h2 className="font-serif text-4xl font-semibold mb-4 leading-tight">Buat Undangan Pernikahan<br />Impianmu Sekarang</h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto leading-relaxed">Bergabung dengan 10.000+ pasangan yang telah mempercayai Invito untuk hari spesial mereka.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => setPage("checkout")} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_8px_28px_rgba(196,149,74,0.4)] flex items-center gap-2">
                  Mulai Gratis <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setPage("templates")} className="px-8 py-3.5 border border-border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-all">Lihat Semua Template</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 bg-foreground text-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-5">
                <Heart className="w-5 h-5 text-primary fill-primary/30" />
                <span className="font-serif text-xl font-semibold italic">Invito</span>
              </div>
              <p className="text-sm text-background/55 leading-relaxed max-w-xs">
                Platform undangan digital pernikahan terbaik di Indonesia. Jadikan momen spesial Anda semakin berkesan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Perusahaan</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => setPage("about")} className="text-sm text-background/55 hover:text-background transition-colors">Tentang Kami</button></li>
                <li><button onClick={() => setPage("about")} className="text-sm text-background/55 hover:text-background transition-colors">Karir</button></li>
                <li><button onClick={() => setPage("faq")} className="text-sm text-background/55 hover:text-background transition-colors">Blog</button></li>
                <li><button className="text-sm text-background/55 hover:text-background transition-colors">Press Kit</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Bantuan</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => setPage("faq")} className="text-sm text-background/55 hover:text-background transition-colors">FAQ</button></li>
                <li><button className="text-sm text-background/55 hover:text-background transition-colors">Panduan</button></li>
                <li><button onClick={() => setPage("contact")} className="text-sm text-background/55 hover:text-background transition-colors">Kontak</button></li>
                <li><button className="text-sm text-background/55 hover:text-background transition-colors">WhatsApp Support</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => setPage("privacy")} className="text-sm text-background/55 hover:text-background transition-colors">Kebijakan Privasi</button></li>
                <li><button onClick={() => setPage("terms")} className="text-sm text-background/55 hover:text-background transition-colors">Syarat & Ketentuan</button></li>
                <li><button className="text-sm text-background/55 hover:text-background transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-background/40">© 2025 Invito. Hak cipta dilindungi undang-undang.</p>
            <p className="text-xs text-background/40">Dibuat dengan ❤️ di Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({
  setPage,
  initialTab,
  onLogin
}: {
  setPage: (p: Page) => void
  initialTab: AuthTab
  onLogin: (user: { name: string; email: string }) => void
}) {
  const [tab, setTab] = useState<AuthTab>(initialTab)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Validasi sederhana
    if (tab === "register" && name.length < 3) {
      toast.error("Nama minimal 3 karakter!")
      return
    }
    if (email.length < 5 || !email.includes("@")) {
      toast.error("Email tidak valid!")
      return
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter!")
      return
    }
    // Simulasi login berhasil
    toast.success(tab === "login" ? "Login berhasil!" : "Registrasi berhasil!")
    // Set user sebagai logged in
    onLogin({
      name: tab === "register" ? name : "User",
      email: email
    })
    // Kembali ke halaman utama (frontend) setelah 1 detik
    setTimeout(() => {
      setPage("landing")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-secondary flex font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&h=1200&fit=crop&auto=format" alt="wedding" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/35 to-foreground/70" />
        <div className="relative z-10 flex flex-col p-12 text-white">
          <button onClick={() => setPage("landing")} className="flex items-center gap-2 mb-auto">
            <Heart className="w-5 h-5 text-primary fill-primary/30" />
            <span className="font-serif text-xl font-semibold italic">Invito</span>
          </button>
          <blockquote className="font-serif text-2xl italic leading-relaxed mb-5">&ldquo;Hari spesial Anda layak mendapat undangan yang sama spesialnya.&rdquo;</blockquote>
          <div className="flex -space-x-2 mb-2">
            {["1438761681033-6461ffad8d80", "1494790108755-2616b612b977", "1507003211169-0a1dd7228f2d"].map((id, i) => (
              <img key={i} src={`https://images.unsplash.com/photo-${id}?w=40&h=40&fit=crop&auto=format`} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="user" />
            ))}
          </div>
          <p className="text-sm text-white/65">10.000+ pasangan telah mempercayai kami</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <button onClick={() => setPage("landing")} className="flex items-center gap-2 mb-8 lg:hidden">
            <Heart className="w-5 h-5 text-primary fill-primary/30" />
            <span className="font-serif text-xl font-semibold italic">Invito</span>
          </button>
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-semibold mb-1.5">{tab === "login" ? "Selamat Datang Kembali" : "Mulai Perjalananmu"}</h2>
            <p className="text-muted-foreground text-sm">{tab === "login" ? "Masuk ke akun Invito Anda" : "Buat akun gratis dan buat undangan impian"}</p>
          </div>
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button onClick={() => setTab("login")} className={`flex-1 py-2.5 text-sm rounded-lg transition-all ${tab === "login" ? "bg-card shadow-sm font-semibold" : "text-muted-foreground"}`}>Masuk</button>
            <button onClick={() => setTab("register")} className={`flex-1 py-2.5 text-sm rounded-lg transition-all ${tab === "register" ? "bg-card shadow-sm font-semibold" : "text-muted-foreground"}`}>Daftar</button>
          </div>
          <button className="w-full flex items-center justify-center gap-3 py-3.5 border border-border rounded-xl mb-5 hover:bg-muted transition-colors text-sm font-medium">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Lanjutkan dengan Google
          </button>
          <div className="flex items-center gap-3 mb-5"><div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground">atau</span><div className="flex-1 h-px bg-border" /></div>
          <div className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Nama Lengkap</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Masukkan nama lengkap Anda" className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium">Password</label>
                {tab === "login" && <button className="text-xs text-primary hover:underline">Lupa password?</button>}
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <button onClick={handleLogin} className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_4px_16px_rgba(196,149,74,0.4)] mt-2">
              {tab === "login" ? "Masuk" : "Buat Akun Gratis"}
            </button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {tab === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
            <button onClick={() => setTab(tab === "login" ? "register" : "login")} className="text-primary hover:underline font-semibold">
              {tab === "login" ? "Daftar sekarang" : "Masuk di sini"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── EDIT PROFILE PAGE ───────────────────────────────────────────────────────
function EditProfilePage({
  setPage,
  currentUser,
  onUpdateProfile
}: {
  setPage: (p: Page) => void
  currentUser: { name: string; email: string } | null
  onUpdateProfile: (data: { name: string; email: string; password?: string }) => void
}) {
  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.length < 3) {
      toast.error("Nama minimal 3 karakter!")
      return
    }
    if (!email.includes("@")) {
      toast.error("Email tidak valid!")
      return
    }
    // Jika ada password baru, validasi
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        toast.error("Masukkan password lama!")
        return
      }
      if (newPassword.length < 6) {
        toast.error("Password baru minimal 6 karakter!")
        return
      }
      if (newPassword !== confirmPassword) {
        toast.error("Konfirmasi password tidak cocok!")
        return
      }
    }
    onUpdateProfile({
      name,
      email,
      password: newPassword || undefined
    })
    toast.success("Profil berhasil diperbarui!")
    setTimeout(() => setPage("landing"), 1000)
  }

  return (
    <div className="min-h-screen bg-secondary flex font-sans pt-20 pb-12">
      <div className="w-full max-w-2xl mx-auto px-6">
        <button onClick={() => setPage("landing")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronRight className="w-4 h-4 rotate-180" /> Kembali
        </button>
        <div className="bg-card rounded-2xl border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold">Edit Profil</h1>
              <p className="text-sm text-muted-foreground">Kelola informasi akun Anda</p>
            </div>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="border-t border-border pt-6 mt-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Ubah Password
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Kosongkan jika tidak ingin mengubah password</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Password Saat Ini</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Password Baru</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Konfirmasi Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setPage("landing")}
                className="flex-1 py-3 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function DashboardPage({
  setPage,
  onLogout
}: {
  setPage: (p: Page) => void
  onLogout: () => void
}) {
  const [activeMenu, setActiveMenu] = useState("Dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [txFilter, setTxFilter] = useState("Semua")

  const handleMenu = (label: string) => {
    setActiveMenu(label)
    if (label === "Edit Undangan") setPage("editor")
    setSidebarOpen(false)
  }

  const filtered = txFilter === "Semua" ? MOCK_TRANSACTIONS : MOCK_TRANSACTIONS.filter(t => t.status === txFilter)

  return (
    <div className="flex h-screen bg-muted overflow-hidden font-sans">
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-40 w-60 h-full bg-sidebar flex flex-col transition-transform duration-300 flex-shrink-0`}>
        <div className="px-5 py-5 border-b border-sidebar-border">
          <button onClick={() => setPage("landing")} className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary/25" />
            <span className="font-serif text-lg font-semibold italic text-sidebar-foreground">Invito</span>
          </button>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {SIDEBAR_NAV.map(({ icon: Icon, label }) => (
            <button key={label} onClick={() => handleMenu(label)} className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all ${activeMenu === label ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />{label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-primary" /></div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">Anisa Rahmawati</p>
              <p className="text-[10px] text-sidebar-foreground/45 truncate">anisa@email.com</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground text-xs transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </button>
        </div>
      </aside>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-foreground/40 z-30 lg:hidden" />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-card border-b border-border px-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"><Menu className="w-5 h-5" /></button>
            <div>
              <p className="text-sm font-semibold">{activeMenu}</p>
              <p className="text-[11px] text-muted-foreground hidden sm:block">Selamat datang, Anisa!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors"><Bell className="w-4 h-4" /><span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" /></button>
            <button onClick={() => setPage("checkout")} className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 transition-all hover:shadow-[0_2px_12px_rgba(196,149,74,0.35)]">
              <Plus className="w-3.5 h-3.5" /> Buat Undangan
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5">
          {activeMenu === "Transaksi" ? (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-semibold">Riwayat Transaksi</h2>
                  <p className="text-xs text-muted-foreground">{MOCK_TRANSACTIONS.length} transaksi total</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input placeholder="Cari transaksi..." className="pl-8 pr-3 py-2 text-xs border border-border rounded-lg bg-card outline-none focus:border-primary w-40" />
                  </div>
                  <div className="flex bg-card border border-border rounded-lg overflow-hidden">
                    {["Semua", "Paid", "Pending", "Expired", "Failed"].map(f => (
                      <button key={f} onClick={() => setTxFilter(f)} className={`px-2.5 py-2 text-[11px] transition-colors ${txFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>{f}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        {["No. Invoice", "Tanggal", "Pelanggan", "Paket", "Metode Bayar", "Total", "Status", ""].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((tx, i) => (
                        <tr key={tx.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                          <td className="px-4 py-3 text-xs font-mono text-primary">{tx.id}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{tx.date}</td>
                          <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">{tx.customer}</td>
                          <td className="px-4 py-3"><span className="text-xs bg-secondary px-2 py-1 rounded-full">{tx.package}</span></td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{tx.method}</td>
                          <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{fmt(tx.amount)}</td>
                          <td className="px-4 py-3"><StatusBadge status={tx.status} /></td>
                          <td className="px-4 py-3">
                            <button className="text-[10px] text-primary hover:underline whitespace-nowrap">Detail</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filtered.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground text-sm">Tidak ada transaksi ditemukan</div>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {[
                  { label: "Total Pendapatan", value: "Rp 1.343.000", icon: TrendingUp, color: "text-green-500 bg-green-50" },
                  { label: "Transaksi Berhasil", value: "4", icon: CheckCircle2, color: "text-primary bg-primary/10" },
                  { label: "Menunggu Bayar", value: "1", icon: Clock, color: "text-yellow-500 bg-yellow-50" },
                  { label: "Transaksi Gagal", value: "2", icon: XCircle, color: "text-red-500 bg-red-50" },
                ].map(({ label, value, icon: Icon, color }, i) => (
                  <div key={i} className="bg-card rounded-xl p-4 border border-border">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${color}`}><Icon className="w-4 h-4" /></div>
                    <p className="text-lg font-bold">{value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                {[
                  { label: "Total Kunjungan", value: "2.847", change: "+12%", icon: TrendingUp, colorCls: "text-blue-500 bg-blue-50" },
                  { label: "Jumlah Tamu", value: "248", change: "+8 baru", icon: Users, colorCls: "text-primary bg-primary/10" },
                  { label: "RSVP Masuk", value: "186", change: "75%", icon: Check, colorCls: "text-green-500 bg-green-50" },
                  { label: "Amplop Digital", value: "Rp 12,4jt", change: "+450rb", icon: Gift, colorCls: "text-purple-500 bg-purple-50" },
                ].map(({ label, value, change, icon: Icon, colorCls }, i) => (
                  <div key={i} className="bg-card rounded-2xl p-4 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorCls}`}><Icon className="w-4 h-4" /></div>
                      <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{change}</span>
                    </div>
                    <p className="text-xl font-semibold mb-0.5">{value}</p>
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-3 gap-4 mb-5">
                <div className="lg:col-span-2 bg-card rounded-2xl p-5 border border-border">
                  <div className="flex items-center justify-between mb-5">
                    <div><h3 className="text-sm font-semibold">Statistik Kunjungan</h3><p className="text-[11px] text-muted-foreground">7 hari terakhir</p></div>
                    <select className="text-xs border border-border rounded-lg px-2 py-1.5 bg-muted outline-none cursor-pointer"><option>7 hari</option><option>30 hari</option></select>
                  </div>
                  <ResponsiveContainer width="100%" height={190}>
                    <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C4954A" stopOpacity={0.18} />
                          <stop offset="95%" stopColor="#C4954A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8C7456" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#8C7456" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(196,149,74,0.2)", borderRadius: "0.75rem", fontSize: 12 }} cursor={{ stroke: "rgba(196,149,74,0.2)" }} />
                      <Area type="monotone" dataKey="views" stroke="#C4954A" strokeWidth={2} fill="url(#goldGrad)" dot={false} activeDot={{ r: 4, fill: "#C4954A" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-card rounded-2xl p-5 border border-border">
                  <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">RSVP Terbaru</h3><button className="text-xs text-primary hover:underline">Lihat semua</button></div>
                  <div className="space-y-3">
                    {[
                      { name: "Dewi Sartika", status: "Hadir", time: "5 mnt lalu" },
                      { name: "Ahmad Fauzi", status: "Hadir", time: "12 mnt lalu" },
                      { name: "Rina Kusuma", status: "Tidak Hadir", time: "1 jam lalu" },
                      { name: "Budi Santoso", status: "Hadir", time: "2 jam lalu" },
                      { name: "Maya Putri", status: "Hadir", time: "3 jam lalu" },
                    ].map(({ name, status, time }, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-[11px] font-semibold text-primary flex-shrink-0">{name[0]}</div>
                          <div><p className="text-xs font-medium">{name}</p><p className="text-[10px] text-muted-foreground">{time}</p></div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${status === "Hadir" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">Undangan Saya</h3><button onClick={() => setPage("checkout")} className="text-xs text-primary flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Buat baru</button></div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "Anisa & Raka", theme: "Elegant", status: "Published", visits: "2.847" },
                    { title: "Draft Undangan 2", theme: "Floral", status: "Draft", visits: "—" },
                  ].map(({ title, theme, status, visits }, i) => (
                    <div key={i} className="border border-border rounded-xl overflow-hidden group hover:shadow-md transition-all">
                      <div className="h-28 bg-gradient-to-br from-secondary to-accent/40 flex items-center justify-center relative">
                        <p className="font-serif text-base">{title}</p>
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button onClick={() => setPage("editor")} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs shadow-md">Edit</button>
                        </div>
                      </div>
                      <div className="px-3.5 py-2.5 flex items-center justify-between">
                        <div><p className="text-xs font-medium">{theme}</p><p className="text-[10px] text-muted-foreground">{visits} kunjungan</p></div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${status === "Published" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>{status}</span>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setPage("checkout")} className="border-2 border-dashed border-border rounded-xl min-h-[120px] flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors text-muted-foreground">
                    <Plus className="w-6 h-6" /><span className="text-xs">Buat Undangan Baru</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

// ─── EDITOR PAGE ─────────────────────────────────────────────────────────────
function EditorPage({ setPage }: { setPage: (p: Page) => void }) {
  const [activeTab, setActiveTab] = useState("Tema")
  const [activeSection, setActiveSection] = useState("Opening")
  const [selectedTheme, setSelectedTheme] = useState(0)

  return (
    <div className="flex h-screen bg-muted overflow-hidden font-sans">
      <div className="w-64 bg-card border-r border-border flex flex-col flex-shrink-0">
        <div className="flex border-b border-border overflow-x-auto">
          {EDITOR_TABS.map(({ icon: Icon, label }) => (
            <button key={label} onClick={() => setActiveTab(label)} className={`flex flex-col items-center gap-1 px-3.5 py-3 flex-shrink-0 text-[10px] transition-colors ${activeTab === label ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "Halaman" && (
            <div>
              <p className="text-[10px] text-muted-foreground mb-3 font-semibold uppercase tracking-widest">Urutan Halaman</p>
              <div className="space-y-1.5">
                {PAGES_LIST.map((pg, i) => (
                  <div key={pg} onClick={() => setActiveSection(pg)} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${activeSection === pg ? "bg-primary/10 border border-primary/25" : "border border-transparent hover:bg-muted"}`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${activeSection === pg ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                    <span className="text-xs font-medium">{pg}</span>
                    {activeSection === pg && <Check className="w-3 h-3 text-primary ml-auto flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "Tema" && (
            <div>
              <p className="text-[10px] text-muted-foreground mb-3 font-semibold uppercase tracking-widest">Pilih Tema</p>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map(({ name, img }, i) => (
                  <button key={i} onClick={() => setSelectedTheme(i)} className={`relative rounded-xl overflow-hidden aspect-[3/4] border-2 transition-all ${selectedTheme === i ? "border-primary" : "border-transparent hover:border-primary/30"}`}>
                    <img src={`https://images.unsplash.com/photo-${img}?w=200&h=280&fit=crop&auto=format`} alt={name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-foreground/60 to-transparent p-2"><p className="text-white text-[10px] font-medium">{name}</p></div>
                    {selectedTheme === i && <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeTab !== "Halaman" && activeTab !== "Tema" && (
            <div className="flex flex-col items-center justify-center h-36 text-muted-foreground text-center gap-2">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                {activeTab === "Background" && <Image className="w-5 h-5" />}
                {activeTab === "Font" && <Type className="w-5 h-5" />}
                {activeTab === "Musik" && <Music className="w-5 h-5" />}
                {activeTab === "Foto" && <Camera className="w-5 h-5" />}
              </div>
              <p className="text-xs">Panel {activeTab}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 bg-card border-b border-border px-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setPage("dashboard")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"><ChevronRight className="w-3.5 h-3.5 rotate-180" />Dashboard</button>
            <span className="text-muted-foreground/30 select-none">|</span>
            <div className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-primary fill-primary/20" /><span className="text-xs font-semibold">Anisa & Raka</span></div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="px-2.5 py-1.5 text-[11px] border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-1"><Eye className="w-3 h-3" /> Preview</button>
            <button className="px-2.5 py-1.5 text-[11px] border border-border rounded-lg hover:bg-muted transition-colors">Simpan</button>
            <button className="px-2.5 py-1.5 text-[11px] bg-muted rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-1"><Share2 className="w-3 h-3" /> Bagikan</button>
            <button className="px-3.5 py-1.5 text-[11px] bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">Publish</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 flex items-start justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-[280px] bg-foreground rounded-[2.5rem] p-3 shadow-2xl">
              <div className="w-full bg-background rounded-[2rem] overflow-hidden min-h-[560px]">
                <div className="relative">
                  <img src={`https://images.unsplash.com/photo-${THEMES[selectedTheme].img}?w=400&h=280&fit=crop&auto=format`} alt="wedding" className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
                </div>
                <div className="px-6 pb-6 -mt-3 text-center">
                  <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">The Wedding of</p>
                  <h2 className="font-serif text-2xl font-semibold mb-1">Anisa &amp; Raka</h2>
                  <div className="w-14 h-px bg-primary/35 mx-auto my-3" />
                  <p className="text-[10px] text-muted-foreground">Sabtu, 12 Januari 2025</p>
                  <p className="text-[10px] text-muted-foreground mb-4">Ballroom Hotel Mulia, Jakarta</p>
                  <div className="flex items-center justify-center gap-1.5 mb-5 bg-primary/8 rounded-full py-2 px-4">
                    <Clock className="w-3 h-3 text-primary" /><span className="text-[10px] text-primary font-medium">30 hari lagi</span>
                  </div>
                  <button className="w-full py-2.5 bg-primary text-white text-[11px] rounded-full font-medium">Buka Undangan</button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {PAGES_LIST.slice(0, 5).map(s => (
                <button key={s} onClick={() => setActiveSection(s)} className={`px-3 py-1 text-[11px] rounded-full transition-all ${activeSection === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:border-primary"}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-60 bg-card border-l border-border flex-shrink-0 overflow-y-auto">
        <div className="px-4 py-3.5 border-b border-border"><h3 className="text-xs font-semibold">Pengaturan Elemen</h3></div>
        <div className="p-4 space-y-5">
          {[{ label: "Warna Background", value: "#FAF8F4" }, { label: "Warna Teks", value: "#2A1F1A" }, { label: "Warna Aksen", value: "#C4954A" }].map(({ label, value }, i) => (
            <div key={i}>
              <label className="text-[10px] text-muted-foreground mb-2 block font-semibold uppercase tracking-wide">{label}</label>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg border border-border shadow-sm" style={{ backgroundColor: value }} />
                <span className="text-[11px] font-mono bg-muted px-2 py-1 rounded-lg">{value}</span>
              </div>
            </div>
          ))}
          <div>
            <label className="text-[10px] text-muted-foreground mb-2 block font-semibold uppercase tracking-wide">Font Judul</label>
            <select className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-muted outline-none focus:border-primary cursor-pointer">
              <option>Playfair Display</option><option>Cormorant Garamond</option><option>Great Vibes</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-2 block font-semibold uppercase tracking-wide">Ukuran Font <span className="font-normal normal-case text-foreground">28px</span></label>
            <input type="range" min="16" max="48" defaultValue="28" className="w-full accent-primary" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-2 block font-semibold uppercase tracking-wide">Padding</label>
            <div className="grid grid-cols-2 gap-2">
              {["Top", "Right", "Bottom", "Left"].map(dir => (
                <div key={dir}><p className="text-[9px] text-muted-foreground/70 mb-0.5">{dir}</p><input defaultValue="16" className="w-full text-xs border border-border rounded-lg px-2 py-1.5 bg-muted outline-none focus:border-primary text-center" /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/// ─── CHECKOUT PAGE ───────────────────────────────────────────────────────────
function CheckoutPage({ setPage }: { setPage: (p: Page) => void }) {
  const [selectedPkg, setSelectedPkg] = useState("standard")
  const [form, setForm] = useState({
    name: "",
    email: "",
    wa: "",
    bride: "",
    groom: "",
    date: ""
  })
  const pkg = PACKAGES.find(p => p.id === selectedPkg)!

  // HANYA simpan draft ke current_invitation, JANGAN ke user_invitations
  useEffect(() => {
    if (form.bride && form.groom && form.date) {
      const invitationData = {
        id: `inv_${Date.now()}`,
        brideName: form.bride,
        groomName: form.groom,
        weddingDate: form.date,
        coupleName: `${form.bride} & ${form.groom}`,
        theme: "Elegant",
        package: pkg.name,
        status: "Pending",
        visits: "0",
        purchaseDate: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        isActive: false,
        description: "",
        guestList: [],
        gallery: [],
        logoSound: "",
        invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`,
        paymentMethod: "",
        total: pkg.price
      }
      // HANYA simpan sebagai draft, JANGAN push ke user_invitations
      localStorage.setItem('current_invitation', JSON.stringify(invitationData))
    }
  }, [form.bride, form.groom, form.date, pkg.name])

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => setPage("landing")} className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary fill-primary/20" />
            <span className="font-serif text-lg font-semibold italic">Invito</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 text-primary font-medium">
              <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">1</div>
              Pilih Paket
            </div>
            <div className="w-8 h-px bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-[10px]">2</div>
              Metode Bayar
            </div>
            <div className="w-8 h-px bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-[10px]">3</div>
              Konfirmasi
            </div>
          </div>
          <button onClick={() => setPage("landing")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />Kembali
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold mb-1">Pilih Paket & Checkout</h1>
          <p className="text-muted-foreground text-sm">Pilih paket yang sesuai dengan kebutuhan Anda</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />Pilih Paket
              </h2>
              <div className="space-y-3">
                {PACKAGES.map((p) => (
                  <label
                    key={p.id}
                    onClick={() => setSelectedPkg(p.id)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPkg === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${selectedPkg === p.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                      {selectedPkg === p.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm">{p.name}</span>
                        {p.popular && <span className="px-1.5 py-0.5 bg-primary text-primary-foreground rounded text-[9px] font-medium">POPULER</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{p.subtitle}</p>
                      <div className="flex flex-wrap gap-1">
                        {p.features.slice(0, 3).map((f, i) => (
                          <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{f}</span>
                        ))}
                        {p.features.length > 3 && <span className="text-[10px] text-muted-foreground">+{p.features.length - 3} lainnya</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {p.originalPrice && <p className="text-[10px] text-muted-foreground line-through">{fmt(p.originalPrice)}</p>}
                      <p className="font-bold text-foreground">{fmt(p.price)}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />Detail Undangan
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Nama Mempelai Wanita", key: "bride", placeholder: "Nama mempelai wanita" },
                  { label: "Nama Mempelai Pria", key: "groom", placeholder: "Nama mempelai pria" },
                  { label: "Tanggal Pernikahan", key: "date", placeholder: "", type: "date" },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key} className={key === "date" ? "sm:col-span-2" : ""}>
                    <label className="text-xs font-medium mb-1.5 block">{label}</label>
                    <input
                      type={type ?? "text"}
                      placeholder={placeholder}
                      value={(form as any)[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />Data Pemesan
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Nama Lengkap", key: "name", placeholder: "Masukkan nama lengkap", type: "text" },
                  { label: "Alamat Email", key: "email", placeholder: "nama@email.com", type: "email" },
                  { label: "Nomor WhatsApp", key: "wa", placeholder: "08xxxxxxxxxx", type: "tel" },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="text-xs font-medium mb-1.5 block">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={(form as any)[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold mb-5">Ringkasan Pesanan</h2>
              <div className="bg-gradient-to-br from-secondary to-accent/20 rounded-xl p-4 mb-5 border border-primary/15">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Paket dipilih</p>
                    <p className="font-serif font-semibold">{pkg.name}</p>
                  </div>
                  <span className="text-xs bg-primary/15 text-primary rounded-full px-2 py-0.5">Aktif</span>
                </div>
                <p className="text-xs text-muted-foreground">{pkg.subtitle}</p>
              </div>
              <div className="space-y-2.5 mb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Harga paket</span>
                  <span>{fmt(pkg.price)}</span>
                </div>
                {pkg.originalPrice && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Hemat</span>
                    <span className="text-green-600">-{fmt(pkg.originalPrice - pkg.price)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Biaya layanan</span>
                  <span>Gratis</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between font-bold">
                  <span>Total Pembayaran</span>
                  <span className="text-primary">{fmt(pkg.price)}</span>
                </div>
              </div>
              <button
                onClick={() => setPage("payment-method")}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_4px_16px_rgba(196,149,74,0.4)] flex items-center justify-center gap-2"
              >
                Lanjut ke Pembayaran <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1"><Shield className="w-3 h-3" />Pembayaran aman</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Xendit secured</div>
              </div>
            </div>

            <div className="mt-4 bg-card rounded-xl p-4 border border-border">
              <p className="text-xs font-semibold mb-2">Fitur Paket {pkg.name}</p>
              <ul className="space-y-1.5">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PAYMENT METHOD PAGE ──────────────────────────────────────────────────────
function PaymentMethodPage({ setPage }: { setPage: (p: Page) => void }) {
  const [activeGroup, setActiveGroup] = useState("va")
  const [selected, setSelected] = useState<string | null>(null)
  const group = PAYMENT_GROUPS.find(g => g.id === activeGroup)!
  const pkg = PACKAGES[1]

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => setPage("landing")} className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary fill-primary/20" />
            <span className="font-serif text-lg font-semibold italic">Invito</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 text-muted-foreground"><div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" /></div>Pilih Paket</div>
            <div className="w-8 h-px bg-border" />
            <div className="flex items-center gap-1.5 text-primary font-medium"><div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">2</div>Metode Bayar</div>
            <div className="w-8 h-px bg-border" />
            <div className="flex items-center gap-1.5"><div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-[10px]">3</div>Konfirmasi</div>
          </div>
          <button onClick={() => setPage("checkout")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5 rotate-180" />Kembali</button>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold mb-1">Pilih Metode Pembayaran</h1>
          <p className="text-muted-foreground text-sm">Powered by <span className="font-semibold text-foreground">Xendit</span> — Pembayaran aman & terpercaya</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="flex overflow-x-auto border-b border-border">
                {PAYMENT_GROUPS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => { setActiveGroup(id); setSelected(null) }} className={`flex items-center gap-2 px-4 py-3.5 text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeGroup === id ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </div>
              <div className="p-5">
                <p className="text-xs text-muted-foreground mb-4">Pilih {group.label} yang ingin Anda gunakan:</p>
                <div className="space-y-2.5">
                  {group.items.map((item) => (
                    <label key={item.code} onClick={() => setSelected(item.code)} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selected === item.code ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/30"}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${selected === item.code ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                        {selected === item.code && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <BankChip code={item.code} bg={item.bg} fg={item.fg} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        {item.badge && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">Biaya admin</p>
                        <p className="text-xs font-medium">{item.fee}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-5 p-4 bg-secondary rounded-xl border border-border">
                  <p className="text-xs font-semibold mb-2">Cara Pembayaran {group.label}:</p>
                  <ol className="space-y-1.5">
                    {activeGroup === "va" && ["Salin nomor Virtual Account yang diberikan", "Buka aplikasi mobile banking atau ATM", "Pilih menu Transfer ke Virtual Account", "Masukkan nomor VA dan konfirmasi pembayaran"].map((s, i) => <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary font-medium flex-shrink-0">{i + 1}.</span>{s}</li>)}
                    {activeGroup === "ewallet" && ["Tap tombol 'Bayar Sekarang'", "Anda akan diarahkan ke aplikasi e-wallet", "Konfirmasi pembayaran di aplikasi e-wallet", "Kembali ke halaman ini setelah selesai"].map((s, i) => <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary font-medium flex-shrink-0">{i + 1}.</span>{s}</li>)}
                    {activeGroup === "qris" && ["Tap tombol 'Bayar Sekarang'", "QR Code akan ditampilkan di layar", "Buka aplikasi e-wallet atau bank Anda", "Scan QR Code dan konfirmasi pembayaran"].map((s, i) => <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary font-medium flex-shrink-0">{i + 1}.</span>{s}</li>)}
                    {activeGroup === "card" && ["Masukkan nomor kartu kredit/debit Anda", "Masukkan tanggal kadaluarsa dan CVV", "Verifikasi dengan OTP yang dikirim ke HP", "Pembayaran akan diproses secara otomatis"].map((s, i) => <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary font-medium flex-shrink-0">{i + 1}.</span>{s}</li>)}
                    {activeGroup === "retail" && ["Kunjungi gerai Alfamart atau Indomaret terdekat", "Tunjukkan kode pembayaran ke kasir", "Bayar sesuai jumlah yang tertera", "Simpan struk sebagai bukti pembayaran"].map((s, i) => <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary font-medium flex-shrink-0">{i + 1}.</span>{s}</li>)}
                    {activeGroup === "paylater" && ["Pilih metode cicilan yang diinginkan", "Daftarkan akun PayLater jika belum punya", "Verifikasi identitas dan limit kredit", "Konfirmasi cicilan dan proses pembayaran"].map((s, i) => <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary font-medium flex-shrink-0">{i + 1}.</span>{s}</li>)}
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold mb-5">Ringkasan Pembayaran</h2>
              <div className="bg-gradient-to-br from-secondary to-accent/20 rounded-xl p-4 mb-5 border border-primary/15">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center"><Package className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">Paket</p><p className="font-semibold text-sm">{pkg.name}</p></div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between"><span>Harga paket</span><span>{fmt(pkg.price)}</span></div>
                  <div className="flex justify-between text-green-600"><span>Diskon</span><span>-{fmt(pkg.originalPrice! - pkg.price)}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-primary/15 flex justify-between font-bold text-sm">
                  <span>Total</span><span className="text-primary">{fmt(pkg.price)}</span>
                </div>
              </div>
              {selected && (
                <div className="mb-4 p-3 bg-primary/8 rounded-xl border border-primary/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium">Metode dipilih</p>
                    <p className="text-xs text-muted-foreground">{group.items.find(i => i.code === selected)?.name}</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => { if (selected) setPage("payment-waiting"); else toast.error("Pilih metode pembayaran terlebih dahulu") }}
                className={`w-full py-3.5 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${selected ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_4px_16px_rgba(196,149,74,0.4)]" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
              >
                {selected ? <><CreditCard className="w-4 h-4" />Bayar Sekarang</> : "Pilih Metode Dulu"}
              </button>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[9px] text-muted-foreground">
                <div className="flex items-center gap-1"><Shield className="w-3 h-3" />SSL Encrypted</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Xendit Secured</div>
                <div className="flex items-center gap-1"><Shield className="w-3 h-3" />PCI DSS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PAYMENT WAITING PAGE ─────────────────────────────────────────────────────
function PaymentWaitingPage({ setPage }: { setPage: (p: Page) => void }) {
  const [copied, setCopied] = useState(false)
  const vaNumber = "8808 8088 5050 1234"
  const pkg = PACKAGES[1]

  const handleCopy = () => {
    setCopied(true)
    toast.success("Nomor VA berhasil disalin!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => setPage("landing")} className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary fill-primary/20" />
            <span className="font-serif text-lg font-semibold italic">Invito</span>
          </button>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 border border-yellow-200 px-3 py-1 rounded-full">
              <Clock className="w-3 h-3" /> Menunggu Pembayaran
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-50 border-2 border-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="font-serif text-3xl font-semibold mb-2">Selesaikan Pembayaran</h1>
          <p className="text-muted-foreground text-sm">Selesaikan pembayaran sebelum waktu habis</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border mb-5 flex flex-col items-center">
          <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Batas Waktu Pembayaran</p>
          <CountdownTimer initialSeconds={24 * 60 * 60} />
          <p className="text-xs text-muted-foreground mt-3">Pembayaran akan otomatis dibatalkan jika melewati batas waktu</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm">BCA Virtual Account</h2>
              <BankChip code="BCA" bg="#003D6E" fg="#FFFFFF" />
            </div>
            <p className="text-xs text-muted-foreground mb-3">Nomor Virtual Account:</p>
            <div className="flex items-center gap-3 p-3.5 bg-secondary rounded-xl border border-border mb-4">
              <span className="font-mono font-bold text-lg tracking-wider flex-1">{vaNumber}</span>
              <button onClick={handleCopy} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${copied ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary hover:bg-primary/20"}`}>
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Tersalin!" : "Salin"}
              </button>
            </div>
            <div className="text-xs space-y-1.5 text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Cara Bayar:</p>
              {["Buka aplikasi BCA Mobile atau m-BCA", "Pilih m-Transfer → BCA Virtual Account", "Masukkan nomor VA di atas", "Konfirmasi pembayaran"].map((s, i) => (
                <div key={i} className="flex gap-2"><span className="text-primary font-medium w-4 flex-shrink-0">{i + 1}.</span>{s}</div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="font-semibold text-sm mb-4">Detail Pesanan</h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between"><span className="text-muted-foreground">No. Invoice</span><span className="font-mono text-xs text-primary">INV-20250112-001</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Nama</span><span className="font-medium">Anisa Rahmawati</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mempelai</span><span className="font-medium">Anisa & Raka</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Paket</span><span>{pkg.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Metode</span><span>BCA Virtual Account</span></div>
              <div className="h-px bg-border" />
              <div className="flex justify-between font-bold"><span>Total Bayar</span><span className="text-primary">{fmt(pkg.price)}</span></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPage("payment-success")} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-medium hover:bg-primary/90 transition-all">
                Cek Status
              </button>
              <button className="flex-1 py-2.5 border border-border rounded-full text-xs hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1">
                <Download className="w-3 h-3" />Instruksi
              </button>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-sm">Atau Bayar dengan QRIS</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Scan dengan GoPay, OVO, DANA, ShopeePay, dll</p>
            </div>
            <BankChip code="QRIS" bg="#CC0000" fg="#FFFFFF" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <QRCodeDisplay />
            <div className="text-sm space-y-2 text-muted-foreground">
              <p className="font-medium text-foreground text-xs mb-3">Cara Bayar QRIS:</p>
              {["Buka aplikasi e-wallet pilihan Anda", "Pilih fitur Scan QR / QRIS", "Arahkan kamera ke QR Code", "Konfirmasi jumlah dan selesaikan pembayaran"].map((s, i) => (
                <div key={i} className="flex gap-2 text-xs"><span className="text-primary font-medium w-4 flex-shrink-0">{i + 1}.</span>{s}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 p-4 bg-yellow-50 rounded-xl border border-yellow-200 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700">Jangan tutup halaman ini. Undangan Anda akan aktif otomatis setelah pembayaran berhasil dikonfirmasi. Proses verifikasi maksimal 1×24 jam.</p>
        </div>
      </div>
    </div>
  )
}

// ─── PAYMENT SUCCESS PAGE ────────────────────────────────────────────────────
function PaymentSuccessPage({ setPage }: { setPage: (p: Page) => void }) {
  const pkg = PACKAGES[1]
  const [saved, setSaved] = useState(false)

  // HANYA simpan ke user_invitations SEKALI saat pembayaran berhasil
  useEffect(() => {
    if (saved) return // Cegah double-save

    const currentInvitation = localStorage.getItem('current_invitation')
    if (currentInvitation) {
      try {
        const invitation = JSON.parse(currentInvitation)
        const updatedInvitation = {
          ...invitation,
          status: "Paid",
          isActive: true,
          paymentMethod: "BCA Virtual Account",
          total: pkg.price,
          invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`
        }
        localStorage.setItem('current_invitation', JSON.stringify(updatedInvitation))

        // TAMBAHKAN ke user_invitations HANYA SEKALI
        const allInvitations = JSON.parse(localStorage.getItem('user_invitations') || '[]')
        const existingIndex = allInvitations.findIndex((inv: any) => inv.id === invitation.id)

        if (existingIndex >= 0) {
          // Update yang sudah ada
          allInvitations[existingIndex] = updatedInvitation
        } else {
          // Tambah baru HANYA jika belum ada
          allInvitations.push(updatedInvitation)
        }
        localStorage.setItem('user_invitations', JSON.stringify(allInvitations))
        setSaved(true) // Tandai sudah disimpan
      } catch (error) {
        console.error('Error updating invitation status:', error)
      }
    }
  }, [saved, pkg.price])

  return (
    <div className="min-h-screen bg-secondary font-sans flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <div className="text-center mb-8">
            <div className="relative inline-block mb-5">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-green-100 rounded-full opacity-40"
              />
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">Pembayaran Berhasil!</h1>
            <p className="text-muted-foreground text-sm">Terima kasih, undangan Anda sedang diproses</p>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden mb-5">
            <div className="bg-gradient-to-r from-green-50 to-primary/5 px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">No. Invoice</p>
                <p className="text-xs font-mono font-bold text-primary">INV-20250112-001</p>
              </div>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {[
                { label: "Status", value: <StatusBadge status="Paid" /> },
                { label: "Tanggal Bayar", value: "12 Januari 2025, 14:32 WIB" },
                { label: "Mempelai", value: "Anisa & Raka" },
                { label: "Paket", value: pkg.name },
                { label: "Metode Bayar", value: "BCA Virtual Account" },
                { label: "Total Bayar", value: <span className="font-bold text-primary">{fmt(pkg.price)}</span> },
              ].map(({ label, value }, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-primary/8 rounded-xl border border-primary/20 flex items-start gap-3 mb-6">
            <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 fill-primary/20" />
            <div>
              <p className="text-xs font-medium text-primary mb-0.5">Undangan sedang diproses</p>
              <p className="text-xs text-muted-foreground">
                Kami akan mengirimkan notifikasi ke email <strong>anisa@email.com</strong> dan WhatsApp setelah undangan Anda siap dalam 1×24 jam.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setPage("purchase-history")}
              className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_4px_16px_rgba(196,149,74,0.4)] flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />Lihat Undangan Saya
            </button>
            <button className="flex-1 py-3.5 border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />Unduh Bukti Bayar
            </button>
          </div>

          <button
            onClick={() => setPage("landing")}
            className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-2"
          >
            Kembali ke Beranda
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// ─── PAYMENT FAILED PAGE ─────────────────────────────────────────────────────
function PaymentFailedPage({ setPage }: { setPage: (p: Page) => void }) {
  const [reason, setReason] = useState<"failed" | "expired">("expired")

  return (
    <div className="min-h-screen bg-secondary font-sans flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-center mb-6">
            <div className="flex bg-card rounded-lg border border-border p-1">
              <button onClick={() => setReason("expired")} className={`px-3 py-1.5 text-xs rounded-md transition-all ${reason === "expired" ? "bg-yellow-50 text-yellow-600 border border-yellow-200" : "text-muted-foreground"}`}>Kadaluarsa</button>
              <button onClick={() => setReason("failed")} className={`px-3 py-1.5 text-xs rounded-md transition-all ${reason === "failed" ? "bg-red-50 text-red-500 border border-red-200" : "text-muted-foreground"}`}>Gagal</button>
            </div>
          </div>
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              {reason === "expired" ? <Clock className="w-12 h-12 text-yellow-500" /> : <XCircle className="w-12 h-12 text-red-500" />}
            </div>
            <h1 className="font-serif text-3xl font-semibold mb-2">
              {reason === "expired" ? "Pembayaran Kadaluarsa" : "Pembayaran Gagal"}
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              {reason === "expired"
                ? "Batas waktu pembayaran telah habis. Pesanan Anda dibatalkan secara otomatis."
                : "Terjadi kesalahan saat memproses pembayaran Anda. Silakan coba lagi."}
            </p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 mb-5">
            <h3 className="font-semibold text-sm mb-3">Detail Transaksi</h3>
            <div className="space-y-2.5 text-sm">
              {[
                { label: "No. Invoice", value: <span className="font-mono text-xs text-muted-foreground">INV-20250112-001</span> },
                { label: "Status", value: <StatusBadge status={reason === "expired" ? "Expired" : "Failed"} /> },
                { label: "Paket", value: "Standard" },
                { label: "Jumlah", value: fmt(199000) },
                { label: "Alasan", value: <span className="text-xs text-red-500">{reason === "expired" ? "Waktu pembayaran habis (24 jam)" : "Transaksi ditolak oleh bank"}</span> },
              ].map(({ label, value }, i) => (
                <div key={i} className="flex justify-between items-center"><span className="text-muted-foreground">{label}</span>{value}</div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 mb-5">
            <button onClick={() => setPage("payment-method")} className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_4px_16px_rgba(196,149,74,0.4)] flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />Coba Lagi dengan Metode Lain
            </button>
            <button onClick={() => setPage("payment-waiting")} className="w-full py-3.5 border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />Gunakan Metode Sama
            </button>
          </div>
          <div className="p-5 bg-card rounded-2xl border border-border">
            <p className="text-xs font-semibold mb-3 flex items-center gap-2"><Headphones className="w-4 h-4 text-primary" />Butuh Bantuan?</p>
            <p className="text-xs text-muted-foreground mb-3">Hubungi tim customer service kami jika Anda mengalami masalah pembayaran.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border rounded-full text-xs hover:border-primary hover:text-primary transition-all">
                <MessageCircle className="w-3.5 h-3.5" />WhatsApp CS
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border rounded-full text-xs hover:border-primary hover:text-primary transition-all">
                <Mail className="w-3.5 h-3.5" />Email Support
              </button>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-3">Tersedia Senin–Sabtu, 08.00–21.00 WIB</p>
          </div>
          <button onClick={() => setPage("landing")} className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-2">
            Kembali ke Beranda
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// ─── HALAMAN TAMBAHAN ─────────────────────────────────────────────────────────
function TemplatesPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <button onClick={() => setPage("landing")} className="text-sm text-muted-foreground mb-8">← Kembali ke Beranda</button>
        <h1 className="font-serif text-4xl font-semibold mb-4 text-center">Pilihan Tema Kami</h1>
        <p className="text-muted-foreground mb-12 text-center">Ratusan tema elegan siap digunakan.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEMES.map(({ name, img, badge }, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-${img}?w=600&h=400&fit=crop&auto=format`}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                {badge && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-medium">
                    {badge}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{name}</h3>
                <p className="text-xs text-muted-foreground mb-3">24 variasi tersedia</p>
                <button
                  onClick={() => setPage("checkout")}
                  className="w-full py-2 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-colors"
                >
                  Gunakan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeaturesPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <button onClick={() => setPage("landing")} className="text-sm text-muted-foreground mb-8">← Kembali ke Beranda</button>
        <h1 className="font-serif text-4xl font-semibold mb-4 text-center">Fitur Lengkap</h1>
        <div className="grid sm:grid-cols-2 gap-4 mt-12">
          {["Custom Domain", "RSVP & Ucapan", "Amplop Digital", "Galeri Foto", "Musik Latar", "Google Maps", "QR Code Check-In", "Live Streaming"].map((f, i) => (
            <div key={i} className="p-4 bg-card border border-border rounded-xl">
              <h3 className="font-semibold">{f}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PricingPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <button onClick={() => setPage("landing")} className="text-sm text-muted-foreground mb-8">← Kembali ke Beranda</button>
        <h1 className="font-serif text-4xl font-semibold mb-4">Pilih Paket Anda</h1>
        <p className="text-muted-foreground mb-8">Lihat detail harga dan fitur lengkap di halaman checkout.</p>
        <button onClick={() => setPage("checkout")} className="px-6 py-3 bg-primary text-primary-foreground rounded-full">Lihat Paket</button>
      </div>
    </div>
  )
}

function AboutPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <button onClick={() => setPage("landing")} className="text-sm text-muted-foreground mb-8">← Kembali ke Beranda</button>
        <h1 className="font-serif text-4xl font-semibold mb-6">Tentang Kami</h1>
        <p className="text-muted-foreground leading-relaxed">Invito adalah platform undangan digital pernikahan #1 di Indonesia. Kami membantu ribuan pasangan mewujudkan undangan impian mereka dengan mudah, cepat, dan elegan.</p>
      </div>
    </div>
  )
}

function FAQPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <button onClick={() => setPage("landing")} className="text-sm text-muted-foreground mb-8">← Kembali ke Beranda</button>
        <h1 className="font-serif text-4xl font-semibold mb-6">Pertanyaan Umum</h1>
        <div className="space-y-4">
          <div className="p-4 bg-card rounded-xl">
            <h3 className="font-semibold mb-2">Berapa lama proses pembuatan?</h3>
            <p className="text-sm text-muted-foreground">Hanya butuh 30 menit!</p>
          </div>
          <div className="p-4 bg-card rounded-xl">
            <h3 className="font-semibold mb-2">Apakah bisa diedit setelah diterbitkan?</h3>
            <p className="text-sm text-muted-foreground">Ya, Anda bisa mengedit kapan saja.</p>
          </div>
          <div className="p-4 bg-card rounded-xl">
            <h3 className="font-semibold mb-2">Bagaimana cara membagikan undangan?</h3>
            <p className="text-sm text-muted-foreground">Cukup copy link dan bagikan via WhatsApp atau media sosial.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <button onClick={() => setPage("landing")} className="text-sm text-muted-foreground mb-8">← Kembali ke Beranda</button>
        <h1 className="font-serif text-4xl font-semibold mb-6">Hubungi Kami</h1>
        <p className="text-muted-foreground mb-2">Email: support@invito.id</p>
        <p className="text-muted-foreground mb-2">WhatsApp: 0812-3456-7890</p>
        <p className="text-muted-foreground">Alamat: Jakarta, Indonesia</p>
      </div>
    </div>
  )
}

function TermsPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <button onClick={() => setPage("landing")} className="text-sm text-muted-foreground mb-8">← Kembali ke Beranda</button>
        <h1 className="font-serif text-4xl font-semibold mb-6">Syarat & Ketentuan</h1>
        <p className="text-muted-foreground leading-relaxed">Dengan menggunakan Invito, Anda menyetujui syarat dan ketentuan yang berlaku. Pembayaran bersifat non-refundable setelah undangan diterbitkan.</p>
      </div>
    </div>
  )
}

function PrivacyPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <button onClick={() => setPage("landing")} className="text-sm text-muted-foreground mb-8">← Kembali ke Beranda</button>
        <h1 className="font-serif text-4xl font-semibold mb-6">Kebijakan Privasi</h1>
        <p className="text-muted-foreground leading-relaxed">Privasi Anda sangat penting bagi kami. Kami tidak akan membagikan data pribadi Anda ke pihak ketiga tanpa izin.</p>
      </div>
    </div>
  )
}

//// ─── PURCHASE HISTORY PAGE ─────────────────────────────────────────────────────
function PurchaseHistoryPage({ setPage }: { setPage: (p: Page) => void }) {
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load data dari localStorage saat komponen di-mount
  useEffect(() => {
    const loadInvitations = () => {
      const allInvitations = JSON.parse(localStorage.getItem('user_invitations') || '[]')
      // Hanya tampilkan data dari localStorage, JANGAN buat data default
      setInvitations(allInvitations)
      setLoading(false)
    }
    loadInvitations()

    // Listen untuk perubahan storage
    const handleStorageChange = () => {
      loadInvitations()
    }
    window.addEventListener('storage', handleStorageChange)
    // Juga listen untuk custom event jika ada update di tab yang sama
    window.addEventListener('invitation-updated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('invitation-updated', handleStorageChange)
    }
  }, [])

  // UBAH DI SINI: handleEdit sekarang mengarah ke template-selection
  const handleEdit = (invitation: any) => {
    localStorage.setItem('current_invitation', JSON.stringify(invitation))
    setPage("template-selection")  // ← UBAH dari "invitation-editor" ke "template-selection"
  }

  const handleToggleActive = (invitation: any) => {
    const updated = { ...invitation, isActive: !invitation.isActive }
    localStorage.setItem('current_invitation', JSON.stringify(updated))

    const allInvitations = JSON.parse(localStorage.getItem('user_invitations') || '[]')
    const index = allInvitations.findIndex((i: any) => i.id === invitation.id)
    if (index >= 0) {
      allInvitations[index] = updated
      localStorage.setItem('user_invitations', JSON.stringify(allInvitations))
    }

    setInvitations(invitations.map(i => i.id === invitation.id ? updated : i))

    // Dispatch custom event untuk update di komponen lain
    window.dispatchEvent(new Event('invitation-updated'))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <button
          onClick={() => setPage("history")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Kembali ke Riwayat Transaksi
        </button>

        <h1 className="font-serif text-4xl font-semibold mb-2 text-center">Riwayat Pembelian</h1>
        <p className="text-muted-foreground mb-12 text-center">Kelola undangan digital yang telah Anda beli</p>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Memuat data...</div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Belum ada undangan yang dibeli</p>
            <button
              onClick={() => setPage("checkout")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all"
            >
              Buat Undangan Pertama
            </button>
          </div>
        ) : (
          <div className="grid gap-6 max-w-2xl mx-auto">
            {invitations.map((inv) => {
              const themeImages: Record<string, string> = {
                "Elegant": "1519225421980-715cb0215aed",
                "Floral": "1550005809-91ad75fb315f",
                "Minimalist": "1464366400600-7168b8af9bc3",
                "Modern": "1469371670807-013ccf25f16a",
                "Traditional": "1583939003579-730e3918a45a",
                "Luxury": "1519741497674-611481863552"
              }
              const imgId = themeImages[inv.theme] || "1519225421980-715cb0215aed"
              const themeImageUrl = `https://images.unsplash.com/photo-${imgId}?w=400&h=300&fit=crop&auto=format`

              return (
                <div key={inv.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={themeImageUrl}
                      alt={inv.theme}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${inv.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                        }`}>
                        {inv.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className="font-serif text-2xl font-semibold">
                        {inv.brideName && inv.groomName
                          ? `${inv.brideName} & ${inv.groomName}`
                          : inv.coupleName || "Undangan"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {inv.theme || "Elegant"} • {inv.package || "Standard"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Kunjungan</p>
                        <p className="font-semibold">{inv.visits || "0"}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <p className="font-semibold text-sm">
                          {inv.isActive ? "Aktif" : "Nonaktif"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tanggal Pembelian:</span>
                        <span>{inv.purchaseDate || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Berlaku Hingga:</span>
                        <span>{inv.validUntil || "-"}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(inv)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${inv.isActive
                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                      >
                        {inv.isActive ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        onClick={() => handleEdit(inv)}
                        className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
                      >
                        Edit Undangan
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


// ── INVITATION EDITOR PAGE ────────────────────────────────────────────────────
function InvitationEditorPage({ setPage }: { setPage: (p: Page) => void }) {
  const [activeMenu, setActiveMenu] = useState<"template" | "addGuest">("template")
  const [formData, setFormData] = useState({
    brideName: "",
    groomName: "",
    weddingDate: "",
    description: "",
    guestName: "",
    gallery: [] as string[],
    logoSound: ""
  })
  const [guestList, setGuestList] = useState<string[]>([])
  const [invitationId, setInvitationId] = useState<string>("")
  const [loaded, setLoaded] = useState(false)

  // Load data dari localStorage - JANGAN buat ID baru, gunakan yang sudah ada
  useEffect(() => {
    const savedData = localStorage.getItem('current_invitation')
    if (savedData) {
      try {
        const existingData = JSON.parse(savedData)
        // Gunakan ID yang sudah ada, JANGAN buat baru
        setInvitationId(existingData.id)
        setFormData({
          brideName: existingData.brideName || "",
          groomName: existingData.groomName || "",
          weddingDate: existingData.weddingDate || "",
          description: existingData.description || "",
          guestName: "",
          gallery: existingData.gallery || [],
          logoSound: existingData.logoSound || ""
        })
        setGuestList(existingData.guestList || [])
        setLoaded(true)
      } catch (error) {
        console.error('Error loading invitation data:', error)
      }
    }
  }, [])

  const handleAddGuest = () => {
    if (!formData.guestName.trim()) {
      toast.error("Nama tamu tidak boleh kosong!")
      return
    }
    if (formData.guestName.includes(" ")) {
      toast.error("Nama tamu tidak boleh ada spasi!")
      return
    }
    if (guestList.includes(formData.guestName)) {
      toast.error("Nama tamu sudah ada di daftar!")
      return
    }
    const updatedGuestList = [...guestList, formData.guestName]
    setGuestList(updatedGuestList)
    setFormData({ ...formData, guestName: "" })
    toast.success("Tamu berhasil ditambahkan!")
    saveToLocalStorage(updatedGuestList)
  }

  const handleRemoveGuest = (index: number) => {
    const updatedGuestList = guestList.filter((_, i) => i !== index)
    setGuestList(updatedGuestList)
    toast.success("Tamu berhasil dihapus!")
    saveToLocalStorage(updatedGuestList)
  }

  const saveToLocalStorage = (currentGuestList?: string[]) => {
    if (!invitationId) {
      toast.error("ID undangan tidak ditemukan!")
      return
    }

    const guestsToSave = currentGuestList || guestList
    const invitationData = {
      id: invitationId, // Gunakan ID yang sudah ada, JANGAN buat baru
      coupleName: formData.brideName && formData.groomName
        ? `${formData.brideName} & ${formData.groomName}`
        : "Anisa & Raka",
      brideName: formData.brideName,
      groomName: formData.groomName,
      weddingDate: formData.weddingDate,
      description: formData.description,
      guestList: guestsToSave,
      gallery: formData.gallery,
      logoSound: formData.logoSound,
      theme: "Elegant",
      package: "Standard",
      status: "Published",
      visits: "2.847",
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    // Simpan ke current_invitation
    localStorage.setItem('current_invitation', JSON.stringify(invitationData))

    // UPDATE yang sudah ada di user_invitations, JANGAN buat baru
    const allInvitations = JSON.parse(localStorage.getItem('user_invitations') || '[]')
    const existingIndex = allInvitations.findIndex((inv: any) => inv.id === invitationId)

    if (existingIndex >= 0) {
      // Update yang sudah ada
      allInvitations[existingIndex] = invitationData
    } else {
      // Jika tidak ada (seharusnya tidak terjadi), tambahkan
      allInvitations.push(invitationData)
    }
    localStorage.setItem('user_invitations', JSON.stringify(allInvitations))
  }

  const handleSave = () => {
    if (!formData.brideName || !formData.groomName) {
      toast.error("Mohon lengkapi nama mempelai!")
      return
    }
    if (!formData.weddingDate) {
      toast.error("Mohon pilih tanggal pernikahan!")
      return
    }
    saveToLocalStorage()
    toast.success("Data undangan berhasil disimpan!")
  }

  const handleCancel = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan? Perubahan yang belum disimpan akan hilang.")) {
      setPage("purchase-history")
    }
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <button
          onClick={() => setPage("purchase-history")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Kembali ke Riwayat Pembelian
        </button>

        <h1 className="font-serif text-4xl font-semibold mb-2 text-center">Editor Undangan Digital</h1>
        <p className="text-muted-foreground mb-12 text-center">Kustomisasi undangan digital Anda</p>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveMenu("template")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${activeMenu === "template"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            Template
          </button>
          <button
            onClick={() => setActiveMenu("addGuest")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${activeMenu === "addGuest"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            Tambah Tamu
          </button>
        </div>

        {activeMenu === "template" ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-serif text-2xl font-semibold mb-6">Tambah Data</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nama Pengantin</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={formData.brideName}
                      onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                      placeholder="Nama mempelai wanita"
                      className="px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      value={formData.groomName}
                      onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                      placeholder="Nama mempelai pria"
                      className="px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tanggal</label>
                  <input
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tulis deskripsi undangan..."
                    rows={4}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Nama yang Diundang</label>
                  <input
                    type="text"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="Nama tamu (tanpa spasi)"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Galeri</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      const fileNames = files.map(f => f.name)
                      setFormData({ ...formData, gallery: fileNames })
                      toast.success(`${fileNames.length} foto dipilih!`)
                    }}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm"
                  />
                  {formData.gallery.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {formData.gallery.length} file dipilih
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Logo Back Sound</label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData({ ...formData, logoSound: file.name })
                        toast.success("Audio dipilih!")
                      }
                    }}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm"
                  />
                  {formData.logoSound && (
                    <p className="text-xs text-muted-foreground mt-2">
                      File: {formData.logoSound}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-serif text-2xl font-semibold mb-6">Tambah Tamu</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nama Tamu</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddGuest()
                        }
                      }}
                      placeholder="Nama tamu (tidak boleh ada spasi)"
                      className="flex-1 px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary"
                    />
                    <button
                      onClick={handleAddGuest}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all"
                    >
                      Tambah
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    * Nama tamu tidak boleh mengandung spasi. Gunakan underscore (_) jika diperlukan.
                  </p>
                </div>
                {guestList.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-3">Daftar Tamu ({guestList.length})</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {guestList.map((guest, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm">{guest}</span>
                          <button
                            onClick={() => handleRemoveGuest(index)}
                            className="text-xs text-red-500 hover:text-red-600 font-medium"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {guestList.length === 0 && (
                  <div className="mt-6 p-8 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Belum ada tamu yang ditambahkan</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────
function HistoryPage({ setPage }: { setPage: (p: Page) => void }) {
  const [txFilter, setTxFilter] = useState("Semua")
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load data dari localStorage
  useEffect(() => {
    const loadInvitations = () => {
      const allInvitations = JSON.parse(localStorage.getItem('user_invitations') || '[]')

      // Hanya ambil data dari localStorage, jangan buat default
      setInvitations(allInvitations)
      setLoading(false)
    }

    loadInvitations()

    const handleStorageChange = () => {
      loadInvitations()
    }
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('invitation-updated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('invitation-updated', handleStorageChange)
    }
  }, [])

  // Filter transaksi berdasarkan status
  const filteredInvitations = invitations.filter(inv => {
    if (txFilter === "Semua") return true
    if (txFilter === "Paid") return inv.status === "Paid"
    if (txFilter === "Pending") return inv.status === "Pending"
    if (txFilter === "Expired") return inv.status === "Expired"
    if (txFilter === "Failed") return inv.status === "Failed"
    return true
  })

  const handleEdit = (invitation: any) => {
    localStorage.setItem('current_invitation', JSON.stringify(invitation))
    setPage("template-selection")  // ← UBAH dari "invitation-editor" ke "template-selection"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <button
          onClick={() => setPage("landing")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Kembali ke Beranda
        </button>

        <h1 className="font-serif text-4xl font-semibold mb-2">Riwayat Transaksi</h1>
        <p className="text-muted-foreground mb-8">Lihat semua transaksi dan kelola undangan Anda</p>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setPage("checkout")}
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all text-left"
          >
            <Plus className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-sm mb-1">Buat Undangan Baru</h3>
            <p className="text-xs text-muted-foreground">Mulai dari Rp 99.000</p>
          </button>
          <button
            onClick={() => setPage("purchase-history")}
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all text-left"
          >
            <Edit3 className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-sm mb-1">Edit Undangan</h3>
            <p className="text-xs text-muted-foreground">Kustomisasi desain</p>
          </button>
          <button
            onClick={() => setPage("templates")}
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all text-left"
          >
            <Layout className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-sm mb-1">Lihat Template</h3>
            <p className="text-xs text-muted-foreground">Pilih tema baru</p>
          </button>
        </div>

        {/* Transaction Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-lg">Riwayat Transaksi</h2>
                <p className="text-xs text-muted-foreground">{filteredInvitations.length} transaksi total</p>
              </div>
              <div className="flex bg-muted rounded-lg overflow-hidden border border-border">
                {["Semua", "Paid", "Pending", "Expired", "Failed"].map(f => (
                  <button
                    key={f}
                    onClick={() => setTxFilter(f)}
                    className={`px-3 py-2 text-xs transition-colors ${txFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/80"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Memuat data...</div>
          ) : filteredInvitations.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <p>Belum ada transaksi. Silakan buat undangan baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">NO. INVOICE</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">TANGGAL</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">PELANGGAN</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">PAKET</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">METODE BAYAR</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">TOTAL</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">STATUS</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvitations.map((inv, index) => (
                    <tr key={inv.id || index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-primary">
                        {inv.invoiceNumber || `INV-${String(index + 1).padStart(3, '0')}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {inv.date || inv.purchaseDate || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {inv.brideName && inv.groomName
                          ? `${inv.brideName} & ${inv.groomName}`
                          : inv.coupleName || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                          {inv.package || "Standard"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {inv.paymentMethod || "BCA Virtual Account"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {inv.total ? `Rp ${inv.total.toLocaleString('id-ID')}` : "Rp 199.000"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${inv.status === "Paid" ? "bg-green-50 text-green-600" :
                          inv.status === "Pending" ? "bg-yellow-50 text-yellow-600" :
                            inv.status === "Expired" ? "bg-gray-100 text-gray-600" :
                              "bg-red-50 text-red-500"
                          }`}>
                          {inv.status || "Paid"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(inv)}
                          className="text-xs text-primary hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── TEMPLATE SELECTION PAGE ─────────────────────────────────────────────────
function TemplateSelectionPage({ setPage }: { setPage: (p: Page) => void }) {
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null)
  const [currentInvitation, setCurrentInvitation] = useState<any>(null)

  // Load data undangan yang sedang diedit
  useEffect(() => {
    const saved = localStorage.getItem('current_invitation')
    if (saved) {
      try {
        setCurrentInvitation(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading invitation:', error)
      }
    }
  }, [])

  const handlePreview = () => {
    if (selectedTheme === null) {
      toast.error("Pilih template terlebih dahulu!")
      return
    }
    alert("Halaman Preview akan segera hadir! Fitur ini sedang dalam pengembangan.")
  }

  const handleUseTemplate = () => {
    if (selectedTheme === null) {
      toast.error("Pilih template terlebih dahulu!")
      return
    }

    // Update tema di current_invitation
    const themeName = THEMES[selectedTheme].name
    if (currentInvitation) {
      const updatedInvitation = {
        ...currentInvitation,
        theme: themeName
      }
      localStorage.setItem('current_invitation', JSON.stringify(updatedInvitation))

      // Update juga di user_invitations
      const allInvitations = JSON.parse(localStorage.getItem('user_invitations') || '[]')
      const existingIndex = allInvitations.findIndex((inv: any) => inv.id === currentInvitation.id)
      if (existingIndex >= 0) {
        allInvitations[existingIndex] = updatedInvitation
        localStorage.setItem('user_invitations', JSON.stringify(allInvitations))
      }
    }

    toast.success(`Template "${themeName}" dipilih!`)
    // Redirect ke Editor Undangan Digital
    setTimeout(() => {
      setPage("invitation-editor")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <button
          onClick={() => setPage("purchase-history")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Kembali ke Riwayat Pembelian
        </button>

        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-semibold mb-2">Pilih Template</h1>
          <p className="text-muted-foreground">Pilih tema yang sesuai dengan konsep pernikahan Anda</p>
        </div>

        {/* Info Undangan */}
        {currentInvitation && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-xl font-semibold truncate">
                    {currentInvitation.brideName && currentInvitation.groomName
                      ? `${currentInvitation.brideName} & ${currentInvitation.groomName}`
                      : currentInvitation.coupleName || "Undangan"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {currentInvitation.theme || "Elegant"} • {currentInvitation.package || "Standard"}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">Tanggal</p>
                  <p className="text-sm font-medium">
                    {currentInvitation.weddingDate || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid Template */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          {THEMES.map(({ name, img, badge }, i) => (
            <div
              key={i}
              onClick={() => setSelectedTheme(i)}
              className={`relative bg-card rounded-2xl border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg ${selectedTheme === i
                ? "border-primary shadow-[0_0_0_3px_rgba(196,149,74,0.2)]"
                : "border-border hover:border-primary/30"
                }`}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-${img}?w=600&h=400&fit=crop&auto=format`}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
                {badge && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-medium">
                    {badge}
                  </div>
                )}
                {selectedTheme === i && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm">{name}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">24 variasi tersedia</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={handlePreview}
            className="flex-1 py-3.5 border border-border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button
            onClick={handleUseTemplate}
            className={`flex-1 py-3.5 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${selectedTheme !== null
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_4px_16px_rgba(196,149,74,0.4)]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
          >
            Gunakan Template <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── ROOT APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("landing")
  const [authTab, setAuthTab] = useState<AuthTab>("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null)

  // Fungsi saat login berhasil - CLEAR localStorage agar history kosong
  const handleLogin = (user: { name: string; email: string }) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    // Clear semua data localStorage saat login baru
    localStorage.removeItem('current_invitation')
    localStorage.removeItem('user_invitations')
    localStorage.removeItem('editing_invitation')
  }

  // Fungsi saat logout
  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    // Clear semua data localStorage saat logout
    localStorage.removeItem('current_invitation')
    localStorage.removeItem('user_invitations')
    localStorage.removeItem('editing_invitation')
    setPage("landing")
    toast.success("Berhasil logout!")
  }

  // Fungsi update profile
  const handleUpdateProfile = (data: { name: string; email: string; password?: string }) => {
    setCurrentUser({ name: data.name, email: data.email })
    if (data.password) {
      toast.success("Password berhasil diubah!")
    }
  }

  const render = () => {
    switch (page) {
      case "login":
        return <AuthPage setPage={setPage} initialTab={authTab} onLogin={handleLogin} />
      case "dashboard":
        return <DashboardPage setPage={setPage} onLogout={handleLogout} />
      case "edit-profile":
        return <EditProfilePage setPage={setPage} currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />
      case "history":
        return <HistoryPage setPage={setPage} />
      case "purchase-history":
        return <PurchaseHistoryPage setPage={setPage} />
      case "invitation-editor":
        return <InvitationEditorPage setPage={setPage} />
      case "template-selection":  // ← TAMBAHKAN INI
        return <TemplateSelectionPage setPage={setPage} />
      case "editor": return <EditorPage setPage={setPage} />
      case "checkout": return <CheckoutPage setPage={setPage} />
      case "payment-method": return <PaymentMethodPage setPage={setPage} />
      case "payment-waiting": return <PaymentWaitingPage setPage={setPage} />
      case "payment-success": return <PaymentSuccessPage setPage={setPage} />
      case "payment-failed": return <PaymentFailedPage setPage={setPage} />
      case "templates": return <TemplatesPage setPage={setPage} />
      case "pricing": return <PricingPage setPage={setPage} />
      case "features": return <FeaturesPage setPage={setPage} />
      case "about": return <AboutPage setPage={setPage} />
      case "faq": return <FAQPage setPage={setPage} />
      case "contact": return <ContactPage setPage={setPage} />
      case "terms": return <TermsPage setPage={setPage} />
      case "privacy": return <PrivacyPage setPage={setPage} />
      default:
        return (
          <LandingPage
            setPage={setPage}
            setAuthTab={setAuthTab}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )
    }
  }

  return (
    <>
      {render()}
      <Toaster position="top-center" richColors />
    </>
  )
}
