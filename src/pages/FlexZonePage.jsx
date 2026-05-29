import { useState, useEffect, useMemo, useRef } from 'react'
import './flexzone.css'
import { ZONES, SERVICE, TYPE_META, computeEnergy } from '../data/flexzoneData'

const INITIAL_ACTIVE = ['C1', 'F2', 'S1']

// ── Seat ──
function Seat({ x, y, on }) {
  return <circle cx={x} cy={y} r={4.5} className={on ? 'fz-seat on' : 'fz-seat'} />
}

// ── Furniture per zone ──
function ZoneFurniture({ z, on }) {
  if (z.pod) {
    const cx = z.x + z.w / 2, cy = z.y + z.h / 2
    return (
      <g>
        <rect x={cx - 16} y={cy - 6} width={32} height={20} rx={5} className={on ? 'fz-furn on' : 'fz-furn'} />
        <circle cx={cx} cy={cy - 20} r={9} className={on ? 'fz-furn on' : 'fz-furn'} />
      </g>
    )
  }
  if (!z.desks) return null
  return (
    <g>
      {z.desks.map((d, i) => (
        <g key={i}>
          <rect x={d.x} y={d.y} width={d.w} height={d.h} rx={4} className={on ? 'fz-furn on' : 'fz-furn'} />
          {d.table ? (
            <g>
              <Seat x={d.x - 9} y={d.y + d.h / 2} on={on} />
              <Seat x={d.x + d.w + 9} y={d.y + d.h / 2} on={on} />
              <Seat x={d.x + d.w * 0.3} y={d.y - 9} on={on} />
              <Seat x={d.x + d.w * 0.7} y={d.y - 9} on={on} />
              <Seat x={d.x + d.w * 0.3} y={d.y + d.h + 9} on={on} />
              <Seat x={d.x + d.w * 0.7} y={d.y + d.h + 9} on={on} />
            </g>
          ) : (
            <Seat x={d.x + d.w / 2} y={d.y + d.h + 9} on={on} />
          )}
        </g>
      ))}
    </g>
  )
}

// ── Single zone ──
function Zone({ z, on, hot, onClick }) {
  return (
    <g
      className={'fz-zone' + (on ? ' on' : '') + (hot ? ' hot' : '')}
      onClick={() => onClick(z.id)}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={z.x} y={z.y} width={z.w} height={z.h}
        rx={z.pod ? z.w / 2 : 14}
        className="fz-zone-bg"
      />
      <ZoneFurniture z={z} on={on} />
      {!z.pod && (
        <text x={z.x + 16} y={z.y + 28} className="fz-zone-label">{z.name}</text>
      )}
      {!z.pod && (
        <text x={z.x + 16} y={z.y + 47} className="fz-zone-sub">
          {on ? 'Active · chauffée' : 'En veille · coupée'}
        </text>
      )}
      {z.pod && (
        <text x={z.x + z.w / 2} y={z.y + z.h - 14} textAnchor="middle" className="fz-pod-label">
          {z.code.split('·')[1].trim()}
        </text>
      )}
      <circle cx={z.x + z.w - 18} cy={z.y + 18} r={5} className={on ? 'fz-dot on' : 'fz-dot'} />
    </g>
  )
}

// ── Floor Plan ──
function FloorPlan({ activeIds, hotId, onZoneClick, time }) {
  return (
    <div className="fz-fp-wrap">
      <div className="fz-fp-head">
        <div>
          <div className="fz-fp-title">Plateau · 3<sup>e</sup> étage</div>
          <div className="fz-fp-subtitle">Siège · 24 places · vue temps réel</div>
        </div>
        <div className="fz-fp-live">
          <span className="fz-fp-live-dot" />
          {time}
        </div>
      </div>

      <div className="fz-fp-canvas">
        <svg viewBox="0 0 800 640" preserveAspectRatio="xMidYMid meet" className="fz-fp-svg">
          <rect x="6" y="6" width="788" height="628" rx="20" className="fz-fp-floor" />
          <g className="fz-fp-grid">
            {Array.from({ length: 19 }).map((_, i) => (
              <line key={'v' + i} x1={6 + (i + 1) * 40} y1="6" x2={6 + (i + 1) * 40} y2="634" />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={'h' + i} x1="6" y1={6 + (i + 1) * 40} x2="794" y2={6 + (i + 1) * 40} />
            ))}
          </g>

          {/* Zone services — toujours active */}
          <g className="fz-zone svc">
            <rect x={SERVICE.x} y={SERVICE.y} width={SERVICE.w} height={SERVICE.h} rx={14} className="fz-svc-bg" />
            <text x={SERVICE.x + 16} y={SERVICE.y + 28} className="fz-zone-label svc">{SERVICE.name}</text>
            <text x={SERVICE.x + 16} y={SERVICE.y + 47} className="fz-zone-sub svc">Toujours actif · base</text>
            <circle
              cx={SERVICE.x + SERVICE.w / 2}
              cy={SERVICE.y + SERVICE.h / 2 + 10}
              r={26}
              className="fz-svc-ic"
            />
            <rect
              x={SERVICE.x + SERVICE.w / 2 - 30}
              y={SERVICE.y + SERVICE.h / 2 + 46}
              width={60} height={10} rx={5}
              className="fz-furn on"
            />
          </g>

          {ZONES.map(z => (
            <Zone
              key={z.id}
              z={z}
              on={activeIds.includes(z.id)}
              hot={hotId === z.id}
              onClick={onZoneClick}
            />
          ))}
        </svg>
      </div>

      <div className="fz-fp-legend">
        <div className="fz-leg"><span className="fz-leg-sw on" />Active · chauffée &amp; éclairée</div>
        <div className="fz-leg"><span className="fz-leg-sw" />En veille · coupée</div>
        <div className="fz-leg-hint">Touche une zone ou réserve dans l'appli →</div>
      </div>
    </div>
  )
}

// ── Radial Gauge ──
function RadialGauge({ pct }) {
  const R = 52, C = 2 * Math.PI * R
  const off = C * (1 - pct / 100)
  return (
    <svg viewBox="0 0 140 140" className="fz-ph-gauge-svg">
      <circle cx="70" cy="70" r={R} className="fz-ph-gauge-track" />
      <circle
        cx="70" cy="70" r={R}
        className="fz-ph-gauge-fill"
        strokeDasharray={C}
        strokeDashoffset={off}
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="66" textAnchor="middle" className="fz-ph-gauge-num">−{pct}</text>
      <text x="70" y="92" textAnchor="middle" className="fz-ph-gauge-pct">% conso</text>
    </svg>
  )
}

// ── Phone App ──
function PhoneApp({ activeIds, energy, onReserve, onRelease, filter, setFilter, setHot }) {
  const types = ['focus', 'collab', 'room']
  const list = ZONES.filter(z => z.type === filter)

  return (
    <div className="fz-phone">
      <div className="fz-phone-notch" />
      <div className="fz-phone-screen">
        <div className="fz-ph-status">
          <span>9:41</span>
          <span className="fz-ph-brand">▰ FlexZone</span>
        </div>

        <div>
          <div className="fz-ph-hello">Ta journée</div>
          <div className="fz-ph-date">Mardi · siège · 3<sup>e</sup> étage</div>
        </div>

        <div className="fz-ph-tabs">
          {types.map(t => (
            <button
              key={t}
              className={'fz-ph-tab' + (filter === t ? ' active' : '')}
              onClick={() => setFilter(t)}
            >
              {TYPE_META[t].label}
            </button>
          ))}
        </div>

        <div className="fz-ph-list">
          {list.map(z => {
            const on = activeIds.includes(z.id)
            return (
              <button
                key={z.id}
                className={'fz-ph-card' + (on ? ' reserved' : '')}
                onMouseEnter={() => setHot(z.id)}
                onMouseLeave={() => setHot(null)}
                onClick={() => on ? onRelease(z.id) : onReserve(z.id)}
              >
                <div>
                  <div className="fz-ph-card-name">{z.code}</div>
                  <div className="fz-ph-card-sub">
                    {on ? 'Réservée · active' : 'Libre'} · {z.hours}
                  </div>
                </div>
                <div className={'fz-ph-card-act' + (on ? ' on' : '')}>
                  {on ? 'Libérer' : 'Réserver'}
                </div>
              </button>
            )
          })}
        </div>

        <div className="fz-ph-energy">
          <RadialGauge pct={energy.avoidedPct} />
          <div className="fz-ph-energy-meta">
            <div className="fz-ph-energy-label">Conso évitée aujourd'hui</div>
            <div className="fz-ph-energy-kwh">{energy.kWhAvoided} kWh</div>
            <div className="fz-ph-energy-occ">
              <span>Occupation</span>
              <div className="fz-ph-occ-bar">
                <i style={{ width: energy.occupancyPct + '%' }} />
              </div>
              <span className="fz-ph-occ-num">{energy.occupancyPct}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Spark chart ──
function Spark({ history }) {
  const w = 240, h = 56, max = 100
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1 || 1)) * w
    const y = h - (v / max) * h
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const area = `0,${h} ${pts} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="fz-spark" preserveAspectRatio="none">
      <polygon points={area} className="fz-spark-area" />
      <polyline points={pts} className="fz-spark-line" />
    </svg>
  )
}

// ── Big Stat ──
function BigStat({ value, unit, label, sub, accent }) {
  return (
    <div className={'fz-bs' + (accent ? ' accent' : '')}>
      <div className="fz-bs-top">
        <span className="fz-bs-val">{value}</span>
        <span className="fz-bs-unit">{unit}</span>
      </div>
      <div className="fz-bs-label">{label}</div>
      <div className="fz-bs-sub">{sub}</div>
    </div>
  )
}

// ── Main Page ──
export default function FlexZonePage() {
  const stageRef = useRef(null)
  const [active, setActive] = useState(INITIAL_ACTIVE)
  const [filter, setFilter] = useState('focus')
  const [hot, setHot] = useState(null)
  const [demo, setDemo] = useState(false)
  const [history, setHistory] = useState([])
  const [time] = useState('Mardi · 15:02')

  const energy = useMemo(() => computeEnergy(active), [active])

  // Keep spark history
  useEffect(() => {
    setHistory(h => [...h.slice(-39), energy.avoidedPct])
  }, [energy.avoidedPct])

  // Scale stage to fit viewport
  useEffect(() => {
    function fit() {
      if (!stageRef.current) return
      const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
      stageRef.current.style.transform = `translate(-50%, -50%) scale(${s})`
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  // Demo auto mode
  useEffect(() => {
    if (!demo) return
    const ids = ZONES.map(z => z.id)
    const iv = setInterval(() => {
      setActive(a => {
        const r = Math.random()
        if (r < 0.55 && a.length < ids.length) {
          const free = ids.filter(i => !a.includes(i))
          return [...a, free[Math.floor(Math.random() * free.length)]]
        } else if (a.length > 1) {
          const idx = Math.floor(Math.random() * a.length)
          return a.filter((_, i) => i !== idx)
        }
        return a
      })
    }, 1100)
    return () => clearInterval(iv)
  }, [demo])

  const reserve = id => setActive(a => a.includes(id) ? a : [...a, id])
  const release = id => setActive(a => a.filter(x => x !== id))
  const toggle  = id => setActive(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id])

  return (
    <div className="fz-root">
      <div id="fz-stage" ref={stageRef} className="fz-stage">
        <div className="fz-inner">
          {/* Topbar */}
          <header className="fz-topbar">
            <div className="fz-brand">
              <span className="fz-brand-mark">▰</span>
              <span className="fz-brand-name">FlexZone</span>
              <span className="fz-brand-tag">Sobriété spatiale</span>
            </div>
            <div className="fz-claim">
              L'espace s'adapte à l'occupation réelle — on arrête de chauffer le vide.
            </div>
            <button
              className={'fz-demo-btn' + (demo ? ' on' : '')}
              onClick={() => setDemo(d => !d)}
            >
              <span className="fz-demo-dot" />
              {demo ? 'Démo en cours' : 'Lancer la démo'}
            </button>
          </header>

          {/* Main */}
          <div className="fz-main">
            <FloorPlan
              activeIds={active}
              hotId={hot}
              onZoneClick={toggle}
              time={time}
            />
            <div className="fz-rail">
              <PhoneApp
                activeIds={active}
                energy={energy}
                onReserve={reserve}
                onRelease={release}
                filter={filter}
                setFilter={setFilter}
                hotId={hot}
                setHot={setHot}
              />
            </div>
          </div>

          {/* Impact band */}
          <footer className="fz-impact">
            <BigStat
              value={energy.occupancyPct}
              unit="%"
              label="Taux d'occupation"
              sub={`${energy.usedSeats} / ${energy.totalSeats} places actives`}
            />
            <div className="fz-impact-div" />
            <BigStat
              value={'−' + energy.avoidedPct}
              unit="%"
              accent
              label="Conso évitée"
              sub={`≈ ${energy.kWhAvoided} kWh aujourd'hui`}
            />
            <div className="fz-impact-div" />
            <div className="fz-impact-spark">
              <div className="fz-spark-head">
                <span>Conso évitée · journée</span>
                <span className="fz-spark-now">−{energy.avoidedPct}%</span>
              </div>
              <Spark history={history} />
            </div>
            <div className="fz-impact-div" />
            <div className="fz-impact-note">
              <div className="fz-note-big">
                {ZONES.filter(z => active.includes(z.id)).length} zones chauffées
              </div>
              <div className="fz-note-sub">sur {ZONES.length} · le reste en veille</div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
