import { FiDownload } from 'react-icons/fi'
import { downloadIcon } from '../utils/zipUtils'

export default function IconCell({ icon }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-[repeating-conic-gradient(#e2e8f0_0%_25%,#f8fafc_0%_50%)] bg-[length:12px_12px]">
        <img
          src={icon.dataUrl}
          alt={`Иконка ${icon.size}×${icon.size}`}
          width={Math.min(icon.size, 72)}
          height={Math.min(icon.size, 72)}
          className="max-h-[72px] max-w-[72px] object-contain"
        />
      </div>
      <span className="text-sm font-medium text-slate-700">
        {icon.size}×{icon.size}
      </span>
      <button
        type="button"
        onClick={() => downloadIcon(icon)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
      >
        <FiDownload className="h-3.5 w-3.5" />
        Скачать
      </button>
    </div>
  )
}
