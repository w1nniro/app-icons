import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/**
 * @param {Array<{ size: number, blob: Blob }>} icons
 */
export async function downloadAllAsZip(icons) {
  const zip = new JSZip()

  icons.forEach(({ size, blob }) => {
    zip.file(`icon-${size}.png`, blob)
  })

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'app-icons.zip')
}

/**
 * @param {{ size: number, blob: Blob }} icon
 */
export function downloadIcon(icon) {
  saveAs(icon.blob, `icon-${icon.size}.png`)
}
