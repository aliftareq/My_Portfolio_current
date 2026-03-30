"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchSingleSkill,
  updateSkill,
  clearSkillState,
  clearSelectedSkill,
  clearSkillUploadedIcon,
  uploadSkillIcon,
} from "../../../../../redux/features/skill/skillSlice";
import ImageUpload from "../../../../../components/ImageUpload";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const id = params?.id;

  const {
    skill,
    loading,
    error,
    success,
    message,
    iconImageLoading,
    uploadedIconUrl,
  } = useSelector((state) => state.skills || {});

  const [form, setForm] = useState({
    name: "",
    category: "",
    proficiency: "",
    experience: "",
    isFeatured: false,
    slug: "",
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleSkill(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (skill && !isInitialized) {
      setForm({
        name: skill.name || "",
        category: skill.category || "",
        proficiency: skill.proficiency || "",
        experience: skill.experience || "",
        isFeatured: skill.isFeatured || false,
        slug: skill.slug || "",
      });

      setIsInitialized(true);
    }
  }, [skill, isInitialized]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generateSlug = () => {
    const generated = form.name
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

    if (iconImageLoading) {
      toast.warning("Skill icon is still uploading. Please wait.");
      return;
    }

    const cleanedForm = {
      ...form,
      icon: uploadedIconUrl || skill?.icon || "",
    };

    dispatch(updateSkill({ id, updatedData: cleanedForm }));
  };

  useEffect(() => {
    if (success) {
      toast.success(message || "Skill updated successfully");
      dispatch(clearSkillState());
      dispatch(clearSkillUploadedIcon());
      dispatch(clearSelectedSkill());
      router.push("/admin/skills");
    }
  }, [success, message, dispatch, router]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Something went wrong");
      dispatch(clearSkillState());
    }
  }, [error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearSkillUploadedIcon());
      dispatch(clearSelectedSkill());
    };
  }, [dispatch]);

  const previewIcon = uploadedIconUrl || skill?.icon || "";

  return (
    <div className="min-h-screen py-10 text-white">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Edit Skill</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-10"
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Skill Icon</h2>

              <ImageUpload
                label="Upload Skill Icon"
                buttonText="Click to upload skill icon"
                selector={(state) => state.skills}
                uploadAction={uploadSkillIcon}
                clearAction={clearSkillUploadedIcon}
              />
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Image Preview</h2>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <div className="relative mx-auto aspect-square w-full max-w-[250px] overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                  {previewIcon ? (
                    <Image
                      src={previewIcon}
                      alt="Skill icon preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-center text-sm text-white/40">
                      Icon preview
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
                  Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter skill name"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Frontend, Backend, DevOps"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Proficiency
                </label>
                <select
                  name="proficiency"
                  value={form.proficiency}
                  onChange={handleChange}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                >
                  <option value="" className="bg-[#1f1f1f] text-white">
                    Select proficiency
                  </option>
                  <option value="Beginner" className="bg-[#1f1f1f] text-white">
                    Beginner
                  </option>
                  <option
                    value="Intermediate"
                    className="bg-[#1f1f1f] text-white"
                  >
                    Intermediate
                  </option>
                  <option value="Advanced" className="bg-[#1f1f1f] text-white">
                    Advanced
                  </option>
                  <option value="Expert" className="bg-[#1f1f1f] text-white">
                    Expert
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 2 years, 6 months"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-white">Mark as Featured Skill</span>
              </label>
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
            disabled={loading || iconImageLoading}
            className="h-14 w-full rounded-2xl bg-accent font-semibold text-primary hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Skill"}
          </button>
        </form>
      </div>
    </div>
  );
}
