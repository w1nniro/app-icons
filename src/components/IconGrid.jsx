import IconCell from './IconCell'

export default function IconGrid({ icons, isGenerating }) {
  if (isGenerating) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Генерация иконок…</p>
        </div>
      </div>
    )
  }

  if (!icons || icons.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-sm text-slate-400">
          Загрузите изображение, чтобы увидеть превью иконок
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {icons.map((icon) => (
        <IconCell key={icon.size} icon={icon} />
      ))}
    </div>
  )
}
