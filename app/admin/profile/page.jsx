"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ImageUpload from "../../../components/ImageUpload";
import {
  fetchProfile,
  saveProfile,
  clearProfileState,
  clearProfileUploadedImage,
  uploadProfileImage,
} from "../../../redux/features/profile/profileSlice";

export default function AdminProfilePage() {
  const dispatch = useDispatch();

  const {
    profile,
    loading,
    error,
    success,
    message,
    mainImageLoading,
    uploadedImageUrl,
  } = useSelector((state) => state.profile);

  const [form, setForm] = useState({
    name: "",
    role: "",
    description: "",
    resumeUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    twitterUrl: "",
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        role: profile.role || "",
        description: profile.description || "",
        resumeUrl: profile.resumeUrl || "",
        githubUrl: profile.socials?.github || "",
        linkedinUrl: profile.socials?.linkedin || "",
        youtubeUrl: profile.socials?.youtube || "",
        twitterUrl: profile.socials?.twitter || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mainImageLoading) {
      toast.warning("Profile image is still uploading. Please wait.");
      return;
    }

    const finalProfileImage = uploadedImageUrl || profile?.profileImage || "";

    if (!finalProfileImage) {
      toast.error("Please upload a profile image.");
      return;
    }

    dispatch(
      saveProfile({
        name: form.name,
        role: form.role,
        description: form.description,
        profileImage: finalProfileImage,
        resumeUrl: form.resumeUrl,
        githubUrl: form.githubUrl,
        linkedinUrl: form.linkedinUrl,
        youtubeUrl: form.youtubeUrl,
        twitterUrl: form.twitterUrl,
      }),
    );
  };

  useEffect(() => {
    if (success) {
      toast.success(message || "Profile saved successfully");
      dispatch(clearProfileState());
      dispatch(fetchProfile());
    }
  }, [success, message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Something went wrong");
      dispatch(clearProfileState());
    }
  }, [error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearProfileUploadedImage());
      dispatch(clearProfileState());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen py-10 text-white">
      <div className="container mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold">Profile Info</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
            />

            <input
              type="text"
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-accent"
          />

          <ImageUpload
            label="Profile Image"
            buttonText="Click to upload profile image"
            selector={(state) => state.profile}
            uploadAction={uploadProfileImage}
            clearAction={clearProfileUploadedImage}
          />

          {profile?.profileImage && !uploadedImageUrl && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-sm text-white/70">
                Current profile image
              </p>
              <img
                src={profile.profileImage}
                alt={profile.name || "Profile"}
                className="h-24 w-24 rounded-xl border border-white/10 object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <input
              type="text"
              name="resumeUrl"
              placeholder="Resume URL"
              value={form.resumeUrl}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
            />

            <input
              type="text"
              name="githubUrl"
              placeholder="GitHub URL"
              value={form.githubUrl}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <input
              type="text"
              name="linkedinUrl"
              placeholder="LinkedIn URL"
              value={form.linkedinUrl}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
            />

            <input
              type="text"
              name="youtubeUrl"
              placeholder="YouTube URL"
              value={form.youtubeUrl}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
            />
          </div>

          <input
            type="text"
            name="twitterUrl"
            placeholder="Twitter URL"
            value={form.twitterUrl}
            onChange={handleChange}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
          />

          <button
            type="submit"
            disabled={loading || mainImageLoading}
            className="h-12 w-full rounded-xl bg-accent font-semibold text-primary hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
