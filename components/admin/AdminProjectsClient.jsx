"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  deleteProject,
  clearProjectState,
} from "../../redux/features/project/projectSlice";
import DeleteModal from "../../components/admin/DeleteModal";

export default function AdminProjectsClient() {
  const dispatch = useDispatch();

  const { projects, loading, error, message } = useSelector(
    (state) => state.project,
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearProjectState());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProjectState());
    }
  }, [error, dispatch]);

  const openDeleteModal = (project) => {
    setSelectedProject(project);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (loading) return;
    setDeleteModalOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject?._id) return;

    await dispatch(deleteProject(selectedProject._id));
    closeDeleteModal();
  };

  return (
    <>
      <section className="min-h-screen py-12 xl:px-0">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 text-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                All Projects
              </h1>
              <p className="text-white/60 mt-2">Manage your projects here</p>
            </div>

            <Link
              href="/admin/projects/new"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 transition-all"
            >
              Add Project
            </Link>
          </div>

          {loading && (!projects || projects.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              Loading projects...
            </div>
          ) : !loading && (!projects || projects.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              No projects found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/40 transition-all"
                >
                  <div className="relative h-[240px] w-full group overflow-hidden">
                    <Image
                      src={project.mainImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h2 className="text-white text-xl font-bold capitalize">
                        {project.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/projects/${project._id}/edit`}
                        className="flex-1 text-center px-4 py-2.5 rounded-xl border border-accent text-accent hover:bg-accent hover:text-primary transition-all"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => openDeleteModal(project)}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <DeleteModal
        isOpen={deleteModalOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.title || "this project"}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />
    </>
  );
}
