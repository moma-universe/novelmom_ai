"use client";
import React from "react";

import SectionHeader from "../Common/SectionHeader";
import SingleCreate from "./SingleCreate";

const Create = () => {
  return (
    <>
      {/* <!-- ===== Features Start ===== --> */}
      <section
        id="features"
        className="flex w-full py-20 lg:py-25 xl:py-30 mt-20 items-center justify-center"
      >
        <div className=" flex-1 max-w-[528px] px-4 md:px-8 xl:px-0 ">
          {/* <!-- Section Title Start --> */}
          <SectionHeader
            headerInfo={{
              title: "노블맘 동화",
              subtitle: "1분 만에 동화 만들기",
              description: `아래 순서에 따라 동화를 만들어 보세요`,
            }}
          />
          {/* <!-- Section Title End --> */}

          <div className="mt-12.5 lg:mt-15 xl:mt-20">
            <SingleCreate />
          </div>
        </div>
      </section>

      {/* <!-- ===== Features End ===== --> */}
    </>
  );
};

export default Create;
