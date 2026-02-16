type ProgressCallback = (progress: number) => void


export function preloadAssets(
  assets: string[],
  onProgress?: ProgressCallback
): Promise<void> {

  // Only include assets that are in a folder called "cover" or "showcase"
  const filteredAssets = assets.filter(src => /\/(preview)\//i.test(src))
  // console.log("filteredAssets", filteredAssets)

  let loaded = 0
  const total = filteredAssets.length

  const update = () => {
    // console.log("loaded ", loaded)
    loaded++
    onProgress?.(loaded / total)
  }

  const loaders = filteredAssets.map((src) => {
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
        // console.log("src", src)
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
