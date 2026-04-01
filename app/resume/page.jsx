"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";

import { fetchProfile } from "../../redux/features/profile/profileSlice";
import { fetchJobExperiences } from "../../redux/features/jobExperience/jobExperienceSlice";
import { fetchEducations } from "../../redux/features/education/educationSlice";
import { fetchSkills } from "../../redux/features/skill/skillSlice";
import { fetchCourses } from "../../redux/features/courses/courseSlice";

import ExperienceSection from "../../components/main/experience/ExperienceSection";
import EducationSection from "../../components/main/education/EducationSection";
import CoursesSection from "../../components/main/courses/CoursesSection";

const Resume = () => {
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.profile);
  const { jobs } = useSelector((state) => state.jobExperience);
  const { educations } = useSelector((state) => state.education);
  const { skills } = useSelector((state) => state.skills);
  const { courses } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchJobExperiences());
    dispatch(fetchEducations());
    dispatch(fetchSkills());
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeInOut" },
      }}
      className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0"
    >
      <div className="container mx-auto">
        <Tabs
          defaultValue="about"
          className="flex flex-col xl:flex-row gap-[60px]"
        >
          <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
            <TabsTrigger value="about">About me</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <div className="min-h-[70vh] w-full">
            <TabsContent
              value="about"
              className="w-full text-center xl:text-left"
            >
              <div className="flex flex-col gap-[30px]">
                <h3 className="text-4xl font-bold">About me</h3>
                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                  {profile?.description}
                </p>

                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
                  <li className="flex items-center gap-4">
                    <span className="text-white/60">Name</span>
                    <span className="text-xl">{profile?.name}</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-white/60">Phone</span>
                    <span className="text-xl">{profile?.phone}</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-white/60">Experience</span>
                    <span className="text-xl">{profile?.experience} Years</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-white/60">Skype</span>
                    <span className="text-xl">{profile?.skype}</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-white/60">Nationality</span>
                    <span className="text-xl">{profile?.nationality}</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-white/60">Email</span>
                    <span className="text-xl">{profile?.email}</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-white/60">Freelance</span>
                    <span className="text-xl">{profile?.freelance}</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-white/60">Languages</span>
                    <span className="text-xl">
                      {profile?.languages?.join(", ")}
                    </span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent
              value="experience"
              className="w-full text-center xl:text-left"
            >
              <ExperienceSection />
            </TabsContent>

            <TabsContent
              value="education"
              className="w-full text-center xl:text-left"
            >
              <EducationSection />
            </TabsContent>

            <TabsContent
              value="courses"
              className="w-full text-center xl:text-left"
            >
              <CoursesSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Resume;
