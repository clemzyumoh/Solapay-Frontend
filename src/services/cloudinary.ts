// cloudinary.ts



export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "solapay_image"); // ✅ fix this

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dwm4ss8cg/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Cloudinary upload error:", data); // ✅ This helps debugging
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
};
