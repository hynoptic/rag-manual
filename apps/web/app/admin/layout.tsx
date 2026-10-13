import { getProfile } from "@/lib/api/profile";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return children;
}
