"use client"
import { FaRegComments } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { RiDeleteBack2Line } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../context/AuthContext";


import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/navbar';
import {
    fetchBlogById,
    fetchCommentsByBlogId,
    postComment,
    postReply,
    deleteComment,
    toggleLike,
    fetchUser
} from '@/app/api/blogApi';


const insertReply = (comments, parentId, newReply) => {
    return comments.map((c) => {
        if (c.id === parentId) {
            return { ...c, replies: [...(c.replies || []), newReply] };
        }
        if (c.replies?.length > 0) {
            return { ...c, replies: insertReply(c.replies, parentId, newReply) };
        }
        return c;
    });
};


//this is recursive component.
const CommentNode = ({ comment, depth = 0, onDelete, onReply }) => {
    const [activeReply, setActiveReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replying, setReplying] = useState(false);


    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        setReplying(true);
        await onReply(comment.id, replyText);
        setReplyText("");
        setActiveReply(false);
        setReplying(false);
    };


    return (
        <div className={`mt-3 pb-1 bg-gray-50 rounded-xl ${depth > 0 ? "ml-8 border-l-2  border-gray-500 pl-3" : ""}`}>

            <div className="flex justify-between bg-gray-100 items-start rounded-lg pl-3 py-3  border-gray-200">
                {/* shadow-sm  */}
                <div className="flex-1">
                    {/* <p className="text-sm font-semibold text-gray-800">
                       User #{comment.userId}
                    </p> */}
                    <p className="text-sm font-semibold text-gray-800">
                        {comment.user?.username || "Unknown User"}
                    </p>

                    <p className="text-gray-700  px-3 font-serif text-sm">{comment.content}</p>
                </div>
                <button
                    className="cursor-pointer my-2 mx-2 pt-1.5 text-gray-500 ml-2 mt-1"
                    onClick={() => onDelete(comment.id)}
                    title="Delete"
                >
                    {/* <MdDelete size={20} /> */}
                    <RiDeleteBack2Line />
                </button>
            </div>


            <button
                onClick={() => setActiveReply((prev) => !prev)}
                className="text-xs text-blue-500 hover:text-blue-700  ml-2 cursor-pointer"
            >
                {activeReply ? "Cancel" : "↩ Reply"}
            </button>


            {activeReply && (
                <div className="mt-2 flex gap-2">
                    <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className=" flex-1 px-4 py-2 
                                                     border border-gray-300 
                                                      rounded-full 
                                                      bg-white
                                                      text-gray-700 placeholder-gray-400 
                                                      focus:outline-none focus:ring-2 focus:ring-blue-300 
                                                         focus:border-blue-400
                                                        shadow-sm hover:shadow-md
                                                            "
                        placeholder="Write a reply..."
                        onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                    />
                    <button
                        onClick={handleSendReply}
                        disabled={replying}
                        className="
                                        bg-white
                                        text-black
                                        border-gray-500
                                        pl-3 pr-2
                                        rounded-xl
                                        font-serif
                                        shadow-md 
                                        hover:shadow-gray-700
                                        hover:cursor-pointer"
                    >
                        {/* {replying ? "..." : "Send"} */}
                        <IoMdSend size={20}></IoMdSend>
                    </button>
                </div>
            )}


            {comment.replies?.length > 0 && (
                <div>
                    {comment.replies.map((reply) => (
                        <CommentNode
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            onDelete={onDelete}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};



const BlogDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const { token } = useAuth();
    //    console.log("token outside:",token)

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [update, setupdate] = useState(false);
   
    

    //fetch comments
    const loadComments = async () => {
        try {
            const data = await fetchCommentsByBlogId(id);
            // console.log(token)
            console.log(data)
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    };


    //Fetch blog 
    useEffect(() => {
        const loadBlog = async () => {
            if (!token) return;
            try {
                const result = await fetchBlogById(id);

                console.log(result);
                setBlog(result.blog);
                setLikes(result.totalLikes);
                setComments(result.blog.comments || []);
                // if(result.blog.userId===)

                // const token = localStorage.getItem("token");
                // console.log("token inside:",token)
                const decoded = jwtDecode(token);
                // console.log(decoded.id);
                // console.log(result.blog.userId)
                //logic to show update button
                if (decoded.id === result.blog.userId) {
                    setupdate(true);
                }
                if (token) {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    const userId = payload.id || payload.userId || payload.sub;
                    if (result.likes && Array.isArray(result.likes)) {
                        setLiked(result.likes.some((like) => like.userId === userId));
                    }
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) loadBlog();
    }, [id, token]);


    //Like
    const handleLike = async () => {
        // const token = localStorage.getItem("token");
        if (!token || likeLoading) return;
        setLikeLoading(true);
        setLiked((prev) => !prev);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
        try {
            const result = await toggleLike(id, token);
            setLiked(result.liked);
        } catch (err) {
            console.error("Like error:", err);
            setLiked((prev) => !prev);
            setLikes((prev) => (liked ? prev + 1 : prev - 1));
        } finally {
            setLikeLoading(false);
        }
    };


    // Post comment 
    const handleComment = async () => {
        // const token = localStorage.getItem("token");
        if (!token || commentLoading || !commentText.trim()) return;

        setCommentLoading(true);
        const text = commentText;
        setCommentText("");

        try {
            await postComment(id, text, token);
        } catch (err) {
            console.error("Comment error:", err);
        } finally {
            setCommentLoading(false);
            loadComments();
        }
    };


    //Reply 
    const handleReply = async (parentId, replyText) => {
        // const token = localStorage.getItem("token");
        if (!token || !replyText.trim()) return;

        try {
            const result = await postReply(id, parentId, replyText, token);

            const newReply = result.data
                ? { ...result.data, replies: [] }
                : { id: Date.now(), content: replyText, userId: "you", replies: [] };

            setComments((prev) => insertReply(prev, parentId, newReply));
        } catch (err) {
            console.error("Reply error:", err);
        }
    };


    // Delete
    const handleDeleteComment = async (commentId) => {
        // const token = localStorage.getItem("token");
        if (!token) return;

        setComments((prev) => prev.filter((c) => c.id !== commentId));

        try {
            await deleteComment(commentId, token);
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            loadComments();
        }
    };


    // Render 
    if (loading) return <p className="text-center mt-20 text-[#b0a090] italic">Loading...</p>;
    if (!blog) return <p className="text-center mt-20 text-[#b0a090] italic">Blog not found.</p>;

    let imageUrl = "";
    try {
        if (blog.image?.length > 0) {
            const img = blog.image[0];
            if (typeof img === "string") imageUrl = img;
            else if (img?.url) imageUrl = img.url;
            else if (img?.path) imageUrl = img.path;
            else if (img?.filename) imageUrl = `/uploads/${img.filename}`;
            imageUrl = imageUrl.replace(/\\/g, "/");
            if (!imageUrl.startsWith("/")) imageUrl = `/${imageUrl}`;
        }
    } catch (_) { }

    const fullImageUrl = imageUrl ? `http://localhost:5000${imageUrl}` : "";

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>

            {/* <MyContext.Provider value={{ title:"blog.title",slug:"blog.slug", }}>
                <Updateblog />
            </MyContext.Provider> */}


            <div className="min-h-screen bg-[#faf7f2] pt-16">
                <div className="max-w-3xl mx-auto px-6 py-14">
                    <div className="flex justify-between">
                        <button
                            onClick={() => router.back()}
                            className="text-xs tracking-widest uppercase text-[#a0896e] font-semibold hover:text-[#1a1208] mb-8 block hover:cursor-pointer"
                        >
                            ← Back
                        </button>


                        {update && (
                            // <Link href="/updateblog">
                            <button
                                className=" text-white font-serif mb-8 px-4 py-1 hover:cursor-pointer bg-gray-900 rounded-sm "
                                onClick={() => router.push(`/updateblog/${blog.id}`)}
                            >
                                Edit
                            </button>
                            // </Link>
                        )}

                    </div>


                    {/* Blog Image */}
                    {fullImageUrl ? (
                        <div className="w-full h-72 rounded-xl overflow-hidden mb-8">
                            <img
                                src={fullImageUrl}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-72 rounded-xl bg-[#f0ebe3] flex items-center justify-center mb-8">
                            <span className="text-6xl text-[#c9b99a]">✦</span>
                        </div>
                    )}

                    <h1 className="text-4xl font-serif text-[#1a1208] leading-tight mb-4">
                        {blog.title}
                    </h1>



                    <hr className="border-[#ede6db] my-4" />
                    <p className="text-[#6b5e50] leading-relaxed text-lg whitespace-pre-wrap break-words">
                        {blog.content}
                    </p>
                    <hr className="border-[#ede6db] my-4" />



                    {/* Like Button */}
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            onClick={handleLike}
                            disabled={likeLoading}
                            className={`flex items-center gap-2 px-4 py-0.5 rounded-full border transition-all duration-200 text-sm  font-serif
                                ${liked
                                    ? "bg-white border-rose-300 text-rose-500 hover:bg-rose-100"
                                    : "bg-white border-[#ede6db] text-gray-600 hover:border-gray-300 hover:text-rose-400"
                                } ${likeLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <span className={`text-lg transition-transform duration-200 ${liked ? "scale-125" : "scale-100"}`}>
                                {liked ? "♥" : "♡"}
                            </span>
                            <span>{likes} {likes === 1}</span>
                        </button>
                        <span
                            className="flex items-center font-serif  text-white max-w-30 sm:max-w-40 gap-2 px-3 py-1 sm:px-3 sm:py-2 rounded-full border border-gray-300 bg-black hover:bg-gray-500 hover:border-white text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer "
                            onClick={() => {
                                setShowComments((prev) => !prev);
                                if (!showComments) loadComments();
                            }}
                        >
                            <FaRegComments className="text-white mx-2.5" />
                        </span>

                    </div>


                    <div>
                        {showComments && (
                            <div className="mt-3">

                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleComment()}
                                        placeholder="Write a comment..."
                                        className=" flex-1 px-4 py-2
                                                      border border-gray-300
                                                       rounded-full
                                                       bg-white
                                                       text-gray-700 placeholder-gray-400
                                                       focus:outline-none focus:ring-2 focus:ring-blue-300
                                                     focus:border-blue-400
                                                        shadow-sm hover:shadow-md
                                                        transition-all duration-200"
                                    />
                                    <button
                                        onClick={handleComment}
                                        disabled={commentLoading}
                                        className="
                                         bg-white
                                         text-black
                                         border-gray-500
                                         pl-3 pr-2
                                         rounded-xl
                                         font-serif
                                         shadow-md 
                                         hover:shadow-gray-700
                                         hover:cursor-pointer"
                                    >
                                        {/* {commentLoading ? "Posting..." : "Post"} */}
                                        <IoMdSend size={20} />
                                    </button>
                                </div>


                                {comments?.length > 0 ? (
                                    comments.map((c) =>
                                        c ? (
                                            <CommentNode
                                                key={c.id}
                                                comment={c}
                                                depth={0}
                                                onDelete={handleDeleteComment}
                                                onReply={handleReply}
                                            />
                                        ) : null
                                    )
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No comments yet. Be the first!</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default BlogDetail;

























