"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import toast, { Toaster } from "react-hot-toast";
import CustomToast from "../Toast";
import NovelModal from "../Modal/NovelModal/Index";

const SingleCreate = () => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [slides, setSlides] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && isLoaded && !userId) {
      router.push("/");
    }
  }, [isLoaded, userId, router]);

  // 로딩 중이거나 사용자가 없으면 아무것도 렌더링하지 않음
  if (!isLoaded || !userId) {
    //toast
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isButtonDisabled) {
      return;
    }
    setLoading(true);
    setGeneratedTextChunks([]);
    setGeneratedImages([]);
    setIsButtonDisabled(true);

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

      // 소설 생성 API 호출
      const createResponse = await fetch("/api/novel/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          generatedTextChunks: data.textChunks || [],
          generatedImages: data.images || [],
        }),
      });

      if (createResponse.ok) {
        toast.custom(
          (t) => (
            <CustomToast
              t={t}
              title="동화 생성 완료"
              message="동화 생성이 성공적으로 완료되었습니다!"
              onClose={() => toast.dismiss(t.id)}
              icon="/images/icon/fox.png"
              bgColor="#ffffff"
              textColor="#5db48b"
            />
          ),
          {
            duration: 5000,
          }
        );
        setShowModal(true);
      } else {
        toast.custom(
          (t) => (
            <CustomToast
              t={t}
              title="동화 생성 실패"
              message="동화 생성 중 오류가 발생했습니다."
              onClose={() => toast.dismiss(t.id)}
              icon="/images/icon/fox.png"
              bgColor="#ffffff"
              textColor="#f55d5d"
            />
          ),
          {
            duration: 5000,
          }
        );
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

  useEffect(() => {
    if (generatedTextChunks.length > 0 && generatedImages.length > 0) {
      const newSlides = generatedTextChunks.map((chunk, index) => (
        <div key={index} className="flex flex-col items-center">
          <p className="text-sm mb-2">{chunk}</p>
          <Image
            src={generatedImages[index]}
            width={300}
            height={300}
            alt={`Generated Image ${index + 1}`}
            className="rounded-lg"
          />
        </div>
      ));
      setSlides(newSlides);
    }
  }, [generatedTextChunks, generatedImages]);

  const handleModalConfirm = () => {
    // 여기에 확인 버튼을 눌렀을 때의 로직을 추가합니다.
    // 예: 생성된 동화 페이지로 이동
    // ex) router.push('/generated-novel');
    setShowModal(false);
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      {showModal && (
        <NovelModal
          onClose={() => setShowModal(false)}
          onConfirm={handleModalConfirm}
          slides={slides}
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
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[4px] bg-[#5db48b]">
            <Image
              src="/images/icon/icon-novel-create.svg"
              width={36}
              height={36}
              alt="title"
            />
          </div>
          <div className="flex flex-row items-center justify-center w-full mt-5">
            <label className="text-center  text-xl font-semibold text-black dark:text-white xl:text-itemtitle">
              <span>동화 장르</span>
            </label>
            <input
              className="flex-1 shadow appearance-none border w-full py-2 px-3 ml-5 text-white leading-tight focus:outline-offset-1 outline-green-200 focus:shadow-outline rounded-full"
              id="genre"
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="동화 장르"
            />
          </div>
          <div className="flex flex-row items-center justify-center w-full mt-5">
            <label className="text-center  text-xl font-semibold text-black dark:text-white xl:text-itemtitle">
              <span>동화 제목</span>
            </label>
            <input
              className="flex-1 shadow appearance-none border w-full py-2 px-3 ml-5 text-white leading-tight focus:outline-offset-1 outline-green-200 focus:shadow-outline rounded-full"
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="동화 제목"
            />
          </div>
          <div className="flex flex-row items-center justify-center w-full mt-5">
            <label className="text-center  text-xl font-semibold text-black dark:text-white xl:text-itemtitle">
              <span>동화 연령</span>
            </label>
            <input
              className="flex-1 shadow appearance-none border w-full py-2 px-3 ml-5 text-white leading-tight focus:outline-offset-1 outline-green-200 focus:shadow-outline rounded-full"
              id="age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="동화 연령"
            />
          </div>
          <div className="flex flex-row items-center justify-center w-full mt-5">
            <label className="text-center  text-xl font-semibold text-black dark:text-white xl:text-itemtitle">
              <span>동화 분위기</span>
            </label>
            <input
              className="flex-1 shadow appearance-none border w-full py-2 px-3 ml-5 text-white leading-tight focus:outline-offset-1 outline-green-200 focus:shadow-outline rounded-full"
              id="mood"
              type="text"
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              placeholder="동화 장르"
            />
          </div>
          <div className="flex flex-col items-start justify-center w-full mt-5 gap-3">
            <label className="text-start text-xl font-semibold text-black dark:text-white xl:text-itemtitle">
              <span>간략한 줄거리</span>
            </label>
            <textarea
              className="flex-1 shadow appearance-none border w-full py-2 px-3 text-white leading-tight focus:outline-offset-1 outline-green-200 focus:shadow-outline rounded-xl"
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="간략한 줄거리를 10줄 이하로 입력해 주세요"
              rows={10}
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
            <button
              type="submit"
              className="bg-[#5db48b] text-white py-2 px-4 rounded-full w-full hover:bg-green-600 mt-2"
              disabled={loading}
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
          </div>

          {generatedTextChunks.length > 0 && (
            <div className="w-full mt-5">
              <h2 className="text-xl font-semibold">생성된 텍스트 및 이미지</h2>
              {generatedTextChunks.map((chunk, index) => (
                <div key={index} className="mb-5">
                  <textarea
                    readOnly
                    value={chunk}
                    className="w-full h-32 p-2 border rounded-md resize-none bg-gray-100"
                  />
                  <Image
                    src={generatedImages[index]}
                    width={500}
                    height={500}
                    alt={`Generated Image ${index + 1}`}
                    className="mt-2 rounded-lg overflow-hidden"
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
