import React from "react";

interface DeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="relative dark:bg-black bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium mb-4">확인</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-black hover:opacity-80 border border-gray-300 dark:border-gray-700 rounded "
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
