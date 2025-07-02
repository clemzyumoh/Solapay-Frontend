// components/Footer.tsx
import { FaGithub } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { TbBrandLinkedinFilled } from "react-icons/tb";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="  lg:mb-5 mb-20 w-full lg:w-[80vw] rounded-2xl  py-6   px-4  shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Branding */}
        <div className="flex items-end-safe justify-items-end-safe">
         
          <Image src="/logo4.svg" alt="picture of logo" className="w-12 mb-2 h-12" />

          <h1 className="font-bold text-2xl dark:bg-gradient-to-br from-[#9945ff] via-[#14f195] to-[#14f195] dark:text-transparent bg-clip-text ">
            OLAPAY
          </h1>
        </div>

        {/* Center Info */}
        <div className="text-sm text-center lg:text-left">
          <p>© 2025 SolaPay • Built on Solana</p>
          <div className="flex gap-4 justify-center md:justify-start mt-1">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>

        {/* Socials and Badge */}
        <div className="flex flex-col lg:items-end items-center gap-2">
          <div className="flex gap-4">
            <a
              href="https://x.com/UmohPet"
              target="_blank"
              rel="noopener noreferrer">
              <BsTwitterX className="w-5 h-5 hover:text-[#14f195]" />
            </a>
            <a
              href="https://github.com/clemzyumoh"
              target="_blank"
              rel="noopener noreferrer">
              <FaGithub className="w-5 h-5 hover:text-[#14f195]" />
            </a>
            <a
              href="https://www.linkedin.com/in/clement-umoh-a17b8629b/"
              target="_blank"
              rel="noopener noreferrer">
              <TbBrandLinkedinFilled className="w-6 h-6 hover:text-[#14f195]" />
            </a>
          </div>
          <div className="text-xs text-gray-500">Powered by Solana Pay</div>
        </div>
      </div>
    </footer>
  );
}
