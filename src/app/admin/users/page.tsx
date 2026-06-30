"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Search, Trash2, Shield, User, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface UserType {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count: {
    orders: number;
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  
  // Modals / Actions
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
      });

      const res = await fetch(`/api/admin/users?${query}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error: any) {
      console.error(error);
      toast.error("Could not load users list");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  // Toggle user role (USER <-> ADMIN)
  const handleToggleRole = async (user: UserType) => {
    setUpdatingRole(user.id);
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update role");
      }

      toast.success(`Role updated successfully for ${user.name || user.email}`);
      
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update user role");
    } finally {
      setUpdatingRole(null);
    }
  };

  // Delete User Confirmation Action
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setSelectedUser(null);
      // Refresh list
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Could not delete user");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <AdminPageHeader
        title="User Management"
        description="View registers, change permissions, and delete profiles."
      />

      {/* Filters & Actions Panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass p-4 rounded-2xl">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-white/5 border border-border/40 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Role Filter */}
        <div className="w-full sm:w-auto flex justify-end">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-44 bg-white/5 border border-border/40 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 transition-all"
          >
            <option value="" className="bg-background">All Roles</option>
            <option value="USER" className="bg-background">Users Only</option>
            <option value="ADMIN" className="bg-background">Admins Only</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-white/5">
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Orders Count</th>
                <th className="py-3 px-6">Joined Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Loader2 className="animate-spin text-brand-purple mx-auto" size={32} />
                    <p className="text-xs text-muted-foreground mt-2">Loading user directories...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No users match current filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-all">
                    {/* User profile detail */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-border/40 text-muted-foreground">
                          <User size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-sm">
                            {user.name || "Unnamed User"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role badge with inline click-toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleRole(user)}
                        disabled={updatingRole === user.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          user.role === "ADMIN"
                            ? "bg-brand-purple/10 text-brand-purple border-brand-purple/20 hover:bg-brand-purple/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20"
                        }`}
                      >
                        {updatingRole === user.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : user.role === "ADMIN" ? (
                          <Shield size={12} />
                        ) : (
                          <User size={12} />
                        )}
                        {user.role}
                      </button>
                    </td>

                    {/* Orders */}
                    <td className="py-4 px-6 font-medium text-foreground">
                      {user._count.orders} order(s)
                    </td>

                    {/* Join Date */}
                    <td className="py-4 px-6 text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions (Delete icon) */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/10 text-xs">
            <span className="text-muted-foreground">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} users)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || loading}
                className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                disabled={page === pagination.totalPages || loading}
                className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete User"
        message={`Are you sure you want to permanently delete user: ${
          selectedUser?.name || selectedUser?.email
        }? This will remove all their profile data and is irreversible.`}
        confirmText="Permanently Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        isLoading={deleting}
      />
    </div>
  );
}
