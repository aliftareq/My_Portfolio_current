"use client";

import { usePathname } from "next/navigation";
import Header from "./main/Header.jsx";
import StairTransition from "./main/StairTransition.jsx";
import PageTransition from "./main/PageTransition.jsx";

export default function RouteLayout({ children }) {
  const pathname = usePathname();

  const skipTransitions =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  if (skipTransitions) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  }

  return (
    <>
      <Header />
      <StairTransition />
      <PageTransition>{children}</PageTransition>
    </>
  );
}