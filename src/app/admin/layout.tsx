import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Route protection
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
