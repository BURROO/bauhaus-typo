type ProgressCallback = (progress: number) => void

export function preloadAssets(
  assets: string[],
  onProgress?: ProgressCallback
): Promise<void> {

  let loaded = 0
  const total = assets.length

  const update = () => {
    loaded++
    onProgress?.(loaded / total)
  }

  const loaders = assets.map((src) => {
    return new Promise<void>((resolve, reject) => {

      // IMAGE
      if (src.match(/\.(jpg|jpeg|png|webp)$/i)) {
        const img = new Image()
        img.src = src
        img.onload = () => { update(); resolve() }
        img.onerror = reject
      }

      // VIDEO
      else if (src.match(/\.(webm|mp4)$/i)) {
        const video = document.createElement('video')
        video.src = src
        video.preload = 'auto'
        video.onloadeddata = () => { update(); resolve() }
        video.onerror = reject
      }

      else {
        // unknown type → skip but count
        update()
        resolve()
      }
    })
  })

  return Promise.all(loaders).then(() => undefined)
}
