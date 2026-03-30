"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSkills,
  deleteSkill,
  clearSkillState,
} from "../../redux/features/skill/skillSlice";
import DeleteModal from "../../components/admin/DeleteModal";

export default function AdminSkills() {
  const dispatch = useDispatch();

  const { skills, loading, error, message } = useSelector(
    (state) => state.skills,
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearSkillState());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearSkillState());
    }
  }, [error, dispatch]);

  const openDeleteModal = (skill) => {
    setSelectedSkill(skill);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (loading) return;
    setDeleteModalOpen(false);
    setSelectedSkill(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSkill?._id) return;

    await dispatch(deleteSkill(selectedSkill._id));
    closeDeleteModal();
  };

  const openDetailsModal = (skill) => {
    setSelectedSkill(skill);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedSkill(null);
  };

  return (
    <>
      <section className="min-h-screen py-12 xl:px-0">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 text-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                All Skills
              </h1>
              <p className="text-white/60 mt-2">
                Manage your skill entries here
              </p>
            </div>

            <Link
              href="/admin/skills/new"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 transition-all"
            >
              Add Skill
            </Link>
          </div>

          {loading && (!skills || skills.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              Loading skill entries...
            </div>
          ) : !loading && (!skills || skills.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              No skill entries found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill._id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="rounded-xl border border-white/10 bg-white/5 hover:border-accent/40 transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => openDetailsModal(skill)}
                    className="w-full text-left p-4 hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs text-accent font-medium mb-1">
                          {skill.category || "Category"}
                        </p>

                        <h2 className="text-xl font-semibold text-white leading-tight">
                          {skill.name}
                        </h2>

                        <p className="text-xs text-white/60 mt-2">
                          Exp: {skill.experience || "N/A"}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-white/70">
                          {skill.proficiency || "N/A"}
                        </span>

                        {skill.isFeatured ? (
                          <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] text-accent">
                            Featured
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>

                  <div className="px-4 pb-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/skills/${skill._id}/edit`}
                        className="flex-1 text-center px-3 py-2 rounded-lg border border-accent text-accent text-sm hover:bg-accent hover:text-primary transition-all"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => openDeleteModal(skill)}
                        disabled={loading}
                        className="flex-1 px-3 py-2 rounded-lg border border-red-500 text-red-400 text-sm hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
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
        title="Delete Skill"
        message={`Are you sure you want to delete "${
          selectedSkill?.name || "this skill entry"
        }"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />

      <SkillDetailsModal
        isOpen={detailsModalOpen}
        skill={selectedSkill}
        onClose={closeDetailsModal}
      />
    </>
  );
}

function SkillDetailsModal({ isOpen, skill, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && skill ? (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#151515] text-white max-h-[90vh] overflow-y-auto"
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
                    {skill.category || "Category not provided"}
                  </p>
                  <h2 className="text-3xl font-bold">{skill.name}</h2>
                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-white/60">
                    <span>
                      {skill.proficiency || "Proficiency not provided"}
                    </span>
                    <span>•</span>
                    <span>{skill.experience || "Experience not provided"}</span>
                    {skill.isFeatured ? (
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

            <div className="p-6 sm:p-8 space-y-6">
              {skill.icon ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Icon</h3>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                  </div>
                </div>
              ) : null}

              {skill.slug ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Slug</h3>
                  <p className="text-white/70 break-all">{skill.slug}</p>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
