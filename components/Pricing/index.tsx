"use client";

import { pricingData } from "@/lib/portone/pricingFeature";
import SectionTitle from "../Common/SectionTitle";
import PricingBox from "./PricingBox";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="flex items-center justify-center z-20 overflow-hidden pb-12 pt-20 lg:pb-[90px] lg:pt-[120px] "
    >
      <div className=" container ">
        <div className="mb-[60px]">
          <SectionTitle
            subtitle="멤버쉽 가격"
            title="멤버쉽 플랜"
            paragraph="월 구독하시고 우리 아이에게 창의력을 선물하세요!"
            center
          />
        </div>

        <div className="-mx-4 flex flex-wrap justify-center ">
          {pricingData.map((product, i) => (
            <PricingBox key={i} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
