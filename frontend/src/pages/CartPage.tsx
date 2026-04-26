import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const shipping = totalPrice() > 100 ? 0 : 15;
  const tax = totalPrice() * 0.1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="container py-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Cart</span>
        </div>

        <h1 className="font-heading text-3xl font-bold mb-8">YOUR CART</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground mb-4">Your cart is empty</p>
            <Link to="/shop" className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs font-body font-semibold tracking-widest">
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-xs font-body font-bold tracking-wider text-muted-foreground">
                <span className="col-span-6">PRODUCT</span>
                <span className="col-span-2">PRICE</span>
                <span className="col-span-2">QUANTITY</span>
                <span className="col-span-2 text-right">TOTAL</span>
              </div>

              {items.map((item) => (
                <div key={item.product.id} className="grid grid-cols-12 gap-4 py-6 border-b border-border items-center">
                  <div className="col-span-12 md:col-span-6 flex gap-4">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover bg-muted" />
                    <div>
                      <h3 className="font-body text-sm font-medium text-foreground">{item.product.name}</h3>
                      <button onClick={() => removeItem(item.product.id)} className="text-xs text-muted-foreground hover:text-destructive mt-1 flex items-center gap-1">
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-2 font-body text-sm">${item.product.price.toFixed(2)}</div>
                  <div className="col-span-4 md:col-span-2">
                    <div className="inline-flex items-center border border-border">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 text-muted-foreground hover:text-foreground">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-body">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 text-muted-foreground hover:text-foreground">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-2 text-right font-body text-sm font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <Link to="/shop" className="inline-block mt-6 text-sm font-body text-accent hover:text-primary">
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="bg-card border border-border p-6 h-fit">
              <h2 className="font-heading text-lg font-semibold mb-6">ORDER SUMMARY</h2>
              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${totalPrice().toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${(totalPrice() + shipping + tax).toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block mt-6 w-full bg-primary text-primary-foreground text-center text-xs font-body font-semibold tracking-widest py-3 hover:bg-accent transition-colors"
              >
                PROCEED TO CHECKOUT
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
