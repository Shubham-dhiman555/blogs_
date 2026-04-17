"use client"
import axios from "axios";
const BASE_URL = "http://localhost:5000";
import { toast } from "react-toastify";
// export const getToken = () => localStorage.getItem("token");


// Fetch a single blog by ID 
export const fetchBlogById = async (id, token) => {
    // const token = getToken()

    try {
        const res = await axios.get(`${BASE_URL}/blogs/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;        //  blog, totalLikes, likes 

    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch blog"
        );
    }
};

//  Fetch all comments for a blog 
export const fetchCommentsByBlogId = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}/comments/blog/${id}`);

        return res.data.data || []; // same logic as before
    } catch (error) {
        throw new Error("Failed to fetch comments");
    }
};

//  top level comment 
export const postComment = async (blogId, content, token) => {
    try {
        // const token = getToken();
        // console.log(token)
        const res = await axios.post(
            `${BASE_URL}/comments`,
            { content, blogId },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        if (error.response) {
            console.error("Backend Error:", error.response.data);
            throw new Error(error.response.data.message || "Failed to post comment");
        } else {
            console.error("Error:", error.message);
            throw new Error("Something went wrong");
        }
    }
};

// reply comment 
export const postReply = async (blogId, parentId, content, token) => {
    try {
        // const token = getToken();
        const res = await axios.post(
            `${BASE_URL}/comments`,
            {
                content,
                parentid: parentId,
                blogId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data; // { data: savedReply }
    } catch (error) {
        throw new Error("Failed to post reply");
    }
};

//  Delete a comment or reply by ID 
export const deleteComment = async (commentId, token) => {
    // const token = getToken();
    try {
        const res = await axios.delete(`${BASE_URL}/comments/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log(res.data)
        return res.data
    }
    catch (error) {
        throw new Error("Failed to delete comment");
    }
};

// blog like unlike  
export const toggleLike = async (blogId, token) => {
    // const token = getToken();
    try {
        const res = await axios.post(`${BASE_URL}/blogs/${blogId}/like`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        return res.data
    }
    catch (error) {
        throw new Error("Failed to toggle like");
    }
};

// Fetch blogs 
export const fetchBlogsApi = async (pathname, token) => {
    let url = "";

    if (pathname === "/myblogs") {
        url = "/users/me/blogs";
    } else if (pathname === "/home" || pathname === "") {
        url = "/blogs";
    } else {
        throw new Error("Invalid route");
    }
    const res = await axios.get(`${BASE_URL}${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    // console.log(res)
    if (pathname === "/myblogs") {
        return res.data.data.blogs;
    }
    if (pathname === "/home" || pathname === "") {
        return res.data;
    }
};

//update blog api.
export const updateBlogApi = async (id, updatedData, token) => {
    // const token = localStorage.getItem("token");
    // const token = getToken();
    try {
        const res = await axios.put(
            `${BASE_URL}/blogs/${id}`,
            updatedData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    }
    catch (error) {
        // console.log(error.response.data);
        const backendError = error.response?.data?.error || "Something went wrong";
        toast.error(backendError);
        throw new Error("Failed to upload data");
        console.log("API Error:", error.response?.data || error.message);
    }
};

// create blog
export const createBlogApi = async (data, token) => {
    try {
        const res = await axios.post(`${BASE_URL}/blogs`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.log("API Error:", error.response?.data || error.message);
        throw error;
    }
};

//get all categories.
export const getAllCategories = async (token) => {
    try {
        const res = await axios.get(`${BASE_URL}/categories`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        },);
        return res.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Function to fetch user info
export const fetchUser = async (token,id) => {
    if (!token) {
        throw new Error("No token provided");
    }

    try {
        const response = await axios.get(`${BASE_URL}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // directly return useful data

    } catch (error) {
        // Better error handling
        const message =
            error.response?.data?.message || error.message || "Something went wrong";

        throw new Error(message); // throw instead of console.log
    }
};

