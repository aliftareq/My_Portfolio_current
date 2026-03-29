"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  deleteService,
  clearServiceState,
} from "../../redux/features/service/serviceSlice";
import DeleteModal from "../../components/admin/DeleteModal";

export default function AdminService() {
  const dispatch = useDispatch();

  const { services, loading, error, message } = useSelector(
    (state) => state.service,
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearServiceState());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearServiceState());
    }
  }, [error, dispatch]);

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (loading) return;
    setDeleteModalOpen(false);
    setSelectedService(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedService?._id) return;

    await dispatch(deleteService(selectedService._id));
    closeDeleteModal();
  };

  return (
    <>
      <section className="min-h-screen py-12 xl:px-0">
        <div className="container mx-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 text-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                All Services
              </h1>
              <p className="text-white/60 mt-2">Manage your services here</p>
            </div>

            <Link
              href="/admin/services/new"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 transition-all"
            >
              Add Service
            </Link>
          </div>

          {/* STATES */}
          {loading && (!services || services.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              Loading services...
            </div>
          ) : !loading && (!services || services.length === 0) ? (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
              No services found.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:border-accent/40 transition-all overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* NUMBER (UI only) */}
                        <p className="text-sm text-accent font-medium mb-2">
                          {String(index + 1).padStart(2, "0")}
                        </p>

                        <h2 className="text-2xl font-bold text-white leading-tight">
                          {service.title}
                        </h2>

                        <p className="text-white/70 mt-3 line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="px-6 pb-6">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/services/${service._id}/edit`}
                        className="flex-1 text-center px-4 py-2.5 rounded-xl border border-accent text-accent hover:bg-accent hover:text-primary transition-all"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => openDeleteModal(service)}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
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

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={deleteModalOpen}
        title="Delete Service"
        message={`Are you sure you want to delete "${
          selectedService?.title || "this service"
        }"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />
    </>
  );
}
