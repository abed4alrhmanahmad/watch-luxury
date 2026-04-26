import { X, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = () => {
  const { items, isCartOpen, setCartOpen, removeItem, updateQuantity, totalPrice } = useCartStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 z-50"
            onClick={() => setCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-heading text-lg font-semibold">CART</h2>
              <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground font-body text-sm py-12">Your cart is empty</p>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <img src={item.product.images[0] || '/placeholder.svg'} alt={item.product.name} className="w-20 h-20 object-cover bg-muted" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-body text-sm font-medium text-foreground truncate">{item.product.name}</h4>
                      <p className="text-sm font-body font-semibold text-foreground mt-1">${item.product.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="text-muted-foreground hover:text-foreground">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-body w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="text-muted-foreground hover:text-foreground">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive self-start">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between font-body">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${totalPrice().toFixed(2)}</span>
                </div>
                <Link
                  to="/cart"
                  onClick={() => setCartOpen(false)}
                  className="block w-full bg-primary text-primary-foreground text-center text-xs font-body font-semibold tracking-wider py-3 hover:bg-accent transition-colors"
                >
                  VIEW CART
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block w-full border border-primary text-primary text-center text-xs font-body font-semibold tracking-wider py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  CHECKOUT
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
