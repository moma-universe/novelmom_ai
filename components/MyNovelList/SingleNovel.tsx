import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { INovel } from "@/lib/database/models/Novel.model";
import { useRouter } from "next/navigation";

import DeleteModal from "../Modal/NovelModal/DeleteModal";

interface SingleNovelProps {
  novel: INovel;
  onDelete: () => void;
}

const SingleNovel: React.FC<SingleNovelProps> = ({ novel, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [truncatedText, setTruncatedText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "deleting" | "completed" | "error"
  >("idle");

  const cloudflareImageUrls = novel.cloudflareImageUrls || [];
  const defaultImageUrl = "/images/novel/default-novel-image.png";

  useEffect(() => {
    if (novel.textChunkIds && novel.textChunkIds.length > 0) {
      const firstChunk = novel.textChunkIds[0];
      let text: string = "";
      if (typeof firstChunk === "string") {
        text = firstChunk;
      } else if (typeof firstChunk === "object" && "text" in firstChunk) {
        text = firstChunk.text as string;
      }
      const truncated = truncateText(text, 100); // 100자로 제한, 필요에 따라 조정 가능
      setTruncatedText(truncated);
    }
  }, [novel.textChunkIds]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? cloudflareImageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === cloudflareImageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteStatus("deleting");
    try {
      const response = await fetch("/api/novel/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ novelId: novel._id }),
      });

      if (!response.ok) {
        throw new Error("소설 삭제에 실패했습니다.");
      } else {
        setIsDeleteModalOpen(false);
      }
      setDeleteStatus("completed");

      onDelete();

      // 삭제 완료 후 3초 뒤에 MyNovel 페이지로 리다이렉트
      setTimeout(() => {
        setIsDeleteModalOpen(false);
      }, 3000);
    } catch (error) {
      console.error("소설 삭제 중 오류 발생:", error);

      setDeleteStatus("error");
    }
    setIsDeleteModalOpen(false);
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
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          &#10005;
        </button>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-[4px] bg-primary">
          <Image
            src="/images/icon/icon-moon.svg"
            width={36}
            height={36}
            alt={novel.title}
          />
        </div>
        <h3 className="mb-5 mt-7.5 text-xl font-semibold text-black dark:text-white xl:text-itemtitle">
          {novel.title}
        </h3>
        <p className="mb-5 overflow-hidden whitespace-nowrap text-ellipsis">
          {truncatedText}
        </p>
        <div className="w-full h-48 relative">
          <Image
            src={cloudflareImageUrls[currentImageIndex] || defaultImageUrl}
            alt={`Image ${currentImageIndex + 1} of ${novel.title}`}
            layout="fill"
            objectFit="cover"
            className="rounded-xl  "
          />
          {cloudflareImageUrls.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                &#8249;
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                &#8250;
              </button>
            </>
          )}
        </div>
      </motion.div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteStatus("idle");
        }}
        onConfirm={handleDeleteConfirm}
        title={novel.title}
        status={deleteStatus}
      />
    </>
  );
};

export default SingleNovel;
