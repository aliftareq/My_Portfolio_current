"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteModal({
  isOpen,
  title = "Delete Project",
  message = "Are you sure you want to delete this project?",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1c1c22] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white">{title}</h2>

              <p className="mt-3 text-white/70">{message}</p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-red-500 bg-red-500 px-4 py-3 text-white hover:bg-red-600 hover:border-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Deleting..." : confirmText}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-white hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
