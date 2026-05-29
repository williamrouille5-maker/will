// FlexZone — données du plateau + logique énergie/occupation
// viewBox du plan : 0 0 800 640

function makeDesks(x, y, w, h, cols, rows, dw, dh, gapx, gapy) {
  const out = []
  const totalW = cols * dw + (cols - 1) * gapx
  const totalH = rows * dh + (rows - 1) * gapy
  const ox = x + (w - totalW) / 2
  const oy = y + (h - totalH) / 2
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push({ x: ox + c * (dw + gapx), y: oy + r * (dh + gapy), w: dw, h: dh })
    }
  }
  return out
}

export const ZONES = [
  {
    id: 'C1', type: 'collab', code: 'Collab Nord', name: 'Espace collab',
    x: 24, y: 24, w: 250, h: 268, seats: 6,
    load: 22, hours: '9h–18h',
    desks: makeDesks(60, 70, 178, 176, 2, 2, 70, 64, 18, 22),
  },
  {
    id: 'C2', type: 'collab', code: 'Collab Sud', name: 'Espace collab',
    x: 292, y: 24, w: 226, h: 176, seats: 4,
    load: 16, hours: '9h–18h',
    desks: makeDesks(320, 60, 170, 100, 2, 1, 70, 64, 22, 0),
  },
  {
    id: 'S1', type: 'room', code: 'Réunion · R1', name: 'Salle fermée',
    x: 540, y: 24, w: 236, h: 128, seats: 8,
    load: 18, hours: 'sur résa',
    desks: [{ x: 600, y: 64, w: 116, h: 48, table: true }],
  },
  {
    id: 'S2', type: 'room', code: 'Confidentiel · R2', name: 'Salle fermée',
    x: 540, y: 168, w: 236, h: 124, seats: 4,
    load: 14, hours: 'sur résa',
    desks: [{ x: 600, y: 204, w: 116, h: 44, table: true }],
  },
  {
    id: 'F1', type: 'focus', code: 'Focus · A1', name: 'Bulle focus',
    x: 24, y: 356, w: 116, h: 116, seats: 1, pod: true,
    load: 5, hours: '9h–12h',
  },
  {
    id: 'F2', type: 'focus', code: 'Focus · A2', name: 'Bulle focus',
    x: 156, y: 356, w: 116, h: 116, seats: 1, pod: true,
    load: 5, hours: '9h–12h',
  },
  {
    id: 'F3', type: 'focus', code: 'Focus · A3', name: 'Bulle focus',
    x: 24, y: 488, w: 116, h: 116, seats: 1, pod: true,
    load: 5, hours: '14h–18h',
  },
  {
    id: 'F4', type: 'focus', code: 'Focus · A4', name: 'Bulle focus',
    x: 156, y: 488, w: 116, h: 116, seats: 1, pod: true,
    load: 5, hours: '14h–18h',
  },
  {
    id: 'O1', type: 'open', code: 'Open space', name: 'Espace ouvert',
    x: 292, y: 356, w: 226, h: 248, seats: 8,
    load: 20, hours: 'libre',
    desks: makeDesks(316, 392, 178, 176, 2, 2, 74, 64, 22, 22),
  },
]

export const SERVICE = { x: 540, y: 356, w: 236, h: 248, name: 'Détente · café', code: 'Services' }

export const BASE_LOAD = 24

export const TYPE_META = {
  collab: { label: 'Collab', tag: 'Espaces collab' },
  room:   { label: 'Réunion', tag: 'Salles fermées' },
  focus:  { label: 'Focus', tag: 'Bulles focus' },
  open:   { label: 'Open', tag: 'Espace ouvert' },
}

export function computeEnergy(activeIds) {
  const totalLoad = BASE_LOAD + ZONES.reduce((s, z) => s + z.load, 0)
  const activeLoad = BASE_LOAD + ZONES.filter(z => activeIds.includes(z.id))
    .reduce((s, z) => s + z.load, 0)
  const avoided = totalLoad - activeLoad
  const avoidedPct = Math.round((avoided / totalLoad) * 100)
  const totalSeats = ZONES.reduce((s, z) => s + z.seats, 0)
  const usedSeats = ZONES.filter(z => activeIds.includes(z.id))
    .reduce((s, z) => s + z.seats, 0)
  const occupancyPct = Math.round((usedSeats / totalSeats) * 100)
  const kWhTotal = totalLoad * 1.4
  const kWhAvoided = Math.round(avoided * 1.4)
  return { totalLoad, activeLoad, avoided, avoidedPct, occupancyPct, usedSeats, totalSeats, kWhAvoided, kWhTotal }
}
