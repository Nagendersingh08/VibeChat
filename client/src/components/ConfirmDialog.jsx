const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4'>
      <div className='w-full max-w-sm rounded-lg border border-white/10 bg-[#282142] p-5 text-white shadow-2xl'>
        <h2 className='text-lg font-semibold'>{title}</h2>
        <p className='mt-2 text-sm leading-6 text-gray-300'>{message}</p>
        <div className='mt-6 flex justify-end gap-3'>
          <button
            type='button'
            onClick={onCancel}
            className='rounded-md border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer'
          >
            {cancelLabel}
          </button>
          <button
            type='button'
            onClick={onConfirm}
            className='rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 cursor-pointer'
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
