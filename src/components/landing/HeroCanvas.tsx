'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  pulse: number
  pulseSpeed: number
  isPrimary: boolean
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []
    const PARTICLE_COUNT = 90
    const MAX_DIST = 160
    const MOUSE_RADIUS = 120

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.018 + 0.008,
        isPrimary: Math.random() < 0.12,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { x: mx, y: my } = mouseRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
          p.vx += (dx / dist) * force * 0.04
          p.vy += (dy / dist) * force * 0.04
        }

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 1.2) {
          p.vx = (p.vx / speed) * 1.2
          p.vy = (p.vy / speed) * 1.2
        }

        // Damping
        p.vx *= 0.995
        p.vy *= 0.995

        p.x += p.vx
        p.y += p.vy
        p.pulse += p.pulseSpeed

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.18

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const cdx = p.x - p2.x
          const cdy = p.y - p2.y
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
          if (cdist < MAX_DIST) {
            const lineAlpha = (1 - cdist / MAX_DIST) * 0.25
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(34, 197, 94, ${lineAlpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }

        // Glow halo for primary nodes
        if (p.isPrimary) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 8)
          g.addColorStop(0, `rgba(74, 222, 128, ${pulseAlpha * 0.35})`)
          g.addColorStop(1, 'rgba(34, 197, 94, 0)')
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius * 8, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        }

        // Node core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.isPrimary ? p.radius * 1.8 : p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.isPrimary ? '74, 222, 128' : '34, 197, 94'}, ${pulseAlpha})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
