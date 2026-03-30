"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  createCourse,
  clearCourseState,
  clearCourseUploadedThumbnail,
  uploadCourseThumbnail,
} from "../../../../redux/features/courses/courseSlice";
import ImageUpload from "../../../../components/ImageUpload";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    loading,
    error,
    success,
    message,
    thumbnailImageLoading,
    uploadedThumbnailUrl,
  } = useSelector((state) => state.courses || {});

  const [form, setForm] = useState({
    title: "",
    provider: "",
    platform: "",
    completionDate: "",
    duration: "",
    skills: [""],
    description: "",
    projects: [{ title: "", description: "", projectLink: "" }],
    courseLink: "",
    isFeatured: false,
    slug: "",
  });

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

  const handleProjectChange = (index, key, value) => {
    setForm((prev) => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = {
        ...updatedProjects[index],
        [key]: value,
      };
      return {
        ...prev,
        projects: updatedProjects,
      };
    });
  };

  const addProject = () => {
    setForm((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: "", description: "", projectLink: "" },
      ],
    }));
  };

  const removeProject = (index) => {
    setForm((prev) => {
      const updatedProjects = prev.projects.filter((_, i) => i !== index);

      return {
        ...prev,
        projects: updatedProjects.length
          ? updatedProjects
          : [{ title: "", description: "", projectLink: "" }],
      };
    });
  };

  const generateSlug = () => {
    const generated = `${form.title}-${form.provider}`
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

    if (thumbnailImageLoading) {
      toast.warning("Course thumbnail is still uploading. Please wait.");
      return;
    }

    const cleanedProjects = form.projects
      .map((project) => ({
        title: project.title.trim(),
        description: project.description.trim(),
        projectLink: project.projectLink.trim(),
      }))
      .filter(
        (project) =>
          project.title || project.description || project.projectLink,
      );

    const cleanedForm = {
      ...form,
      skills: form.skills.filter((item) => item.trim() !== ""),
      projects: cleanedProjects,
      thumbnail: uploadedThumbnailUrl || "",
      completionDate: form.completionDate || null,
    };

    dispatch(createCourse(cleanedForm));
  };

  useEffect(() => {
    if (success) {
      toast.success(message || "Course added successfully");
      dispatch(clearCourseState());
      dispatch(clearCourseUploadedThumbnail());
      router.push("/admin/courses");
    }
  }, [success, message, dispatch, router]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Something went wrong");
      dispatch(clearCourseState());
    }
  }, [error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearCourseUploadedThumbnail());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen py-10 text-white">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Add Course</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-10"
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Course Thumbnail</h2>

              <ImageUpload
                label="Upload Course Thumbnail"
                buttonText="Click to upload course thumbnail"
                selector={(state) => state.courses}
                uploadAction={uploadCourseThumbnail}
                clearAction={clearCourseUploadedThumbnail}
              />
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Image Preview</h2>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <div className="relative mx-auto aspect-square w-full max-w-[250px] overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                  {uploadedThumbnailUrl ? (
                    <Image
                      src={uploadedThumbnailUrl}
                      alt="Course thumbnail preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-center text-sm text-white/40">
                      Thumbnail preview
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
                  Course Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Provider
                </label>
                <input
                  type="text"
                  name="provider"
                  value={form.provider}
                  onChange={handleChange}
                  placeholder="e.g. Udemy, Coursera"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Platform
                </label>
                <input
                  type="text"
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                  placeholder="Enter platform"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 8 weeks, 40 hours"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Completion Date
                </label>
                <input
                  type="date"
                  name="completionDate"
                  value={form.completionDate}
                  onChange={handleChange}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Course Link
                </label>
                <input
                  type="text"
                  name="courseLink"
                  value={form.courseLink}
                  onChange={handleChange}
                  placeholder="Enter course link"
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
                <span className="text-white">Mark as Featured Course</span>
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
                placeholder="Write a short description about this course"
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-2xl font-bold">Skills</h2>

            <StackedArrayField
              field="skills"
              values={form.skills}
              addField={addField}
              removeField={removeField}
              handleArrayChange={handleArrayChange}
              placeholder="Skill"
              buttonText="Add Skill"
            />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Projects</h2>

              <button
                type="button"
                onClick={addProject}
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80"
              >
                <span className="text-xl leading-none">+</span>
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-5">
              {form.projects.map((project, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-white">
                      Project {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="rounded-xl bg-red-500/90 px-4 py-2 text-sm text-white hover:bg-red-500"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="block text-base font-medium text-white">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) =>
                          handleProjectChange(index, "title", e.target.value)
                        }
                        placeholder="Enter project title"
                        className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-base font-medium text-white">
                        Project Description
                      </label>
                      <textarea
                        value={project.description}
                        onChange={(e) =>
                          handleProjectChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        rows={4}
                        placeholder="Write project description"
                        className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-base font-medium text-white">
                        Project Link
                      </label>
                      <input
                        type="text"
                        value={project.projectLink}
                        onChange={(e) =>
                          handleProjectChange(
                            index,
                            "projectLink",
                            e.target.value,
                          )
                        }
                        placeholder="Enter project link"
                        className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
            disabled={loading || thumbnailImageLoading}
            className="h-14 w-full rounded-2xl bg-accent font-semibold text-primary hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Course"}
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
              onChange={(e) => handleArrayChange(index, e.target.value, field)}
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
