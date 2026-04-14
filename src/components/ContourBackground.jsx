import * as React from 'react'

const ContourBackground = () => {
  const canvasRef = React.useRef(null)
  const animationFrameRef = React.useRef(null)
  const timeRef = React.useRef(0)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    let width, height

    // Perlin Noise implementation
    class PerlinNoise {
      constructor(seed = 42) {
        this.perm = []
        const p = Array.from({length: 256}, (_, i) => i)
        let n = seed
        for (let i = 255; i > 0; i--) {
          n = (n * 16807) % 2147483647
          const j = n % (i + 1)
          ;[p[i], p[j]] = [p[j], p[i]]
        }
        for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255]
      }
      fade(t) { return t * t * t * (t * (t * 6 - 15) + 10) }
      lerp(a, b, t) { return a + t * (b - a) }
      grad(hash, x, y) {
        const h = hash & 3
        return ((h & 1) ? -((h < 2) ? x : y) : ((h < 2) ? x : y)) + ((h & 2) ? -((h < 2) ? y : x) : ((h < 2) ? y : x))
      }
      noise(x, y) {
        const X = Math.floor(x) & 255, Y = Math.floor(y) & 255
        x -= Math.floor(x)
        y -= Math.floor(y)
        const u = this.fade(x), v = this.fade(y)
        const A = this.perm[X] + Y, B = this.perm[X + 1] + Y
        return this.lerp(
          this.lerp(this.grad(this.perm[A], x, y), this.grad(this.perm[B], x - 1, y), u),
          this.lerp(this.grad(this.perm[A + 1], x, y - 1), this.grad(this.perm[B + 1], x - 1, y - 1), u),
          v
        )
      }
      noise3D(x, y, z) {
        const z0 = Math.floor(z), zf = z - z0
        return this.lerp(
          this.noise(x + z0 * 31.41, y + z0 * 17.93),
          this.noise(x + (z0 + 1) * 31.41, y + (z0 + 1) * 17.93),
          this.fade(zf)
        )
      }
      fbm3D(x, y, z, octaves = 5) {
        let value = 0, amp = 0.5, freq = 1
        for (let i = 0; i < octaves; i++) {
          value += amp * this.noise3D(x * freq, y * freq, z * freq)
          amp *= 0.5
          freq *= 2
        }
        return value * 0.5 + 0.5
      }
    }

    const perlin = new PerlinNoise(123)

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    // Smooth interpolation using cubic easing
    const smoothInterp = (a, b, t) => {
      const clamped = Math.max(0, Math.min(1, (t - a) / (b - a)))
      // Cubic easing for smoother transitions
      const eased = clamped * clamped * (3 - 2 * clamped)
      return eased
    }

    const getEdges = (ci, x, y, s, v00, v10, v01, v11, th) => {
      const interp = (a, b) => smoothInterp(a, b, th)
      const t = [x + interp(v00, v10) * s, y]
      const b = [x + interp(v01, v11) * s, y + s]
      const l = [x, y + interp(v00, v01) * s]
      const r = [x + s, y + interp(v10, v11) * s]
      return ({
        1: [...l, ...t], 2: [...t, ...r], 3: [...l, ...r], 4: [...b, ...l],
        5: [...b, ...t], 6: [...t, ...l, ...b, ...r], 7: [...b, ...r],
        8: [...r, ...b], 9: [...r, ...t, ...l, ...b], 10: [...t, ...b],
        11: [...r, ...b], 12: [...l, ...r], 13: [...t, ...r], 14: [...l, ...t]
      })[ci] || []
    }

    let lastFrameTime = 0
    const targetFPS = 30
    const frameInterval = 1000 / targetFPS

    const draw = (currentTime) => {
      // Throttle to target FPS for better performance
      if (currentTime - lastFrameTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(draw)
        return
      }
      lastFrameTime = currentTime

      ctx.clearRect(0, 0, width, height)

      // Increased cell size for better performance (fewer calculations)
      const cellSize = 2.5
      const cols = Math.ceil(width / cellSize) + 1
      const rows = Math.ceil(height / cellSize) + 1
      const scale = 0.002
      const levels = 8 // Reduced from 12 to 8 for better performance

      // Generate height map
      const heightMap = []
      for (let y = 0; y < rows; y++) {
        heightMap[y] = []
        for (let x = 0; x < cols; x++) {
          heightMap[y][x] = perlin.fbm3D(x * cellSize * scale, y * cellSize * scale, timeRef.current * 0.08, 6) // Reduced octaves from 7 to 6
        }
      }

      // Draw contour lines - optimized to draw fewer levels
      for (let level = 0; level < levels; level++) {
        const threshold = level / levels
        const isMajor = level % 4 === 0 // Adjusted for fewer levels
        
        ctx.strokeStyle = isMajor 
          ? 'rgba(180, 190, 205, 0.18)' 
          : 'rgba(200, 210, 220, 0.12)'
        ctx.lineWidth = isMajor ? 1.8 : 1.0
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.miterLimit = 10
        ctx.beginPath()

        for (let y = 0; y < rows - 1; y++) {
          for (let x = 0; x < cols - 1; x++) {
            const v00 = heightMap[y][x]
            const v10 = heightMap[y][x + 1]
            const v01 = heightMap[y + 1][x]
            const v11 = heightMap[y + 1][x + 1]
            const caseIndex = (v00 > threshold ? 1 : 0) | 
                             (v10 > threshold ? 2 : 0) | 
                             (v01 > threshold ? 4 : 0) | 
                             (v11 > threshold ? 8 : 0)
            
            if (caseIndex !== 0 && caseIndex !== 15) {
              const px = x * cellSize
              const py = y * cellSize
              const edges = getEdges(caseIndex, px, py, cellSize, v00, v10, v01, v11, threshold)
              for (let i = 0; i < edges.length; i += 4) {
                ctx.moveTo(edges[i], edges[i + 1])
                ctx.lineTo(edges[i + 2], edges[i + 3])
              }
            }
          }
        }
        ctx.stroke()
      }

      timeRef.current += 0.008
      animationFrameRef.current = requestAnimationFrame(draw)
    }

    resize()
    animationFrameRef.current = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="contour-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  )
}

export default ContourBackground
