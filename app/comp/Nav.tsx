"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";

const Nav = () => {
  const pathname = usePathname();
  const { currentUser, removeUser } = useUser();
  if (!pathname) return null;
  const router = useRouter();
  if (pathname === "/") return null; //doesnt display nav on login page

  return (
    <div className="w-full drop-shadow-lg bg-white border-b border-gray-800 flex items-center justify-start flex-row">
      <Link href="/" className="flex items-center justify-start ml-10">
        <Image
          src="/logo.png"
          alt="Needs Connect Logo"
          width={30}
          height={30}
        />
        <h1 className="text-black text-lg notable-regular p-4">
          Needs Connect
        </h1>
      </Link>


      <div className="flex flex-row items-center justify-end w-full">
        {currentUser?.role==='user' && (<Link href="/needs" className="mr-4 text-sm notable-regular hover:scale-103 transition-transform">
          Needs
        </Link>)}

        <Link href={currentUser?.role==='admin' ? "/cupboard" : "/basket"} className="mr-4 text-sm notable-regular hover:scale-103 transition-transform">
            {currentUser?.role==='admin' ? "Cupboard" : "Basket"}
        </Link>
        <Link href="/dashboard" className="mr-4 text-sm notable-regular hover:scale-103 transition-transform">
          Dashboard
        </Link>
        <Link href="/community" className="mr-4 text-sm notable-regular hover:scale-103 transition-transform">
          Community
        </Link>
        <Link href="/" className="text-sm text-red-600 mr-10 hover:underline cursor-pointer" >
          <ArrowLeftEndOnRectangleIcon className="h-8 w-8 hover:scale-105 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default Nav;
