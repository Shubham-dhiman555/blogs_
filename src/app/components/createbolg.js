"use client";
import React, { useEffect, useState } from "react";
import { createBlogApi, getAllCategories } from "../api/blogApi";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";  // Adjust path as needed


const Createblog = () => {
  const { token } = useAuth();
  // console.log(token)
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [categories, setcategories] = useState([])
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(token);
        console.log(data);
        setcategories(data)
        //   const total = data.length
        //   const arr = Array.from({ length: total }, (_, i) => i + 1);
        //   setdropdown(arr);
        // setCategories(data);

      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    image: "",
    userId: "",
    categoryId: "",
    view: ""
  });


  const handleChange = (e) => {
    // console.log(e.target.value)
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // let token = null;
    // if (typeof window !== "undefined") {
    //   const savedToken = localStorage.getItem("token");
    //   if (savedToken) token = savedToken;
    // }

    let tempErrors = {};
    //title
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
    //category
    if (!formData.categoryId || isNaN(formData.categoryId) || formData.categoryId < 1) {
      tempErrors.categoryId = 'Category is required.*';
    }

    setErrors(tempErrors);
    console.log(tempErrors);

    if (Object.keys(tempErrors).length === 0) {  //only hit api if error is zero
      toast.success("blog created sucessfully.")
      try {

        const data = new FormData();

        data.append("title", formData.title);
        data.append("slug", formData.slug);
        data.append("content", formData.content);
        data.append("categoryId", formData.categoryId);
        data.append("view", formData.view || "0");
        data.append("userId", formData.userId);

        if (formData.image) {
          data.append("image", formData.image);
        }

        const result = await createBlogApi(data, token);//call api function here 
        setTimeout(() => {
          router.back();
        }, 2000);

        console.log(data);
        console.log("Blog created:", result);


      } catch (err) {
        const backendErrorMsg = err.response?.data?.error || "Something went wrong";
        toast.error(backendErrorMsg);
        console.log("Error:", err.response?.data || err.message);
      }
    };
  }


  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-[#ede6db] p-8 md:p-12">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-serif text-[#1a1208] mb-1">Create Blog</h2>
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
                //   setFormData({ ...formData, image: e.target.files[0] })
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
            </div>
          </div>

          {/* <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest uppercase text-[#a0896e] font-semibold">
              Category ID
            </label>
            <input
              type="text"
              name="categoryId"
              placeholder="Enter category ID..."
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-[#ede6db] rounded-lg px-4 py-3 text-[#1a1208] placeholder-[#c9b99a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9b99a] focus:border-transparent bg-[#faf7f2] transition"
            />

            {errors.categoryId && (
              <p className="text-red-500 text-sm ">{errors.categoryId}</p>
            )}
          </div> */}


          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest uppercase text-[#a0896e] font-semibold">
              Category
            </label>

            <select
              name="categoryId" // SAME NAME (important)
              value={formData.categoryId}
              onChange={handleChange} // SAME FUNCTION
              className="w-full border border-[#ede6db] rounded-lg px-4 py-3 text-[#1a1208] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9b99a] focus:border-transparent bg-[#faf7f2] transition"
            >
              <option value="">Select Category</option>

              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {errors.categoryId && (
              <p className="text-red-500 text-sm">{errors.categoryId}</p>
            )}
          </div>
          <div className="w-full h-px bg-[#ede6db]" />

          <button className="w-full bg-[#1a1208] text-[#faf7f2] py-3 rounded-lg text-xs tracking-widest uppercase font-semibold hover:bg-[#a0896e] transition-colors duration-300 cursor-pointer">
            post blog
          </button>

        </form>
      </div>
    </div>
  );
};

export default Createblog;

















