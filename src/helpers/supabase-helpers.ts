import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vyeifzmnuzcivtkngscm.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadResumeAndGetUrl = async (file: File) => {
  try {
    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = `resumes/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("mern-job-board")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("mern-job-board")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading resume:", error);
    throw error;
  }
};
