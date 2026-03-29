"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEducations,
  deleteEducation,
  clearEducationState,
} from "../../redux/features/education/educationSlice";
import DeleteModal from "../../components/admin/DeleteModal";

export default function AdminEducation() {
  const dispatch = useDispatch();

  const { educations, loading, error, message } = useSelector(
    (state) => state.education,
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);

  useEffect(() => {
    dispatch(fetchEducations());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearEducationState());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearEducationState());
    }
  }, [error, dispatch]);

  const openDeleteModal = (education) => {
    setSelectedEducation(education);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (loading) return;
    setDeleteModalOpen(false);
    setSelectedEducation(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEducation?._id) return;

    await dispatch(deleteEducation(selectedEducation._id));
    closeDeleteModal();
  };

  const openDetailsModal = (education) => {
    setSelectedEducation(education);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedEducation(null);
  };

  return (
    <>
      <section className="min-h-screen py-12 xl:px-0">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 text-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                All Education
              </h1>
              <p className="text-white/60 mt-2">
                Manage your education entries here
              </p>
            </div>

            <Link
              href="/admin/education/new"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 transition-all"
            >
              Add Education
            </Link>
          </div>

          {loading && (!educations || educations.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              Loading education entries...
            </div>
          ) : !loading && (!educations || educations.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              No education entries found.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {educations.map((education, index) => (
                <motion.div
                  key={education._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:border-accent/40 transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => openDetailsModal(education)}
                    className="w-full text-left p-6 hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-accent font-medium mb-2">
                          {education.degree || "Degree"}
                        </p>

                        <h2 className="text-2xl font-bold text-white leading-tight">
                          {education.institutionName}
                        </h2>

                        <p className="text-lg text-white/80 mt-2">
                          {education.fieldOfStudy}
                        </p>

                        <p className="text-sm text-white/60 mt-3">
                          {education.location || "Location not provided"}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                          {formatDuration(
                            education.startDate,
                            education.endDate,
                            education.currentlyStudying,
                          )}
                        </span>
                      </div>
                    </div>
                  </button>

                  <div className="px-6 pb-6">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/education/${education._id}/edit`}
                        className="flex-1 text-center px-4 py-2.5 rounded-xl border border-accent text-accent hover:bg-accent hover:text-primary transition-all"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => openDeleteModal(education)}
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
        title="Delete Education"
        message={`Are you sure you want to delete "${selectedEducation?.institutionName || "this education entry"}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />

      <EducationDetailsModal
        isOpen={detailsModalOpen}
        education={selectedEducation}
        onClose={closeDetailsModal}
      />
    </>
  );
}

function EducationDetailsModal({ isOpen, education, onClose }) {
  const duration = useMemo(() => {
    if (!education) return "";
    return formatDuration(
      education.startDate,
      education.endDate,
      education.currentlyStudying,
    );
  }, [education]);

  return (
    <AnimatePresence>
      {isOpen && education ? (
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
                    {education.degree || "Degree"}
                  </p>
                  <h2 className="text-3xl font-bold">
                    {education.institutionName}
                  </h2>
                  <p className="text-xl text-white/80 mt-2">
                    {education.fieldOfStudy}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-white/60">
                    <span>{education.location || "Location not provided"}</span>
                    <span>•</span>
                    <span>{duration}</span>
                    {education.grade ? (
                      <>
                        <span>•</span>
                        <span>Grade: {education.grade}</span>
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
              {education.description ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-white/70 leading-7">
                    {education.description}
                  </p>
                </div>
              ) : null}

              {(education.honors || []).length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Honors</h3>
                  <ul className="space-y-2 text-white/70">
                    {education.honors.map((item, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-accent mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {(education.relevantCoursework || []).length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Relevant Coursework
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {education.relevantCoursework.map((course, index) => (
                      <span
                        key={`${course}-${index}`}
                        className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-white/80"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {(education.projects || []).length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Projects</h3>
                  <div className="space-y-4">
                    {education.projects.map((project, index) => (
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
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function formatDuration(startDate, endDate, currentlyStudying) {
  const start = formatMonthYear(startDate);
  const end = currentlyStudying ? "Present" : formatMonthYear(endDate);

  if (!start && !end) return "Duration not provided";
  if (start && end) return `${start} - ${end}`;
  return start || end || "Duration not provided";
}

function formatMonthYear(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}