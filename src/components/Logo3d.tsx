import { OrbitControls, OrthographicCamera, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import { Group } from 'three'

// Type definitions
interface ModelProps {
  rotate: boolean
  modelPosition: [number, number, number]
  onModelClick: () => void
}

interface Logo3DProps {
  defaultZoom?: number
  rotate?: boolean
}

const deg2rad = (degrees: number): number => degrees * (Math.PI / 180)
const getIsMobile = (): boolean => window.innerWidth <= 768

function Model({ rotate, modelPosition, onModelClick }: ModelProps) {
  const { scene } = useGLTF('/logo3d.glb')
  const groupRef = useRef<Group>(null)

  const [rotationY, setRotationY] = useState(0)
  const [rotationX, setRotationX] = useState(0)
  const [isIncreasingY, setIsIncreasingY] = useState(true)
  const [isIncreasingX, setIsIncreasingX] = useState(true)

  const minRotationY = deg2rad(0)
  const maxRotationY = deg2rad(90)
  const minRotationX = deg2rad(-15)
  const maxRotationX = deg2rad(30)

  useFrame((_, delta) => {
    if (rotate && groupRef.current) {
      // Handle Y rotation
      setRotationY(prevY => {
        let newY = prevY
        if (isIncreasingY) {
          newY += delta * 0.5
          if (newY >= maxRotationY) {
            newY = maxRotationY
            setIsIncreasingY(false)
          }
        } else {
          newY -= delta * 0.5
          if (newY <= minRotationY) {
            newY = minRotationY
            setIsIncreasingY(true)
          }
        }
        return newY
      })

      setRotationX(prevX => {
        let newX = prevX
        if (isIncreasingX) {
          newX += delta * 0.3
          if (newX >= maxRotationX) {
            newX = maxRotationX
            setIsIncreasingX(false)
          }
        } else {
          newX -= delta * 0.3
          if (newX <= minRotationX) {
            newX = minRotationX
            setIsIncreasingX(true)
          }
        }
        return newX
      })

      groupRef.current.rotation.y = rotationY
      groupRef.current.rotation.x = rotationX
    } else if (groupRef.current) {
      groupRef.current.rotation.y = rotate ? rotationY : deg2rad(90)
      groupRef.current.rotation.x = rotate ? rotationX : 0
    }
  })

  return (
    <group
      ref={groupRef}
      position={modelPosition}
      onClick={onModelClick}
    >
      <primitive object={scene} />
    </group>
  )
}

function LoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  )
}

function Logo3D({ defaultZoom = 25, rotate = false }: Logo3DProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(getIsMobile())

    const handleResize = () => {
      setIsMobile(getIsMobile())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const cameraPosition: [number, number, number] = [-6, 3, 10]
  const orbitTarget: [number, number, number] = [0, 1, 0]
  const modelPosition: [number, number, number] = [0, -1, 0]

  const handleModelClick = () => {
    window.location.href = '/'
  }

  return (
    <>
      <OrthographicCamera
        position={cameraPosition}
        zoom={defaultZoom}
        near={0.1}
        far={50}
        makeDefault
      />

      <OrbitControls
        maxZoom={defaultZoom + defaultZoom / 2}
        enablePan={false}
        minZoom={defaultZoom - defaultZoom / 2}
        zoomSpeed={0.5}
        rotateSpeed={0.5}
        minPolarAngle={deg2rad(45)}
        maxPolarAngle={deg2rad(90)}
        minAzimuthAngle={deg2rad(-45)}
        maxAzimuthAngle={deg2rad(45)}
        enabled={!isMobile}
        target={orbitTarget}
      />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 2, 3]} intensity={1} />

      <React.Suspense fallback={<LoadingFallback />}>
        <Model
          rotate={rotate}
          modelPosition={modelPosition}
          onModelClick={handleModelClick}
        />
      </React.Suspense>
    </>
  )
}

useGLTF.preload('/logo3d.glb')

export default Logo3D
