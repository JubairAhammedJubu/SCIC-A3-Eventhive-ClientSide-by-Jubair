"use client";

import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {Shield, User as UserIcon, Loader2} from "lucide-react";
import DataTable, {type Column} from "@/components/dashboard/DataTable";
import {fetchUsers, updateUserRole} from "@/service/admin.service";
import type {AppUser} from "@/types/user";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleRole = async (u: AppUser) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    setActionLoading(u._id);
    try {
      await updateUserRole(u._id, newRole);
      setUsers((prev) => prev.map((x) => (x._id === u._id ? {...x, role: newRole} : x)));
      toast.success(`${u.username} is now ${newRole}`);
    } catch (err: any) {
      toast.error(err.message || "Could not update role");
    } finally {
      setActionLoading(null);
    }
  };

  const columns: Column<AppUser>[] = [
    {
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {u.username?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{u.username}</p>
            <p className="text-xs text-gray-400 truncate max-w-[160px]">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      render: (u) => (
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
            u.role === "admin"
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
              : "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
          }`}
        >
          {u.role === "admin" ? (
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <UserIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          )}
          <span
            className={`text-xs font-semibold capitalize ${
              u.role === "admin" ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"
            }`}
          >
            {u.role}
          </span>
        </div>
      ),
    },
    {header: "Joined", render: (u) => new Date(u.createdAt).toLocaleDateString("en-US", {day: "numeric", month: "short", year: "numeric"})},
    {
      header: "Actions",
      render: (u) => (
        <button
          onClick={() => toggleRole(u)}
          disabled={!!actionLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {actionLoading === u._id && <Loader2 className="w-3 h-3 animate-spin" />}
          Make {u.role === "admin" ? "user" : "admin"}
        </button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="p-6 pt-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage users</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">All registered accounts.</p>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <DataTable columns={columns} data={users} keyField={(u) => u._id} emptyMessage="No users found." />
        )}
      </div>
    </div>
  );
}
