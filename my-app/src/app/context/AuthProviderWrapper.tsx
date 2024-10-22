"use client";
import { AuthContextProvider } from "./authContext";

export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
