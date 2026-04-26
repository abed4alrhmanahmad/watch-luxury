import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { ordersAPI, couponsAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Check, X } from 'lucide-react';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const subtotal = totalPrice();
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.1;

  const [form, setForm] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '', city: '', state: '', zip: '', country: 'United States',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ discount_percentage: number; discount_amount: number; final_price: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const discount = appliedCoupon?.discount_amount || 0;
  const total = subtotal + shipping + tax - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl mb-4">Your cart is empty</h1>
          <Link to="/shop" className="text-accent font-body text-sm">← Continue Shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setCouponLoading(true);
    try {
      const { data } = await couponsAPI.apply(couponCode, subtotal);
      setAppliedCoupon(data);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setCouponError(axiosErr.response?.data?.error || 'Invalid coupon code.');
      } else {
        setCouponError('Failed to apply coupon. Please try again.');
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = items.map((i) => ({
        product_id: Number(i.product.id),
        quantity: i.quantity,
      }));

      const { data } = await ordersAPI.checkout({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zip_code: form.zip,
        country: form.country,
        items: orderItems,
        coupon_code: appliedCoupon ? couponCode : undefined,
      });

      clearCart();
      navigate('/order-confirmation', { state: { order: data.order || data } });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setError(axiosErr.response?.data?.error || 'Failed to place order. Please try again.');
      } else {
        setError('Failed to place order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full px-4 py-2.5 text-sm font-body border border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="container py-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Checkout</span>
        </div>

        {!isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm font-body px-4 py-3 mb-6">
            <Link to="/auth" state={{ from: { pathname: '/checkout' } }} className="font-semibold underline">
              Sign in
            </Link>{' '}
            to save your order history. You can also continue as guest.
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="font-heading text-3xl font-bold">SHIPPING INFORMATION</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'fullName', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone', key: 'phone', type: 'tel' },
                { label: 'Address', key: 'address', type: 'text' },
                { label: 'City', key: 'city', type: 'text' },
                { label: 'State', key: 'state', type: 'text' },
                { label: 'Zip Code', key: 'zip', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key} className={key === 'address' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-body font-semibold tracking-wider text-foreground mb-1">
                    {label.toUpperCase()}
                  </label>
                  <input
                    type={type}
                    required
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-body font-semibold tracking-wider text-foreground mb-1">COUNTRY</label>
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className={inputClass}
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Lebanon</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold mb-2">COUPON CODE</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  disabled={appliedCoupon !== null}
                  className={`flex-1 px-4 py-2.5 text-sm font-body border border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors ${
                    appliedCoupon ? 'opacity-60' : ''
                  }`}
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="px-4 py-2.5 text-xs font-body font-semibold tracking-widest text-red-600 hover:text-red-700"
                  >
                    REMOVE
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-4 py-2.5 text-xs font-body font-semibold tracking-widest bg-primary text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? 'APPLYING...' : 'APPLY'}
                  </button>
                )}
              </div>
              {couponError && (
                <p className="text-xs text-red-600 font-body mt-2">{couponError}</p>
              )}
              {appliedCoupon && (
                <p className="text-xs text-green-600 font-body mt-2 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {appliedCoupon.discount_percentage}% discount applied! You save ${appliedCoupon.discount_amount.toFixed(2)}
                </p>
              )}
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold mb-2">PAYMENT</h2>
              <p className="text-sm font-body text-muted-foreground">
                Secure checkout — your order will be placed and confirmed immediately.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border p-6 h-fit">
            <h2 className="font-heading text-lg font-semibold mb-6">ORDER SUMMARY</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-body font-medium text-foreground truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-body font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm font-body border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full bg-primary text-primary-foreground text-xs font-body font-semibold tracking-widest py-3 hover:bg-accent transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'PROCESSING PAYMENT…' : 'PAY NOW'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
