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
      className={`h-[600px] w-[400px] flex flex-col mx-auto gap-6 border-1 rounded-[0.5vw] ${className}`}
      {...props}
      style={{ height: "450px", borderColor: "#6563f1bc", backgroundColor: '#200054' }}
    >
      <Card style={{backgroundColor: '#200054',padding : '0 1rem', height: ''}}>
        <CardHeader className="text-center gap-3 text-inidigo-600" style={{ marginTop: "40px" }}>
          <CardTitle className="text-xl text-indigo-600" style={{ color: "#CDB384" }}>
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent style={{backgroundColor: '#200054'}}>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mt-2">
              <div className="mt-2 grid gap-3 has-[input:focus-within]:outline-indigo-600">
                <Label className="mt-[40px] ml-[2%]" htmlFor="username" style={{ color: "#CDB384" }}>
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
              <div className="mt-2 grid gap-3 has-[input:focus-within]:outline-indigo-600">
                <Label className="ml-[2%]" htmlFor="email" style={{ color: "#CDB384" }}>
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
                  <Label className="ml-[2%]" htmlFor="password" style={{ color: "#CDB384" }}>
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
              <Button type="submit" className="w-[30%] mx-auto my-[20px]">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
