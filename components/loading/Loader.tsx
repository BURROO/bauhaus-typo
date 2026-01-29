'use client'

import { useEffect, useState } from 'react'
import { preloadAssets } from '@/util/preloadAssets'
// import { assets } from '@/data/fileData'
import assets from '@/public/assets.json'



export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)


  useEffect(() => {
    preloadAssets(assets, setProgress)
      .then(onDone)
      .catch(console.error)
  }, [onDone])

  return (
    <div style={styles.overlay}>
      <div style={styles.bar}>
        <div
          style={{
            ...styles.fill,
            transform: `scaleX(${progress})`
          }}
        />
      </div>
      <div style={styles.label}>
        {Math.round(progress * 100)}%
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 9999,
  },
  bar: {
    width: '50vw',
    height: 4,
    background: '#222',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    background: '#fff',
    transformOrigin: '0 0',
    transition: 'transform 0.2s ease',
  },
  label: {
    marginTop: 12,
    color: '#888',
    fontSize: 12,
    fontFamily: 'monospace',
  },
} as const
