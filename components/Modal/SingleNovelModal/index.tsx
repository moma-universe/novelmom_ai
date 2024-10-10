import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SingleNovelCarousel from "@/components/Carousel/SingleNovelCarousel";
import SkeletonNovel from "@/components/\bSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { INovel } from "@/lib/database/models/Novel.model";

interface SingleNovelModalProps {
  novel: INovel;
  textChunks: string[];
  cloudflareImageUrls: string[];
  cloudflareImageIds: string[];
  onClose: () => void;
}

const SingleNovelModal: React.FC<SingleNovelModalProps> = ({
  novel,
  textChunks,
  cloudflareImageUrls,
  cloudflareImageIds,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [showSummaryInput, setShowSummaryInput] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryState, setSummaryState] = useState<
    "idle" | "generating" | "generated" | "saving"
  >("idle");
  const router = useRouter();

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = cloudflareImageUrls.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            setImagesLoaded((prev) => prev + 1);
            resolve(null);
          };
          img.onerror = () => resolve(null);
          img.src = src;
        });
      });

      await Promise.all(imagePromises);
      setIsContentLoaded(true);
    };

    if (textChunks.length > 0 && cloudflareImageUrls.length > 0) {
      loadImages();
    }
  }, [textChunks, cloudflareImageUrls]);

  const handleLastSlide = useCallback((isLast: boolean) => {
    setIsLastSlide(isLast);
  }, []);

  const handleGoBack = () => {
    setShowSummaryInput(false);
    setSummaryState("idle");
  };

  const handleCloseModal = () => {
    setSummary("");
    onClose();
  };

  const extractTextFromChunks = (chunks: string[]): string => {
    const extractedTexts = [];

    for (let i = 0; i < Math.min(5, chunks.length); i++) {
      extractedTexts.push(chunks[i]);
    }

    if (chunks.length > 10) {
      const middleIndex = Math.floor(chunks.length / 2);
      extractedTexts.push(chunks[middleIndex]);
    }

    for (let i = Math.max(0, chunks.length - 5); i < chunks.length; i++) {
      if (!extractedTexts.includes(chunks[i])) {
        extractedTexts.push(chunks[i]);
      }
    }

    return extractedTexts.join(" ");
  };

  const handleGenerateSummary = async () => {
    const extractedText = extractTextFromChunks(textChunks);
    setSummaryState("generating");
    setLoading(true);
    try {
      const response = await fetch("/api/openai/generateSummary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          extractedText,
          genre: novel.genre,
          age: novel.age,
          title: novel.title,
          mood: novel.mood,
        }),
      });

      if (!response.ok) {
        throw new Error("줄거리 생성에 실패했습니다.");
      }

      const data = await response.json();
      setSummary(data.summary);
      setSummaryState("generated");
      toast.success("줄거리가 생성되었습니다.");
    } catch (error) {
      console.error("Error:", error);
      toast.error("줄거리 생성 중 오류가 발생했습니다.");
      setSummaryState("idle");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSummary = async () => {
    // handleGenerateSummary 에서 actions 통해 api 호출 할 수 있게 변경 필요
    // 줄거리 저장 이후 입력 창에서 -> handleGenerateSummary 반환되는 text 값을 표시 후 입력창 비활성화 -> 뒤로 가기 시 입력창 활성화
    // handleGenerateSummary 에서 반환 되는 값을 actions에 전달
    // actions 내부 cloudflare 이미지 업로드 알고리즘 통해서 저장 -> novel 에 textChunk, cloudflareImageUrls, cloudflareImageIds 저장
    // 저장 완료 후 모달 닫기
  };

  return (
    <div
      className="fixed inset-0 z-[100000]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl rounded-lg bg-white dark:bg-black shadow-xl">
            <div className="bg-white dark:bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden">
              <h3
                className="text-lg font-semibold leading-6 dark:text-white text-gray-900"
                id="modal-title"
              >
                동화 생성 완료
              </h3>
            </div>
            <AnimatePresence mode="wait">
              {!showSummaryInput ? (
                <motion.div
                  key="carousel"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[calc(90vh-200px)] overflow-y-auto"
                >
                  {isContentLoaded ? (
                    <SingleNovelCarousel
                      textChunks={textChunks}
                      cloudflareImageUrls={cloudflareImageUrls}
                      onLastSlide={handleLastSlide}
                    />
                  ) : (
                    <SkeletonNovel />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
                  className="h-[calc(90vh-200px)] overflow-y-auto p-4"
                >
                  <form onSubmit={(e) => e.preventDefault()}>
                    <textarea
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="줄거리를 입력하세요..."
                      className="w-full h-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      rows={10}
                      disabled={
                        summaryState === "generating" ||
                        summaryState === "saving"
                      }
                    />
                    <div className="flex gap-3 mt-4 justify-end">
                      <button
                        type="button"
                        onClick={handleGoBack}
                        disabled={
                          summaryState === "generating" ||
                          summaryState === "saving"
                        }
                        className={`inline-flex justify-center rounded-md bg-white dark:bg-black border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:opacity-90 ${
                          (summaryState === "generating" ||
                            summaryState === "saving") &&
                          "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        뒤로 돌아가기
                      </button>
                      <button
                        type="button"
                        onClick={
                          summaryState === "generated"
                            ? handleSaveSummary
                            : handleGenerateSummary
                        }
                        disabled={
                          summaryState === "generating" ||
                          summaryState === "saving"
                        }
                        className={`inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${
                          summaryState === "generated"
                            ? "bg-green-600 hover:bg-green-500"
                            : "bg-blue-600 hover:bg-blue-500"
                        } ${
                          (summaryState === "generating" ||
                            summaryState === "saving") &&
                          "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {summaryState === "generating" ? (
                          <>
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
                            줄거리 만드는 중...
                          </>
                        ) : summaryState === "saving" ? (
                          <>
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
                            줄거리 저장 중...
                          </>
                        ) : summaryState === "generated" ? (
                          "줄거리 저장하기"
                        ) : (
                          "줄거리 만들기"
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="bg-white dark:bg-black px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 dark:border-gray-700 rounded-b-xl overflow-hidden">
              {isLastSlide && !showSummaryInput && (
                <button
                  type="button"
                  onClick={() => setShowSummaryInput(true)}
                  disabled={loading || isSaved}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  <span>줄거리 작성하기</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleCloseModal}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-black hover:opacity-90 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleNovelModal;
