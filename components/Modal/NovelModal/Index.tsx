import Carousel from "@/components/Carousel";
import React from "react";

interface NovelModalProps {
  onClose: () => void;
  onConfirm: () => void;
  generatedTextChunks: string[];
  generatedImages: string[];
}

const NovelModal: React.FC<NovelModalProps> = ({
  onClose,
  onConfirm,
  generatedTextChunks,
  generatedImages,
}) => (
  <div
    className="fixed inset-0 z-[100000]"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div className="fixed inset-0 z-[100001] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl rounded-lg bg-white dark:bg-black shadow-xl">
          <div className="bg-white dark:bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden">
            <h3
              className="text-lg font-semibold leading-6 dark:text-white text-gray-900"
              id="modal-title"
            >
              동화 생성 완료
            </h3>
          </div>
          <div className="h-[calc(90vh-200px)] overflow-y-auto ">
            <Carousel
              generatedTextChunks={generatedTextChunks}
              generatedImages={generatedImages}
            />
          </div>
          <div className="bg-white dark:bg-black px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 dark:border-gray-700 rounded-b-xl overflow-hidden">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
            >
              저장
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-black hover:opacity-90 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              다시 만들기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NovelModal;
