import React, { useState } from "react";
import { Button } from "/src/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card.jsx";
import { Input } from "/src/components/ui/Input.jsx";
import { Label } from "/src/components/ui/label.jsx";

export default function Register({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth, gender, nationality }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      setSuccess("Registration successful! You can now log in.");
      setUsername("");
      setEmail("");
      setPassword("");
      setDateOfBirth("");
      setGender("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className={`h-96 w-[25%] flex flex-col mx-auto gap-6 border-1 rounded-[1vw] ${className}`}
      {...props}
      style={{ height: "450px", borderColor: "#200054" }}
    >
      <Card style={{backgroundColor: '#200054'}}>
        <CardHeader className="text-center gap-3 text-inidigo-600" style={{ marginTop: "40px" }}>
          <CardTitle className="text-xl text-indigo-600" style={{ color: "white" }}>
            We are glad to have you!
          </CardTitle>
        </CardHeader>
        <CardContent style={{backgroundColor: '#200054', padding: '1rem'}}>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mt-2">
              <div className="mt-2 grid gap-3 has-[Input:focus-within]:outline-indigo-600">
                <Label className="mt-[40px] ml-[2%] font-bold " htmlFor="username" style={{ color: "white" }}>
                  User Name
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
              <div>
                <Label className="mt-[40px] ml-[2%]" htmlFor="username" style={{ color: "white" }}>
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="text"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div>
                <Label className="mt-[40px] ml-[2%]" htmlFor="username" style={{ color: "white" }}>
                  Password
                </Label>
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
              <div>
                <Label className="mt-[40px] ml-[2%]" htmlFor="firstName" style={{ color: "white" }}>
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div>
                <Label className="mt-[40px] ml-[2%]" htmlFor="lastName" style={{ color: "white" }}>
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div>
                <Label className="mt-[40px] ml-[2%]" htmlFor="username" style={{ color: "white" }}>
                  Gender
                </Label>
                <Input
                  id="gender"
                  type="text"
                  name="gender"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div>
                <Label className="mt-[40px] ml-[2%]" htmlFor="nationality" style={{ color: "white" }}>
                  Nationality
                </Label>
                <Input
                  id="nationality"
                  type="text"
                  name="nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div className="mt-2 grid gap-3 has-[Input:focus-within]:outline-indigo-600">
                <Label className="mt-[40px] ml-[2%]" htmlFor="dateOfBirth" style={{ color: "white" }}>
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  required
                  value={dateOfBirth || ""}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              
              {error && <div className="text-red-600 text-center">{error}</div>}
              {success && <div className="text-green-600 text-center">{success}</div>}
              <Button type="submit" className="w-full my-[20px]">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      <div className="my-auto text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4" style={{backgroundColor: '#200054', borderRadius: '1rem'}}>
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
      </Card>
    </div>
  );
}
