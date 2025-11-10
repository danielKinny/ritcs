import { NextResponse } from "next/server";

export const POST = async () => {
  const res = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );

  // Clear the 'user' cookie by setting it to an empty value and maxAge 0
  res.cookies.set({
    name: "user",
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
};
