import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Civil Resolve Admin | Sign In",
  description: "Sign in to the Civil Resolve Admin Panel",
};

export default function SignIn() {
  return <SignInForm />;
}
