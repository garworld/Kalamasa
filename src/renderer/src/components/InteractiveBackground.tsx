import React, { useEffect, useRef } from 'react'

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = window.innerWidth
    let height = window.innerHeight

    // Particle settings
    const particleCount = 60 // Number of nodes
    const connectionDistance = 150 // Distance to draw lines
    const mouseParams = { x: -1000, y: -1000, radius: 200 } // Mouse interaction radius

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
    }

    const particles: Particle[] = []

    const initParticles = () => {
      particles.length = 0
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5, // Slow velocity
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1
        })
      }
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initParticles()
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseParams.x = e.clientX
      mouseParams.y = e.clientY
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    // Initial sizing
    handleResize()

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#1d1d1f' // Particle color (black/dark gray)
      ctx.strokeStyle = 'rgba(29, 29, 31, 0.1)' // Line color (faint black)

      // Update and draw particles
      particles.forEach((p, i) => {
        // Movement
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // Mouse interaction (repulse)
        const dx = p.x - mouseParams.x
        const dy = p.y - mouseParams.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouseParams.radius) {
          const forceDirectionX = dx / distance
          const forceDirectionY = dy / distance
          const force = (mouseParams.radius - distance) / mouseParams.radius
          const directionX = forceDirectionX * force * 1.5
          const directionY = forceDirectionY * force * 1.5

          p.x += directionX
          p.y += directionY
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx2 = p.x - p2.x
          const dy2 = p.y - p2.y
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

          if (dist2 < connectionDistance) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(29, 29, 31, ${1 - dist2 / connectionDistance})`
            ctx.lineWidth = 1
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1, // Behind everything
        width: '100%',
        height: '100%',
        background: '#f9f9fa' // Base background color
      }}
    />
  )
}

export default InteractiveBackground
