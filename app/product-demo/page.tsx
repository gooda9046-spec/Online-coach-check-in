import type { Metadata } from "next";

import { ProductDemoApp } from "@/components/demo/ProductDemoApp";

export const metadata: Metadata = {
  title: "Live Product Demo",
  description: "Try the Forge coach dashboard — build a program, manage clients, and assign programs live in your browser.",
};

export default function ProductDemoPage() {
  return <ProductDemoApp />;
}
