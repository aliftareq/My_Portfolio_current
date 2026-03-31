"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowDownRight } from "react-icons/bs";

import { fetchServices } from "../../redux/features/service/serviceSlice";

const Services = () => {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.service);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 2.4, duration: 0.4, ease: "easeInOut" },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-[60px]"
        >
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col justify-center gap-6 group"
              >
                <div className="w-full flex justify-between items-center">
                  <div className="text-5xl font-extrabold text-outline text-transparent">
                    0{index + 1}
                  </div>
                  <div className="w-[70px] h-[70px] rounded-full bg-white flex justify-center items-center">
                    <BsArrowDownRight className="text-primary text-3xl" />
                  </div>
                </div>
                <h2 className="text-[42px] font-bold leading-none text-white">
                  Loading...
                </h2>
                <p className="text-white/60">
                  Please wait while services load.
                </p>
                <div className="border-b border-white/20 w-full"></div>
              </div>
            ))}

          {!loading && error && (
            <div className="col-span-1 md:col-span-2 text-center text-red-400">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            services?.map((service, index) => {
              const serviceNumber = String(index + 1).padStart(2, "0");

              return (
                <div
                  key={service._id || index}
                  className="flex-1 flex flex-col justify-center gap-6 group"
                >
                  {/* top */}
                  <div className="w-full flex justify-between items-center">
                    <div className="text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover transition-all duration-500">
                      {serviceNumber}
                    </div>

                    <Link
                      href={service.link || `/services/${service.slug}`}
                      className="w-[70px] h-[70px] rounded-full bg-white group-hover:bg-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45"
                    >
                      <BsArrowDownRight className="text-primary text-3xl" />
                    </Link>
                  </div>

                  {/* title */}
                  <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500">
                    {service.title}
                  </h2>

                  {/* description */}
                  <p className="text-white/60">{service.description}</p>

                  {/* border */}
                  <div className="border-b border-white/20 w-full"></div>
                </div>
              );
            })}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
