'use client'

import { useEffect, useState } from 'react'
import { preloadAssets } from '@/util/preloadAssets'
// import { assets } from '@/data/fileData'
import assets from '@/public/assets.json'
import styles from './Loader.module.css'



export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)


  useEffect(() => {
    preloadAssets(assets, setProgress)
      .then(onDone)
      .catch(console.error)
  }, [onDone])

  return (
    <div className={styles.overlay}>
      <div className={styles.bar}>
        <div
        className={styles.fill}
        style={{
          transform: `scaleX(${progress})`
        }}
        />
      </div>
      <div className={styles.label}>
        {Math.round(progress * 100)}%
      </div>
    </div>
  )
}

// const styles = {
//   overlay: {
//     position: 'fixed',
//     inset: 0,
//     background: '#000',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'column',
//     zIndex: 9999,
//   },
//   bar: {
//     width: '50vw',
//     height: 4,
//     background: '#222',
//     overflow: 'hidden',
//   },
//   fill: {
//     height: '100%',
//     background: '#fff',
//     transformOrigin: '0 0',
//     transition: 'transform 0.2s ease',
//   },
//   label: {
//     marginTop: 12,
//     color: '#888',
//     fontSize: 12,
//     fontFamily: 'monospace',
//   },
// } as const
