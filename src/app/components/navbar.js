"use client"
import React from 'react'
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { useAuth } from "../../context/AuthContext";



const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMyblogsPage, setIsMyblogsPage] = useState(false);
    const { logout } = useAuth();  //logout context

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setShow(false);
            } else {
                setShow(true);
            }
            setLastScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        setIsMyblogsPage(pathname === "/myblogs");
    }, [pathname]);

    const router = useRouter();

    const handleLogout = () => {
        logout();  // This clears the token in context AND localStorage
        Cookies.remove("token");
        router.push("/login");
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-10 ">
            <header
                className={`w-full border border-[#ede6db] bg-[#faf7f2]/90 py-3 px-2 shadow-sm backdrop-blur-lg rounded-2xl transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"}`}
            >
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex container items-center justify-between">
                        <div className="flex items-center">
                            <button
                                className="sm:hidden flex flex-col space-y-1.5 mr-3 p-1"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <span className="block w-5 h-0.5 bg-[#1a1208] rounded-full"></span>
                                <span className="block w-5 h-0.5 bg-[#1a1208] rounded-full"></span>
                                <span className="block w-5 h-0.5 bg-[#1a1208] rounded-full"></span>
                            </button>

                            {isOpen && (
                                <div className="sm:hidden absolute top-full left-0 mt-2 w-44 bg-[#faf7f2] border border-[#ede6db] shadow-md rounded-xl flex flex-col overflow-hidden">
                                    <Link href="/home" className="px-4 py-3 text-sm text-[#1a1208] font-medium hover:bg-[#f0ebe3] transition-colors duration-150">Home</Link>
                                    <Link href="/myblogs" className="px-4 py-3 text-sm text-[#1a1208] font-medium hover:bg-[#f0ebe3] transition-colors duration-150">MyBlogs</Link>
                                </div>
                            )}
                            <div className="hidden sm:flex flex-row items-center gap-1">
                                <Link href="/home" className="px-4 py-2 rounded-xl text-sm font-medium text-[#1a1208] tracking-wide hover:bg-[#f0ebe3] transition-colors duration-200">Home</Link>
                                <Link href="/myblogs" className="px-4 py-2 rounded-xl text-sm font-medium text-[#1a1208] tracking-wide hover:bg-[#f0ebe3] transition-colors duration-200">MyBlogs</Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-3">
                            {isMyblogsPage && (
                                <Link href="/createblog">
                                    <button className="bg-[#1a1208] text-[#faf7f2] px-5 py-2 text-xs tracking-widest uppercase font-semibold rounded-xl hover:bg-[#a0896e] transition-colors duration-200 cursor-pointer">
                                        Create Blog
                                    </button>
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 text-xs tracking-widest uppercase font-semibold rounded-xl border border-[#1a1208] text-[#1a1208] hover:bg-[#1a1208] hover:text-[#faf7f2] transition-colors duration-200 cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Navbar;
