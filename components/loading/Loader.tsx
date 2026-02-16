'use client'

import { useEffect, useState } from 'react'
import { preloadAssets } from '@/util/preloadAssets'
// import { assets } from '@/data/fileData'
import assets from '@/public/assets.json'
import styles from './Loader.module.css'



export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)


  useEffect(() => {
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || 'ontouchstart' in window)

    if (isMobile) {
      onDone()
      return
    }

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
