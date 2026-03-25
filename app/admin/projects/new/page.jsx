"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { UploadCloudIcon, XIcon } from "lucide-react";
import {
  createProject,
  clearProjectState,
  clearUploadedImage,
  clearGalleryImages,
  removeGalleryImage,
  uploadProjectGalleryImage,
} from "../../../../redux/features/project/projectSlice";
import ImageUpload from "../../../../components/ImageUpload";

export default function NewProjectPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const galleryInputRef = useRef(null);

  const {
    loading,
    error,
    success,
    message,
    mainImageLoading,
    uploadedImageUrl,
    galleryImageLoading,
    galleryImages,
    galleryImageError,
  } = useSelector((state) => state.project);

  const [form, setForm] = useState({
    category: "",
    title: "",
    slug: "",
    description: "",
    techStack: [""],
    liveUrl: "",
    githubUrl: "",
    featured: false,
  });

  const [galleryLocalFiles, setGalleryLocalFiles] = useState([]);

  const galleryPreviewItems = useMemo(() => {
    return galleryLocalFiles.map((file, index) => ({
      id: `${file.name}-${index}`,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));
  }, [galleryLocalFiles]);

  useEffect(() => {
    return () => {
      galleryPreviewItems.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [galleryPreviewItems]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (index, value, field) => {
    setForm((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addField = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeField = (index, field) => {
    setForm((prev) => {
      const updated = prev[field].filter((_, i) => i !== index);
      return {
        ...prev,
        [field]: updated.length ? updated : [""],
      };
    });
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setGalleryLocalFiles((prev) => [...prev, ...files]);

    for (const file of files) {
      await dispatch(uploadProjectGalleryImage(file));
    }

    e.target.value = "";
  };

  const handleRemoveGallery = (index) => {
    setGalleryLocalFiles((prev) => prev.filter((_, i) => i !== index));
    dispatch(removeGalleryImage(index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mainImageLoading) {
      alert("Main image is still uploading. Please wait.");
      return;
    }

    if (galleryImageLoading) {
      alert("Gallery images are still uploading. Please wait.");
      return;
    }

    if (!uploadedImageUrl) {
      alert("Please upload a main image.");
      return;
    }

    const cleanedForm = {
      ...form,
      techStack: form.techStack.filter((item) => item.trim() !== ""),
      mainImage: uploadedImageUrl,
      gallery: galleryImages,
    };

    dispatch(createProject(cleanedForm));
  };

  useEffect(() => {
    if (success) {
      alert(message || "Project added successfully");
      dispatch(clearProjectState());
      dispatch(clearUploadedImage());
      dispatch(clearGalleryImages());
      router.push("/admin/projects");
    }
  }, [success, message, dispatch, router]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearProjectState());
    }
  }, [error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearUploadedImage());
      dispatch(clearGalleryImages());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen py-10 text-white">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Add New Project</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
            />

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
            />
          </div>

          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent resize-none"
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-white text-lg font-medium">Tech Stack</p>
              <button
                type="button"
                onClick={() => addField("techStack")}
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80"
              >
                <span className="text-xl leading-none">+</span>
                <span>Add Tech</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {form.techStack.map((item, index) => (
                <div key={index} className="relative">
                  <input
                    type="text"
                    value={item}
                    placeholder={`Tech ${index + 1}`}
                    onChange={(e) =>
                      handleArrayChange(index, e.target.value, "techStack")
                    }
                    className="w-full h-14 px-4 pr-14 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
                  />

                  <button
                    type="button"
                    onClick={() => removeField(index, "techStack")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg bg-red-500/90 text-white hover:bg-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <ImageUpload />

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-white text-lg font-medium">Gallery Images</p>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80"
              >
                <span className="text-xl leading-none">+</span>
                <span>Add Gallery Images</span>
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-4">
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 transition hover:border-accent/60 hover:bg-white/10"
                >
                  <UploadCloudIcon className="h-6 w-6 text-white/60" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">
                    Click to upload gallery images
                  </p>
                  <p className="text-xs text-white/50">
                    You can upload multiple images one after another
                  </p>

                  {galleryImageLoading && (
                    <p className="text-xs text-accent">
                      Uploading gallery image...
                    </p>
                  )}

                  {galleryImageError && (
                    <p className="text-xs text-red-400">{galleryImageError}</p>
                  )}
                </div>
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </div>

            {galleryPreviewItems.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {galleryPreviewItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  >
                    <div className="h-36 w-full">
                      <img
                        src={item.preview}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveGallery(index)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white hover:bg-black"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>

                    <div className="p-3">
                      <p className="truncate text-xs text-white/70">
                        {item.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              name="liveUrl"
              placeholder="Live URL"
              value={form.liveUrl}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
            />

            <input
              type="text"
              name="githubUrl"
              placeholder="GitHub URL"
              value={form.githubUrl}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
            />
          </div>

          <label className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="text-white">Featured Project</span>
          </label>

          <button
            type="submit"
            disabled={loading || mainImageLoading || galleryImageLoading}
            className="w-full h-12 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mainImageLoading || galleryImageLoading
              ? "Uploading image..."
              : loading
                ? "Creating..."
                : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
