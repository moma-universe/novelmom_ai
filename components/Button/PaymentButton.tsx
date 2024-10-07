"use client";

declare global {
  interface Window {
    IMP: any;
  }
}

// 멤버쉽 결제 페이지 만들기

export default function PaymentButton() {
  const paymentHandler = () => {
    if (!window.IMP) return;
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init(process.env.NEXT_PUBLIC_IMP_KEY); // 가맹점 식별코드

    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: "kakaopay.TC0ONETIME", // PG사 코드표 참조
      pay_method: "card",
      merchant_uid: "ORD20231030-000001", // 주문번호
      name: "테스트 결제",
      amount: 100, // 숫자 타입
      buyer_email: "gildong@gmail.com",
      buyer_name: "홍길동",
    };

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, callback);
  };

  async function callback(rsp: any) {
    const { success, error_msg, merchant_uid, imp_uid } = rsp;

    console.log("imp_uid : ", imp_uid);

    if (success) {
      const res = await fetch("ENDPOINT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imp_uid: imp_uid,
          merchant_uid: merchant_uid,
        }),
      });

      const data = await res.json();

      console.log("data : ", data);
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  }

  return (
    <>
      <button onClick={paymentHandler}>결제하기</button>
    </>
  );
}
