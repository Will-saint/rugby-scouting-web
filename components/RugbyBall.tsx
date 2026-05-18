"use client"
import { useEffect, useRef } from "react"

export function RugbyBall({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animId: number
    let renderer: import("three").WebGLRenderer | undefined

    import("three").then((THREE) => {
      if (!containerRef.current) return
      const W = container.clientWidth
      const H = container.clientHeight

      /* Scene */
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100)
      camera.position.set(0, 0.2, 6)
      camera.lookAt(0, 0, 0)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      container.appendChild(renderer.domElement)

      /* FFR texture */
      function createFFRTexture() {
        const TW = 1024, TH = 512
        const c = document.createElement("canvas")
        c.width = TW; c.height = TH
        const ctx = c.getContext("2d")!
        const img = ctx.createImageData(TW, TH)
        const d = img.data
        const WHITE = [248, 246, 238], BLUE = [0, 35, 149], RED = [237, 41, 57], BLACK = [18, 18, 18]
        function wrapDist(a: number, b: number) { const d0 = Math.abs(a - b); return Math.min(d0, 1 - d0) }
        for (let py = 0; py < TH; py++) {
          for (let px = 0; px < TW; px++) {
            const u = px / TW, v = py / TH
            const panelEnv = Math.sin(Math.PI * v)
            const dBlue1 = wrapDist(u, 0.25), dBlue2 = wrapDist(u, 0.75)
            const dRed1a = wrapDist(u, 0.14), dRed1b = wrapDist(u, 0.36)
            const dRed2a = wrapDist(u, 0.64), dRed2b = wrapDist(u, 0.86)
            const blueW = 0.095 * panelEnv, redW = 0.022 * panelEnv
            let col = WHITE
            if (dBlue1 < blueW || dBlue2 < blueW) col = BLUE
            else if (dRed1a < redW || dRed1b < redW || dRed2a < redW || dRed2b < redW) col = RED
            if (wrapDist(u, 0) < 0.005 || wrapDist(u, 0.5) < 0.005) col = BLACK
            if (Math.abs(v - 0.5) < 0.006) col = BLACK
            const idx = (py * TW + px) * 4
            d[idx] = col[0]; d[idx + 1] = col[1]; d[idx + 2] = col[2]; d[idx + 3] = 255
          }
        }
        ctx.putImageData(img, 0, 0)
        const lacX = TW * 0.5, lacTop = TH * 0.28, lacBot = TH * 0.72
        const stitches = 7, gap = (lacBot - lacTop) / (stitches - 1)
        ctx.strokeStyle = "#111"; ctx.lineWidth = 3; ctx.lineCap = "round"
        ctx.beginPath(); ctx.moveTo(lacX, lacTop); ctx.lineTo(lacX, lacBot); ctx.stroke()
        for (let i = 0; i < stitches; i++) {
          const y = lacTop + i * gap
          const len = 18 * Math.sin(Math.PI * ((y / TH - 0.28) / 0.44))
          ctx.lineWidth = 2.5
          for (const [dx, dy] of [[-8, -6], [8, -6], [-8, 6], [8, 6]]) {
            ctx.beginPath()
            ctx.moveTo(lacX + dx, y + dy)
            ctx.lineTo(lacX + dx + (dx < 0 ? -len : len), y + dy)
            ctx.stroke()
          }
        }
        return new THREE.CanvasTexture(c)
      }

      function createBumpTexture() {
        const c = document.createElement("canvas")
        c.width = 512; c.height = 256
        const ctx = c.getContext("2d")!
        ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, 512, 256)
        for (let i = 0; i < 12000; i++) {
          const x = Math.random() * 512, y = Math.random() * 256
          const r = Math.random() * 1.5 + 0.3
          const v = Math.floor(Math.random() * 60 + 100)
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.fill()
        }
        return new THREE.CanvasTexture(c)
      }

      /* Ball geometry */
      const pts: import("three").Vector2[] = []
      for (let i = 0; i <= 48; i++) {
        const t = i / 48, angle = t * Math.PI
        const y = -Math.cos(angle) * 1.45
        const r = Math.pow(Math.sin(angle), 1.18) * 0.82
        pts.push(new THREE.Vector2(r, y))
      }
      const ballGeo = new THREE.LatheGeometry(pts, 80)
      const ballMat = new THREE.MeshPhongMaterial({
        map: createFFRTexture(),
        bumpMap: createBumpTexture(),
        bumpScale: 0.03,
        shininess: 55,
        specular: new THREE.Color(0x555555),
      })
      const ball = new THREE.Mesh(ballGeo, ballMat)
      scene.add(ball)

      /* Shadow */
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 1.2),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1, depthWrite: false })
      )
      shadow.rotation.x = -Math.PI / 2
      shadow.position.set(0, -2.2, 0)
      scene.add(shadow)

      /* Lights */
      scene.add(new THREE.AmbientLight(0xfff5e0, 0.55))
      const key = new THREE.DirectionalLight(0xffffff, 1.1)
      key.position.set(3, 6, 5); scene.add(key)
      const rim = new THREE.DirectionalLight(0x8899ff, 0.4)
      rim.position.set(-5, -1, -4); scene.add(rim)
      scene.add(Object.assign(new THREE.DirectionalLight(0xfff0d0, 0.2), { position: { x: 0, y: -4, z: 3 } }))

      /* Animate */
      const clock = new THREE.Clock()
      const shadowMat = shadow.material as import("three").MeshBasicMaterial

      function animate() {
        animId = requestAnimationFrame(animate)
        const t = clock.getElapsedTime()
        ball.rotation.y = t * (Math.PI * 2 / 4.5)
        ball.rotation.z = 0.15
        ball.position.y = Math.sin(t * 0.9) * 0.12
        const sc = 1 - ball.position.y * 0.08
        shadow.scale.set(sc, sc, 1)
        shadowMat.opacity = 0.1 - ball.position.y * 0.012
        renderer!.render(scene, camera)
      }
      animate()

      /* Resize */
      const onResize = () => {
        if (!container || !renderer) return
        const W = container.clientWidth, H = container.clientHeight
        camera.aspect = W / H
        camera.updateProjectionMatrix()
        renderer.setSize(W, H)
      }
      window.addEventListener("resize", onResize)

      // Store cleanup
      ;(container as HTMLDivElement & { _cleanup?: () => void })._cleanup = () => {
        window.removeEventListener("resize", onResize)
        cancelAnimationFrame(animId)
        renderer!.dispose()
        if (renderer!.domElement.parentNode === container) container.removeChild(renderer!.domElement)
      }
    })

    return () => {
      cancelAnimationFrame(animId)
      const c = container as HTMLDivElement & { _cleanup?: () => void }
      c._cleanup?.()
    }
  }, [])

  return <div ref={containerRef} className={className} style={{ width: "100%", height: "100%" }} />
}
