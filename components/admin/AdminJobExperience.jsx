"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobExperiences,
  deleteJobExperience,
  clearJobState,
} from "../../redux/features/jobExperience/jobExperienceSlice";
import DeleteModal from "../../components/admin/DeleteModal";

export default function AdminExperienceClient() {
  const dispatch = useDispatch();

  const { jobs, loading, error, message } = useSelector(
    (state) => state.jobExperience,
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    dispatch(fetchJobExperiences());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearJobState());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearJobState());
    }
  }, [error, dispatch]);

  const openDeleteModal = (job) => {
    setSelectedJob(job);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (loading) return;
    setDeleteModalOpen(false);
    setSelectedJob(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJob?._id) return;

    await dispatch(deleteJobExperience(selectedJob._id));
    closeDeleteModal();
  };

  const openDetailsModal = (job) => {
    setSelectedJob(job);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <>
      <section className="min-h-screen py-12 xl:px-0">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 text-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                All Experience
              </h1>
              <p className="text-white/60 mt-2">
                Manage your job experiences here
              </p>
            </div>

            <Link
              href="/admin/experience/new"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 transition-all"
            >
              Add Experience
            </Link>
          </div>

          {loading && (!jobs || jobs.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              Loading job experiences...
            </div>
          ) : !loading && (!jobs || jobs.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              No job experiences found.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:border-accent/40 transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => openDetailsModal(job)}
                    className="w-full text-left p-6 hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-accent font-medium mb-2">
                          {job.employmentType || "Employment"}
                        </p>

                        <h2 className="text-2xl font-bold text-white leading-tight">
                          {job.companyName}
                        </h2>

                        <p className="text-lg text-white/80 mt-2">
                          {job.jobTitle}
                        </p>

                        <p className="text-sm text-white/60 mt-3">
                          {job.location || "Location not provided"}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                          {formatDuration(
                            job.startDate,
                            job.endDate,
                            job.currentlyWorking,
                          )}
                        </span>
                      </div>
                    </div>

                    {job.description ? (
                      <p className="text-white/60 mt-4 line-clamp-2">
                        {job.description}
                      </p>
                    ) : null}

                    {(job.technologies || []).length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.technologies.slice(0, 4).map((tech, i) => (
                          <span
                            key={`${tech}-${i}`}
                            className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/80 border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                        {job.technologies.length > 4 ? (
                          <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60 border border-white/10">
                            +{job.technologies.length - 4} more
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </button>

                  <div className="px-6 pb-6">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/experience/${job._id}/edit`}
                        className="flex-1 text-center px-4 py-2.5 rounded-xl border border-accent text-accent hover:bg-accent hover:text-primary transition-all"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => openDeleteModal(job)}
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
        title="Delete Job Experience"
        message={`Are you sure you want to delete "${selectedJob?.companyName || "this experience"}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />

      <ExperienceDetailsModal
        isOpen={detailsModalOpen}
        job={selectedJob}
        onClose={closeDetailsModal}
      />
    </>
  );
}

function ExperienceDetailsModal({ isOpen, job, onClose }) {
  const duration = useMemo(() => {
    if (!job) return "";
    return formatDuration(job.startDate, job.endDate, job.currentlyWorking);
  }, [job]);

  return (
    <AnimatePresence>
      {isOpen && job ? (
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
                    {job.employmentType || "Employment"}
                  </p>
                  <h2 className="text-3xl font-bold">{job.companyName}</h2>
                  <p className="text-xl text-white/80 mt-2">{job.jobTitle}</p>
                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-white/60">
                    <span>{job.location || "Location not provided"}</span>
                    <span>•</span>
                    <span>{duration}</span>
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
              {job.description ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-white/70 leading-7">{job.description}</p>
                </div>
              ) : null}

              {(job.responsibilities || []).length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Responsibilities
                  </h3>
                  <ul className="space-y-2 text-white/70">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-accent mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {(job.achievements || []).length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Achievements</h3>
                  <ul className="space-y-2 text-white/70">
                    {job.achievements.map((item, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-accent mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {(job.technologies || []).length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech, index) => (
                      <span
                        key={`${tech}-${index}`}
                        className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-white/80"
                      >
                        {tech}
                      </span>
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

function formatDuration(startDate, endDate, currentlyWorking) {
  const start = formatMonthYear(startDate);
  const end = currentlyWorking ? "Present" : formatMonthYear(endDate);

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
