import React, { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

interface SingleNovelCarouselProps {
  textChunks: string[];
  cloudflareImageUrls: string[];
  onLastSlide: (isLast: boolean) => void;
}

const SingleNovelCarousel: React.FC<SingleNovelCarouselProps> = ({
  textChunks,
  cloudflareImageUrls,
  onLastSlide,
}) => {
  const swiperRef = useRef<Swiper | null>(null);

  useEffect(() => {
    // Swiper가 이미 초기화되어 있다면 파괴
    if (swiperRef.current) {
      swiperRef.current.destroy(true, true);
    }

    // Swiper 초기화
    swiperRef.current = new Swiper(".default-carousel", {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: false,
      speed: 300,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      on: {
        // transitionEnd 이벤트로 변경하여 슬라이드 전환이 완료된 후에 호출
        transitionEnd: (swiper) => {
          const isLast = swiper.activeIndex === swiper.slides.length - 1;
          onLastSlide(isLast);
        },
      },
    });

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, [textChunks, cloudflareImageUrls, onLastSlide]);

  return (
    <div className="w-full h-full relative p-2 sm:p-5 ">
      <div className="swiper default-carousel swiper-container h-full">
        <div className="swiper-wrapper h-full">
          {textChunks.map((chunk, index) => (
            <div key={index} className="swiper-slide h-full">
              <div className="bg-gray-100 dark:bg-black rounded-2xl h-full flex flex-col justify-center items-center overflow-y-auto p-2 sm:p-4">
                <div className="w-full max-w-xl mx-auto mb-4">
                  <div className="w-full aspect-square relative mb-4">
                    <Image
                      src={cloudflareImageUrls[index]}
                      alt={`Generated Image ${index + 1}`}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-xl overflow-hidden"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 text-start max-w-xl">
                  {chunk}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-button-next text-black dark:text-white"></div>
        <div className="swiper-button-prev text-black dark:text-white"></div>
        <div className="swiper-pagination opacity-70"></div>
      </div>
    </div>
  );
};

export default SingleNovelCarousel;
