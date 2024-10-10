export async function deleteCloudflareImageUtil(
  imageId: string
): Promise<void> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare 계정 정보가 올바르게 설정되지 않았습니다.");
  }

  if (!imageId) {
    throw new Error("유효한 이미지 ID가 제공되지 않았습니다.");
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${encodeURIComponent(
        imageId
      )}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      let errorMessage = `Cloudflare API 오류: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.errors && errorData.errors.length > 0) {
          errorMessage += ` - ${errorData.errors[0].message}`;
        }
      } catch (jsonError) {
        console.error("API 오류 응답을 파싱하는 중 오류 발생:", jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(
        `Cloudflare 이미지 삭제 실패: ${
          data.errors?.[0]?.message || "알 수 없는 오류"
        }`
      );
    }

    console.log(`Cloudflare 이미지 삭제 성공: ${imageId}`);
  } catch (error) {
    console.error("Cloudflare 이미지 삭제 중 오류 발생:", error);
    if (error instanceof Error) {
      throw new Error(`Cloudflare 이미지 삭제 실패: ${error.message}`);
    } else {
      throw new Error(
        "Cloudflare 이미지 삭제 중 알 수 없는 오류가 발생했습니다."
      );
    }
  }
}
