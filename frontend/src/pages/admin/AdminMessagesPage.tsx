import { useEffect, useState } from 'react';
import { adminAPI, AdminMessage } from '@/services/adminApi';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError('');
      const params = filter === 'all' ? undefined : { is_read: String(filter === 'read') };
      const { data } = await adminAPI.messages.list(params);
      setMessages(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [filter]);

  const toggleRead = async (msg: AdminMessage) => {
    try {
      await adminAPI.messages.markRead(msg.id, !msg.is_read);
      loadMessages();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update message');
    }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await adminAPI.messages.delete(id);
      loadMessages();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-3xl font-bold">Contact Messages</h2>
        <p className="text-sm text-muted-foreground">Handle customer inquiries from the storefront</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-3 flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-2 text-xs rounded-md border ${filter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}>All</button>
        <button onClick={() => setFilter('unread')} className={`px-3 py-2 text-xs rounded-md border ${filter === 'unread' ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}>Unread</button>
        <button onClick={() => setFilter('read')} className={`px-3 py-2 text-xs rounded-md border ${filter === 'read' ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}>Read</button>
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md">{error}</div>}

      <div className="bg-card border border-border rounded-lg overflow-auto">
        {loading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading messages...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="p-3">From</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Message</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className="border-b border-border/60 align-top">
                  <td className="p-3">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </td>
                  <td className="p-3">{m.subject}</td>
                  <td className="p-3 max-w-[440px]">
                    <p className="line-clamp-3 text-muted-foreground">{m.message}</p>
                  </td>
                  <td className="p-3">{m.is_read ? 'Read' : 'Unread'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleRead(m)} className="px-2 py-1 text-xs border border-border rounded-md">
                        Mark {m.is_read ? 'Unread' : 'Read'}
                      </button>
                      <button onClick={() => deleteMessage(m.id)} className="px-2 py-1 text-xs border border-destructive/40 text-destructive rounded-md">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
