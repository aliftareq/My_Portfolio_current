"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  createService,
  clearServiceState,
  clearServiceUploadedLogo,
  uploadServiceLogo,
} from "../../../../redux/features/service/serviceSlice";
import ImageUpload from "../../../../components/ImageUpload";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    loading,
    error,
    success,
    message,
    logoImageLoading,
    uploadedLogoUrl,
  } = useSelector((state) => state.service || {});

  const [form, setForm] = useState({
    title: "",
    description: "",
    slug: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = () => {
    const generated = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setForm((prev) => ({
      ...prev,
      slug: generated,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (logoImageLoading) {
      toast.warning("Logo is still uploading. Please wait.");
      return;
    }

    const cleanedForm = {
      ...form,
      icon: uploadedLogoUrl || "",
    };

    dispatch(createService(cleanedForm));
  };

  useEffect(() => {
    if (success) {
      toast.success(message || "Service created successfully");
      dispatch(clearServiceState());
      dispatch(clearServiceUploadedLogo());
      router.push("/admin/services");
    }
  }, [success, message, dispatch, router]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Something went wrong");
      dispatch(clearServiceState());
    }
  }, [error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearServiceUploadedLogo());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen py-10 text-white">
      <div className="container mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold">Add Service</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-10"
        >
          {/* IMAGE */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Service Logo</h2>

              <ImageUpload
                label="Upload Service Logo"
                buttonText="Click to upload logo"
                selector={(state) => state.service}
                uploadAction={uploadServiceLogo}
                clearAction={clearServiceUploadedLogo}
              />
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Preview</h2>

              <div className="relative mx-auto aspect-square w-full max-w-[200px] rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                {uploadedLogoUrl ? (
                  <Image
                    src={uploadedLogoUrl}
                    alt="Service logo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/40 text-sm">
                    No preview
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-2xl font-bold">Basic Info</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-white">Service Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="h-14 w-full rounded-2xl bg-white/5 border border-white/10 px-4"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-white">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="h-14 w-full rounded-2xl bg-white/5 border border-white/10 px-4"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={generateSlug}
                  className="h-14 px-6 border border-accent text-accent rounded-2xl hover:bg-accent hover:text-primary"
                >
                  Generate
                </button>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-white">Link (optional)</label>
                <input
                  type="text"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  placeholder="/services/web-development"
                  className="h-14 w-full rounded-2xl bg-white/5 border border-white/10 px-4"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || logoImageLoading}
            className="h-14 w-full rounded-2xl bg-accent text-primary font-semibold"
          >
            {loading ? "Creating..." : "Create Service"}
          </button>
        </form>
      </div>
    </div>
  );
}
