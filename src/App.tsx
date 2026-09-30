import { useState, useEffect } from 'react'
import { SceneCanvas }   from './components/SceneCanvas'
import { Nail3DModel }   from './components/Nail3DModel'
import { BookingModal }  from './components/BookingModal'
import confetti          from 'canvas-confetti'
import { Sliders, ChevronDown, Check, Wand2, Compass, Sparkles, Clock, HelpCircle, Info, Layers } from 'lucide-react'
import type { NailShapeType } from './components/Nail3DModel'

/* ─── Story Acts ─── */
const ACTS = [
  { num: '01', label: 'LA MATRIZ',    act: 1 },
  { num: '02', label: 'ESCULPIDO',    act: 2 },
  { num: '03', label: 'REFRACCIÓN',   act: 3 },
  { num: '04', label: 'ALTA COSTURA', act: 4 },
]

/* ─── Catálogo de Acabados & Precios de Referencia Colombia (Bogotá/Medellín) ─── */
interface FinishOption {
  id: string
  label: string
  category: 'Tendencia' | 'Lujo' | 'Clásico'
  basePriceCOP: number
  duration: string
  desc: string
}

const FINISHES: FinishOption[] = [
  { id: 'aura',            label: 'Korean Blush Aura',    category: 'Tendencia', basePriceCOP: 125000, duration: '1h 45m', desc: 'Difuminado degradado estilo coreano con acabado jugoso' },
  { id: 'chrome',          label: 'Molten Cyber Chrome',  category: 'Lujo',      basePriceCOP: 140000, duration: '1h 50m', desc: 'Espejo plateado líquido reflectivo de alto impacto' },
  { id: 'cateye',          label: 'Velvet Cat-Eye 3D',    category: 'Tendencia', basePriceCOP: 135000, duration: '1h 45m', desc: 'Partículas magnéticas que cambian con la luz' },
  { id: 'rosegold',        label: 'Oro Rosa Líquido',     category: 'Lujo',      basePriceCOP: 145000, duration: '1h 50m', desc: 'Espejo rosado de alta costura con micro-reflejos' },
  { id: 'tortoise',        label: 'Carey & Ámbar 3D',     category: 'Lujo',      basePriceCOP: 145000, duration: '2h 00m', desc: 'Efecto carey translúcido con vetas profundas' },
  { id: 'lavender_aura',   label: 'Aura Lavanda Pastel',  category: 'Tendencia', basePriceCOP: 130000, duration: '1h 45m', desc: 'Aura etérea en tonos lilas y flor de lavanda' },
  { id: 'emerald',         label: 'Mármol Jade & Oro',    category: 'Lujo',      basePriceCOP: 155000, duration: '2h 10m', desc: 'Textura mineral imperial con toques en pan de oro' },
  { id: 'ruby_velvet',     label: 'Cat-Eye Rubí Borgoña', category: 'Tendencia', basePriceCOP: 140000, duration: '1h 50m', desc: 'Rojo rubí magnético aterciopelado de noche' },
  { id: 'microfrench',     label: 'Micro French Gold',    category: 'Clásico',   basePriceCOP: 115000, duration: '1h 30m', desc: 'Sonrisa francesa milimétrica de máxima sofisticación' },
  { id: 'cobalt_chrome',   label: 'Cromo Azul Cobalto',   category: 'Lujo',      basePriceCOP: 145000, duration: '1h 50m', desc: 'Azul cobalto cromado futurista electrizante' },
  { id: 'oxblood',         label: 'Oxblood Glass',        category: 'Clásico',   basePriceCOP: 120000, duration: '1h 30m', desc: 'Tono cereza negra / borgoña profundo ultra cristalino' },
  { id: 'terracotta',      label: 'Terracota Nude Chic',  category: 'Clásico',   basePriceCOP: 115000, duration: '1h 30m', desc: 'Satinado cálido natural que combina con todo' },
  { id: 'liquid',          label: 'Oro Fundido 24K',      category: 'Lujo',      basePriceCOP: 160000, duration: '2h 15m', desc: 'Relieves metálicos dorados esculpidos a mano' },
  { id: 'milky_glaze',     label: 'Milky Glaze Nácar',    category: 'Tendencia', basePriceCOP: 120000, duration: '1h 30m', desc: 'Blanco lechoso con destellos de perla glaseada' },
  { id: 'glass',           label: 'Cristal Rosé Quartz',  category: 'Lujo',      basePriceCOP: 150000, duration: '2h 00m', desc: 'Estructura translúcida tipo cuarzo rosa con refracción' },
  { id: 'sunset_chrome',   label: 'Sunset Chrome Boreal', category: 'Lujo',      basePriceCOP: 145000, duration: '1h 55m', desc: 'Iridiscencia melocotón y oro que cambia de color' },
]

/* ─── Formas de Uña Profesionales ─── */
const SHAPES = [
  { id: 'almond',  label: 'Almendra',  desc: 'Estiliza y alarga los dedos' },
  { id: 'coffin',  label: 'Coffin / Ballerina', desc: 'Moderna y estructurada' },
  { id: 'stiletto',label: 'Stiletto',  desc: 'Puntiaguda y vanguardista' },
  { id: 'oval',    label: 'Ovalada',   desc: 'Suave, natural y resistente' },
]

/* ─── Tamaños / Largos Profesionales (Escala Salón Colombia: #1 a #4) ─── */
const LENGTHS = [
  { id: 0, num: '#1', label: 'Natural / Corto', addCOP: 0,     extraTime: '0m',   ideal: 'Oficina y comodidad' },
  { id: 1, num: '#2', label: 'Medio / Salón',   addCOP: 20000, extraTime: '+15m', ideal: 'El largo más solicitado' },
  { id: 2, num: '#3', label: 'Largo Editorial', addCOP: 40000, extraTime: '+30m', ideal: 'Eventos y fotos' },
  { id: 3, num: '#4', label: 'Extremo XXL',     addCOP: 65000, extraTime: '+45m', ideal: 'Haute Couture' },
]

/* ─── Preguntas Frecuentes Clientes Colombia ─── */
const FAQS = [
  {
    q: '¿Cuánto tiempo dura el set completo?',
    a: 'Nuestras aplicaciones estructuradas en Soft Gel y Polygel de alta gama duran entre 3 y 4 semanas intactas sin desprendimientos. Recomendamos mantenimiento cada 21 a 28 días.'
  },
  {
    q: '¿El servicio maltrata o debilita mi uña natural?',
    a: 'No. Aplicamos la técnica de Manicura Rusa / Combinada sin limado agresivo de la placa ungueal. Usamos bases niveladoras de biotina que protegen y estimulan el crecimiento natural.'
  },
  {
    q: '¿Qué incluye la tarifa en pesos colombianos (COP)?',
    a: 'Incluye: retiro de esmalte previo suave, limpieza profunda de cutícula con fresas diamantadas, nivelación de estructura, esculpido 3D, esmaltado semipermanente de autor, hidratación con aceite de cutícula y masaje relajante.'
  },
  {
    q: '¿Cómo elijo el largo y la forma correcta?',
    a: 'Si usas teclado con frecuencia o prefieres practicidad, el largo #1 o #2 en forma Almendra u Ovalada es el más recomendado. Para eventos especiales o si amas el impacto visual, Coffin o Stiletto en largo #3.'
  },
]

export default function App() {
  const [progress,      setProgress]      = useState(0)
  const [activeAct,     setActiveAct]     = useState(1)
  const [isCustom,      setIsCustom]      = useState(false)
  const [activeStyle,   setActiveStyle]   = useState('aura')
  const [activeLength,  setActiveLength]  = useState(1)
  const [activeShape,   setActiveShape]   = useState('almond')
  const [activeTab,     setActiveTab]     = useState<'design' | 'guide'>('design')
  const [bookingOpen,   setBookingOpen]   = useState(false)
  const [bookingDone,   setBookingDone]   = useState(false)

  /* ─── Cálculo Dinámico de Precios Colombia ─── */
  const currentFinish = FINISHES.find((f) => f.id === activeStyle) || FINISHES[0]
  const currentLength = LENGTHS.find((l) => l.id === activeLength) || LENGTHS[1]
  const currentShape  = SHAPES.find((s) => s.id === activeShape) || SHAPES[0]
  const totalPriceCOP = currentFinish.basePriceCOP + currentLength.addCOP

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(totalPriceCOP)

  /* ─── Scroll listener ─── */
  useEffect(() => {
    const onScroll = () => {
      const total   = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return
      const p = Math.min(window.scrollY / total, 1)
      setProgress(p)
      setActiveAct(p < 0.25 ? 1 : p < 0.5 ? 2 : p < 0.75 ? 3 : 4)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ─── Booking confirm ─── */
  const handleConfirm = () => {
    setBookingOpen(false)
    setBookingDone(true)
    confetti({
      particleCount: 130,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#b8924a', '#d4849a', '#f5f1ec', '#ffffff', '#d4b07a'],
    })
    setTimeout(() => setBookingDone(false), 6000)
  }

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '400vh', background: 'var(--bg)' }}>

      {/* ── Ambient light orbs ── */}
      <div className="orb" style={{ top:'5%',  left:'10%',  width:'420px', height:'420px', background:'rgba(212,176,122,0.18)' }} />
      <div className="orb" style={{ top:'38%', right:'8%',  width:'480px', height:'480px', background:'rgba(212,132,154,0.13)', animationDelay:'6s' }} />
      <div className="orb" style={{ top:'70%', left:'15%',  width:'380px', height:'380px', background:'rgba(184,146,74,0.12)',  animationDelay:'3s' }} />

      {/* ── Progress bar ── */}
      <div className="progress-bar" style={{ width: `${progress * 100}%` }} />

      {/* ── 3D Canvas (always behind UI) ── */}
      <SceneCanvas>
        <Nail3DModel
          progress={progress}
          activeStyle={activeStyle}
          activeLength={activeLength}
          activeShape={activeShape as NailShapeType}
          isCustomizing={isCustom}
        />
      </SceneCanvas>

      {/* ════════════════════════════════════════
          HEADER
          ════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, width: '100%',
        padding: '20px 40px', zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(250,249,247,0.92) 0%, rgba(250,249,247,0) 100%)',
        backdropFilter: 'blur(0px)',
        pointerEvents: 'auto',
      }}>
        {/* Brand */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{
            width:'38px', height:'38px', borderRadius:'50%',
            border:'1.5px solid var(--gold)', display:'flex', alignItems:'center',
            justifyContent:'center', color:'var(--gold)',
            fontFamily:'var(--font-heading)', fontSize:'15px', fontWeight:700,
            background:'rgba(184,146,74,0.06)',
          }}>É</div>
          <div>
            <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'17px', letterSpacing:'4px', margin:0, color:'var(--text-dark)', fontWeight:400 }}>
              L'ÉLÉGANCE
            </h1>
            <p style={{ fontSize:'9px', letterSpacing:'2px', color:'var(--text-mute)', margin:0, textTransform:'uppercase' }}>
              Haute Nail Architecture 3D
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
          <button
            onClick={() => setIsCustom(!isCustom)}
            className="pill"
            style={{
              padding:'9px 18px', borderRadius:'30px',
              color: isCustom ? '#fff' : 'var(--gold)',
              background: isCustom ? 'var(--gold)' : 'rgba(255,255,255,0.75)',
              fontFamily:'var(--font-heading)', fontSize:'10px', letterSpacing:'2px',
              cursor:'pointer', display:'flex', alignItems:'center', gap:'8px',
              transition:'all 0.3s ease',
            }}
          >
            {isCustom ? <Compass size={13} /> : <Sliders size={13} />}
            {isCustom ? 'VER HISTORIA 3D' : 'ESTUDIO CUSTOM 3D'}
          </button>

          <button
            className="btn-gold"
            onClick={() => setBookingOpen(true)}
            style={{ padding:'9px 22px', borderRadius:'30px', fontSize:'10px', boxShadow:'0 6px 20px rgba(184,146,74,0.28)' }}
          >
            RESERVAR CITA
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════
          STORY PROGRESS INDICATOR
          ════════════════════════════════════════ */}
      {!isCustom && (
        <nav style={{
          position:'fixed', left:'36px', top:'50%', transform:'translateY(-50%)',
          zIndex:20, display:'flex', flexDirection:'column', gap:'22px',
        }}>
          {ACTS.map((a) => (
            <div
              key={a.num}
              style={{
                display:'flex', alignItems:'center', gap:'10px',
                opacity: activeAct === a.act ? 1 : 0.28,
                transition:'opacity 0.4s ease',
              }}
            >
              <div style={{
                width:'7px', height:'7px', borderRadius:'50%',
                background: activeAct === a.act ? 'var(--gold)' : 'var(--text-mute)',
                boxShadow: activeAct === a.act ? '0 0 10px var(--gold)' : 'none',
                transition:'all 0.4s ease',
              }} />
              <span style={{ fontFamily:'var(--font-heading)', fontSize:'9px', letterSpacing:'2px', color:'var(--text-mid)' }}>
                {a.num} / {a.label}
              </span>
            </div>
          ))}
        </nav>
      )}

      {/* ════════════════════════════════════════
          CUSTOMISER PANEL
          ════════════════════════════════════════ */}
      {/* ════════════════════════════════════════
          CUSTOMISER & SALON GUIDE PANEL
          ════════════════════════════════════════ */}
      {isCustom && (
        <aside
          className="glass"
          style={{
            position:'fixed', right:'28px', top:'50%', transform:'translateY(-50%)',
            zIndex:40, width:'350px', maxHeight:'88vh', padding:'20px', borderRadius:'22px',
            color:'var(--text-dark)', pointerEvents:'auto',
            display:'flex', flexDirection:'column',
            boxShadow:'0 24px 60px rgba(80,60,40,0.16)',
            overflowY:'auto',
          }}
        >
          {/* Header & Tabs */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
              <Wand2 size={15} color="var(--gold)" />
              <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'12px', letterSpacing:'2px', margin:0, fontWeight:600, color:'var(--text-dark)' }}>
                ATELIER 3D & GUÍA
              </h3>
            </div>

            <div style={{ display:'flex', background:'rgba(184,146,74,0.08)', borderRadius:'18px', padding:'3px' }}>
              <button
                onClick={() => setActiveTab('design')}
                style={{
                  padding:'4px 10px', borderRadius:'14px', border:'none', cursor:'pointer', fontSize:'9px', letterSpacing:'1px',
                  background: activeTab === 'design' ? 'var(--gold)' : 'transparent',
                  color: activeTab === 'design' ? '#fff' : 'var(--text-mid)',
                  fontWeight: activeTab === 'design' ? 600 : 400,
                  transition:'all 0.2s',
                }}
              >
                DISEÑO
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                style={{
                  padding:'4px 10px', borderRadius:'14px', border:'none', cursor:'pointer', fontSize:'9px', letterSpacing:'1px',
                  background: activeTab === 'guide' ? 'var(--gold)' : 'transparent',
                  color: activeTab === 'guide' ? '#fff' : 'var(--text-mid)',
                  fontWeight: activeTab === 'guide' ? 600 : 400,
                  transition:'all 0.2s',
                }}
              >
                FAQS & PRECIOS
              </button>
            </div>
          </div>

          {activeTab === 'design' ? (
            <>
              {/* Resumen de Cotización en Tiempo Real (Colombia) */}
              <div style={{
                background:'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,246,238,0.85) 100%)',
                border:'1px solid rgba(184,146,74,0.25)',
                borderRadius:'14px',
                padding:'12px 14px',
                marginBottom:'14px',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'4px' }}>
                  <span style={{ fontSize:'9px', letterSpacing:'1.5px', color:'var(--text-mute)', textTransform:'uppercase' }}>
                    Precio Estimado Colombia
                  </span>
                  <span style={{ fontFamily:'var(--font-heading)', fontSize:'18px', fontWeight:700, color:'var(--gold)' }}>
                    {formattedPrice}
                  </span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:'var(--text-mid)' }}>
                  <span>{currentFinish.label} • {currentShape.label}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                    <Clock size={11} color="var(--gold)" />
                    {currentFinish.duration}
                  </span>
                </div>
              </div>

              {/* Selector de Acabados Esculturales */}
              <div style={{ marginBottom:'14px' }}>
                <label style={{ display:'flex', justifyContent:'space-between', fontSize:'9px', color:'var(--text-mute)', letterSpacing:'1px', marginBottom:'6px' }}>
                  <span>ACABADO / TÉCNICA (16 DISEÑOS)</span>
                  <span style={{ color:'var(--gold)', fontWeight:500 }}>{currentFinish.category}</span>
                </label>
                <div style={{
                  display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px',
                  maxHeight:'165px', overflowY:'auto', paddingRight:'3px'
                }}>
                  {FINISHES.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveStyle(f.id)}
                      style={{
                        padding:'7px 8px', borderRadius:'9px', cursor:'pointer',
                        fontSize:'9.5px', textAlign:'left',
                        border:'1px solid',
                        borderColor: activeStyle === f.id ? 'var(--gold)' : 'var(--border)',
                        background:  activeStyle === f.id ? 'rgba(184,146,74,0.14)' : 'rgba(250,249,247,0.7)',
                        color:       activeStyle === f.id ? 'var(--gold)' : 'var(--text-mid)',
                        transition:'all 0.2s',
                        display:'flex', flexDirection:'column', gap:'2px',
                      }}
                    >
                      <span style={{ fontWeight: activeStyle === f.id ? 600 : 400 }}>{f.label}</span>
                      <span style={{ fontSize:'8px', opacity:0.75 }}>${(f.basePriceCOP / 1000).toFixed(0)}k COP</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Forma */}
              <div style={{ marginBottom:'14px' }}>
                <label style={{ display:'block', fontSize:'9px', color:'var(--text-mute)', letterSpacing:'1px', marginBottom:'6px' }}>
                  FORMA ESCULPIDA
                </label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'4px' }}>
                  {SHAPES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveShape(s.id)}
                      title={s.desc}
                      style={{
                        padding:'6px 4px', borderRadius:'8px', cursor:'pointer', fontSize:'9px', textAlign:'center',
                        border:'1px solid',
                        borderColor: activeShape === s.id ? 'var(--gold)' : 'var(--border)',
                        background:  activeShape === s.id ? 'rgba(184,146,74,0.12)' : 'rgba(250,249,247,0.7)',
                        color:       activeShape === s.id ? 'var(--gold)' : 'var(--text-mid)',
                        fontWeight: activeShape === s.id ? 600 : 400,
                        transition:'all 0.2s',
                      }}
                    >
                      {s.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Largo (Escala de Salón Profesional #1 a #4) */}
              <div style={{ marginBottom:'16px' }}>
                <label style={{ display:'flex', justifyContent:'space-between', fontSize:'9px', color:'var(--text-mute)', letterSpacing:'1px', marginBottom:'6px' }}>
                  <span>LARGO PROFESIONAL (ESCALA SALÓN)</span>
                  <span style={{ color:'var(--text-mid)' }}>{currentLength.ideal}</span>
                </label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'4px' }}>
                  {LENGTHS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setActiveLength(l.id)}
                      style={{
                        padding:'7px 4px', borderRadius:'8px', cursor:'pointer', fontSize:'9px', textAlign:'center',
                        border:'1px solid',
                        borderColor: activeLength === l.id ? 'var(--gold)' : 'var(--border)',
                        background:  activeLength === l.id ? 'rgba(184,146,74,0.12)' : 'rgba(250,249,247,0.7)',
                        color:       activeLength === l.id ? 'var(--gold)' : 'var(--text-mid)',
                        transition:'all 0.2s',
                        display:'flex', flexDirection:'column', alignItems:'center', gap:'1px',
                      }}
                    >
                      <span style={{ fontWeight:700, fontSize:'10.5px' }}>{l.num}</span>
                      <span style={{ fontSize:'7.5px', opacity:0.8 }}>
                        {l.addCOP === 0 ? 'Base' : `+$${(l.addCOP/1000).toFixed(0)}k`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón CTA Reserva */}
              <button
                className="btn-gold"
                onClick={() => setBookingOpen(true)}
                style={{
                  width:'100%', padding:'12px', borderRadius:'12px',
                  fontSize:'10px', letterSpacing:'2px',
                  boxShadow:'0 6px 18px rgba(184,146,74,0.25)',
                }}
              >
                RESERVAR ESTE SET ({formattedPrice})
              </button>
            </>
          ) : (
            /* Tab de Preguntas Frecuentes & Guía de Salón Colombia */
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ fontSize:'9.5px', color:'var(--text-mute)', letterSpacing:'1px', marginBottom:'2px' }}>
                GUÍA RÁPIDA PARA CLIENTAS EN COLOMBIA
              </div>

              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background:'rgba(255,255,255,0.7)',
                    border:'1px solid rgba(184,146,74,0.15)',
                    borderRadius:'10px',
                    padding:'10px 12px',
                  }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                    <HelpCircle size={12} color="var(--gold)" />
                    <h4 style={{ fontSize:'10.5px', fontWeight:600, color:'var(--text-dark)', margin:0 }}>
                      {faq.q}
                    </h4>
                  </div>
                  <p style={{ fontSize:'9.5px', color:'var(--text-mid)', lineHeight:1.55, margin:0 }}>
                    {faq.a}
                  </p>
                </div>
              ))}

              <div style={{
                marginTop:'4px',
                background:'rgba(184,146,74,0.08)',
                border:'1px dashed rgba(184,146,74,0.3)',
                borderRadius:'10px',
                padding:'10px',
                fontSize:'9px',
                color:'var(--text-mid)',
                display:'flex',
                alignItems:'center',
                gap:'8px',
              }}>
                <Info size={14} color="var(--gold)" />
                <span>Ubicación: <strong>Zona Rosa / El Poblado</strong>. Citas con depósito de anticipo de $30.000 COP abonables al total.</span>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* ════════════════════════════════════════
          STORYTELLING SECTIONS
          ════════════════════════════════════════ */}
      {!isCustom && (
        <div style={{ position:'relative', zIndex:10, pointerEvents:'none' }}>

          {/* ACT I */}
          <section style={{ height:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'0 24px' }}>
            <span className="fade-up" style={{ fontFamily:'var(--font-heading)', fontSize:'11px', letterSpacing:'6px', color:'var(--gold)', marginBottom:'14px', textTransform:'uppercase' }}>
              ACTO I — EL ORIGEN
            </span>
            <h2 className="fade-up" style={{
              fontFamily:'var(--font-heading)',
              fontSize:'clamp(36px, 6.5vw, 78px)',
              fontWeight:400, lineHeight:1.08, letterSpacing:'-0.5px',
              color:'var(--text-dark)', maxWidth:'860px', marginBottom:'20px',
            }}>
              Uñas Esculpidas como<br />Esculturas Líquidas.
            </h2>
            <p className="fade-up" style={{ color:'var(--text-mute)', fontSize:'14px', letterSpacing:'0.5px', maxWidth:'420px', fontWeight:300, lineHeight:1.7 }}>
              Desliza para presenciar la transformación de la materia en arte 3D.
            </p>
            <div style={{ marginTop:'44px', opacity:0.55 }}>
              <ChevronDown size={22} color="var(--gold)" />
            </div>
          </section>

          {/* ACT II */}
          <section style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'flex-start', padding:'0 10vw' }}>
            <div className="glass" style={{ padding:'38px', borderRadius:'22px', maxWidth:'400px', pointerEvents:'auto' }}>
              <span style={{ fontFamily:'var(--font-heading)', fontSize:'9px', letterSpacing:'4px', color:'var(--gold)' }}>
                ACTO II — ARQUITECTURA
              </span>
              <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'30px', fontWeight:400, margin:'10px 0 14px', color:'var(--text-dark)' }}>
                Precisión de Alta Costura.
              </h3>
              <p style={{ color:'var(--text-mid)', fontSize:'14px', lineHeight:1.75, fontWeight:300 }}>
                Moldeamos la extensión natural mediante geles constructores de alta viscosidad. La curva&nbsp;C perfecta para una durabilidad inquebrantable.
              </p>
            </div>
          </section>

          {/* ACT III */}
          <section style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'0 10vw' }}>
            <div className="glass" style={{ padding:'38px', borderRadius:'22px', maxWidth:'400px', pointerEvents:'auto' }}>
              <span style={{ fontFamily:'var(--font-heading)', fontSize:'9px', letterSpacing:'4px', color:'var(--rose)' }}>
                ACTO III — LUZ & REFRACCIÓN
              </span>
              <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'30px', fontWeight:400, margin:'10px 0 14px', color:'var(--text-dark)' }}>
                Gotas de Cromo & Cristal.
              </h3>
              <p style={{ color:'var(--text-mid)', fontSize:'14px', lineHeight:1.75, fontWeight:300 }}>
                Incrustaciones orgánicas en 3D que refractan la luz del entorno. Pigmentos de cuarzo, cromo líquido y gemas de precisión.
              </p>
            </div>
          </section>

          {/* ACT IV */}
          <section style={{ height:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'0 24px' }}>
            <span style={{ fontFamily:'var(--font-heading)', fontSize:'11px', letterSpacing:'6px', color:'var(--gold)', marginBottom:'14px' }}>
              ACTO IV — TU FIRMA
            </span>
            <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'clamp(32px, 5vw, 60px)', fontWeight:400, color:'var(--text-dark)', marginBottom:'28px' }}>
              Diseño de Autor en Tus Manos.
            </h2>
            <button
              className="btn-gold"
              onClick={() => setBookingOpen(true)}
              style={{
                pointerEvents:'auto', padding:'16px 44px', borderRadius:'36px',
                fontSize:'12px', letterSpacing:'3px',
                boxShadow:'0 16px 40px rgba(184,146,74,0.35)',
              }}
            >
              RESERVAR EXPERIENCIA EXCLUSIVA
            </button>
          </section>
        </div>
      )}

      {/* ── Success toast ── */}
      {bookingDone && (
        <div className="glass" style={{
          position:'fixed', bottom:'36px', left:'50%', transform:'translateX(-50%)',
          zIndex:200, padding:'18px 28px', borderRadius:'28px',
          display:'flex', alignItems:'center', gap:'10px',
          border:'1px solid var(--gold)',
        }}>
          <Check size={18} color="var(--gold)" />
          <span style={{ fontFamily:'var(--font-heading)', fontSize:'11px', letterSpacing:'2px', color:'var(--text-dark)' }}>
            CITA RESERVADA — TE ESPERAMOS EN EL ESTUDIO
          </span>
        </div>
      )}

      {/* ── Booking modal ── */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onConfirm={handleConfirm}
        selectedStyle={currentFinish.label}
        selectedLengthName={currentLength.label}
        selectedShape={currentShape.label}
        estimatedPriceCOP={totalPriceCOP}
        estimatedDuration={currentFinish.duration}
      />
    </div>
  )
}
