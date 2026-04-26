import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        await register(form.firstName, form.lastName, form.email, form.password, form.confirmPassword);
      }
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: Record<string, string[]> } };
        const data = axiosErr.response?.data;
        if (data) {
          const messages = Object.values(data).flat().join(' ');
          setError(messages || 'Something went wrong. Please try again.');
        } else {
          setError('Something went wrong. Please try again.');
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <div>
      <label className="block text-xs font-body font-semibold tracking-wider text-foreground mb-1">
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        required
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-4 py-2.5 text-sm font-body border border-border bg-background text-foreground focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="container py-20">
        <div className="max-w-md mx-auto bg-card border border-border p-8">
          <h1 className="font-heading text-2xl font-bold text-center mb-8">
            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                {field('First Name', 'firstName')}
                {field('Last Name', 'lastName')}
              </div>
            )}
            {field('Email', 'email', 'email')}
            {field('Password', 'password', 'password')}
            {!isLogin && field('Confirm Password', 'confirmPassword', 'password')}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 text-xs font-body font-semibold tracking-widest hover:bg-accent transition-colors disabled:opacity-60"
            >
              {isLoading ? 'PLEASE WAIT…' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-center text-sm font-body text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-accent hover:text-primary font-semibold transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthPage;
