import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // OpenAI API 키를 환경 변수에서 가져옵니다.
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const { extractedText, genre, title, age, mood } = await request.json();

    const chatResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "당신은 창의적인 동화 작가입니다. 1000자 내외의 동화 줄거리를 작성해 주세요. 문장이 중간에 끝기면 안됩니다. 모든 문장을 끝까지 작성해 주세요.",
            },
            {
              role: "user",
              content: `장르: ${genre}\n제목: ${title}\n연령: ${age}\n분위기: ${mood}\n줄거리: ${extractedText}\n위 정보를 바탕으로 창의적이고 해당 연령이 이해할 수 있고 좋아할 만한 동화 줄거리를 작성해 주세요.`,
            },
          ],
          max_tokens: 400,
        }),
      }
    );

    const chatData = await chatResponse.json();

    if (!chatData.choices || !chatData.choices[0]?.message?.content) {
      throw new Error("동화 줄거리 생성에 실패했습니다.");
    }

    // 텍스트 생성 결과 추출
    const generatedText = chatData.choices?.[0].message?.content.trim() || "";

    // 텍스트를 100자 단위로 자르기
    const textChunks = [];
    let currentIndex = 0;
    const chunkSize = 500;

    while (currentIndex < generatedText.length) {
      let nextIndex = currentIndex + chunkSize;
      if (nextIndex < generatedText.length) {
        // 문장이 끝나는 지점까지 포함
        const lastPeriod = generatedText.lastIndexOf(".", nextIndex);
        if (lastPeriod > currentIndex) {
          nextIndex = lastPeriod + 1;
        }
      }
      textChunks.push(generatedText.slice(currentIndex, nextIndex).trim());
      currentIndex = nextIndex;
    }

    const images: string[] = [];

    for (const chunk of textChunks) {
      const transformResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content:
                  "당신은 동화에 적합한 이미지를 생성할 수 있게 텍스트를 만드는 전문가입니다. 유저로부터 받은 텍스트를 이미지로 만들 수 있게 변환해줘.",
              },
              {
                role: "user",
                content: `${chunk}`,
              },
            ],
            max_tokens: 200,
          }),
        }
      );

      const transformData = await transformResponse.json();

      const transformedText =
        transformData.choices?.[0].message?.content.trim() || "";

      console.log(transformedText);

      const imageResponse = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: `${transformedText}`,
            size: "1024x1024",
            quality: "standard",
            n: 1,
          }),
        }
      );

      const imageData = await imageResponse.json();
      const imageUrl = imageData.data?.[0]?.url || "";

      images.push(imageUrl);
      console.log(imageUrl);
    }
    return NextResponse.json({
      textChunks,
      images,
    });
  } catch (error) {
    console.error("에러 발생:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
