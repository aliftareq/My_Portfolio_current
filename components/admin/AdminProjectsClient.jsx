"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  deleteProject,
  clearProjectState,
} from "../../redux/features/project/projectSlice";

export default function AdminProjectsClient() {
  const dispatch = useDispatch();

  const { projects, loading, error, message } = useSelector(
    (state) => state.project,
  );

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      alert(message);
      dispatch(clearProjectState());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearProjectState());
    }
  }, [error, dispatch]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (!confirmed) return;

    dispatch(deleteProject(id));
  };

  if (loading && (!projects || projects.length === 0)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-white">
        Loading projects...
      </div>
    );
  }

  if (!loading && (!projects || projects.length === 0)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-white">
        No projects found.
      </div>
    );
  }

  return (
    <section className="min-h-screen py-12 xl:px-0">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">All Projects</h1>
            <p className="text-white/60 mt-2">Manage your projects here</p>
          </div>

          <Link
            href="/admin/projects/new"
            className="px-5 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 transition-all"
          >
            Add Project
          </Link>
        </div>

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
                    href={`/admin/projects/${project._id}`}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-accent text-accent hover:bg-accent hover:text-primary transition-all"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(project._id)}
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
      </div>
    </section>
  );
}