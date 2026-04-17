"use client";
import React from 'react'
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { loginUser } from '../api/AuthApi';
// import { useAuth } from "../../context/AuthContext";

// At the top, uncomment:
import { useAuth } from "../../context/AuthContext";

// In the component:


// In handleSubmit, after getting the token:




const Login = () => {
  const { login } = useAuth();//contextcghgfjhfhjjhgjhj
  const router = useRouter();
  // const { login } = useAuth();

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    // console.log(data);
  };

  const validate = () => {
    let newErrors = {};

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
  //     //   // console.log(validationErrors)
  //     setErrors(validationErrors);
  //     if (Object.keys(validationErrors).length === 0) {
  //       console.log("Form Data:", data);
  //       const res = await fetch("http://localhost:5000/users/login", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify(data)
  //       });
  //       const result = await res.json();
  //       if (res.ok) {
  //         // console.log("Success:", result);
  //         localStorage.setItem("token", result.token);   //token token token
  //          Cookies.set("token", result.token, {
  //           expires: 1,        // 1 day
  //           secure: true,      // only HTTPS
  //           sameSite: "Strict",// CSRF protection
  //         });
  //         // setData(data.token)
  //         router.push("/home");
  //       } else {
  //         router.replace("/login");      
  //         console.log("Error:", result.message);
  //       }
  //     }
  //     } catch (err) {
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

        const result = await loginUser(data);

        // localStorage.setItem("token", result.token);

        // Cookies.set("token", result.token, {
        //   expires: 1,
        //   secure: true,
        //   sameSite: "Strict",
        // });
        
        login(result.token);  // This sets the token in context AND localStorage
        Cookies.set("token", result.token, { expires: 1, secure: true, sameSite: "Strict" });
        router.push("/home");
        // login(result.token);

        router.push("/home");

      }
    } catch (err) {
      console.log("Error:", err.message);
      router.replace("/login");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex gap-3 md:gap-5 flex-col w-full max-w-md bg-white p-4 md:p-6 rounded-xl shadow-lg">

          <h2 className="text-2xl font-bold text-center mb-6">
            Login
          </h2>

          <div className="relative">
            <span htmlFor="email" className="block mb-1 font-medium">
              Email Address
            </span>
            <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              //  onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder=" "
              className=" px-2.5 pb-1.5 pt-3 w-full text-sm bg-transparent border border-gray-300 p-2 rounded-md focus:outline-none  focus:border-blue-300 peer"
            />
            <label htmlFor="email"
              className="absolute mt-4 text-sm text-gray-500 text-body duration-300 bg-white transform -translate-y-1 scale-75 top-1 z-10  bg-neutral-primary px-2  peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/3 peer-placeholder-shown:mt-5 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-1 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto ">Email<span className="text-red-500">*</span></label>

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>




          <div className="relative"  >
            <span htmlFor="password" className="block mb-1 font-medium">
              Password
            </span>
            <input
              id="password"
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              //  onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder=" "
              className="px-2.5 pb-1.5 pt-3 w-full text-sm bg-transparent rounded-base border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-0 focus:border-blue-300 peer"
            />
            <label htmlFor="password"
              className="absolute mt-4 text-sm text-gray-500 text-body duration-300 bg-white transform -translate-y-1 scale-75 top-1 z-10  bg-neutral-primary px-2  peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/3 peer-placeholder-shown:mt-5 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-1 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto ">password<span className="text-red-500">*</span></label>
            {errors.password && (
              <p className="text-red-500 text-sm ">{errors.password}</p>
            )}

          </div>




          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition hover:cursor-pointer">
            Login
          </button>


          <p className="text-center mt-4 text-sm">
            Dont have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Signup
            </Link>
          </p>

        </div>

      </div>
    </>
  )
}

export default Login
