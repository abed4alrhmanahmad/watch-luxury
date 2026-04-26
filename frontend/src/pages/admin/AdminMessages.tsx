import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { adminAPI, AdminMessage } from '@/services/adminApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AdminMessages() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [showUnreadOnly]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (showUnreadOnly) params.is_read = 'false';
      const res = await adminAPI.messages.list(params);
      setMessages(Array.isArray(res.data) ? res.data : res.data.results);
    } catch (err) {
      toast.error('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (message: AdminMessage) => {
    try {
      await adminAPI.messages.markRead(message.id, !message.is_read);
      toast.success(message.is_read ? 'Marked as unread' : 'Marked as read');
      if (selectedMessage?.id === message.id) {
        setSelectedMessage({ ...selectedMessage, is_read: !message.is_read });
      }
      fetchMessages();
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await adminAPI.messages.delete(id);
      toast.success('Message deleted');
      setIsDetailOpen(false);
      fetchMessages();
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const handleViewMessage = (message: AdminMessage) => {
    setSelectedMessage(message);
    setIsDetailOpen(true);
    if (!message.is_read) {
      handleMarkAsRead(message);
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <div className="text-sm text-gray-400">
          {unreadCount} unread messages
        </div>
      </div>

      {/* Toggle Filter */}
      <Card className="bg-gray-800 border-gray-700 p-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => setShowUnreadOnly(e.target.checked)}
            className="rounded"
          />
          <span>Show unread only</span>
        </label>
      </Card>

      {/* Messages List */}
      <Card className="bg-gray-800 border-gray-700 p-0">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        ) : messages.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 hover:bg-gray-700/50 transition-colors cursor-pointer border-l-4 ${
                  message.is_read ? 'border-gray-600 bg-gray-900/50' : 'border-amber-500 bg-amber-500/10'
                }`}
                onClick={() => handleViewMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-semibold truncate">{message.name}</p>
                      <span className="text-xs text-gray-400">&lt;{message.email}&gt;</span>
                      {!message.is_read && (
                        <span className="ml-auto px-2 py-1 bg-amber-600 text-white text-xs rounded">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-300 truncate">{message.subject}</p>
                    <p className="text-sm text-gray-400 truncate mt-1">{message.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(message.created_at).toLocaleDateString()}{' '}
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.is_read ? (
                    <MailOpen className="ml-4 text-gray-500 flex-shrink-0" size={20} />
                  ) : (
                    <Mail className="ml-4 text-amber-500 flex-shrink-0" size={20} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-400">
            {showUnreadOnly ? 'No unread messages' : 'No messages yet'}
          </div>
        )}
      </Card>

      {/* Message Detail Dialog */}
      {selectedMessage && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
              <DialogDescription>From {selectedMessage.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Sender Info */}
              <div className="bg-gray-700/50 p-4 rounded">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-400">Name</label>
                    <p className="font-semibold">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-gray-400">Email</label>
                    <p className="font-semibold break-all">{selectedMessage.email}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400">Date</label>
                    <p className="font-semibold">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="text-sm text-gray-400">Message</label>
                <div className="bg-gray-700/50 p-4 rounded mt-2 whitespace-pre-wrap text-sm">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-4">
                <div>
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      selectedMessage.is_read
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                    }`}
                  >
                    {selectedMessage.is_read ? 'Read' : 'Unread'}
                  </span>
                </div>
                <div className="flex-1" />
                <Button
                  onClick={() => handleMarkAsRead(selectedMessage)}
                  variant="outline"
                  className="border-gray-600"
                >
                  {selectedMessage.is_read ? 'Mark as Unread' : 'Mark as Read'}
                </Button>
                <Button
                  onClick={() => handleDelete(selectedMessage.id)}
                  variant="destructive"
                  className="bg-red-900/50 text-red-400 hover:bg-red-900"
                >
                  <Trash2 size={16} className="mr-2" /> Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
