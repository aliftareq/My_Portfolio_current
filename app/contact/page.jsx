"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { fetchProfile } from "../../redux/features/profile/profileSlice";
import { fetchServices } from "../../redux/features/service/serviceSlice";

const Contact = () => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  const { profile } = useSelector((state) => state.profile);
  const { services } = useSelector((state) => state.service);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchProfile());
    dispatch(fetchServices());
  }, [dispatch]);

  // ✅ Contact Info
  const info = useMemo(
    () => [
      {
        icon: <FaPhoneAlt />,
        title: "Phone",
        description: profile?.phone || "No phone number added",
      },
      {
        icon: <FaEnvelope />,
        title: "Email",
        description: profile?.email || "No email address added",
      },
      {
        icon: <FaMapMarkerAlt />,
        title: "Address",
        description:
          profile?.currentAddress ||
          profile?.permanentAddress ||
          "No address added",
      },
    ],
    [profile],
  );

  // ✅ Services
  const serviceOptions = useMemo(() => {
    if (!Array.isArray(services)) return [];

    return services
      .filter((service) => service?.isActive)
      .map((service) => ({
        value: service.slug,
        label: service.title,
      }));
  }, [services]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          {/* ================= FORM ================= */}
          <div className="xl:w-[60%] order-2 xl:order-none">
            <form className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl">
              <h3 className="text-4xl text-accent">Let&apos;s Work Together</h3>

              <p className="text-white/60">
                {profile?.description ||
                  "Feel free to contact me for any project or collaboration."}
              </p>

              {mounted ? (
                <>
                  {/* inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="Firstname"
                    />
                    <Input type="text" name="lastName" placeholder="Lastname" />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      suppressHydrationWarning
                    />
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      suppressHydrationWarning
                    />
                  </div>

                  {/* service select */}
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Service" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select a Service</SelectLabel>

                        {serviceOptions.length > 0 ? (
                          serviceOptions.map((service) => (
                            <SelectItem
                              key={service.value}
                              value={service.value}
                            >
                              {service.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-service" disabled>
                            No active services
                          </SelectItem>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {/* message */}
                  <Textarea
                    className="h-[200px]"
                    name="message"
                    placeholder="Type your message here."
                    suppressHydrationWarning
                  />

                  {/* button */}
                  <Button type="submit" size="md" className="max-w-40">
                    Send Message
                  </Button>
                </>
              ) : (
                // skeleton (pre-hydration)
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-10 rounded-md bg-[#1f1f23]" />
                  <div className="h-10 rounded-md bg-[#1f1f23]" />
                  <div className="h-10 rounded-md bg-[#1f1f23]" />
                  <div className="h-10 rounded-md bg-[#1f1f23]" />
                  <div className="md:col-span-2 h-10 rounded-md bg-[#1f1f23]" />
                  <div className="md:col-span-2 h-[200px] rounded-md bg-[#1f1f23]" />
                  <div className="h-10 w-40 rounded-md bg-[#1f1f23]" />
                </div>
              )}
            </form>
          </div>

          {/* ================= INFO ================= */}
          <div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10 w-full max-w-[380px]">
              {info.map((item, index) => (
                <li key={index} className="flex items-center gap-6">
                  {/* icon */}
                  <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] text-accent rounded-md flex items-center justify-center shrink-0">
                    <div className="text-[28px]">{item.icon}</div>
                  </div>

                  {/* text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60">{item.title}</p>

                    {/* 🔥 FIXED TEXT WRAP */}
                    <h3 className="text-xl leading-snug whitespace-normal break-normal">
                      {item.description}
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
