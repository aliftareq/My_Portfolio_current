// import WorkClient from "../../components/main/WorkClient";

// export default function WorkPage() {
//   return <WorkClient />;
// }
"use client";

import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import Image from "next/image";
import WorkSliderBtns from "../../components/main/WorkSliderBtns";
import { fetchProjects } from "../../redux/features/project/projectSlice";

const serviceTabs = [
  { label: "Web Development", value: "web-development" },
  { label: "UI/UX Design", value: "ui-ux-design" },
  { label: "App Development", value: "app-development" },
  { label: "SEO", value: "seo" },
];

export default function WorkClient() {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.project);

  const [activeService, setActiveService] = useState(serviceTabs[0].value);
  const [project, setProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const category = item.category?.toLowerCase().trim();

      return (
        category === activeService ||
        category === activeService.replace(/-/g, " ") ||
        category?.replace(/\s+/g, "-") === activeService
      );
    });
  }, [projects, activeService]);

  useEffect(() => {
    if (filteredProjects.length > 0) {
      setProject(filteredProjects[0]);
    } else {
      setProject(null);
    }
  }, [filteredProjects]);

  const handleSlideChange = (swiper) => {
    const currentIndex = swiper.activeIndex;
    setProject(filteredProjects[currentIndex] || null);
  };

  const formatProjectNumber = (index) => {
    return String(index + 1).padStart(2, "0");
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-white">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  const currentProjectIndex = filteredProjects.findIndex(
    (p) => p._id === project?._id
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[80vh] flex flex-col justify-center py-12 xl:px-0"
    >
      <div className="container mx-auto">
        {/* Service Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {serviceTabs.map((service) => (
            <button
              key={service.value}
              onClick={() => setActiveService(service.value)}
              className={`px-5 py-2 rounded-full border transition-all duration-300 ${
                activeService === service.value
                  ? "bg-accent text-primary border-accent"
                  : "border-white/20 text-white hover:border-accent hover:text-accent"
              }`}
            >
              {service.label}
            </button>
          ))}
        </div>

        {!project || filteredProjects.length === 0 ? (
          <div className="min-h-[40vh] flex items-center justify-center text-white">
            No projects found for this service.
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row xl:gap-[30px]">
            <div className="w-full xl:w-[50%] xl:h-[460px] flex flex-col xl:justify-between order-2 xl:order-none">
              <div className="flex flex-col gap-[30px] h-[50%]">
                <div className="text-8xl leading-none font-extrabold text-transparent text-outline">
                  {formatProjectNumber(currentProjectIndex)}
                </div>

                <h2 className="text-[42px] font-bold leading-none text-white capitalize">
                  {project.title || project.slug}
                </h2>

                <ul className="flex gap-4 flex-wrap">
                  {project.techStack?.map((item, index) => (
                    <li key={index} className="text-xl text-accent">
                      {item}
                      {index !== project.techStack.length - 1 && ","}
                    </li>
                  ))}
                </ul>

                <div className="border border-white/20"></div>

                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    href={`/work/${project.slug}`}
                    className="px-6 py-3 rounded-full border border-white/20 text-white hover:border-accent hover:text-accent transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full xl:w-[50%]">
              <Swiper
                key={activeService}
                spaceBetween={30}
                slidesPerView={1}
                className="xl:h-[520px] mb-12"
                onSlideChange={handleSlideChange}
              >
                {filteredProjects.map((item, index) => (
                  <SwiperSlide key={item._id || index} className="w-full">
                    <div className="relative group w-full aspect-[1280/824] bg-transparent">
                      <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>

                      <Link
                        href={`/work/${item.slug}`}
                        className="relative flex items-center justify-center w-full h-full"
                      >
                        <Image
                          src={item.mainImage}
                          fill
                          className="object-contain object-center"
                          alt={item.title || "Project image"}
                          sizes="(max-width: 1280px) 100vw, 50vw"
                        />
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}

                <WorkSliderBtns
                  containerStyles="flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)] xl:bottom-0 z-20 w-full justify-between xl:w-max xl:justify-none"
                  btnStyles="bg-accent hover:bg-accent-hover text-primary text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all"
                />
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}