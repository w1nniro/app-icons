export const DEFAULT_SIZES = [
  16, 32, 48, 72, 96, 128, 144, 152, 167, 180, 192, 512,
]

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} radius
 */
function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, r)
  } else {
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + width - r, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + r)
    ctx.lineTo(x + width, y + height - r)
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
    ctx.lineTo(x + r, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }
}

/**
 * @param {HTMLImageElement} sourceImage
 * @param {number} size
 * @param {{
 *   backgroundColor?: string | null,
 *   padding?: number,
 *   borderRadius?: number,
 *   fitMode?: 'contain' | 'cover',
 * }} options
 * @returns {Promise<{ size: number, blob: Blob, dataUrl: string }>}
 */
export function generateIcon(sourceImage, size, options = {}) {
  const {
    backgroundColor = null,
    padding = 0,
    borderRadius = 0,
    fitMode = 'contain',
  } = options

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const radiusPx = (borderRadius / 100) * size

  if (radiusPx > 0) {
    roundRectPath(ctx, 0, 0, size, size, radiusPx)
    ctx.clip()
  }

  if (backgroundColor) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, size, size)
  }

  const paddingPx = fitMode === 'contain' ? (padding / 100) * size : 0
  const drawArea = size - paddingPx * 2

  let drawWidth
  let drawHeight
  let drawX
  let drawY

  if (fitMode === 'cover') {
    const scale = Math.max(
      drawArea / sourceImage.naturalWidth,
      drawArea / sourceImage.naturalHeight,
    )
    drawWidth = sourceImage.naturalWidth * scale
    drawHeight = sourceImage.naturalHeight * scale
    drawX = (size - drawWidth) / 2
    drawY = (size - drawHeight) / 2
  } else {
    const scale = Math.min(
      drawArea / sourceImage.naturalWidth,
      drawArea / sourceImage.naturalHeight,
    )
    drawWidth = sourceImage.naturalWidth * scale
    drawHeight = sourceImage.naturalHeight * scale
    drawX = paddingPx + (drawArea - drawWidth) / 2
    drawY = paddingPx + (drawArea - drawHeight) / 2
  }

  ctx.drawImage(sourceImage, drawX, drawY, drawWidth, drawHeight)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Не удалось создать изображение'))
        return
      }
      resolve({
        size,
        blob,
        dataUrl: canvas.toDataURL('image/png'),
      })
    }, 'image/png')
  })
}

/**
 * @param {HTMLImageElement} sourceImage
 * @param {number[]} sizes
 * @param {object} options
 * @returns {Promise<Array<{ size: number, blob: Blob, dataUrl: string }>>}
 */
export async function generateAllIcons(sourceImage, sizes, options) {
  const results = await Promise.all(
    sizes.map((size) => generateIcon(sourceImage, size, options)),
  )
  return results.sort((a, b) => a.size - b.size)
}

/**
 * @param {File} file
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Не удалось загрузить изображение'))
    }
    img.src = url
  })
}

export const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export function isAcceptedImage(file) {
  return ACCEPTED_TYPES.includes(file.type)
}
