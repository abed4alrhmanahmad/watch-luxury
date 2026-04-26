import { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await contactAPI.send(form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="container py-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Contact</span>
        </div>

        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading text-3xl font-bold text-center mb-2">CONTACT US</h1>
          <p className="text-center text-muted-foreground font-body mb-10">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          {sent && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 mb-6 text-sm font-body text-center">
              Thank you! Your message has been sent successfully. We'll get back to you soon.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 text-sm font-body text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'NAME', key: 'name', type: 'text' },
                { label: 'EMAIL', key: 'email', type: 'email' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-body font-semibold tracking-wider text-foreground mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm font-body border border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-body font-semibold tracking-wider text-foreground mb-1">SUBJECT</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-2.5 text-sm font-body border border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-body font-semibold tracking-wider text-foreground mb-1">MESSAGE</label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 text-sm font-body border border-border bg-card text-foreground resize-none focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground px-10 py-3 text-xs font-body font-semibold tracking-widest hover:bg-accent transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'SENDING…' : 'SEND MESSAGE'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
