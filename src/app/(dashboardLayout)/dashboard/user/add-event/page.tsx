"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {createEvent} from "@/service/events.service";

const categories = ["Music", "Business", "Food & Drink", "Sports", "Arts", "Education", "Festivals", "Tech"];

export default function AddEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: categories[0],
    date: "",
    location: "",
    price: "",
    capacity: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({...f, [field]: value}));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.shortDescription || !form.fullDescription || !form.date || !form.location) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await createEvent({
        ...form,
        price: Number(form.price) || 0,
        capacity: Number(form.capacity) || 0,
      });
      toast.success("Event created");
      router.push("/dashboard/user/my-events");
    } catch (err: any) {
      setError(err.message || "Could not create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 pt-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add a new event</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Fill in the details below — you can edit them later from My Events.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Event details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Downtown Jazz Night"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="shortDescription">Short description</Label>
              <Input
                id="shortDescription"
                value={form.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
                placeholder="One sentence that sums up the event"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="fullDescription">Full description</Label>
              <Textarea
                id="fullDescription"
                value={form.fullDescription}
                onChange={(e) => update("fullDescription", e.target.value)}
                placeholder="What should attendees know before booking?"
                className="mt-1.5 min-h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] px-3 text-sm text-gray-900 dark:text-gray-100"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Venue or city"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (Tk, 0 = free)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="0"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => update("capacity", e.target.value)}
                  placeholder="e.g. 100"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) => update("imageUrl", e.target.value)}
                placeholder="https://..."
                className="mt-1.5"
              />
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <Button className="mx-auto" type="submit" variant="gradient" disabled={submitting}>
              {submitting ? "Publishing..." : "Submit event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
