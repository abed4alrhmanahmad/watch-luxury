import { useEffect, useState } from 'react';
import { adminAPI, AdminUser } from '@/services/adminApi';
import { useAuth } from '@/contexts/AuthContext';

interface UserForm {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'customer' | 'staff' | 'admin';
  password: string;
  is_active: boolean;
}

const initialForm: UserForm = {
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  role: 'customer',
  password: '',
  is_active: true,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UserForm>(initialForm);
  const { user: currentUser } = useAuth();

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await adminAPI.users.list(search ? { search } : undefined);
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreate = () => {
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (u: AdminUser) => {
    setForm({
      id: u.id,
      email: u.email,
      first_name: u.first_name,
      last_name: u.last_name,
      phone: u.phone || '',
      role: u.is_superuser ? 'admin' : u.is_staff ? 'staff' : 'customer',
      password: '',
      is_active: u.is_active,
    });
    setShowModal(true);
  };

  const saveUser = async () => {
    try {
      setSaving(true);
      const payload = {
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        is_active: form.is_active,
        is_staff: form.role === 'staff' || form.role === 'admin',
        is_superuser: form.role === 'admin',
        ...(form.password ? { password: form.password } : {}),
      };

      if (form.id) {
        await adminAPI.users.update(form.id, payload);
      } else {
        await adminAPI.users.create(payload);
      }

      setShowModal(false);
      setForm(initialForm);
      loadUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (target: AdminUser) => {
    if (target.id === currentUser?.id) {
      setError('You cannot delete your own account.');
      return;
    }
    if (!window.confirm(`Delete ${target.email}?`)) return;
    try {
      await adminAPI.users.delete(target.id);
      loadUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-3xl font-bold">User Management</h2>
          <p className="text-sm text-muted-foreground">Manage customers and staff permissions</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">Add User</button>
      </div>

      <div className="bg-card border border-border rounded-lg p-3 flex gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users" className="px-3 py-2 border border-border rounded-md bg-background text-sm" />
        <button onClick={loadUsers} className="px-4 py-2 rounded-md border border-border text-sm">Search</button>
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md">{error}</div>}

      <div className="bg-card border border-border rounded-lg overflow-auto">
        {loading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading users...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/60">
                  <td className="p-3">
                    <p className="font-medium">{u.full_name || `${u.first_name} ${u.last_name}`.trim()}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">{u.order_count}</td>
                  <td className="p-3">{u.is_active ? 'Active' : 'Disabled'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(u)} className="px-2 py-1 text-xs border border-border rounded-md">Edit</button>
                      <button onClick={() => deleteUser(u)} className="px-2 py-1 text-xs border border-destructive/40 text-destructive rounded-md">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-card border border-border rounded-lg p-4">
            <h3 className="font-heading text-2xl mb-3">{form.id ? 'Edit User' : 'Create User'}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" className="px-3 py-2 border rounded-md bg-background" />
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone" className="px-3 py-2 border rounded-md bg-background" />
              <input value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} placeholder="First name" className="px-3 py-2 border rounded-md bg-background" />
              <input value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} placeholder="Last name" className="px-3 py-2 border rounded-md bg-background" />
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserForm['role'] }))} className="px-3 py-2 border rounded-md bg-background">
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <input value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder={form.id ? 'New password (optional)' : 'Password'} type="password" className="px-3 py-2 border rounded-md bg-background" />
            </div>

            <label className="mt-3 inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
              Active account
            </label>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-border rounded-md text-sm">Cancel</button>
              <button onClick={saveUser} disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
