import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function RotatingBox({
  active,
  onToggle,
}: {
  active: boolean
  onToggle: () => void
}) {
  const myMesh = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!active) return
    myMesh.current.rotation.x = clock.elapsedTime
  })

  return (
    <mesh
      ref={myMesh}
      scale={active ? 1.5 : 1}
      onClick={onToggle}
    >
      <boxGeometry />
      <meshPhongMaterial color="royalblue" />
    </mesh>
  )
}

function CanvasPage() {
  const [active, setActive] = useState(false)

  return (
    <>
      <h1>Canvas</h1>

      <h2>Basic Figure</h2>
      <Canvas>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} color="red" />
      </Canvas>

      <h2>Basic Movement</h2>
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} />
        <RotatingBox active={active} onToggle={() => setActive((v) => !v)} />
      </Canvas>
    </>
  )
}

export default CanvasPage
