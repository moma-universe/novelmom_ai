import React, { useEffect } from "react";
import OfferList from "./OfferList";
import { Price } from "@/types/price";
import { useUser } from "@clerk/nextjs";

declare global {
  interface Window {
    IMP: any;
  }
}

const PricingBox = ({ product }: { product: Price }) => {
  const { user } = useUser();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await paymentHandler();
    } catch (error) {
      console.error("구독 처리 중 오류 발생:", error);
    }
  };

  // 포트원 페이먼트
  const paymentHandler = () => {
    return new Promise((reject) => {
      if (!window.IMP) {
        reject(new Error("IMP 객체를 찾을 수 없습니다."));
        return;
      }

      const { IMP } = window;
      IMP.init(process.env.NEXT_PUBLIC_IMP_KEY);

      const data = {
        pg: "kakaopay.TC0ONETIME",
        merchant_uid:
          new Date().getTime() + Math.floor(Math.random() * 1000000),
        name: product.nickname,
        amount: product.unit_amount / 100,
        buyer_email: user?.emailAddresses[0].emailAddress,
        buyer_name: user?.fullName,
      };

      //숨겨서 전달하는 코딩 필요.
      IMP.request_pay(data, async (rsp: any) => {
        const {
          success,
          error_msg,
          merchant_uid,
          imp_uid,
          paid_amount,
          pay_method,
          status,
          buyer_name,
          buyer_email,
          paid_at,
          pg_tid,
        } = rsp;

        if (success) {
          const res = await fetch("/api/transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              priceId: product.id,
              imp_uid: imp_uid,
              merchant_uid: merchant_uid,
              status: status,
              buyer_name: buyer_name,
              buyer_email: buyer_email,
              paid_at: paid_at,
              pg_tid: pg_tid,
              paid_amount: paid_amount,
              pay_method: pay_method,
            }),
          });

          if (!res.ok) {
            throw new Error(`서버 응답 오류: ${res.status}`);
          }
        }
      });
    });
  };

  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3 ">
      <div
        className="relative z-10 mb-10 overflow-hidden rounded-xl  px-8 py-10 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.08)] sm:p-12 lg:px-6 lg:py-10 xl:p-14 dark:bg-blackho bg-white"
        data-wow-delay=".1s"
      >
        {product.nickname === "Premium" && (
          <p className="absolute right-[-50px] top-[60px] inline-block -rotate-90 rounded-bl-md rounded-tl-md bg-primary px-5 py-2 text-base font-medium text-white">
            Recommended
          </p>
        )}
        <span className="mb-5 block text-xl font-medium text-dark dark:text-white">
          {product.nickname}
        </span>
        <h2 className="mb-11 text-4xl font-semibold text-dark dark:text-white xl:text-[42px] xl:leading-[1.21]">
          <span className="text-xl font-medium"> </span>
          <span className="-ml-1 -tracking-[2px]">
            {(product.unit_amount / 100).toLocaleString("ko-KR", {
              currency: "KRW",
            })}
          </span>
          <span className="text-base font-normal text-body-color dark:text-dark-6">
            {" "}
            / 1개월
          </span>
        </h2>

        <div className="mb-[50px]">
          <h3 className="mb-5 text-lg font-medium text-dark dark:text-white">
            상세 혜택
          </h3>
          <div className="mb-10">
            {product?.offers.map((offer, i) => (
              <OfferList key={i} text={offer} />
            ))}
          </div>
        </div>
        <div className="w-full">
          <button
            onClick={handleClick}
            className="inline-block rounded-md bg-primary px-7 py-3 text-center text-base font-medium text-white transition duration-300 hover:bg-primary/90"
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingBox;
