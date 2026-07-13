"use client";

import {useState} from "react";
import toast from "react-hot-toast";
import {Mail} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're subscribed! Watch your inbox for new events.");
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1d24] p-8 text-center sm:p-12">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl eh-gradient-bg text-white">
          <Mail className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Never miss an event
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Get a weekly digest of new events near you. No spam, unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" variant="gradient">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
