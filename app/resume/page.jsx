"use client";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

import AboutSection from "../../components/main/about/AboutSection";
import ExperienceSection from "../../components/main/experience/ExperienceSection";
import EducationSection from "../../components/main/education/EducationSection";
import SkillsSection from "../../components/main/skill/SkillSection";
import CoursesSection from "../../components/main/courses/CoursesSection";

const Resume = () => {
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
              <AboutSection />
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
              value="skills"
              className="w-full text-center xl:text-left"
            >
              <SkillsSection />
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
