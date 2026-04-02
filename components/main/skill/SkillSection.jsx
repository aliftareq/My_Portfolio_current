"use client";

import { useSelector } from "react-redux";

const SkillsSection = () => {
  const { skills, loading, error } = useSelector((state) => state.skills);

  if (loading) {
    return <p className="text-white/60">Loading skills...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-[30px] text-center xl:text-left">
      {/* Title */}
      <h3 className="text-4xl font-bold">My Skills</h3>

      {/* Description (optional) */}
      <p className="max-w-[700px] text-white/60 mx-auto xl:mx-0">
        Technologies and tools I use to build modern, scalable applications.
      </p>

      {/* Skills Grid */}
      <div className="max-w-5xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {skills?.map((skill) => (
            <div
              key={skill._id}
              className="group w-full rounded-[16px] border border-white/10 bg-[#232329] p-4 flex flex-col items-center justify-center text-center hover:border-accent transition-all duration-300"
            >
              {/* Icon (if exists) */}
              {skill?.icon && (
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-10 h-10 mb-3 object-contain"
                />
              )}

              {/* Name */}
              <p className="text-white text-sm font-medium group-hover:text-accent transition-all duration-300">
                {skill?.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
