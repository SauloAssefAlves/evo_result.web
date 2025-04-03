import { FaTrash } from "react-icons/fa";


interface DeleteWarningProps {
  onConfirm: () => void;
}

import { useRef } from "react";

export default function DeleteWarning({ onConfirm }: DeleteWarningProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => modalRef.current?.showModal();
  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <button className="btn btn-neutral" onClick={openModal}>
        <FaTrash />
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tem certeza?</h3>
          <p className="py-4">Essa ação não pode ser desfeita.</p>
          <div className="modal-action">
            <button
              className="btn btn-error"
              onClick={() => {
                onConfirm();
                closeModal();
              }}
            >
              Sim, deletar
            </button>
            <button className="btn" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
