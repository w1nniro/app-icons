import { useCallback, useEffect, useMemo, useState } from 'react'
import { FiDownload, FiRefreshCw } from 'react-icons/fi'
import ImageUploader from './components/ImageUploader'
import OptionsPanel from './components/OptionsPanel'
import IconGrid from './components/IconGrid'
import {
  DEFAULT_SIZES,
  generateAllIcons,
  loadImageFromFile,
} from './utils/iconGenerator'
import { downloadAllAsZip } from './utils/zipUtils'

const DEBOUNCE_MS = 300

export default function App() {
  const [sourceImage, setSourceImage] = useState(null)
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState(null)
  const [selectedSizes, setSelectedSizes] = useState([...DEFAULT_SIZES])
  const [borderRadius, setBorderRadius] = useState(0)
  const [padding, setPadding] = useState(0)
  const [fitMode, setFitMode] = useState('contain')
  const [backgroundEnabled, setBackgroundEnabled] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [generatedIcons, setGeneratedIcons] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloadingZip, setIsDownloadingZip] = useState(false)

  const generatorOptions = useMemo(
    () => ({
      backgroundColor: backgroundEnabled ? backgroundColor : null,
      padding,
      borderRadius,
      fitMode,
    }),
    [backgroundEnabled, backgroundColor, padding, borderRadius, fitMode],
  )

  const handleImageLoad = useCallback(async (file) => {
    if (sourcePreviewUrl) {
      URL.revokeObjectURL(sourcePreviewUrl)
    }

    const previewUrl = URL.createObjectURL(file)
    const img = await loadImageFromFile(file)

    setSourcePreviewUrl(previewUrl)
    setSourceImage(img)
  }, [sourcePreviewUrl])

  const handleReset = useCallback(() => {
    if (sourcePreviewUrl) {
      URL.revokeObjectURL(sourcePreviewUrl)
    }
    setSourceImage(null)
    setSourcePreviewUrl(null)
    setGeneratedIcons([])
    setSelectedSizes([...DEFAULT_SIZES])
    setBorderRadius(0)
    setPadding(0)
    setFitMode('contain')
    setBackgroundEnabled(false)
    setBackgroundColor('#ffffff')
  }, [sourcePreviewUrl])

  useEffect(() => {
    if (!sourceImage || selectedSizes.length === 0) {
      setGeneratedIcons([])
      return
    }

    let cancelled = false
    setIsGenerating(true)

    const timer = setTimeout(async () => {
      try {
        const icons = await generateAllIcons(
          sourceImage,
          selectedSizes,
          generatorOptions,
        )
        if (!cancelled) {
          setGeneratedIcons(icons)
        }
      } catch {
        if (!cancelled) {
          setGeneratedIcons([])
        }
      } finally {
        if (!cancelled) {
          setIsGenerating(false)
        }
      }
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [sourceImage, selectedSizes, generatorOptions])

  const handleDownloadZip = async () => {
    if (generatedIcons.length === 0) return
    setIsDownloadingZip(true)
    try {
      await downloadAllAsZip(generatedIcons)
    } finally {
      setIsDownloadingZip(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
          <img
            src="/app-icon.png"
            alt=""
            className="h-10 w-10 rounded-xl"
          />
          <div>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              Генератор иконок для приложений
            </h1>
            <p className="text-sm text-slate-500">
              Полный набор размеров из одного изображения
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[368px_1fr]">
          <aside className="space-y-6">
            {!sourceImage ? (
              <ImageUploader onImageLoad={handleImageLoad} />
            ) : (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Исходное изображение
                  </p>
                  <div className="flex items-center justify-center rounded-xl bg-[repeating-conic-gradient(#e2e8f0_0%_25%,#f8fafc_0%_50%)] bg-[length:16px_16px] p-4">
                    <img
                      src={sourcePreviewUrl}
                      alt="Исходное изображение"
                      className="max-h-48 max-w-full object-contain"
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-slate-500">
                    {sourceImage.naturalWidth}×{sourceImage.naturalHeight} px
                    {sourceImage.naturalWidth !== sourceImage.naturalHeight &&
                      ' — не квадратное'}
                  </p>
                </div>

                <ImageUploader onImageLoad={handleImageLoad} compact />

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  Сбросить
                </button>
              </div>
            )}

            {sourceImage && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <OptionsPanel
                  selectedSizes={selectedSizes}
                  onSizesChange={setSelectedSizes}
                  borderRadius={borderRadius}
                  onBorderRadiusChange={setBorderRadius}
                  backgroundEnabled={backgroundEnabled}
                  onBackgroundEnabledChange={setBackgroundEnabled}
                  backgroundColor={backgroundColor}
                  onBackgroundColorChange={setBackgroundColor}
                  padding={padding}
                  onPaddingChange={setPadding}
                  fitMode={fitMode}
                  onFitModeChange={setFitMode}
                />
              </div>
            )}
          </aside>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-800">
                Превью иконок
                {generatedIcons.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({generatedIcons.length})
                  </span>
                )}
              </h2>

              {generatedIcons.length > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={isDownloadingZip || isGenerating}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  <FiDownload className="h-4 w-4" />
                  {isDownloadingZip ? 'Создание архива…' : 'Скачать все ZIP'}
                </button>
              )}
            </div>

            <IconGrid icons={generatedIcons} isGenerating={isGenerating} />

            {sourceImage && selectedSizes.length === 0 && (
              <p className="text-center text-sm text-amber-600">
                Выберите хотя бы один размер для генерации
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
