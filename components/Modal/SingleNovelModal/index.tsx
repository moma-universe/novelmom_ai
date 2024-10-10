import Carousel from "@/components/Carousel";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomToast from "@/components/Toast";
import { useRouter } from "next/navigation";
import SingleNovelCarousel from "@/components/Carousel/SingleNovelCarousel";
import SkeletonNovel from "@/components/\bSkeleton";

interface SingleNovelModalProps {
  onClose: () => void;
  textChunks: string[];
  cloudflareImageUrls: string[];
  cloudflareImageIds: string[];
}

const SingleNovelModal: React.FC<SingleNovelModalProps> = ({
  onClose,
  textChunks,
  cloudflareImageUrls,
  cloudflareImageIds,
}) => {
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isLastSlide, setIsLastSlide] = useState(false); // 마지막 슬라이드인지 확인
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

  //   const handleSave = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (loading || isSaved) return;
  //     setLoading(true);
  //     try {
  //       const createResponse = await fetch("/api/novel/create", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           ...formData,
  //           age: Number(formData.age),
  //           generatedTextChunks: generatedTextChunks,
  //           generatedImages: generatedImages,
  //         }),
  //       });

  //       const responseData = await createResponse.json();

  //       if (createResponse.ok) {
  //         setIsSaved(true);
  //         toast.custom(
  //           (t) => (
  //             <CustomToast
  //               t={t}
  //               title="동화 저장 완료"
  //               message="동화가 성공적으로 저장되었습니다!"
  //               onClose={() => toast.dismiss(t.id)}
  //               icon="/images/icon/fox.png"
  //               bgColor="#ffffff"
  //               textColor="#5db48b"
  //             />
  //           ),
  //           {
  //             duration: 5000,
  //           }
  //         );
  //         onConfirm();
  //       } else {
  //         throw new Error(
  //           responseData.error || "알 수 없는 오류가 발생했습니다."
  //         );
  //       }
  //     } catch (error) {
  //       console.error("오류 발생:", error);
  //       toast.custom(
  //         (t) => (
  //           <CustomToast
  //             t={t}
  //             title="동화 저장 실패"
  //             message="동화 저장 중 오류가 발생했습니다."
  //             onClose={() => toast.dismiss(t.id)}
  //             icon="/images/icon/fox.png"
  //             bgColor="#ffffff"
  //             textColor="#f55d5d"
  //           />
  //         ),
  //         {
  //           duration: 5000,
  //         }
  //       );
  //     } finally {
  //       setLoading(false);
  //       onClose(); // 모달 닫기
  //       router.push("/mynovel"); // mynovel 페이지로 이동
  //     }
  //   };
  return (
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
            <div className="h-[calc(90vh-200px)] overflow-y-auto">
              {isContentLoaded ? (
                <SingleNovelCarousel
                  textChunks={textChunks}
                  cloudflareImageUrls={cloudflareImageUrls}
                  onLastSlide={handleLastSlide}
                />
              ) : (
                <SkeletonNovel />
              )}
            </div>
            <div className="bg-white dark:bg-black px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 dark:border-gray-700 rounded-b-xl overflow-hidden">
              {isLastSlide && (
                <button
                  type="button"
                  // onClick={handleSave}
                  disabled={loading || isSaved}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  <span>줄거리 생성하기</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
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
