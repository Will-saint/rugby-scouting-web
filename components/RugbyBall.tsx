"use client"
import { useEffect, useRef } from "react"

export function RugbyBall({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animId = 0

    import("three").then((THREE) => {
      if (!containerRef.current) return
      const W = container.clientWidth || window.innerWidth / 2
      const H = container.clientHeight || window.innerHeight

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100)
      camera.position.set(0, 0.2, 6)
      camera.lookAt(0, 0, 0)

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      /* ── FFR texture ── */
      function createFFRTexture() {
        const TW = 1024, TH = 512
        const cv = document.createElement("canvas")
        cv.width = TW; cv.height = TH
        const ctx = cv.getContext("2d")!
        const img = ctx.createImageData(TW, TH)
        const d = img.data
        const WHITE = [248, 246, 238], BLUE = [0, 35, 149], RED = [237, 41, 57], BLACK = [18, 18, 18]

        function wd(a: number, b: number) { const v = Math.abs(a - b); return Math.min(v, 1 - v) }

        for (let py = 0; py < TH; py++) {
          for (let px = 0; px < TW; px++) {
            const u = px / TW, v = py / TH
            const env = Math.sin(Math.PI * v)
            const bW = 0.095 * env, rW = 0.022 * env
            let col = WHITE
            if (wd(u, 0.25) < bW || wd(u, 0.75) < bW) col = BLUE
            else if (wd(u, 0.14) < rW || wd(u, 0.36) < rW || wd(u, 0.64) < rW || wd(u, 0.86) < rW) col = RED
            if (wd(u, 0) < 0.005 || wd(u, 0.5) < 0.005 || Math.abs(v - 0.5) < 0.006) col = BLACK
            const i = (py * TW + px) * 4
            d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255
          }
        }
        ctx.putImageData(img, 0, 0)

        // Lacing
        const lx = TW * 0.5, lt = TH * 0.28, lb = TH * 0.72
        const n = 7, gap = (lb - lt) / (n - 1)
        ctx.strokeStyle = "#111"; ctx.lineWidth = 3; ctx.lineCap = "round"
        ctx.beginPath(); ctx.moveTo(lx, lt); ctx.lineTo(lx, lb); ctx.stroke()
        for (let i = 0; i < n; i++) {
          const y = lt + i * gap
          const len = 18 * Math.sin(Math.PI * ((y / TH - 0.28) / 0.44))
          ctx.lineWidth = 2.5
          ctx.beginPath(); ctx.moveTo(lx - 8, y - 6); ctx.lineTo(lx - 8 - len, y - 6); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(lx + 8, y - 6); ctx.lineTo(lx + 8 + len, y - 6); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(lx - 8, y + 6); ctx.lineTo(lx - 8 - len, y + 6); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(lx + 8, y + 6); ctx.lineTo(lx + 8 + len, y + 6); ctx.stroke()
        }
        return new THREE.CanvasTexture(cv)
      }

      function createBumpTexture() {
        const cv = document.createElement("canvas")
        cv.width = 512; cv.height = 256
        const ctx = cv.getContext("2d")!
        ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, 512, 256)
        for (let i = 0; i < 12000; i++) {
          const x = Math.random() * 512, y = Math.random() * 256
          const r = Math.random() * 1.5 + 0.3
          const v = Math.floor(Math.random() * 60 + 100)
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.fill()
        }
        return new THREE.CanvasTexture(cv)
      }

      /* ── Geometry ── */
      const pts = []
      for (let i = 0; i <= 48; i++) {
        const angle = (i / 48) * Math.PI
        pts.push(new THREE.Vector2(Math.pow(Math.sin(angle), 1.18) * 0.82, -Math.cos(angle) * 1.45))
      }
      const ball = new THREE.Mesh(
        new THREE.LatheGeometry(pts, 80),
        new THREE.MeshPhongMaterial({ map: createFFRTexture(), bumpMap: createBumpTexture(), bumpScale: 0.03, shininess: 55, specular: new THREE.Color(0x555555) })
      )
      scene.add(ball)

      /* Shadow */
      const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1, depthWrite: false })
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.2), shadowMat)
      shadow.rotation.x = -Math.PI / 2
      shadow.position.set(0, -2.2, 0)
      scene.add(shadow)

      /* Lights */
      scene.add(new THREE.AmbientLight(0xfff5e0, 0.55))
      const key = new THREE.DirectionalLight(0xffffff, 1.1)
      key.position.set(3, 6, 5); scene.add(key)
      const rim = new THREE.DirectionalLight(0x8899ff, 0.4)
      rim.position.set(-5, -1, -4); scene.add(rim)
      const fill = new THREE.DirectionalLight(0xfff0d0, 0.2)
      fill.position.set(0, -4, 3); scene.add(fill)

      /* Animate */
      const clock = new THREE.Clock()
      function animate() {
        animId = requestAnimationFrame(animate)
        const t = clock.getElapsedTime()
        ball.rotation.y = t * (Math.PI * 2 / 4.5)
        ball.rotation.z = 0.15
        ball.position.y = Math.sin(t * 0.9) * 0.12
        const sc = 1 - ball.position.y * 0.08
        shadow.scale.set(sc, sc, 1)
        shadowMat.opacity = 0.1 - ball.position.y * 0.012
        renderer.render(scene, camera)
      }
      animate()

      /* Resize */
      function onResize() {
        if (!container) return
        const W = container.clientWidth, H = container.clientHeight
        if (W === 0 || H === 0) return
        camera.aspect = W / H
        camera.updateProjectionMatrix()
        renderer.setSize(W, H)
      }
      window.addEventListener("resize", onResize)

      // Cleanup ref
      ;(container as HTMLElement & { _three_cleanup?: () => void })._three_cleanup = () => {
        window.removeEventListener("resize", onResize)
        cancelAnimationFrame(animId)
        renderer.dispose()
        if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement)
      }
    })

    return () => {
      cancelAnimationFrame(animId)
      const c = container as HTMLElement & { _three_cleanup?: () => void }
      c._three_cleanup?.()
    }
  }, [])

  return <div ref={containerRef} className={className} style={{ width: "100%", height: "100%", minHeight: 400 }} />
}
