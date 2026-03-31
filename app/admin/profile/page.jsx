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
    email: "",
    phone: "",
    skype: "",
    experience: "",
    nationality: "",
    freelance: "",
    currentAddress: "",
    permanentAddress: "",
    languages: "",
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
        email: profile.email || "",
        phone: profile.phone || "",
        skype: profile.skype || "",
        experience: profile.experience || "",
        nationality: profile.nationality || "",
        freelance: profile.freelance || "",
        currentAddress: profile.currentAddress || "",
        permanentAddress: profile.permanentAddress || "",
        languages: Array.isArray(profile.languages)
          ? profile.languages.join(", ")
          : "",
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
        email: form.email,
        phone: form.phone,
        skype: form.skype,
        experience: form.experience,
        nationality: form.nationality,
        freelance: form.freelance,
        currentAddress: form.currentAddress,
        permanentAddress: form.permanentAddress,
        languages: form.languages,
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

  const inputClassName =
    "h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent";

  const textareaClassName =
    "w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-accent";

  const labelClassName = "mb-2 block text-sm font-medium text-white/80";

  const selectClassName =
    "h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-white outline-none focus:border-accent appearance-none";

  return (
    <div className="min-h-screen py-10 text-white">
      <div className="container mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold">Profile Info</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
        >
          {/* TOP IMAGE SECTION */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 text-xl font-semibold">Profile Image</h2>

              <ImageUpload
                label="Upload Profile Image"
                buttonText="Click to upload profile image"
                selector={(state) => state.profile}
                uploadAction={uploadProfileImage}
                clearAction={clearProfileUploadedImage}
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 text-xl font-semibold">Image Preview</h2>

              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4">
                {uploadedImageUrl || profile?.profileImage ? (
                  <img
                    src={uploadedImageUrl || profile?.profileImage}
                    alt={profile?.name || "Profile"}
                    className="h-52 w-52 rounded-2xl border border-white/10 object-cover"
                  />
                ) : (
                  <p className="text-sm text-white/50">No image selected</p>
                )}
              </div>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-5 text-xl font-semibold">Basic Info</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClassName}>
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="role" className={labelClassName}>
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="description" className={labelClassName}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className={textareaClassName}
              />
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-5 text-xl font-semibold">Contact Info</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="email" className={labelClassName}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClassName}>
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="skype" className={labelClassName}>
                  Skype
                </label>
                <input
                  id="skype"
                  type="text"
                  name="skype"
                  value={form.skype}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="resumeUrl" className={labelClassName}>
                  Resume URL
                </label>
                <input
                  id="resumeUrl"
                  type="text"
                  name="resumeUrl"
                  value={form.resumeUrl}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          {/* PERSONAL INFO */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-5 text-xl font-semibold">Personal Info</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="experience" className={labelClassName}>
                  Experience
                </label>
                <input
                  id="experience"
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="nationality" className={labelClassName}>
                  Nationality
                </label>
                <input
                  id="nationality"
                  type="text"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="freelance" className={labelClassName}>
                  Freelance
                </label>

                <div className="relative">
                  <select
                    id="freelance"
                    name="freelance"
                    value={form.freelance}
                    onChange={handleChange}
                    className={selectClassName}
                  >
                    <option value="" className="bg-gray-900 text-white">
                      Select availability
                    </option>
                    <option
                      value="Available"
                      className="bg-gray-900 text-white"
                    >
                      Available
                    </option>
                    <option
                      value="Not Available"
                      className="bg-gray-900 text-white"
                    >
                      Not Available
                    </option>
                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="languages" className={labelClassName}>
                  Languages
                </label>
                <input
                  id="languages"
                  type="text"
                  name="languages"
                  value={form.languages}
                  onChange={handleChange}
                  placeholder="English, Bengali"
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="currentAddress" className={labelClassName}>
                  Current Address
                </label>
                <input
                  id="currentAddress"
                  type="text"
                  name="currentAddress"
                  value={form.currentAddress}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="permanentAddress" className={labelClassName}>
                  Permanent Address
                </label>
                <input
                  id="permanentAddress"
                  type="text"
                  name="permanentAddress"
                  value={form.permanentAddress}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-5 text-xl font-semibold">Social Links</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="githubUrl" className={labelClassName}>
                  GitHub URL
                </label>
                <input
                  id="githubUrl"
                  type="text"
                  name="githubUrl"
                  value={form.githubUrl}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="linkedinUrl" className={labelClassName}>
                  LinkedIn URL
                </label>
                <input
                  id="linkedinUrl"
                  type="text"
                  name="linkedinUrl"
                  value={form.linkedinUrl}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="youtubeUrl" className={labelClassName}>
                  YouTube URL
                </label>
                <input
                  id="youtubeUrl"
                  type="text"
                  name="youtubeUrl"
                  value={form.youtubeUrl}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="twitterUrl" className={labelClassName}>
                  Twitter URL
                </label>
                <input
                  id="twitterUrl"
                  type="text"
                  name="twitterUrl"
                  value={form.twitterUrl}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

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
