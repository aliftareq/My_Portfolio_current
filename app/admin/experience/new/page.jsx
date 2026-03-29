"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  createJobExperience,
  clearJobState,
  clearJobExperienceUploadedLogo,
  uploadJobExperienceLogo,
} from "../../../../redux/features/jobExperience/jobExperienceSlice";
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
  } = useSelector((state) => state.jobExperience);

  const employmentOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Freelance",
  ];

  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    location: "",
    employmentType: "Full-time",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
    responsibilities: [""],
    achievements: [""],
    technologies: [""],
    slug: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "currentlyWorking" && checked ? { endDate: "" } : {}),
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

  const generateSlug = () => {
    const generated = `${form.companyName}-${form.jobTitle}`
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
      toast.warning("Company logo is still uploading. Please wait.");
      return;
    }

    const cleanedForm = {
      ...form,
      responsibilities: form.responsibilities.filter(
        (item) => item.trim() !== "",
      ),
      achievements: form.achievements.filter((item) => item.trim() !== ""),
      technologies: form.technologies.filter((item) => item.trim() !== ""),
      companyLogo: uploadedLogoUrl || "",
      endDate: form.currentlyWorking ? null : form.endDate || null,
    };

    dispatch(createJobExperience(cleanedForm));
  };

  useEffect(() => {
    if (success) {
      toast.success(message || "Experience added successfully");
      dispatch(clearJobState());
      dispatch(clearJobExperienceUploadedLogo());
      router.push("/admin/experience");
    }
  }, [success, message, dispatch, router]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Something went wrong");
      dispatch(clearJobState());
    }
  }, [error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearJobExperienceUploadedLogo());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen py-10 text-white">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Add Experience</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-10"
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Company Logo</h2>

              <ImageUpload
                label="Upload Company Logo"
                buttonText="Click to upload company logo"
                selector={(state) => state.jobExperience}
                uploadAction={uploadJobExperienceLogo}
                clearAction={clearJobExperienceUploadedLogo}
              />
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Image Preview</h2>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <div className="relative mx-auto aspect-square w-full max-w-[250px] overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                  {uploadedLogoUrl ? (
                    <Image
                      src={uploadedLogoUrl}
                      alt="Company logo preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-center text-sm text-white/40">
                      Logo preview
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-8 text-2xl font-bold">Basic Info</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  placeholder="Enter your role"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                >
                  {employmentOptions.map((item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-[#1c1c22] text-white"
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  disabled={form.currentlyWorking}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="checkbox"
                  name="currentlyWorking"
                  checked={form.currentlyWorking}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-white">Currently Working Here</span>
              </label>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-2xl font-bold">Description</h2>

            <div className="space-y-2">
              <label className="block text-base font-medium text-white">
                Short Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Write a short description about this role"
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-2xl font-bold">Responsibilities</h2>

            <StackedArrayField
              title="Responsibilities"
              field="responsibilities"
              values={form.responsibilities}
              addField={addField}
              removeField={removeField}
              handleArrayChange={handleArrayChange}
              placeholder="Responsibility"
              buttonText="Add Responsibility"
            />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-2xl font-bold">Achievements</h2>

            <StackedArrayField
              title="Achievements"
              field="achievements"
              values={form.achievements}
              addField={addField}
              removeField={removeField}
              handleArrayChange={handleArrayChange}
              placeholder="Achievement"
              buttonText="Add Achievement"
            />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-2xl font-bold">Technologies</h2>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <label className="block text-base font-medium text-white">
                  Tech Stack
                </label>
                <button
                  type="button"
                  onClick={() => addField("technologies")}
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80"
                >
                  <span className="text-xl leading-none">+</span>
                  <span>Add Tech</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {form.technologies.map((item, index) => (
                  <div key={index} className="relative">
                    <input
                      type="text"
                      value={item}
                      placeholder={`Tech ${index + 1}`}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          e.target.value,
                          "technologies",
                        )
                      }
                      className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-14 outline-none focus:border-accent"
                    />

                    <button
                      type="button"
                      onClick={() => removeField(index, "technologies")}
                      className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-red-500/90 text-white hover:bg-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-2xl font-bold">Slug Info</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="Enter slug"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={generateSlug}
                  className="h-14 rounded-2xl border border-accent px-6 text-accent transition-all hover:bg-accent hover:text-primary"
                >
                  Generate Slug
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || logoImageLoading}
            className="h-14 w-full rounded-2xl bg-accent font-semibold text-primary hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Experience"}
          </button>
        </form>
      </div>
    </div>
  );
}

function StackedArrayField({
  field,
  values,
  addField,
  removeField,
  handleArrayChange,
  placeholder,
  buttonText,
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="block text-base font-medium text-white">
          {buttonText.replace("Add ", "")}
        </label>

        <button
          type="button"
          onClick={() => addField(field)}
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80"
        >
          <span className="text-xl leading-none">+</span>
          <span>{buttonText}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {values.map((item, index) => (
          <div key={index} className="relative">
            <input
              type="text"
              value={item}
              placeholder={`${placeholder} ${index + 1}`}
              onChange={(e) =>
                handleArrayChange(index, e.target.value, field)
              }
              className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-14 outline-none focus:border-accent"
            />

            <button
              type="button"
              onClick={() => removeField(index, field)}
              className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-lg bg-red-500/90 text-white hover:bg-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}