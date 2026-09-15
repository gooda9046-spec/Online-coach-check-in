"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

export function ContactSalesForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent-bright" />
        <p className="text-foreground">
          Thanks! In a live product a sales rep would follow up shortly. This concept preview
          doesn&apos;t send a real request.
        </p>
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
          <Label htmlFor="company">Studio / team name</Label>
          <Input id="company" name="company" type="text" placeholder="Studio Forma" />
        </div>
        <div>
          <Label htmlFor="coaches">Number of coaches</Label>
          <Select id="coaches" name="coaches" defaultValue="2-5">
            <option value="2-5">2–5</option>
            <option value="6-15">6–15</option>
            <option value="16-50">16–50</option>
            <option value="50+">50+</option>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="message">What are you looking for?</Label>
        <Textarea id="message" name="message" placeholder="Team seats, white-labeling, migration…" />
      </div>
      <Button type="submit" className="w-full">
        Contact Sales
      </Button>
    </form>
  );
}
