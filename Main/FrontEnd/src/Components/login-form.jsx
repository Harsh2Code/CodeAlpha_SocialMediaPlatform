import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import { AuthContext } from "../contexts/AuthContext";
import API_BASE_URL from "../lib/apiConfig.js";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/api-token-auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login error response:", errorText);
        throw new Error("Invalid credentials: " + errorText);
      }
      const data = await response.json();
      // Fetch full user data after login
      const userResponse = await fetch(`${API_BASE_URL}/api/users/me/`, {
        headers: {
          'Authorization': `Token ${data.token}`,
        },
      });
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      login(data.token, userData); // Store token and full user data in context
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className={`h-[600px] w-[400px] flex flex-col justify-evenly mx-auto gap-6 border-1 rounded-[0.5vw] ${className}`}
      {...props}
      style={{ height: "30rem",marginTop: '3rem', backgroundColor: '#f7f7f7ff', boxShadow: 'rgba(51, 51, 51, 0.79) 0px 4px 24px -12px' }}
    >
      <Card style={{backgroundColor: '#f7f7f7ff',padding : '0 1rem', height: '100%'}}>
        <CardHeader className="text-center gap-3 text-inidigo-600" style={{ marginTop: "40px" }}>
          <CardTitle className="text-[1.7rem] text-[#232323ff]">
            Welcome back
          </CardTitle>
        </CardHeader>
        <CardContent style={{backgroundColor: '#f7f7f7ff'}}>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mt-2">
              <div className="mt-2 grid gap-3 has-[input:focus-within]:outline-indigo-600">
                <Label className="mt-[40px] ml-[2%] text-[1rem] text-[#232323ff]  " htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label className="mt-[20px] ml-[2%] text-[1rem] text-[#232323ff] " htmlFor="password">
                    Password
                  </Label>
                  <a href="#" className="ml-auto mt-[20px] text-[#232323ff] text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-[#232323ff] text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              {error && <div className="text-red-600 text-center">{error}</div>}
              <Button type="submit" className="w-[80%] mx-auto my-[20px] px-[1.5rem] text-[#232323ff] py-[1rem] bg-[#ffffff] focus:bg-[#1e1d1dff] rounded-[8rem]" style={{border: 'none', color: 'black',boxShadow: 'inset rgba(201, 201, 201, 1) 2px -2px 8px'}}>
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="my-auto text-[#232323ff] text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
