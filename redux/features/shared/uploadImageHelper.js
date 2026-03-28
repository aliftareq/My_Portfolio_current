const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const uploadImageRequest = async (file, thunkAPI, errorMessage) => {
  try {
    const formData = new FormData();
    formData.append("my_file", file);

    const response = await fetch(`${BASE_URL}/api/upload-image`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return thunkAPI.rejectWithValue(data.message || errorMessage);
    }

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.message || "Something went wrong while uploading image",
    );
  }
};
