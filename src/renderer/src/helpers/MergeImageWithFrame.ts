export const mergeImageWithFrame = (
  photos: string[],
  frameSrc: string,
  photoPos: { x: number; y: number; width: number; height: number }[],
  selectedFilter: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return reject('No canvas context')

    const photoImgs = photos.map(() => new Image())
    const frame = new Image()

    const applyFilter = (filterName: string | undefined): string => {
      switch (filterName) {
        case 'Black & White':
          return 'grayscale(100%)'
        case 'Yellow':
          return 'sepia(100%) hue-rotate(30deg) saturate(3)'
        case 'Vintage':
          return 'contrast(0.8) sepia(0.4)'
        case 'Modern':
          return 'saturate(2) brightness(1.2)'
        case 'Sky':
          return 'hue-rotate(180deg) brightness(1.1)'
        default:
          return 'none'
      }
    }

    let loaded = 0
    const checkLoaded = (): void => {
      loaded++
      if (loaded < photoPos.length + 1) return

      canvas.width = frame.width * 4
      canvas.height = frame.height * 4

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw first photo
      ctx.filter = applyFilter(selectedFilter)
      photoImgs.forEach((img, i) => {
        const pos = photoPos[i]
        if (pos) {
          ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height)
        }
      })

      // Draw the frame on front
      ctx.filter = 'none'
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)

      resolve(canvas.toDataURL('image/png'))
    }

    frame.onload = checkLoaded
    frame.onerror = reject
    frame.src = frameSrc

    photos.forEach((src, i) => {
      photoImgs[i].onload = checkLoaded
      photoImgs[i].onerror = reject
      photoImgs[i].src = src
    })
  })
}
