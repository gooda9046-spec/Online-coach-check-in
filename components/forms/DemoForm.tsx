"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

export function DemoForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent-bright" />
        <p className="text-foreground">
          Thanks! In a live product this would notify our team to follow up within one business
          day. This concept preview doesn&apos;t send a real request.
        </p>
        <Button variant="outline" asChild>
          <Link href="/product-demo">
            Try the live demo now <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" type="text" placeholder="Alex Rivera" required />
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="company">Business name</Label>
          <Input id="company" name="company" type="text" placeholder="Ironline Performance" />
        </div>
        <div>
          <Label htmlFor="clients">Number of clients</Label>
          <Select id="clients" name="clients" defaultValue="1-10">
            <option value="1-10">1–10</option>
            <option value="11-50">11–50</option>
            <option value="51-150">51–150</option>
            <option value="150+">150+</option>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="message">What would you like to see?</Label>
        <Textarea id="message" name="message" placeholder="Tell us about your current setup…" />
      </div>
      <Button type="submit" className="w-full">
        Request Demo
      </Button>
    </form>
  );
}
