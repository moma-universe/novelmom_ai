import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { INovel } from "@/lib/database/models/Novel.model";

interface SingleNovelProps {
  novel: INovel;
}

const SingleNovel: React.FC<SingleNovelProps> = ({ novel }) => {
  const firstCloudflareImageUrl =
    novel.cloudflareImageUrls && novel.cloudflareImageUrls.length > 0
      ? novel.cloudflareImageUrls[0]
      : "/images/default-novel-image.jpg";
  return (
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
      <p>{novel.summary}</p>
      <div className="w-full h-48 relative">
        <Image
          src={firstCloudflareImageUrl}
          alt={`First image of ${novel.title}`}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
    </motion.div>
  );
};

export default SingleNovel;
