import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProductDemoApp } from "@/components/demo/ProductDemoApp";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Live Product Demo",
  description: "Your Forge coach dashboard or client app.",
};

export default async function ProductDemoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <ProductDemoApp currentUser={{ id: user.id, name: user.name, role: user.role }} />;
}
