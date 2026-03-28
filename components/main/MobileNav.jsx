"use client";

import Link from "next/link";
import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "../ui/sheet";
import { usePathname } from "next/navigation";
import { CiMenuFries } from "react-icons/ci";

const links = [
  {
    name: "home",
    path: "/",
  },
  {
    name: "services",
    path: "/services",
  },
  {
    name: "resume",
    path: "/resume",
  },
  {
    name: "work",
    path: "/work",
  },
  {
    name: "contact",
    path: "/contact",
  },
];

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-32[px] text-accent" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
        {/* logo */}
        <div className="mt-16 mb-24 text-center text-2xl">
          <Link href="/">
            <h1 className="text-4xl font-semibold">
              Alif<span className="text-accent">.</span>
            </h1>
          </Link>
        </div>
        {/* nav */}
        <SheetClose asChild>
          <nav className="flex flex-col justify-center items-center gap-4">
            {links.map((link, index) => {
              return (
                <SheetClose asChild key={index}>
                  <Link
                    href={link.path}
                    className={` ${
                      link.path === pathname &&
                      "text-accent border-b-2 border-accent"
                    }
                  text-xl capitalize hover:text-accent transition-all`}
                  >
                    {link.name}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
