export async function deleteCloudflareImageUtil(
  imageId: string
): Promise<void> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${encodeURIComponent(
      imageId
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Cloudflare API 오류: ${response.statusText}`);
  }
}
