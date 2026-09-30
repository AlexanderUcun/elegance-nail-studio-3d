import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

export interface NailProps {
  progress: number
  activeStyle: string
  activeLength: number
  activeShape?: NailShapeType
  isCustomizing: boolean
}

export type NailShapeType = 'stiletto' | 'coffin' | 'almond' | 'oval'
export type ModernFinishType =
  | 'aura'
  | 'chrome'
  | 'cateye'
  | 'tortoise'
  | 'emerald'
  | 'microfrench'
  | 'oxblood'
  | 'liquid'
  | 'glass'
  | 'pearl'
  | 'rosegold'
  | 'lavender_aura'
  | 'ruby_velvet'
  | 'cobalt_chrome'
  | 'terracotta'
  | 'noir_gold'
  | 'sunset_chrome'
  | 'milky_glaze'
  | 'sapphire_cat'
  | 'quartz_frost'

interface NailDesign {
  id: string
  name: string
  shape: NailShapeType
  finish: ModernFinishType
  baseY: number
  radius: number
  angleOffset: number
  tilt: number
}

/* ─── 24 Unique Haute Couture Nails in Spiral Tornado (Zero repetition, full variety) ─── */
const TORNADO_NAILS: NailDesign[] = [
  // ── Nivel 1: Base Espiral (Bajo) ──
  { id: 'aura',            name: 'Korean Blush Aura',    shape: 'almond',  finish: 'aura',            baseY: -2.3, radius: 1.35, angleOffset: 0.0,  tilt: 0.12 },
  { id: 'chrome',          name: 'Molten Cyber Chrome',  shape: 'stiletto',finish: 'chrome',          baseY: -2.0, radius: 1.45, angleOffset: 1.05, tilt: -0.15 },
  { id: 'cateye',          name: 'Velvet Cat-Eye Azul',  shape: 'oval',    finish: 'cateye',          baseY: -1.7, radius: 1.55, angleOffset: 2.10, tilt: 0.16 },
  { id: 'rosegold',        name: 'Oro Rosa Líquido',     shape: 'coffin',  finish: 'rosegold',        baseY: -1.4, radius: 1.65, angleOffset: 3.15, tilt: -0.14 },
  { id: 'tortoise',        name: 'Carey & Ámbar 3D',     shape: 'stiletto',finish: 'tortoise',        baseY: -1.1, radius: 1.75, angleOffset: 4.20, tilt: 0.15 },
  { id: 'lavender_aura',   name: 'Aura Lavanda Pastel',  shape: 'oval',    finish: 'lavender_aura',   baseY: -0.8, radius: 1.85, angleOffset: 5.25, tilt: -0.12 },

  // ── Nivel 2: Espiral Central (Cintura) ──
  { id: 'emerald',         name: 'Mármol Esmeralda & Oro',shape: 'almond', finish: 'emerald',         baseY: -0.5, radius: 1.95, angleOffset: 0.52, tilt: 0.14 },
  { id: 'ruby_velvet',     name: 'Cat-Eye Rubí Borgoña', shape: 'stiletto',finish: 'ruby_velvet',     baseY: -0.2, radius: 2.05, angleOffset: 1.57, tilt: -0.18 },
  { id: 'microfrench',     name: 'Micro Gold French',    shape: 'almond',  finish: 'microfrench',     baseY: 0.1,  radius: 2.15, angleOffset: 2.62, tilt: 0.15 },
  { id: 'cobalt_chrome',   name: 'Cromo Azul Cobalto',   shape: 'coffin',  finish: 'cobalt_chrome',   baseY: 0.4,  radius: 2.25, angleOffset: 3.67, tilt: -0.16 },
  { id: 'oxblood',         name: 'Oxblood Glass Cereza', shape: 'stiletto',finish: 'oxblood',         baseY: 0.7,  radius: 2.35, angleOffset: 4.72, tilt: 0.18 },
  { id: 'terracotta',      name: 'Terracota Nude Mate',  shape: 'oval',    finish: 'terracotta',      baseY: 1.0,  radius: 2.45, angleOffset: 5.77, tilt: -0.14 },

  // ── Nivel 3: Espiral Alta (Expansión) ──
  { id: 'liquid',          name: 'Oro Fundido 24K',      shape: 'stiletto',finish: 'liquid',          baseY: 1.3,  radius: 2.55, angleOffset: 0.26, tilt: 0.20 },
  { id: 'milky_glaze',     name: 'Milky Glaze Nácar',    shape: 'almond',  finish: 'milky_glaze',     baseY: 1.6,  radius: 2.65, angleOffset: 1.31, tilt: -0.15 },
  { id: 'glass',           name: 'Cristal Rosé Quartz',  shape: 'coffin',  finish: 'glass',           baseY: 1.9,  radius: 2.75, angleOffset: 2.36, tilt: 0.18 },
  { id: 'noir_gold',       name: 'Noir Obsidiana & Oro', shape: 'stiletto',finish: 'noir_gold',       baseY: 2.2,  radius: 2.85, angleOffset: 3.41, tilt: -0.20 },
  { id: 'pearl',           name: 'Glazed Donut Pearl',   shape: 'oval',    finish: 'pearl',           baseY: 2.4,  radius: 2.90, angleOffset: 4.46, tilt: 0.16 },
  { id: 'sunset_chrome',   name: 'Sunset Chrome Boreal', shape: 'coffin',  finish: 'sunset_chrome',   baseY: 2.6,  radius: 2.95, angleOffset: 5.51, tilt: -0.18 },

  // ── Contracorriente de Profundidad (6 Diseños Exclusivos) ──
  { id: 'sapphire_cat',    name: 'Zafiro Profundo 3D',   shape: 'almond',  finish: 'sapphire_cat',    baseY: -1.9, radius: 1.70, angleOffset: 3.40, tilt: 0.15 },
  { id: 'quartz_frost',    name: 'Cuarzo Hielo Glaciar', shape: 'coffin',  finish: 'quartz_frost',    baseY: -1.0, radius: 1.90, angleOffset: 4.80, tilt: -0.16 },
  { id: 'amethyst_aura',   name: 'Aura Ciruela Mística', shape: 'oval',    finish: 'lavender_aura',   baseY: -0.1, radius: 2.10, angleOffset: 0.90, tilt: 0.14 },
  { id: 'champagne_chrome',name: 'Champagne Satin Chrome',shape: 'stiletto',finish: 'chrome',         baseY: 0.8,  radius: 2.30, angleOffset: 2.10, tilt: -0.13 },
  { id: 'royal_emerald',   name: 'Esmeralda Imperial 3D',shape: 'coffin',  finish: 'emerald',         baseY: 1.5,  radius: 2.50, angleOffset: 3.80, tilt: 0.17 },
  { id: 'carey_suprem',    name: 'Carey Royale Couture', shape: 'stiletto',finish: 'tortoise',        baseY: 2.3,  radius: 2.70, angleOffset: 5.00, tilt: -0.16 },
]

/* ─── Fully Closed Solid Volumetric Nail Geometry Generator ─── */
function createSolidSculptedNailGeometry(shape: NailShapeType, lengthFactor: number = 1.0): THREE.BufferGeometry {
  const segmentsU = 22
  const segmentsV = 36
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const totalLength = 0.65 * (0.85 + lengthFactor * 0.3)
  const baseHalfWidth = 0.115

  function getPoint(uNorm: number, v: number) {
    let halfW = baseHalfWidth
    if (v < 0.16) {
      const r = v / 0.16
      halfW = baseHalfWidth * Math.sqrt(Math.max(0.001, 1 - Math.pow(1 - r, 2)))
    } else if (v <= 0.42) {
      halfW = baseHalfWidth + (v - 0.16) * 0.015
    } else {
      const t = (v - 0.42) / 0.58
      if (shape === 'stiletto') {
        halfW = baseHalfWidth * (1 - Math.pow(t, 0.92) * 0.95)
      } else if (shape === 'coffin') {
        halfW = baseHalfWidth * (1 - t * 0.52)
      } else if (shape === 'almond') {
        halfW = baseHalfWidth * (1 - Math.pow(t, 1.35) * 0.82)
      } else {
        halfW = baseHalfWidth * Math.sqrt(Math.max(0.01, 1 - Math.pow(t, 2) * 0.75))
      }
    }

    const x = uNorm * Math.max(0.006, halfW)
    const y = (v - 0.38) * totalLength

    // Longitudinal apex arch (highest at 38% length)
    const longitudinalApex = Math.sin(v * Math.PI * 0.85) * 0.038

    // Transverse C-Curve arch
    const cCurve = Math.cos(uNorm * Math.PI * 0.48) * (0.055 + (1 - v * 0.4) * 0.025)

    // Solid thickness tapering to 0 at perimeter
    const borderTaper = (1 - uNorm * uNorm) * Math.sin(v * Math.PI)
    const thickness = 0.014 * Math.max(0, borderTaper)

    const zFront = longitudinalApex + cCurve + thickness * 0.5
    const zBack  = longitudinalApex + cCurve - thickness * 0.5

    return { x, y, zFront, zBack }
  }

  // Front surface
  for (let iv = 0; iv <= segmentsV; iv++) {
    const v = iv / segmentsV
    for (let iu = 0; iu <= segmentsU; iu++) {
      const uNorm = (iu / segmentsU) * 2 - 1
      const { x, y, zFront } = getPoint(uNorm, v)
      positions.push(x, y, zFront)

      // Center-focused vertical UV mapping aligned with image orientation
      const uTex = uNorm * 0.38 + 0.5
      const vTex = 1.0 - v * 0.92
      uvs.push(uTex, vTex)
    }
  }

  for (let iv = 0; iv < segmentsV; iv++) {
    for (let iu = 0; iu < segmentsU; iu++) {
      const a = iv * (segmentsU + 1) + iu
      const b = (iv + 1) * (segmentsU + 1) + iu
      const c = (iv + 1) * (segmentsU + 1) + (iu + 1)
      const d = iv * (segmentsU + 1) + (iu + 1)
      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  // Back surface
  const backOffset = positions.length / 3
  for (let iv = 0; iv <= segmentsV; iv++) {
    const v = iv / segmentsV
    for (let iu = 0; iu <= segmentsU; iu++) {
      const uNorm = (iu / segmentsU) * 2 - 1
      const { x, y, zBack } = getPoint(uNorm, v)
      positions.push(x, y, zBack)
      const uTex = uNorm * 0.38 + 0.5
      const vTex = 1.0 - v * 0.92
      uvs.push(uTex, vTex)
    }
  }

  for (let iv = 0; iv < segmentsV; iv++) {
    for (let iu = 0; iu < segmentsU; iu++) {
      const a = backOffset + iv * (segmentsU + 1) + iu
      const b = backOffset + (iv + 1) * (segmentsU + 1) + iu
      const c = backOffset + (iv + 1) * (segmentsU + 1) + (iu + 1)
      const d = backOffset + iv * (segmentsU + 1) + (iu + 1)
      indices.push(a, d, b)
      indices.push(b, d, c)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

/* ─── High-Definition In-Memory Procedural Texture Generators ─── */
function createProceduralTextures(): Record<string, THREE.CanvasTexture> {
  const textures: Record<string, THREE.CanvasTexture> = {}

  // 1. Korean Blush Aura (Soft diffused strawberry blush over milky jelly base)
  {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    // Milky nude jelly background
    ctx.fillStyle = '#fceee9'
    ctx.fillRect(0, 0, 512, 1024)

    // Soft gradient blur aura
    const grad = ctx.createRadialGradient(256, 520, 20, 256, 520, 240)
    grad.addColorStop(0, 'rgba(235, 78, 115, 0.95)')
    grad.addColorStop(0.35, 'rgba(238, 108, 140, 0.72)')
    grad.addColorStop(0.7, 'rgba(247, 168, 185, 0.35)')
    grad.addColorStop(1, 'rgba(252, 238, 233, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 1024)

    // Secondary subtle peach depth
    const grad2 = ctx.createRadialGradient(256, 480, 10, 256, 480, 150)
    grad2.addColorStop(0, 'rgba(255, 120, 130, 0.5)')
    grad2.addColorStop(1, 'rgba(255, 180, 190, 0)')
    ctx.fillStyle = grad2
    ctx.fillRect(0, 0, 512, 1024)

    textures.aura = new THREE.CanvasTexture(canvas)
  }

  // 2. Carey & Ámbar (Amber Tortoiseshell with floating organic dark spots)
  {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Warm deep amber honey base
    const baseGrad = ctx.createLinearGradient(0, 0, 512, 1024)
    baseGrad.addColorStop(0, '#c7781b')
    baseGrad.addColorStop(0.5, '#994f0e')
    baseGrad.addColorStop(1, '#5a2d05')
    ctx.fillStyle = baseGrad
    ctx.fillRect(0, 0, 512, 1024)

    // Dark organic tortoise patches with soft edges
    const spots = [
      { x: 180, y: 220, rx: 70, ry: 45, rot: 0.4 },
      { x: 330, y: 380, rx: 90, ry: 60, rot: -0.5 },
      { x: 210, y: 540, rx: 80, ry: 50, rot: 0.8 },
      { x: 360, y: 720, rx: 75, ry: 60, rot: -0.3 },
      { x: 190, y: 840, rx: 85, ry: 55, rot: 0.2 },
      { x: 280, y: 150, rx: 50, ry: 35, rot: -0.2 },
      { x: 140, y: 400, rx: 45, ry: 65, rot: 0.6 },
      { x: 340, y: 590, rx: 60, ry: 40, rot: -0.7 },
    ]

    spots.forEach(s => {
      ctx.save()
      ctx.translate(s.x, s.y)
      ctx.rotate(s.rot)
      const spotGrad = ctx.createRadialGradient(0, 0, s.rx * 0.15, 0, 0, s.rx)
      spotGrad.addColorStop(0, 'rgba(24, 10, 4, 0.95)')
      spotGrad.addColorStop(0.65, 'rgba(54, 22, 7, 0.75)')
      spotGrad.addColorStop(1, 'rgba(153, 79, 14, 0)')
      ctx.fillStyle = spotGrad
      ctx.beginPath()
      ctx.ellipse(0, 0, s.rx, s.ry, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    textures.tortoise = new THREE.CanvasTexture(canvas)
  }

  // 3. Mármol Esmeralda & Vetas Doradas (Imperial Deep Emerald with Gold Veins)
  {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Deep malachite/emerald gradient
    const emGrad = ctx.createLinearGradient(0, 0, 512, 1024)
    emGrad.addColorStop(0, '#042718')
    emGrad.addColorStop(0.4, '#09432b')
    emGrad.addColorStop(0.7, '#063421')
    emGrad.addColorStop(1, '#02180f')
    ctx.fillStyle = emGrad
    ctx.fillRect(0, 0, 512, 1024)

    // Swirling mineral depth bands
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.strokeStyle = `rgba(18, 96, 62, ${0.35 + i * 0.08})`
      ctx.lineWidth = 28 - i * 3
      ctx.moveTo(0, 160 * i + 80)
      ctx.bezierCurveTo(200, 160 * i + 150, 320, 160 * i + 40, 512, 160 * i + 110)
      ctx.stroke()
    }

    // Gold leaf shimmering mineral veins
    ctx.strokeStyle = '#e6bf65'
    ctx.lineWidth = 3
    ctx.shadowColor = '#ffe399'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.moveTo(40, 200)
    ctx.bezierCurveTo(180, 290, 240, 240, 380, 480)
    ctx.bezierCurveTo(440, 600, 280, 720, 460, 920)
    ctx.stroke()

    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(350, 120)
    ctx.bezierCurveTo(240, 280, 120, 420, 170, 650)
    ctx.bezierCurveTo(190, 740, 110, 860, 80, 980)
    ctx.stroke()
    ctx.shadowBlur = 0

    textures.emerald = new THREE.CanvasTexture(canvas)
  }

  // 4. Micro Gold French (Porcelain nude bed with micro 24K gold smile tip)
  {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Milky clean clean-girl nude bed
    const nudeGrad = ctx.createLinearGradient(0, 0, 0, 1024)
    nudeGrad.addColorStop(0, '#f9ece6')
    nudeGrad.addColorStop(0.7, '#f4ded6')
    nudeGrad.addColorStop(1, '#ebd0c7')
    ctx.fillStyle = nudeGrad
    ctx.fillRect(0, 0, 512, 1024)

    // French smile tip line in gold at the free edge (top of UV)
    ctx.fillStyle = '#dfb15b'
    ctx.beginPath()
    ctx.moveTo(60, 0)
    ctx.quadraticCurveTo(256, 75, 452, 0)
    ctx.lineTo(512, 0)
    ctx.lineTo(512, 35)
    ctx.quadraticCurveTo(256, 95, 0, 35)
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.fill()

    // Delicate metallic rim glow
    ctx.strokeStyle = '#fff0ba'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(80, 2)
    ctx.quadraticCurveTo(256, 76, 432, 2)
    ctx.stroke()

    textures.microfrench = new THREE.CanvasTexture(canvas)
  }

  // 5. Magnetic Velvet Cat-Eye (Rich reflective magnetic light band across the center)
  {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Midnight amethyst / sapphire deep velvet base
    const baseGrad = ctx.createLinearGradient(0, 0, 512, 1024)
    baseGrad.addColorStop(0, '#0d1326')
    baseGrad.addColorStop(0.5, '#191f3a')
    baseGrad.addColorStop(1, '#090d1a')
    ctx.fillStyle = baseGrad
    ctx.fillRect(0, 0, 512, 1024)

    // Slanted diagonal 3D magnetic cat-eye beam
    const catGrad = ctx.createLinearGradient(80, 180, 432, 840)
    catGrad.addColorStop(0, 'rgba(164, 194, 255, 0)')
    catGrad.addColorStop(0.38, 'rgba(175, 205, 255, 0.4)')
    catGrad.addColorStop(0.5, 'rgba(235, 245, 255, 0.98)')
    catGrad.addColorStop(0.62, 'rgba(175, 205, 255, 0.4)')
    catGrad.addColorStop(1, 'rgba(164, 194, 255, 0)')

    ctx.fillStyle = catGrad
    ctx.beginPath()
    ctx.moveTo(0, 320)
    ctx.lineTo(320, 0)
    ctx.lineTo(512, 200)
    ctx.lineTo(200, 1024)
    ctx.lineTo(0, 820)
    ctx.closePath()
    ctx.fill()

    textures.cateye = new THREE.CanvasTexture(canvas)
  }

  // 6. Aura Lavanda & Ciruela Pastel (Lavender soft aura with milky edges)
  {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#f8f4fb'
    ctx.fillRect(0, 0, 512, 1024)

    const grad = ctx.createRadialGradient(256, 520, 20, 256, 520, 230)
    grad.addColorStop(0, 'rgba(168, 85, 247, 0.92)')
    grad.addColorStop(0.4, 'rgba(192, 132, 252, 0.65)')
    grad.addColorStop(0.75, 'rgba(233, 213, 255, 0.3)')
    grad.addColorStop(1, 'rgba(248, 244, 251, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 1024)

    textures.lavender_aura = new THREE.CanvasTexture(canvas)
  }

  // 7. Ruby Velvet Cat-Eye (Burgundy crimson base with bright magenta light slash)
  {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    const baseGrad = ctx.createLinearGradient(0, 0, 512, 1024)
    baseGrad.addColorStop(0, '#2d060d')
    baseGrad.addColorStop(0.5, '#4a0b17')
    baseGrad.addColorStop(1, '#1f0308')
    ctx.fillStyle = baseGrad
    ctx.fillRect(0, 0, 512, 1024)

    const catGrad = ctx.createLinearGradient(80, 200, 432, 840)
    catGrad.addColorStop(0, 'rgba(255, 150, 180, 0)')
    catGrad.addColorStop(0.4, 'rgba(255, 110, 150, 0.5)')
    catGrad.addColorStop(0.5, 'rgba(255, 230, 240, 0.98)')
    catGrad.addColorStop(0.6, 'rgba(255, 110, 150, 0.5)')
    catGrad.addColorStop(1, 'rgba(255, 150, 180, 0)')
    ctx.fillStyle = catGrad
    ctx.beginPath()
    ctx.moveTo(0, 320)
    ctx.lineTo(320, 0)
    ctx.lineTo(512, 200)
    ctx.lineTo(200, 1024)
    ctx.lineTo(0, 820)
    ctx.closePath()
    ctx.fill()

    textures.ruby_velvet = new THREE.CanvasTexture(canvas)
  }

  // 8. Sapphire Ocean Cat-Eye (Royal intense navy with electric cyan beam)
  {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    const baseGrad = ctx.createLinearGradient(0, 0, 512, 1024)
    baseGrad.addColorStop(0, '#03142e')
    baseGrad.addColorStop(0.5, '#072552')
    baseGrad.addColorStop(1, '#020b1a')
    ctx.fillStyle = baseGrad
    ctx.fillRect(0, 0, 512, 1024)

    const catGrad = ctx.createLinearGradient(80, 200, 432, 840)
    catGrad.addColorStop(0, 'rgba(56, 189, 248, 0)')
    catGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.55)')
    catGrad.addColorStop(0.5, 'rgba(224, 242, 254, 0.98)')
    catGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.55)')
    catGrad.addColorStop(1, 'rgba(56, 189, 248, 0)')
    ctx.fillStyle = catGrad
    ctx.beginPath()
    ctx.moveTo(0, 320)
    ctx.lineTo(320, 0)
    ctx.lineTo(512, 200)
    ctx.lineTo(200, 1024)
    ctx.lineTo(0, 820)
    ctx.closePath()
    ctx.fill()

    textures.sapphire_cat = new THREE.CanvasTexture(canvas)
  }

  // Configure repeat & filter properties for high visual fidelity
  Object.values(textures).forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    tex.generateMipmaps = true
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.needsUpdate = true
  })

  return textures
}

/* ─── Material Component with Direct Procedural Physical Shaders ─── */
interface MaterialProps {
  finish: ModernFinishType
  textures: Record<string, THREE.CanvasTexture>
}

function ModernNailMaterial({ finish, textures }: MaterialProps) {
  // 1. Cyber Liquid Mirror Chrome (100% reflective liquid metal)
  if (finish === 'chrome') {
    return (
      <meshPhysicalMaterial
        color="#f2f5fa"
        metalness={0.98}
        roughness={0.02}
        clearcoat={1.0}
        clearcoatRoughness={0.01}
        reflectivity={1.0}
        envMapIntensity={1.8}
      />
    )
  }

  // 2. Liquid 24K Melted Gold (Heavy warm pure gold)
  if (finish === 'liquid') {
    return (
      <meshPhysicalMaterial
        color="#eab754"
        metalness={0.97}
        roughness={0.03}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={1.0}
        envMapIntensity={1.9}
      />
    )
  }

  // 3. Glazed Donut Pearl (Hailey Bieber nacre with iridescent sheen)
  if (finish === 'pearl') {
    return (
      <meshPhysicalMaterial
        color="#fff5f2"
        metalness={0.25}
        roughness={0.06}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        iridescence={0.88}
        iridescenceIOR={1.38}
        iridescenceThicknessRange={[100, 400]}
        reflectivity={0.95}
      />
    )
  }

  // 4. Oxblood Glass (Ultra-deep sensual cherry glass with high refraction)
  if (finish === 'oxblood') {
    return (
      <meshPhysicalMaterial
        color="#3b050d"
        metalness={0.12}
        roughness={0.03}
        clearcoat={1.0}
        clearcoatRoughness={0.01}
        transmission={0.42}
        thickness={0.5}
        reflectivity={0.98}
      />
    )
  }

  // 5. Glass / Quartz Transmission (Translucent luxury crystal)
  if (finish === 'glass') {
    return (
      <MeshTransmissionMaterial
        backside
        samples={8}
        resolution={256}
        transmission={0.93}
        roughness={0.02}
        clearcoat={1.0}
        thickness={0.45}
        chromaticAberration={0.08}
        distortion={0.12}
        distortionScale={0.2}
        color="#ffeef4"
      />
    )
  }

  // 6. Velvet Cat-Eye (Procedural light beam with silky sheen)
  if (finish === 'cateye') {
    return (
      <meshPhysicalMaterial
        map={textures.cateye}
        color="#ffffff"
        metalness={0.7}
        roughness={0.08}
        sheen={1.0}
        sheenRoughness={0.2}
        sheenColor="#9ec3f7"
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={0.95}
      />
    )
  }

  // 7. Mármol Esmeralda & Gold (Rich procedural malachite marble)
  if (finish === 'emerald') {
    return (
      <meshPhysicalMaterial
        map={textures.emerald}
        metalness={0.35}
        roughness={0.04}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={0.96}
      />
    )
  }

  // 8. Carey & Ámbar (Glossy translucent tortoise shell)
  if (finish === 'tortoise') {
    return (
      <meshPhysicalMaterial
        map={textures.tortoise}
        metalness={0.18}
        roughness={0.03}
        clearcoat={1.0}
        clearcoatRoughness={0.01}
        reflectivity={0.97}
        transmission={0.25}
        thickness={0.35}
      />
    )
  }

  // 9. Micro Gold French (Porcelain nude with golden smile curve)
  if (finish === 'microfrench') {
    return (
      <meshPhysicalMaterial
        map={textures.microfrench}
        metalness={0.25}
        roughness={0.05}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={0.94}
      />
    )
  }

  // 11. Rose Gold Liquid (Luxury rose-gold molten mirror)
  if (finish === 'rosegold') {
    return (
      <meshPhysicalMaterial
        color="#e5989b"
        metalness={0.96}
        roughness={0.03}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={1.0}
        envMapIntensity={1.8}
      />
    )
  }

  // 12. Cobalt Cyber Chrome (Intense metallic cobalt blue)
  if (finish === 'cobalt_chrome') {
    return (
      <meshPhysicalMaterial
        color="#1d4ed8"
        metalness={0.95}
        roughness={0.04}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={1.0}
        envMapIntensity={2.0}
      />
    )
  }

  // 13. Sunset Chrome Boreal (Peach-gold iridescent shift)
  if (finish === 'sunset_chrome') {
    return (
      <meshPhysicalMaterial
        color="#f97316"
        metalness={0.90}
        roughness={0.05}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        iridescence={0.95}
        iridescenceIOR={1.45}
        iridescenceThicknessRange={[150, 480]}
        reflectivity={1.0}
      />
    )
  }

  // 14. Noir Obsidiana & Oro (Glossy jet-black with high specular highlight)
  if (finish === 'noir_gold') {
    return (
      <meshPhysicalMaterial
        color="#0a0a0a"
        metalness={0.4}
        roughness={0.02}
        clearcoat={1.0}
        clearcoatRoughness={0.01}
        reflectivity={1.0}
      />
    )
  }

  // 15. Milky Glaze Nácar (White milky glazed syrup)
  if (finish === 'milky_glaze') {
    return (
      <meshPhysicalMaterial
        color="#fdfbf9"
        metalness={0.15}
        roughness={0.05}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        iridescence={0.7}
        iridescenceIOR={1.3}
        transmission={0.35}
        thickness={0.3}
        reflectivity={0.96}
      />
    )
  }

  // 16. Terracota Nude Chic (Warm warm earth terracotta satin)
  if (finish === 'terracotta') {
    return (
      <meshPhysicalMaterial
        color="#b45309"
        metalness={0.08}
        roughness={0.08}
        clearcoat={0.9}
        clearcoatRoughness={0.04}
        reflectivity={0.9}
      />
    )
  }

  // 17. Cuarzo Hielo Glaciar (Cyan crystal transmission)
  if (finish === 'quartz_frost') {
    return (
      <MeshTransmissionMaterial
        backside
        samples={8}
        resolution={256}
        transmission={0.94}
        roughness={0.03}
        clearcoat={1.0}
        thickness={0.4}
        chromaticAberration={0.12}
        distortion={0.15}
        distortionScale={0.25}
        color="#e0f2fe"
      />
    )
  }

  // 18. Lavender Aura (Procedural lilac aura map)
  if (finish === 'lavender_aura') {
    return (
      <meshPhysicalMaterial
        map={textures.lavender_aura}
        roughness={0.03}
        metalness={0.12}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={0.96}
        transmission={0.18}
        thickness={0.25}
      />
    )
  }

  // 19. Ruby Velvet Cat-Eye (Procedural deep crimson magnetic light)
  if (finish === 'ruby_velvet') {
    return (
      <meshPhysicalMaterial
        map={textures.ruby_velvet}
        color="#ffffff"
        metalness={0.65}
        roughness={0.08}
        sheen={1.0}
        sheenRoughness={0.2}
        sheenColor="#f43f5e"
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={0.96}
      />
    )
  }

  // 20. Sapphire Ocean Cat-Eye (Procedural electric navy cat-eye)
  if (finish === 'sapphire_cat') {
    return (
      <meshPhysicalMaterial
        map={textures.sapphire_cat}
        color="#ffffff"
        metalness={0.7}
        roughness={0.08}
        sheen={1.0}
        sheenRoughness={0.2}
        sheenColor="#38bdf8"
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={0.96}
      />
    )
  }

  // Korean Blush Aura (Soft blush diffuser) default
  return (
    <meshPhysicalMaterial
      map={textures.aura}
      roughness={0.03}
      metalness={0.12}
      clearcoat={1.0}
      clearcoatRoughness={0.02}
      reflectivity={0.96}
      transmission={0.18}
      thickness={0.25}
    />
  )
}

/* ─── Individual Sculpted Nail in the Tornado ─── */
interface SingleNailProps {
  design: NailDesign
  index: number
  totalCount: number
  progress: number
  activeStyle: string
  activeLength: number
  activeShape?: NailShapeType
  isCustomizing: boolean
  textures: Record<string, THREE.CanvasTexture>
}

function SingleNail({
  design,
  index,
  totalCount: _totalCount,
  progress,
  activeStyle,
  activeLength,
  activeShape,
  isCustomizing,
  textures,
}: SingleNailProps) {
  const meshGroupRef = useRef<THREE.Group>(null!)

  const isSelected = isCustomizing && activeStyle === design.id
  const effectiveShape = isSelected && activeShape ? activeShape : design.shape

  const geometry = useMemo(() => {
    return createSolidSculptedNailGeometry(effectiveShape, activeLength)
  }, [effectiveShape, activeLength])

  useFrame(({ clock }) => {
    if (!meshGroupRef.current) return
    const t = clock.getElapsedTime()

    if (isCustomizing) {
      if (isSelected) {
        // Move to comfortable viewing position on the left-center of the screen
        meshGroupRef.current.position.x = THREE.MathUtils.lerp(meshGroupRef.current.position.x, -0.7, 0.08)
        meshGroupRef.current.position.y = THREE.MathUtils.lerp(meshGroupRef.current.position.y, 0.05, 0.08)
        meshGroupRef.current.position.z = THREE.MathUtils.lerp(meshGroupRef.current.position.z, 1.2, 0.08)

        meshGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          meshGroupRef.current.rotation.y,
          Math.sin(t * 0.8) * 0.45,
          0.06
        )
        meshGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          meshGroupRef.current.rotation.x,
          Math.cos(t * 0.6) * 0.12 - 0.02,
          0.06
        )
        meshGroupRef.current.rotation.z = THREE.MathUtils.lerp(meshGroupRef.current.rotation.z, 0, 0.06)

        // Refined elegant scale: not overly blown up, balanced with studio lighting
        meshGroupRef.current.scale.setScalar(
          THREE.MathUtils.lerp(meshGroupRef.current.scale.x, 1.35, 0.08)
        )
      } else {
        const slowSpin = t * 0.12
        const curAngle = design.angleOffset + slowSpin
        const targetRadius = design.radius * 1.35
        const tx = Math.cos(curAngle) * targetRadius
        const tz = Math.sin(curAngle) * targetRadius - 1.2
        const ty = design.baseY + Math.sin(t * 0.7 + index) * 0.1

        meshGroupRef.current.position.x = THREE.MathUtils.lerp(meshGroupRef.current.position.x, tx, 0.04)
        meshGroupRef.current.position.y = THREE.MathUtils.lerp(meshGroupRef.current.position.y, ty, 0.04)
        meshGroupRef.current.position.z = THREE.MathUtils.lerp(meshGroupRef.current.position.z, tz, 0.04)

        meshGroupRef.current.rotation.y = -curAngle + Math.PI / 2
        meshGroupRef.current.rotation.z = Math.cos(curAngle) * 0.15
        meshGroupRef.current.scale.setScalar(
          THREE.MathUtils.lerp(meshGroupRef.current.scale.x, 0.85, 0.06)
        )
      }
    } else {
      // ─── TORNADO VORTEX MOTION ───
      const tornadoSpin = t * 0.38 + progress * Math.PI * 5.0
      const curAngle = design.angleOffset + tornadoSpin

      const expansion = 1.0 + Math.sin(progress * Math.PI) * 0.35
      const currentRadius = design.radius * expansion

      const verticalFloat = Math.sin(t * 1.1 + index * 0.6) * 0.08
      const targetY = design.baseY + (progress - 0.5) * 0.6 + verticalFloat

      const targetX = Math.cos(curAngle) * currentRadius
      const targetZ = Math.sin(curAngle) * currentRadius

      meshGroupRef.current.position.x = THREE.MathUtils.lerp(meshGroupRef.current.position.x, targetX, 0.08)
      meshGroupRef.current.position.y = THREE.MathUtils.lerp(meshGroupRef.current.position.y, targetY, 0.08)
      meshGroupRef.current.position.z = THREE.MathUtils.lerp(meshGroupRef.current.position.z, targetZ, 0.08)

      const outwardTilt = 0.22 * expansion
      meshGroupRef.current.rotation.y = -curAngle + Math.PI * 0.5 + Math.sin(t * 0.6 + index) * 0.12
      meshGroupRef.current.rotation.x = Math.sin(curAngle) * outwardTilt + design.tilt
      meshGroupRef.current.rotation.z = Math.cos(curAngle) * -outwardTilt

      const depthScale = 1.0 + (targetZ / 4.0) * 0.25
      meshGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshGroupRef.current.scale.x, Math.max(0.7, depthScale), 0.08)
      )
    }
  })

  return (
    <group ref={meshGroupRef}>
      {/* ── Pure Solid Sculpted Nail with Photo Texture Map ── */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <ModernNailMaterial finish={design.finish} textures={textures} />
      </mesh>
    </group>
  )
}

/* ─── Golden Vortex Particles ─── */
function TornadoVortexSparks({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const count = 90

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const tNorm = i / count
      const radius = 1.1 + tNorm * 1.9
      const angle = tNorm * Math.PI * 10
      pos[i * 3]     = Math.cos(angle) * radius
      pos[i * 3 + 1] = (tNorm - 0.5) * 5.2
      pos[i * 3 + 2] = Math.sin(angle) * radius
      ph[i] = Math.random() * Math.PI * 2
    }
    return [pos, ph]
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    pointsRef.current.rotation.y = t * 0.28 + progress * Math.PI * 3.2

    const geo = pointsRef.current.geometry
    const posAttr = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const origY = (i / count - 0.5) * 5.2
      const floatY = origY + Math.sin(t * 1.4 + phases[i]) * 0.1
      posAttr.setY(i, floatY)
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#d4af37"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ─── Main 3D Scene Root Component ─── */
export const Nail3DModel = ({
  progress,
  activeStyle,
  activeLength,
  activeShape,
  isCustomizing,
}: NailProps) => {
  const rootGroupRef = useRef<THREE.Group>(null!)

  // Generate luxury procedural textures in memory (instant loading, 0 external assets)
  const textures = useMemo(() => createProceduralTextures(), [])

  useFrame(({ clock }) => {
    if (!rootGroupRef.current) return
    const t = clock.getElapsedTime()
    rootGroupRef.current.rotation.x = Math.sin(t * 0.3) * 0.06
    rootGroupRef.current.rotation.z = Math.cos(t * 0.25) * 0.04
  })

  return (
    <Float speed={0.9} rotationIntensity={0.06} floatIntensity={0.16}>
      <group ref={rootGroupRef} position={[0, -0.15, 0]}>
        <TornadoVortexSparks progress={progress} />

        {TORNADO_NAILS.map((design, index) => (
          <SingleNail
            key={design.id}
            design={design}
            index={index}
            totalCount={TORNADO_NAILS.length}
            progress={progress}
            activeStyle={activeStyle}
            activeLength={activeLength}
            activeShape={activeShape}
            isCustomizing={isCustomizing}
            textures={textures}
          />
        ))}
      </group>
    </Float>
  )
}
