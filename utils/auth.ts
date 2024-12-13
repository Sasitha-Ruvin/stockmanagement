import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

const SECRET_KEY = "secretKey";

// A helper function to validate the token
export async function validateToken(req: Request) {
  const token = Cookies.get("authToken");
  
  if (!token) {
    // Redirect to login if no token found
    return NextResponse.redirect("/");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    // Optionally attach the user data from the token to the request context
    return decoded; // You can pass it down as props or use in the backend
  } catch (error) {
    // Invalid token or expired
    return NextResponse.redirect("/login");
  }
}
