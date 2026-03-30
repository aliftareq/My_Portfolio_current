"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  deleteCourse,
  clearCourseState,
} from "../../redux/features/courses/courseSlice";
import DeleteModal from "../../components/admin/DeleteModal";

export default function AdminCourses() {
  const dispatch = useDispatch();

  const { courses, loading, error, message } = useSelector(
    (state) => state.courses
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearCourseState());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearCourseState());
    }
  }, [error, dispatch]);

  const openDeleteModal = (course) => {
    setSelectedCourse(course);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (loading) return;
    setDeleteModalOpen(false);
    setSelectedCourse(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCourse?._id) return;

    await dispatch(deleteCourse(selectedCourse._id));
    closeDeleteModal();
  };

  const openDetailsModal = (course) => {
    setSelectedCourse(course);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <>
      <section className="min-h-screen py-12 xl:px-0">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 text-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                All Courses
              </h1>
              <p className="text-white/60 mt-2">Manage your course entries here</p>
            </div>

            <Link
              href="/admin/courses/new"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 transition-all"
            >
              Add Course
            </Link>
          </div>

          {loading && (!courses || courses.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              Loading course entries...
            </div>
          ) : !loading && (!courses || courses.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              No course entries found.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:border-accent/40 transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => openDetailsModal(course)}
                    className="w-full text-left p-6 hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-accent font-medium mb-2">
                          {course.provider || "Provider"}
                        </p>

                        <h2 className="text-2xl font-bold text-white leading-tight">
                          {course.title}
                        </h2>

                        <p className="text-sm text-white/60 mt-3">
                          Duration : {course.duration || "Duration not provided"}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                          {formatCompletionDate(course.completionDate)}
                        </span>
                      </div>
                    </div>
                  </button>

                  <div className="px-6 pb-6">
                    {(course.skills || []).length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-white/80"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex gap-3">
                      <Link
                        href={`/admin/courses/${course._id}/edit`}
                        className="flex-1 text-center px-4 py-2.5 rounded-xl border border-accent text-accent hover:bg-accent hover:text-primary transition-all"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => openDeleteModal(course)}
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
        title="Delete Course"
        message={`Are you sure you want to delete "${
          selectedCourse?.title || "this course entry"
        }"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />

      <CourseDetailsModal
        isOpen={detailsModalOpen}
        course={selectedCourse}
        onClose={closeDetailsModal}
      />
    </>
  );
}

function CourseDetailsModal({ isOpen, course, onClose }) {
  const completionDate = useMemo(() => {
    if (!course) return "";
    return formatCompletionDate(course.completionDate);
  }, [course]);

  return (
    <AnimatePresence>
      {isOpen && course ? (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#151515] text-white max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8 border-b border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-accent text-sm font-medium mb-2">
                    {course.provider || "Provider"}
                  </p>
                  <h2 className="text-3xl font-bold">{course.title}</h2>
                  <p className="text-xl text-white/80 mt-2">
                    {course.platform || "Platform not provided"}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-white/60">
                    <span>{course.duration || "Duration not provided"}</span>
                    <span>•</span>
                    <span>{completionDate}</span>
                    {course.isFeatured ? (
                      <>
                        <span>•</span>
                        <span>Featured</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-white/15 text-white/80 hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {course.description ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-white/70 leading-7">{course.description}</p>
                </div>
              ) : null}

              {(course.skills || []).length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-white/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {(course.projects || []).length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Projects</h3>
                  <div className="space-y-4">
                    {course.projects.map((project, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <h4 className="text-base font-semibold text-white">
                          {project.title}
                        </h4>

                        {project.description ? (
                          <p className="text-white/70 mt-2 leading-7">
                            {project.description}
                          </p>
                        ) : null}

                        {project.projectLink ? (
                          <a
                            href={project.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 text-accent hover:underline"
                          >
                            View Project
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {(course.certificate?.name || course.certificate?.url) ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Certificate</h3>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    {course.certificate?.name ? (
                      <p className="text-white/80 font-medium">
                        {course.certificate.name}
                      </p>
                    ) : null}

                    {course.certificate?.url ? (
                      <a
                        href={course.certificate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-accent hover:underline"
                      >
                        View Certificate
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {course.courseLink ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Course Link</h3>
                  <a
                    href={course.courseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {course.courseLink}
                  </a>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function formatCompletionDate(dateValue) {
  if (!dateValue) return "Completion date not provided";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Completion date not provided";

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}