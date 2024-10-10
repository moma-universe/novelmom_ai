import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  status: "idle" | "deleting" | "completed" | "error";
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  status,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-blacksection p-6 rounded-lg">
        {status === "idle" && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              정말 삭제하시겠습니까?
            </h2>
            <p className="mb-4">{title}을(를) 삭제하시겠습니까?</p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
              >
                취소
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                삭제
              </button>
            </div>
          </>
        )}
        {status === "deleting" && (
          <>
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-center">삭제 중...</p>
            </div>
          </>
        )}
        {status === "completed" && (
          <p className="text-center">
            삭제가 완료되었습니다. 곧 페이지가 새로고침됩니다.
          </p>
        )}
        {status === "error" && (
          <>
            <p className="text-center mb-4">삭제 중 오류가 발생했습니다.</p>
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                닫기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteModal;
