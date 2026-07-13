import Image from "next/image";
import {CalendarDays} from "lucide-react";

export default function Gallery({imageUrl, title}: {imageUrl: string; title: string}) {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950/50 dark:to-violet-950/50 sm:h-96">
      {imageUrl ? (
        <Image src={imageUrl} alt={title} fill className="object-cover" priority />
      ) : (
        <div className="flex h-full items-center justify-center text-indigo-300 dark:text-indigo-700">
          <CalendarDays className="h-16 w-16" />
        </div>
      )}
    </div>
  );
}
