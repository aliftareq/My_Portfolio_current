"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { FiDownload } from "react-icons/fi";
import { Button } from "../components/ui/button";
import Social from "../components/main/Social";
import Photo from "../components/main/Photo";
import Stats from "../components/main/Stats";
import { fetchProfile } from "../redux/features/profile/profileSlice";

const Home = () => {
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <section>
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8 xl:pb-24">
          {/* text */}
          <div className="text-center xl:text-left order-2 xl:order-none">
            <h1 className="h1 mb-6">
              Hello! I&apos;m <br />
              <span className="text-accent">
                {loading ? "Loading..." : profile?.name || "Your Name"}
              </span>
            </h1>

            <span className="text-xl">
              A {profile?.role || "Software Developer"}
            </span>

            <p className="max-w-[500px] mb-9 text-white/80">
              {profile?.description ||
                "I design and build elegant digital experiences, combining strong technical expertise with proficiency in multiple programming languages and cutting-edge tools."}
            </p>

            {/* button and socials */}
            <div className="flex flex-col xl:flex-row items-center gap-8">
              {profile?.resumeUrl ? (
                <Link href={profile.resumeUrl} target="_blank">
                  <Button
                    variant="outline"
                    size="lg"
                    className="uppercase flex items-center gap-2"
                  >
                    <span>Download Resume</span>
                    <FiDownload />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  className="uppercase flex items-center gap-2"
                  disabled
                >
                  <span>Download Resume</span>
                  <FiDownload />
                </Button>
              )}

              <div className="mb:8 xl:mb-0">
                <Social
                  containerStyles="flex gap-6"
                  iconStyles="w-9 h-9 border border-accent rounded-full flex justify-center items-center text-accent text-base hover:bg-accent hover:text-primary hover:transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* photo */}
          <div className="order-1 xl:order-none mb-6 xl:mb-0">
            <Photo />
          </div>
        </div>
      </div>

      <Stats />
    </section>
  );
};

export default Home;
