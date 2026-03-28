"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export default function ImageUpload({
  label = "Image",
  buttonText = "Click to upload image",
  selector,
  uploadAction,
  clearAction,
}) {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const { mainImageLoading, uploadedImageUrl, mainImageError } =
    useSelector(selector);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setImageFile(selectedFile);
      dispatch(uploadAction(selectedFile));
    }

    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setImageFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    dispatch(clearAction());

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const localPreviewUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(localPreviewUrl);

    return () => {
      URL.revokeObjectURL(localPreviewUrl);
    };
  }, [imageFile]);

  const inputId = `${label.toLowerCase().replace(/\s+/g, "-")}-upload`;

  return (
    <div className="space-y-3">
      <p className="text-lg font-medium text-white">{label}</p>

      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="relative h-20 w-20 shrink-0">
          <input
            id={inputId}
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleImageChange}
            accept="image/*"
          />

          {!imageFile ? (
            <label
              htmlFor={inputId}
              className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 transition hover:border-accent/60 hover:bg-white/10"
            >
              <UploadCloudIcon className="h-6 w-6 text-white/60" />
            </label>
          ) : mainImageLoading ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-2">
              <div className="h-10 w-10 animate-pulse rounded-md bg-white/20" />
            </div>
          ) : (
            <>
              <div className="h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <button
                type="button"
                className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/80 text-white hover:bg-black"
                onClick={handleRemoveImage}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-white">{buttonText}</p>

          {!imageFile && (
            <p className="text-xs text-white/50">PNG, JPG, WEBP supported</p>
          )}

          {imageFile && (
            <p className="max-w-[220px] truncate text-xs text-white/60">
              {imageFile.name}
            </p>
          )}

          {mainImageLoading && (
            <p className="text-xs text-accent">Uploading image...</p>
          )}

          {!mainImageLoading && uploadedImageUrl && (
            <p className="text-xs text-green-400">Upload complete</p>
          )}

          {mainImageError && (
            <p className="text-xs text-red-400">{mainImageError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
