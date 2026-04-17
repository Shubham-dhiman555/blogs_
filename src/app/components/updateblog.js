"use client";
import React, { useState } from "react";
import { updateBlogApi } from '@/app/api/blogApi';
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { fetchBlogById } from "@/app/api/blogApi";
import { useAuth } from "../../context/AuthContext";

const Updateblog = () => {
    const { token } = useAuth();
    const blogId = useParams().id
    const [preview, setPreview] = useState(null);
    const [oldformData, setoldFormData] = useState({
        title: "",
        slug: "",
        content: "",
        image: "",
    });


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
            setFormData({ ...formData, image: e.target.files[0] })
        } else {
            setPreview(null);
        }
    };


    useEffect(() => {
        const loadBlog = async () => {
            try {
                const result = await fetchBlogById(blogId);

                if (!result?.blog) return;

                const blog = result.blog;

                setFormData({
                    title: blog.title || "",
                    content: blog.content || "",
                    slug: blog.slug || "",
                    image: blog.image?.[0] || ""
                });

                setoldFormData({
                    title: blog.title || "",
                    content: blog.content || "",
                    slug: blog.slug || "",
                    image: blog.image?.[0] || ""
                });

            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        if (blogId) {
            loadBlog();
        }
    }, [blogId]);

    const router = useRouter();
    // console.log(blogId)
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        image: "",
    });
    // console.log(formData)
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let tempErrors = {};

        //Title
        if (!formData.title.trim()) {
            tempErrors.title = 'Title is required*';
        } else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(formData.title)) {
            tempErrors.title = "Title can contain letters only, with a single space between words. No numbers, special characters, or extra spaces allowed.";
        } else if (formData.title.length > 15) {
            tempErrors.title = "Title length must be less than 15."
        }
        //slug
        if (!formData.slug.trim()) {
            tempErrors.slug = 'Slug is required*';
        } else if (formData.slug !== formData.slug.trim()) {
            tempErrors.slug = 'No spaces are allowed at the beginning or end.';
        } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
            tempErrors.slug = 'Slug can only contain lowercase letters, numbers, and single hyphens between words. It cannot start or end with a hyphen.';
        } else if (formData.slug.length > 20) {
            tempErrors.slug = 'Slug length must be less that 20.'
        }
        //content
        if (!formData.content.trim()) {
            tempErrors.content = 'Content is required*';
        } else if (formData.content != formData.content.trim()) {
            tempErrors.content = 'No spaces are allowed at the beginning or end.'
        } else if (formData.content.length < 10) {
            tempErrors.content = 'Content must be at least 10 characters';
        }
        setErrors(tempErrors);
        console.log(tempErrors);

        const hasChanges = Object.keys(formData).some(
            key => formData[key] !== oldformData[key]
        );
        if (!hasChanges) {
            console.log("you have not change any thing");
            toast.info("No changes were detected. Please update the fields before submitting.")
        }

        else {
            if (Object.keys(tempErrors).length === 0) {
                toast.success("Blog has been updated successfully.");
                try {
                    const data = new FormData();
                    data.append("title", formData.title);
                    data.append("slug", formData.slug);
                    data.append("content", formData.content);
                    // data.append("categoryId", formData.categoryId);
                    // data.append("view", formData.view || "0");
                    // data.append("userId", formData.userId);

                    if (formData.image) {
                        data.append("image", formData.image);
                    }

                    const result = await updateBlogApi(blogId, data, token);
                    console.log(result);
                    console.log(data.getAll("image", "title"));
                    // console.log(formData)
                    setTimeout(() => {
                        router.back();
                    }, 2000);
                }
                catch (error) {
                    console.log(error)
                }
            };
        }
    }





    return (
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4 py-12">
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-[#ede6db] p-8 md:p-12">

                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-serif text-[#1a1208] mb-1">Update Blog</h2>
                    {/* <p className="text-sm text-[#a0896e]"></p> */}
                    <div className="mt-3 mx-auto w-12 h-px bg-[#c9b99a]" />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="title" className="text-xs tracking-widest uppercase text-[#a0896e] font-semibold">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter your blog title..."
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-[#ede6db] rounded-lg px-4 py-3 text-[#1a1208] placeholder-[#c9b99a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9b99a] focus:border-transparent bg-[#faf7f2] transition"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm ">{errors.title}</p>
                        )}


                    </div>



                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs tracking-widest uppercase text-[#a0896e] font-semibold">
                            Slug
                        </label>
                        <input
                            type="text"
                            name="slug"
                            placeholder="your-blog-slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full border border-[#ede6db] rounded-lg px-4 py-3 text-[#1a1208] placeholder-[#c9b99a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9b99a] focus:border-transparent bg-[#faf7f2] transition"
                        />
                        {errors.slug && (
                            <p className="text-red-500 text-sm ">{errors.slug}</p>
                        )}
                    </div>



                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs tracking-widest uppercase text-[#a0896e] font-semibold">
                            Content
                        </label>
                        <textarea
                            name="content"
                            placeholder="Write your story here..."
                            value={formData.content}
                            onChange={handleChange}
                            rows={6}
                            className="w-full border border-[#ede6db] rounded-lg px-4 py-3 text-[#1a1208] placeholder-[#c9b99a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9b99a] focus:border-transparent bg-[#faf7f2] transition resize-none"
                        />
                        {errors.content && (
                            <p className="text-red-500 text-sm ">{errors.content}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs tracking-widest uppercase text-[#a0896e] font-semibold">
                            Cover Image
                        </label>
                        <div className="w-full border-2 border-dashed border-[#ede6db] rounded-lg px-4 py-6 bg-[#faf7f2] flex flex-col items-center justify-center gap-2 hover:border-[#c9b99a] transition">
                            <span className="text-3xl text-[#c9b99a]">✦</span>
                            <p className="text-xs text-[#a0896e]">Click to upload an image</p>
                            <input
                                type="file"
                                accept="image/*"
                                // onChange={(e) =>
                                //     setFormData({ ...formData, image: e.target.files[0] })
                                // }
                                onChange={handleFileChange}

                                className="text-xs text-[#a0896e] hover:cursor-pointer border-2 rounded-sm"
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{ width: "150px", height: "100px", objectFit: "cover", marginTop: "10px" }}
                                />
                            )}
                            {formData.image?.path && (
                                <img
                                    src={`http://localhost:5000/${formData.image.path.replace("\\", "/")}`}
                                    alt="Blog"
                                    style={{ width: "150px", height: "100px", objectFit: "cover", marginTop: "10px" }}
                                />
                            )}

                        </div>
                    </div>

                    <div className="w-full h-px bg-[#ede6db]" />

                    <button className="w-full bg-[#1a1208] text-[#faf7f2] py-3 rounded-lg text-xs tracking-widest uppercase font-semibold hover:bg-[#a0896e] transition-colors duration-300 cursor-pointer">
                        update blog
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Updateblog;







