"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import NovelModal from "../Modal/NovelModal/Index";

import ReGenerateModal from "../Modal/ReGenerateModal";
import tipInfo from "@/constants/tip";

const SingleCreate = () => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showReGenerateModal, setShowReGenerateModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && isLoaded && !userId) {
      router.push("/");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded || !userId) {
    return null;
  }

  const [formData, setFormData] = useState({
    genre: "",
    title: "",
    age: 0,
    mood: "",
    summary: "",
  });

  const [loading, setLoading] = useState(false);
  const [generatedTextChunks, setGeneratedTextChunks] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const [showReplayModal, setShowReplayModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) =>
      typeof value === "string" ? value.trim() !== "" : value !== null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid() || isButtonDisabled) {
      return;
    }

    setLoading(true);
    setGeneratedTextChunks([]);
    setGeneratedImages([]);
    setIsButtonDisabled(true);
    setIsFormDisabled(true);

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 60000);

    try {
      const response = await fetch("/api/openai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.textChunks) {
        setGeneratedTextChunks(data.textChunks);
      }

      if (data.images) {
        setGeneratedImages(data.images);
      }
      if (response.ok) {
        setShowModal(true);
        setIsFormDisabled(true);
      }
    } catch (error) {
      console.error("오류 발생:", error);
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handleModalConfirm = () => {
    //
  };

  const handlePreviewClick = () => {
    setShowReplayModal(true);
  };

  const handleReGenerateClick = () => {
    setShowReGenerateModal(true);
  };

  const handleReGenerateConfirm = async () => {
    try {
      setFormData({
        genre: "",
        title: "",
        age: 0,
        mood: "",
        summary: "",
      });

      // 생성된 텍스트 및 이미지 초기화
      setGeneratedTextChunks([]);
      setGeneratedImages([]);

      // 폼 및 버튼 상태 초기화
      setIsFormDisabled(false);
      setIsButtonDisabled(false);

      // 모달 닫기
      setShowReGenerateModal(false);

      // 선택적: 페이지 상단으로 스크롤
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("다시 만들기 오류 : ", error);
    } finally {
      setShowReGenerateModal(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      {showModal && (
        <NovelModal
          onClose={() => setShowModal(false)}
          onConfirm={handleModalConfirm}
          generatedTextChunks={generatedTextChunks}
          generatedImages={generatedImages}
          formData={formData}
        />
      )}

      {showReplayModal && (
        <NovelModal
          onClose={() => setShowReplayModal(false)}
          onConfirm={handleModalConfirm}
          generatedTextChunks={generatedTextChunks}
          generatedImages={generatedImages}
          formData={formData}
        />
      )}

      {showReGenerateModal && (
        <ReGenerateModal
          onClose={() => setShowReGenerateModal(false)}
          onConfirm={handleReGenerateConfirm}
          message="정말로 이 동화를 다시 만드시겠습니까? 기존 만들어진 동화는 삭제됩니다."
        />
      )}
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: -10,
          },

          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="animate_top z-40 rounded-lg border border-white bg-white p-7.5 shadow-solid-3 transition-all hover:shadow-solid-4 dark:border-strokedark dark:bg-blacksection dark:hover:bg-hoverdark xl:p-12.5"
      >
        <form
          className="flex flex-col items-center justify-center gap-2.5"
          onSubmit={handleSubmit}
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[4px] bg-primary">
            <Image
              src="/images/icon/icon-novel-create.svg"
              width={36}
              height={36}
              alt="title"
            />
          </div>
          <div className="flex flex-row items-center justify-center w-full mt-5">
            <label className="text-center text-xl font-semibold text-black dark:text-white xl:text-itemtitle flex items-center">
              <div className="relative group">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center cursor-help">
                  <span className="text-gray-600 text-xs font-bold">?</span>
                </div>
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs rounded-xl py-1 px-2 w-48 invisible group-hover:visible transition-all duration-200 z-10">
                  {tipInfo.genre}
                </div>
              </div>
              <span className="ml-2 ">동화 장르</span>
            </label>
            <input
              className="flex-1 shadow appearance-none border w-full py-2 px-3 ml-5 text-white leading-tight focus:outline-offset-1 outline-green-200 focus:shadow-outline rounded-full"
              id="genre"
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="동화 장르"
              disabled={isFormDisabled}
              autoComplete="genre"
            />
          </div>
          <div className="flex flex-row items-center justify-center w-full mt-5">
            <label className="text-center text-xl font-semibold text-black dark:text-white xl:text-itemtitle flex items-center">
              <div className="relative group">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center cursor-help">
                  <span className="text-gray-600 text-xs font-bold">?</span>
                </div>
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs rounded-xl py-1 px-2 w-48 invisible group-hover:visible transition-all duration-200 z-10">
                  {tipInfo.title}
                </div>
              </div>
              <span className="ml-2 ">동화 제목</span>
            </label>
            <input
              className="flex-1 shadow appearance-none border w-full py-2 px-3 ml-5 text-white leading-tight focus:outline-offset-1 outline-green-200 focus:shadow-outline rounded-full"
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="동화 제목"
              autoComplete="off"
              disabled={isFormDisabled}
            />
          </div>
          <div className="flex flex-row items-center justify-center w-full mt-5">
            <label className="text-center text-xl font-semibold text-black dark:text-white xl:text-itemtitle flex items-center">
              <div className="relative group">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center cursor-help">
                  <span className="text-gray-600 text-xs font-bold">?</span>
                </div>
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs rounded-xl py-1 px-2 w-48 invisible group-hover:visible transition-all duration-200 z-10">
                  {tipInfo.age}
                </div>
              </div>
              <span className="ml-2 ">동화 연령</span>
            </label>
            <input
              className="flex-1 shadow appearance-none border w-full py-2 px-3 ml-5 text-white leading-tight focus:outline-offset-1 outline-green-200 focus:shadow-outline rounded-full"
              id="age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="동화 연령"
              autoComplete="off"
              disabled={isFormDisabled}
            />
          </div>
          <div className="flex flex-row items-center justify-center w-full mt-5">
            <label className="text-center text-xl font-semibold text-black dark:text-white xl:text-itemtitle flex items-center">
              <div className="relative group">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center cursor-help">
                  <span className="text-gray-600 text-xs font-bold">?</span>
                </div>
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs rounded-xl py-1 px-2 w-48 invisible group-hover:visible transition-all duration-200 z-10">
                  {tipInfo.mood}
                </div>
              </div>
              <span className="ml-2 ">동화 분위기</span>
            </label>
            <input
              className="flex-1 shadow appearance-none border w-full py-2 px-3 ml-5 text-white leading-tight focus:outline-offset-1 outline-green-200 focus:shadow-outline rounded-full"
              id="mood"
              type="text"
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              placeholder="동화 분위기"
              autoComplete="off"
              disabled={isFormDisabled}
            />
          </div>
          <div className="flex flex-col items-start justify-center w-full mt-5 gap-3">
            <label className="text-start text-xl font-semibold text-black dark:text-white xl:text-itemtitle flex items-center">
              <div className="relative  group">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center cursor-help">
                  <span className="text-gray-600 text-xs font-bold">?</span>
                </div>
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs rounded py-1 px-2 w-48 invisible group-hover:visible transition-all duration-200 z-10">
                  {tipInfo.summary}
                </div>
              </div>
              <span className="ml-2">간략한 줄거리</span>
            </label>
            <textarea
              className="flex-1 shadow appearance-none border w-full py-2 px-3 text-white leading-tight focus:outline-offset-1 outline-green-200 focus:shadow-outline rounded-xl"
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              disabled={isFormDisabled}
              placeholder="간략한 줄거리를 10줄 이하로 입력해 주세요"
              rows={10}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col items-center justify-center w-full mt-2">
            <AnimatePresence>
              {loading ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-row items-center justify-start w-full  ml-5"
                >
                  <p className="text-sm">최대 1분 정도 소요됩니다.</p>
                </motion.div>
              ) : (
                ""
              )}
            </AnimatePresence>
            {generatedTextChunks.length === 0 ||
            generatedImages.length === 0 ? (
              <>
                <button
                  type="submit"
                  className={`bg-primary text-white py-2 px-4 rounded-full w-full hover:bg-blue-700 mt-2 ${
                    !isFormValid() || isButtonDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!isFormValid() || isButtonDisabled}
                >
                  {loading ? (
                    <div className="flex flex-row items-center justify-center">
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
                      <span>동화 만드는중...</span>
                    </div>
                  ) : (
                    "동화 만들기"
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePreviewClick}
                  className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 mt-2 w-full"
                >
                  크게보기
                </button>
                <button
                  type="button"
                  onClick={handleReGenerateClick}
                  className="dark:bg-black bg-white border border-gray-300 dark:border-gray-700 hover:opacity-80 text-white py-2 px-4 rounded-full hover:bg-red-500 mt-2 w-full"
                >
                  다시 만들기
                </button>
              </>
            )}
          </div>

          {generatedTextChunks.length > 0 && (
            <div className="w-full mt-5">
              <h2 className="text-xl font-semibold">생성된 텍스트 및 이미지</h2>
              {generatedTextChunks.map((chunk, index) => (
                <div key={index} className="mb-5">
                  <Image
                    src={generatedImages[index]}
                    width={500}
                    height={500}
                    alt={`Generated Image ${index + 1}`}
                    className="mt-2 rounded-lg overflow-hidden"
                  />
                  <textarea
                    readOnly
                    value={chunk}
                    className="w-full h-32 p-2 mt-2 rounded-lg resize-none dark:bg-black dark:bg-opacity-100"
                  />
                </div>
              ))}
            </div>
          )}
        </form>
      </motion.div>
    </>
  );
};

export default SingleCreate;
