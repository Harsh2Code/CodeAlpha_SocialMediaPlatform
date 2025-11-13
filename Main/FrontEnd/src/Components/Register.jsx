import React, { useState } from "react";
import { Button } from "./ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import API_BASE_URL from "../lib/apiConfig.js";

export default function Register({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Register error response:", errorText);
        throw new Error("Registration failed: " + errorText);
      }
      const data = await response.json();
      // You can handle post-registration logic here, e.g., auto-login or redirect
      alert("Registration successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className={`h-[600px] w-[400px] flex flex-col mx-auto gap-6 border-1 rounded-2xl ${className}`}
      {...props}
      style={{ height: "32rem",marginTop: '8rem', backgroundColor: '#e2e2e2ff', borderRadius: '20px',boxShadow: 'rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px;'}}
    >
      <Card style={{backgroundColor: '#f7f7f7ff',padding : '0 1rem', height: '100%', borderRadius: '10px', boxShadow: 'rgba(51, 51, 51, 0.79) 0px 4px 24px -12px'}}>
        <CardHeader className="text-center gap-3 text-inidigo-600" style={{ marginTop: "40px" }}>
          <CardTitle className=" text-[1.7rem] text-[#111]" >
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent style={{backgroundColor: '#f7f7f7ff'}}>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mt-2">
              <div className="mt-2 grid gap-3 has-[input:focus-within]:outline-indigo-600">
                <Label className="mt-[40px] ml-[2%] text-[1rem] text-[#232323ff]" htmlFor="username" >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              {/* #232323ff */}
              <div className="mt-2 grid gap-3 has-[input:focus-within]:outline-indigo-600">
                <Label className="ml-[2%] text-[1rem] text-[#232323ff]" htmlFor="email" >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label className="ml-[2%] text-[1rem] text-[#232323ff]" htmlFor="password" >
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              {error && <div className="text-red-600 text-center">{error}</div>}
              <Button type="submit" className="w-[80%] mx-auto my-[20px] px-[1.5rem] py-[1rem] bg-[#ffffff] focus:bg-[#1e1d1dff] rounded-[8rem]" style={{border: 'none',boxShadow: 'inset rgba(201, 201, 201, 1) 2px -2px 8px' }}>
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
