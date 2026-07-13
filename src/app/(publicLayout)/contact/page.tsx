"use client";

import {useState} from "react";
import toast from "react-hot-toast";
import {Mail, Phone, MapPin} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent — we'll get back to you soon.");
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contact us</h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Questions about hosting, bookings, or anything else — reach out.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required placeholder="Your name" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@example.com" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" required placeholder="How can we help?" className="mt-1.5" />
          </div>
          <Button type="submit" variant="gradient" disabled={submitting}>
            {submitting ? "Sending..." : "Send message"}
          </Button>
        </form>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Email</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">support@eventhive.app</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Phone</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 010-2024</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Office</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                144 Market Street, San Francisco, CA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
