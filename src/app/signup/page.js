"use client";
import React from 'react'
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../api/AuthApi"
// import AuthGuard from "../components/authguard.js";

const Signup = () => {
  const router = useRouter();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    // const { name, value } = e.target;

    if (e.target.name === "username" && /\s/.test(e.target.value)) {
      setErrors({ ...errors, username: "Spaces not allowed" });
    }
    else if (e.target.name === "username" && !/^[A-Za-z]+$/.test(e.target.value)) {
      setErrors({ ...errors, username: "Please enter valid username" });
    }
    else (e.target.name === "username") && setErrors({ ...errors, username: "" });

    if (e.target.name === "email" && !/\S+@\S+\.\S+/.test(e.target.value)) {
      setErrors({ ...errors, email: "Invalid email format" });
    }
    else (e.target.name === "email") && setErrors({ ...errors, email: "" });

    if (e.target.name === "password" && !/^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(e.target.value)) {
      setErrors({ ...errors, password: "Password must contain uppercase, lowercase and special character." });
    }
    else (e.target.name === "password") && setErrors({ ...errors, password: "" });
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
    // setErrors(validate());
  };

  const validate = () => {
    let newErrors = {};
    if (!data.username) newErrors.username = "Username required*";
    else if (/\s/.test(data.username)) {
      newErrors.username = "Spaces not allowed";
    }
    else if (!/^[A-Za-z]+$/.test(data.username)) {
      newErrors.username = "Please enter valid username";
    }

    if (!data.email) {
      newErrors.email = "Email is required*";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data.password) {
      newErrors.password = "Password is required*";
    } else if (!/^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(data.password)) {
      newErrors.password = "Password must contain uppercase, lowercase and special character.";
    }

    return newErrors;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const validationErrors = validate();
  //     setErrors(validationErrors);
  //     if (Object.keys(validationErrors).length === 0) {
  //       console.log("Form Data:", data);
  //       const res = await fetch("http://localhost:5000/users/register", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify(data)
  //       });

  //       const result = await res.json();
  //       if (res.ok) {
  //         console.log("Success:", result);
  //         alert("Registration successful! Please login.");
  //         router.push("/login");
  //       } else {
  //         alert(result.message);
  //         console.log("Error:", result.message);
  //       }
  //     }

  //   } catch (err) {
  //     console.log("Server Error:", err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validationErrors = validate();
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        console.log("Form Data:", data);

        const result = await registerUser(data);

        console.log("Success:", result);
        alert("Registration successful! Please login.");
        router.push("/login");
      }

    } catch (err) {
      console.log("Error:", err.message);
      alert(err.message);
    }
  };

  return (
    <>
      {/* <AuthGuard> */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full flex flex-col gap-5 max-w-md bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center ">
            Signup
          </h2>
          <div className="relative">
            <label className="block mb-1 font-medium">
              Name
            </label>
            <input
              id="name"
              name="username"
              type="text"
              placeholder=" "
              value={data.username}
              onChange={handleChange}
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-heading bg-transparent rounded-base border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-0 focus:border-blue-300 peer"

            />
            <label htmlFor="name"
              className="absolute mt-4 text-sm text-gray-500 text-body duration-300 bg-white transform -translate-y-1 scale-75 top-1 z-10  bg-neutral-primary px-2  peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/3 peer-placeholder-shown:mt-5 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-1 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Name<span className="text-red-500">*</span></label>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>


          <div className="relative">
            <label htmlFor="email" className="block mb-1 font-medium">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              placeholder=""
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-heading bg-transparent rounded-base border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-0 focus:border-blue-300 peer "
            />
            <label htmlFor="email"
              className="absolute mt-4 text-sm text-gray-500 text-body duration-300 bg-white transform -translate-y-1 scale-75 top-1 z-10  bg-neutral-primary px-2  peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/3 peer-placeholder-shown:mt-5 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-1 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email<span className="text-red-500">*</span></label>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              placeholder=" "
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-heading bg-transparent rounded-base border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-0 focus:border-blue-300 peer "
            />
            <label htmlFor="password"
              className="absolute mt-4 text-sm text-gray-500 text-body duration-300 bg-white transform -translate-y-1 scale-75 top-1 z-10  bg-neutral-primary px-2  peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/3 peer-placeholder-shown:mt-5 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-1 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">password<span className="text-red-500">*</span></label>

            {errors.password && (
              <p className="text-red-500 text-sm ">{errors.password}</p>
            )}
          </div>



          <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition hover:cursor-pointer"
            onClick={handleSubmit}
          >
            Signup
          </button>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
      {/* </AuthGuard> */}
    </>
  );
};

export default Signup;