"use client"

import LoginSide from "@/components/LoginSide";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for the authToken in cookies on mount and redirect if exists
  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        Cookies.set("authToken", token, { expires: 2 }); // token expires in 2 hours
        router.push("/dashboard");
      } else {
        setError("Invalid Credentials, Please Try Again");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [username, password, router]);

  return (
    <div className="flex h-screen">
      <LoginSide />

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-center text-3xl font-semibold text-gray-800">Login</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mt-4 border rounded-md bg-gray-200 text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mt-4 border rounded-md bg-gray-200 text-black"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 mt-4 rounded-md hover:bg-gray-700 transition relative"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#fff" loading={loading} /> : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
