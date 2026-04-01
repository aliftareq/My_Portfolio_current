"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobExperiences } from "../../../redux/features/jobExperience/jobExperienceSlice";
import ExperienceCard from "./ExperienceCard";
import ExperienceModal from "./ExperienceModal";

const ExperienceSection = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobExperience);

  const [selectedExperience, setSelectedExperience] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchJobExperiences());
  }, [dispatch]);

  const handleOpen = (item) => {
    setSelectedExperience(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedExperience(null);
  };

  if (loading) {
    return <p className="text-white/60 text-lg">Loading experience...</p>;
  }

  if (error) {
    return <p className="text-red-400 text-lg">{error}</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-[30px] text-center xl:text-left">
        <h3 className="text-4xl font-bold">My Experience</h3>
        <p className="max-w-[700px] text-white/60 mx-auto xl:mx-0">
          A summary of my professional journey, roles, and the technologies I’ve
          worked with.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs?.map((item) => (
            <ExperienceCard
              key={item._id}
              item={item}
              onOpen={() => handleOpen(item)}
            />
          ))}
        </div>
      </div>

      <ExperienceModal
        item={selectedExperience}
        open={open}
        onClose={handleClose}
      />
    </>
  );
};

export default ExperienceSection;
