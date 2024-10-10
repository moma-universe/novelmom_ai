interface CloudflareImageUploadResult {
  imageUrl: string;
  imageId: string;
}
export async function uploadImageToCloudflare(
  imageUrl: string
): Promise<CloudflareImageUploadResult> {
  const formData = new FormData();
  formData.append("url", imageUrl);

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudflare API Error:", errorData);
      throw new Error(
        `Cloudflare API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      console.error("Cloudflare API Error:", data.errors);
      throw new Error("Failed to upload image to Cloudflare");
    }

    return {
      imageUrl: data.result.variants[0],
      imageId: data.result.id,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudflare:", error);
    throw error;
  }
}
