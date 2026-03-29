"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchSingleProject,
  updateProject,
  clearProjectState,
  clearSelectedProject,
} from "../../../../../redux/features/project/projectSlice";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const projectId = params?.id;

  const { project, loading, error, success, message } = useSelector(
    (state) => state.project,
  );

  const serviceOptions = [
    "Web Development",
    "UI/UX Design",
    "App Development",
    "SEO",
  ];

  const [form, setForm] = useState({
    category: "Web Development",
    subCategory: "",
    title: "",
    slug: "",
    description: "",
    techStack: [""],
    liveUrl: "",
    githubUrl: "",
    featured: false,
    mainImage: "",
    gallery: [],
  });

  useEffect(() => {
    if (projectId) {
      dispatch(fetchSingleProject(projectId));
    }

    return () => {
      dispatch(clearProjectState());
      dispatch(clearSelectedProject());
    };
  }, [dispatch, projectId]);

  useEffect(() => {
    if (project) {
      setForm({
        category: project.category || "Web Development",
        subCategory: project.subCategory || "",
        title: project.title || "",
        slug: project.slug || "",
        description: project.description || "",
        techStack:
          Array.isArray(project.techStack) && project.techStack.length > 0
            ? project.techStack
            : [""],
        liveUrl: project.liveUrl || "",
        githubUrl: project.githubUrl || "",
        featured: Boolean(project.featured),
        mainImage: project.mainImage || "",
        gallery: Array.isArray(project.gallery) ? project.gallery : [],
      });
    }
  }, [project]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Failed to load project");
      dispatch(clearProjectState());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message || "Project updated successfully");
      dispatch(clearProjectState());
      router.push("/admin/projects");
    }
  }, [success, message, dispatch, router]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    const cleanedForm = {
      category: form.category,
      subCategory: form.subCategory,
      title: form.title,
      slug: form.slug,
      description: form.description,
      techStack: form.techStack.filter((item) => item.trim() !== ""),
      liveUrl: form.liveUrl,
      githubUrl: form.githubUrl,
      featured: form.featured,
      mainImage: form.mainImage,
      gallery: form.gallery,
    };

    dispatch(
      updateProject({
        id: projectId,
        updatedData: cleanedForm,
      }),
    );
  };

  if (loading && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading project...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 text-white">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Edit Project</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/70">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
              >
                {serviceOptions.map((service) => (
                  <option
                    key={service}
                    value={service}
                    className="bg-[#1c1c22] text-white"
                  >
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm text-white/70">
                Sub-category
              </label>
              <input
                type="text"
                name="subCategory"
                placeholder="Sub-category"
                value={form.subCategory}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/70">Slug</label>
              <input
                type="text"
                name="slug"
                placeholder="Slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/70">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent resize-none"
            />
          </div>

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
                <div key={index} className="space-y-2">
                  <label className="block text-sm text-white/70">
                    Tech {index + 1}
                  </label>

                  <div className="relative">
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
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Main Image</label>
              <input
                type="text"
                value={form.mainImage}
                disabled
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white/50 cursor-not-allowed"
              />
              <p className="text-xs text-white/40">
                Image editing is disabled here.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Gallery Images</label>
              <input
                type="text"
                value={`${form.gallery.length} image(s)`}
                disabled
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white/50 cursor-not-allowed"
              />
              <p className="text-xs text-white/40">
                Gallery editing is disabled here.
              </p>
            </div>
          </div>

          {form.gallery.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {form.gallery.map((img, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="h-36 w-full">
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="h-full w-full object-cover opacity-70"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Live URL</label>
              <input
                type="text"
                name="liveUrl"
                placeholder="Live URL"
                value={form.liveUrl}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/70">GitHub URL</label>
              <input
                type="text"
                name="githubUrl"
                placeholder="GitHub URL"
                value={form.githubUrl}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/70">Featured</label>
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
