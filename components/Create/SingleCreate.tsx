"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const SingleCreate = () => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && isLoaded && !userId) {
      toast.error("로그인이 필요합니다.");
      router.push("/");
    }
  }, [isLoaded, userId, router]);

  // 로딩 중이거나 사용자가 없으면 아무것도 렌더링하지 않음
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
      toast.warn("1분 후에 다시 클릭해 주세요.");
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

      const createData = await createResponse.json();

      if (createResponse.ok) {
        toast.success("소설이 성공적으로 생성되었습니다.");
      } else {
        toast.error(createData.error || "소설 생성에 실패하였습니다.");
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

  return (
    <>
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
          <div className="flex flex-col items-center justify-center w-full mt-5">
            <button
              type="submit"
              className="bg-[#5db48b] text-white py-2 px-4 rounded-full w-full hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "동화 만드는중..." : "동화 만들기"}
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
