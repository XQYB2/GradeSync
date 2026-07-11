function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="modal-title">{title}</h3>}
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button type="button" className="modal-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="modal-confirm-btn" onClick={onConfirm}>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
