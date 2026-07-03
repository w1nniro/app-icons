import { DEFAULT_SIZES } from '../utils/iconGenerator'

export default function OptionsPanel({
  selectedSizes,
  onSizesChange,
  borderRadius,
  onBorderRadiusChange,
  backgroundEnabled,
  onBackgroundEnabledChange,
  backgroundColor,
  onBackgroundColorChange,
  padding,
  onPaddingChange,
  fitMode,
  onFitModeChange,
  disabled,
}) {
  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter((s) => s !== size))
    } else {
      onSizesChange([...selectedSizes, size].sort((a, b) => a - b))
    }
  }

  const toggleAll = () => {
    if (selectedSizes.length === DEFAULT_SIZES.length) {
      onSizesChange([])
    } else {
      onSizesChange([...DEFAULT_SIZES])
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            Размеры для генерации
          </h3>
          <button
            type="button"
            onClick={toggleAll}
            disabled={disabled}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
          >
            {selectedSizes.length === DEFAULT_SIZES.length
              ? 'Снять все'
              : 'Выбрать все'}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {DEFAULT_SIZES.map((size) => (
            <label
              key={size}
              className={[
                'flex cursor-pointer items-center gap-1 rounded-md border px-1.5 py-1 text-[11px] leading-tight transition-colors',
                selectedSizes.includes(size)
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                disabled ? 'pointer-events-none opacity-50' : '',
              ].join(' ')}
            >
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={() => toggleSize(size)}
                disabled={disabled}
                className="h-3 w-3 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="whitespace-nowrap tabular-nums">{size}×{size}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">Настройки</h3>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="border-radius" className="text-sm text-slate-600">
              Скругление углов
            </label>
            <span className="text-sm font-medium text-slate-800">
              {borderRadius}%
            </span>
          </div>
          <input
            id="border-radius"
            type="range"
            min={0}
            max={50}
            step={1}
            value={borderRadius}
            onChange={(e) => onBorderRadiusChange(Number(e.target.value))}
            disabled={disabled}
          />
          <p className="mt-1 text-xs text-slate-500">
            ~20–25% для iOS-стиля, 50% для круглых иконок
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="padding" className="text-sm text-slate-600">
              Отступ (padding)
            </label>
            <span className="text-sm font-medium text-slate-800">
              {padding}%
            </span>
          </div>
          <input
            id="padding"
            type="range"
            min={0}
            max={40}
            step={1}
            value={padding}
            onChange={(e) => onPaddingChange(Number(e.target.value))}
            disabled={disabled || fitMode === 'cover'}
          />
          <p className="mt-1 text-xs text-slate-500">
            {fitMode === 'cover'
              ? 'Недоступно в режиме «Обрезка»'
              : 'Полезно для адаптивных иконок Android'}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-600">
            Вписывание изображения
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onFitModeChange('contain')}
              disabled={disabled}
              className={[
                'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                fitMode === 'contain'
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                disabled ? 'opacity-50' : '',
              ].join(' ')}
            >
              Вписать
            </button>
            <button
              type="button"
              onClick={() => onFitModeChange('cover')}
              disabled={disabled}
              className={[
                'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                fitMode === 'cover'
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                disabled ? 'opacity-50' : '',
              ].join(' ')}
            >
              Обрезать
            </button>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="bg-toggle" className="text-sm text-slate-600">
              Цвет фона
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                id="bg-toggle"
                type="checkbox"
                checked={backgroundEnabled}
                onChange={(e) => onBackgroundEnabledChange(e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500">Включить</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              disabled={disabled || !backgroundEnabled}
              className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              disabled={disabled || !backgroundEnabled}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 disabled:opacity-50"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
