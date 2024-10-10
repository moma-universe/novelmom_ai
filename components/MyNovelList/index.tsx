"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "../Common/SectionHeader";
import { useAuth } from "@clerk/nextjs";
import SingleNovel from "./SingleNovel";
import { INovel } from "@/lib/database/models/Novel.model";

const MyNovelList = () => {
  const { isLoaded, userId } = useAuth();
  const [novels, setNovels] = useState<INovel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNovels = async () => {
    if (isLoaded && userId) {
      try {
        const response = await fetch(`/api/novel/get?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setNovels(data.novels);
        } else {
          console.error("Failed to fetch novels");
        }
      } catch (error) {
        console.error("Error fetching novels:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNovels();
  }, [isLoaded, userId]);

  const handleAfterDelete = () => {
    fetchNovels(); // 소설이 삭제된 후 목록을 다시 불러옵니다.
  };

  return (
    <section id="features" className="py-20 lg:py-25 xl:py-30">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        <SectionHeader
          headerInfo={{
            title: "내 동화 목록",
            subtitle: "My Novels",
            description: "내가 만든 동화들을 확인해보세요.",
          }}
        />

        <div className="mt-12.5 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-20 xl:gap-12.5">
          {novels.map((novel) => (
            <SingleNovel
              key={novel._id as string}
              novel={novel}
              onDelete={handleAfterDelete}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyNovelList;
