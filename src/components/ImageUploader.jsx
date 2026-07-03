import { useCallback, useRef, useState } from 'react'
import { FiUpload, FiImage } from 'react-icons/fi'
import { isAcceptedImage } from '../utils/iconGenerator'

export default function ImageUploader({ onImageLoad, disabled, compact = false }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)

  const processFile = useCallback(
    async (file) => {
      setError(null)
      if (!file) return

      if (!isAcceptedImage(file)) {
        setError('Поддерживаются только PNG, JPEG и WebP')
        return
      }

      try {
        await onImageLoad(file)
      } catch {
        setError('Не удалось загрузить изображение')
      }
    },
    [onImageLoad],
  )

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const file = e.dataTransfer.files[0]
      processFile(file)
    },
    [disabled, processFile],
  )

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      processFile(file)
      e.target.value = ''
    },
    [processFile],
  )

  if (compact) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
        >
          <FiUpload className="h-4 w-4" />
          Заменить изображение
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleInputChange}
        />
        {error && (
          <p className="text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={[
          'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition-colors',
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50',
          disabled ? 'pointer-events-none opacity-50' : '',
        ].join(' ')}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          {isDragging ? (
            <FiImage className="h-7 w-7" />
          ) : (
            <FiUpload className="h-7 w-7" />
          )}
        </div>
        <p className="text-center text-base font-medium text-slate-800">
          Перетащите изображение сюда
        </p>
        <p className="mt-1 text-center text-sm text-slate-500">
          PNG, JPEG или WebP — квадратное или прямоугольное
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            inputRef.current?.click()
          }}
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Выбрать файл
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
      {error && (
        <p className="text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
