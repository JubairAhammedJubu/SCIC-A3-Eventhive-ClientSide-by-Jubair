"use client";

import type {ReactNode} from "react";
import {motion} from "framer-motion";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: (row: T) => string;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  keyField,
  emptyMessage = "Nothing here yet.",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-12 text-center text-sm text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1d24] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/40 text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className="px-4 py-3 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((row, i) => (
              <motion.tr
                key={keyField(row)}
                initial={{opacity: 0, x: -10}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: Math.min(i, 20) * 0.02}}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.header} className={`px-4 py-4 align-middle ${col.className || ""}`}>
                    {col.render(row)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
        <p className="text-xs text-gray-400">
          Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{data.length}</span> item
          {data.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
