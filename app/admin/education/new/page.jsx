"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  createEducation,
  clearEducationState,
  clearEducationUploadedLogo,
  uploadEducationLogo,
} from "../../../../redux/features/education/educationSlice";
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
  } = useSelector((state) => state.education || {});

  const [form, setForm] = useState({
    institutionName: "",
    degree: "",
    fieldOfStudy: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyStudying: false,
    grade: "",
    honors: [""],
    relevantCoursework: [""],
    projects: [{ title: "", description: "" }],
    description: "",
    slug: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "currentlyStudying" && checked ? { endDate: "" } : {}),
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
      projects: [...prev.projects, { title: "", description: "" }],
    }));
  };

  const removeProject = (index) => {
    setForm((prev) => {
      const updatedProjects = prev.projects.filter((_, i) => i !== index);

      return {
        ...prev,
        projects: updatedProjects.length
          ? updatedProjects
          : [{ title: "", description: "" }],
      };
    });
  };

  const generateSlug = () => {
    const generated =
      `${form.institutionName}-${form.degree}-${form.fieldOfStudy}`
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
      toast.warning("Institution logo is still uploading. Please wait.");
      return;
    }

    const cleanedProjects = form.projects
      .map((project) => ({
        title: project.title.trim(),
        description: project.description.trim(),
      }))
      .filter((project) => project.title || project.description);

    const cleanedForm = {
      ...form,
      honors: form.honors.filter((item) => item.trim() !== ""),
      relevantCoursework: form.relevantCoursework.filter(
        (item) => item.trim() !== "",
      ),
      projects: cleanedProjects,
      institutionLogo: uploadedLogoUrl || "",
      endDate: form.currentlyStudying ? null : form.endDate || null,
    };

    dispatch(createEducation(cleanedForm));
  };

  useEffect(() => {
    if (success) {
      toast.success(message || "Education added successfully");
      dispatch(clearEducationState());
      dispatch(clearEducationUploadedLogo());
      router.push("/admin/education");
    }
  }, [success, message, dispatch, router]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Something went wrong");
      dispatch(clearEducationState());
    }
  }, [error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearEducationUploadedLogo());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen py-10 text-white">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Add Education</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-10"
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Institution Logo</h2>

              <ImageUpload
                label="Upload Institution Logo"
                buttonText="Click to upload institution logo"
                selector={(state) => state.education}
                uploadAction={uploadEducationLogo}
                clearAction={clearEducationUploadedLogo}
              />
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Image Preview</h2>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <div className="relative mx-auto aspect-square w-full max-w-[250px] overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                  {uploadedLogoUrl ? (
                    <Image
                      src={uploadedLogoUrl}
                      alt="Institution logo preview"
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
                  Institution Name
                </label>
                <input
                  type="text"
                  name="institutionName"
                  value={form.institutionName}
                  onChange={handleChange}
                  placeholder="Enter institution name"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Degree
                </label>
                <input
                  type="text"
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  placeholder="Enter degree"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-white">
                  Field of Study
                </label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={form.fieldOfStudy}
                  onChange={handleChange}
                  placeholder="Enter field of study"
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
                  disabled={form.currentlyStudying}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-base font-medium text-white">
                  Grade / GPA / CGPA
                </label>
                <input
                  type="text"
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  placeholder="e.g. 3.75/4.00"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="checkbox"
                  name="currentlyStudying"
                  checked={form.currentlyStudying}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-white">Currently Studying Here</span>
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
                placeholder="Write a short description about this education"
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-2xl font-bold">Honors</h2>

            <StackedArrayField
              field="honors"
              values={form.honors}
              addField={addField}
              removeField={removeField}
              handleArrayChange={handleArrayChange}
              placeholder="Honor"
              buttonText="Add Honor"
            />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-2xl font-bold">Relevant Coursework</h2>

            <StackedArrayField
              field="relevantCoursework"
              values={form.relevantCoursework}
              addField={addField}
              removeField={removeField}
              handleArrayChange={handleArrayChange}
              placeholder="Course"
              buttonText="Add Course"
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
            disabled={loading || logoImageLoading}
            className="h-14 w-full rounded-2xl bg-accent font-semibold text-primary hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Education"}
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
