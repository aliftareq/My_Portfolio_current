"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSkills } from "../../../redux/features/skill/skillSlice";
import SkillCard from "./SkillCard";
import SkillModal from "./SkillModal";

const SkillsSection = () => {
  const dispatch = useDispatch();
  const { skills, loading, error } = useSelector((state) => state.skills);

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  const handleOpen = (item) => {
    setSelectedSkill(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSkill(null);
  };

  if (loading) {
    return <p className="text-white/60">Loading skills...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-[30px] text-center xl:text-left">
        <h3 className="text-4xl font-bold">My Skills</h3>

        <p className="max-w-[700px] text-white/60 mx-auto xl:mx-0">
          Technologies, tools, and professional abilities I use to build modern,
          reliable, and scalable digital products.
        </p>

        {skills?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {skills.map((item) => (
              <SkillCard
                key={item._id}
                item={item}
                onOpen={() => handleOpen(item)}
              />
            ))}
          </div>
        ) : (
          <p className="text-white/50">No skills found.</p>
        )}
      </div>

      <SkillModal item={selectedSkill} open={open} onClose={handleClose} />
    </>
  );
};

export default SkillsSection;
