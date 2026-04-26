import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Order {
  order_number: string;
  total: string;
  shipping_full_name: string;
  shipping_email: string;
}

const OrderConfirmationPage = () => {
  const location = useLocation();
  const order: Order | undefined = (location.state as { order?: Order })?.order;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-20 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h1 className="font-heading text-3xl font-bold mb-4">ORDER CONFIRMED</h1>

        {order ? (
          <div className="max-w-sm mx-auto bg-card border border-border p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-semibold">{order.order_number}</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Name</span>
              <span>{order.shipping_full_name}</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Email</span>
              <span>{order.shipping_email}</span>
            </div>
            <div className="flex justify-between text-sm font-body border-t border-border pt-3">
              <span className="text-muted-foreground font-semibold">Total</span>
              <span className="font-bold text-base">${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p className="font-body text-muted-foreground max-w-md mx-auto mb-8">
            Thank you for your purchase! Your order has been placed successfully.
          </p>
        )}

        <div className="flex justify-center gap-4">
          <Link
            to="/account"
            className="bg-primary text-primary-foreground px-8 py-3 text-xs font-body font-semibold tracking-widest hover:bg-accent transition-colors"
          >
            VIEW ORDERS
          </Link>
          <Link
            to="/shop"
            className="border border-primary text-primary px-8 py-3 text-xs font-body font-semibold tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
