"use client"
import React from 'react'
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/navbar';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { fetchBlogsApi } from "../api/blogApi";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext"



const Blogscontainer = () => {

    const { token } = useAuth();
    // console.log(token)
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!token) return;
        const fetchBlogs = async () => {
            try {
                const data = await fetchBlogsApi(pathname, token);
                setBlogs(data);
            } catch (error) {
                console.error("Error:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [pathname, token]);


    if (loading) {
        return (
            <div className="flex pt-16 justify-center ">
                {/* <img src="/Spinner.png" alt="loading..." style={{ filter: "hue-rotate(200deg)" }} /> */}
                <Image
                    src="/Spinner.svg"
                    alt="loading"
                    width={100}
                    height={100}
                    style={{ filter: "hue-rotate(200deg)" }}

                />
            </div>
        );
    }


    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>
            <div className="min-h-screen bg-[#faf7f2] pt-16">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    {!blogs || blogs.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-2xl font-serif text-[#b0a090] italic">
                                No stories yet...
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => {
                                let imageUrl = "";

                                try {
                                    if (blog.image && blog.image.length > 0) {
                                        const img = blog.image[0];

                                        if (typeof img === "string") {
                                            imageUrl = img;
                                        } else if (img?.url) {
                                            imageUrl = img.url;
                                        } else if (img?.path) {
                                            imageUrl = img.path;
                                        } else if (img?.filename) {
                                            imageUrl = `/uploads/${img.filename}`;
                                        }

                                        imageUrl = imageUrl.replace(/\\/g, "/");
                                        if (!imageUrl.startsWith("/")) {
                                            imageUrl = `/${imageUrl}`;
                                        }
                                    }
                                } catch (err) {
                                    console.log("Image error:", err);
                                }

                                const fullImageUrl = imageUrl
                                    ? `http://localhost:5000${imageUrl}`
                                    : "";

                                return (
                                    <div
                                        key={blog.id}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#ede6db] hover:shadow-md transition-shadow duration-300 flex flex-col"
                                    >
                                        <div className="w-full h-52 bg-[#f0ebe3] overflow-hidden">
                                            {fullImageUrl ? (
                                                <img
                                                    src={fullImageUrl}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 hover:cursor-pointer"
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                        console.log("Failed to load:", fullImageUrl);
                                                    }}
                                                    onClick={() => router.push(`/blog/${blog.id}`)}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center hover:cursor-pointer"
                                                    onClick={() => router.push(`/blog/${blog.id}`)}>
                                                    <span className="text-4xl text-[#c9b99a]">✦</span>
                                                </div>
                                            )}
                                        </div>


                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-xl font-serif text-[#1a1208] leading-snug mb-3 line-clamp-2">
                                                {blog.title}
                                            </h3>
                                            <p className="text-sm text-[#6b5e50] leading-relaxed line-clamp-3 flex-1">
                                                {blog.content}
                                            </p>

                                            <div className="mt-5 pt-4 border-t border-[#ede6db]">
                                                <button className="text-xs tracking-widest uppercase text-[#a0896e] font-semibold hover:text-[#1a1208] transition-colors duration-200 cursor-pointer"
                                                    onClick={() => router.push(`/blog/${blog.id}`)}>
                                                    Read More →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Blogscontainer

