import { ArrowRight, ShieldCheck, Gem, Sparkles, Clock, CheckCircle2 } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  selectedStyle: string
  selectedLengthName: string
  selectedShape: string
  estimatedPriceCOP: number
  estimatedDuration: string
}

export const BookingModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedStyle,
  selectedLengthName,
  selectedShape,
  estimatedPriceCOP,
  estimatedDuration,
}: BookingModalProps) => {
  if (!isOpen) return null

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(estimatedPriceCOP)

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(250,249,247,0.6)',
      backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
      padding:'20px',
    }}>
      <div className="glass" style={{
        width:'100%', maxWidth:'470px', borderRadius:'24px', padding:'34px',
        color:'var(--text-dark)', position:'relative',
        border:'1px solid rgba(184,146,74,0.22)',
        boxShadow:'0 32px 64px rgba(100,80,60,0.18)',
      }}>
        <button onClick={onClose} style={{
          position:'absolute', top:'18px', right:'18px',
          background:'none', border:'none', color:'var(--text-mute)',
          fontSize:'18px', cursor:'pointer', lineHeight:1,
        }}>✕</button>

        <div style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'14px' }}>
          <Gem size={18} color="var(--gold)" />
          <span style={{ fontSize:'10px', letterSpacing:'3px', color:'var(--gold)', textTransform:'uppercase', fontFamily:'var(--font-heading)' }}>
            RESERVA PRIVADA
          </span>
        </div>

        <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'24px', fontWeight:400, marginBottom:'6px', color:'var(--text-dark)' }}>
          Escultura {selectedStyle.toUpperCase()}
        </h3>
        <p style={{ color:'var(--text-mute)', fontSize:'12px', marginBottom:'18px', lineHeight:1.5 }}>
          Cada sesión incluye manicura rusa/combinada, nivelación de estructura y diseño de autor.
        </p>

        {/* Resumen del Servicio con Precios Colombia */}
        <div style={{
          background:'rgba(184,146,74,0.06)',
          border:'1px solid rgba(184,146,74,0.22)',
          borderRadius:'14px',
          padding:'14px 16px',
          marginBottom:'20px',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'8px' }}>
            <span style={{ fontSize:'10px', letterSpacing:'1px', color:'var(--text-mute)', textTransform:'uppercase' }}>
              Valor Estimado (COP)
            </span>
            <span style={{ fontFamily:'var(--font-heading)', fontSize:'20px', fontWeight:600, color:'var(--gold)' }}>
              {formattedPrice}
            </span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', paddingTop:'8px', borderTop:'1px dashed rgba(184,146,74,0.2)', fontSize:'11px', color:'var(--text-mid)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <Clock size={12} color="var(--gold)" />
              <span>Tiempo: <strong>{estimatedDuration}</strong></span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <Sparkles size={12} color="var(--gold)" />
              <span>Largo: <strong>{selectedLengthName} ({selectedShape})</strong></span>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onConfirm() }}
          style={{ display:'flex', flexDirection:'column', gap:'14px' }}
        >
          {[
            { label:'NOMBRE COMPLETO', type:'text',  placeholder:'Ej. Valeria De la Torre' },
            { label:'CORREO ELECTRÓNICO', type:'email', placeholder:'hola@email.com'       },
            { label:'FECHA DE CITA',    type:'date', placeholder:''                         },
          ].map(({ label, type, placeholder }) => (
            <div key={label}>
              <label style={{ display:'block', fontSize:'9px', color:'var(--text-mute)', marginBottom:'5px', letterSpacing:'1.2px' }}>
                {label}
              </label>
              <input
                type={type}
                required
                placeholder={placeholder}
                style={{
                  width:'100%', padding:'12px 14px',
                  background:'rgba(250,249,247,0.8)',
                  border:'1px solid rgba(184,146,74,0.18)',
                  borderRadius:'10px', color:'var(--text-dark)',
                  fontSize:'13px', outline:'none',
                  fontFamily:'var(--font-body)',
                }}
              />
            </div>
          ))}

          <div style={{ display:'flex', alignItems:'center', gap:'7px', fontSize:'11px', color:'var(--text-mute)' }}>
            <ShieldCheck size={14} color="var(--gold)" />
            Garantía de acabado 3D de alta duración (4+ semanas)
          </div>

          <button
            type="submit"
            className="btn-gold"
            style={{
              marginTop:'10px', padding:'14px', borderRadius:'12px',
              fontSize:'12px', letterSpacing:'2px',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'9px',
            }}
          >
            CONFIRMAR CITA PRIVADA
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  )
}
