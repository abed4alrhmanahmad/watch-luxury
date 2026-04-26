import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, LogOut, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useState } from 'react';
import logo from '@/assets/logo.png';

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'SHOP', href: '/shop' },
  { label: 'CATEGORIES', href: '/categories' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
];

const Navbar = () => {
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="ChronoLux" className="h-8 md:h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-xs font-body font-medium tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </Link>

          {/* User menu */}
          <div className="hidden md:block relative">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs font-body font-medium tracking-wider hidden lg:block">
                    {user?.first_name}
                  </span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border shadow-lg z-20 py-1">
                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-xs font-body font-medium tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        MY ACCOUNT
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-xs font-body font-medium tracking-wider text-muted-foreground hover:text-red-600 hover:bg-muted flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> LOGOUT
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button onClick={toggleCart} className="relative text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button className="md:hidden text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden bg-card border-t border-border px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-body font-medium tracking-widest text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block text-sm font-body font-medium tracking-widest text-muted-foreground hover:text-foreground">
            WISHLIST
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/account" onClick={() => setMobileOpen(false)} className="block text-sm font-body font-medium tracking-widest text-muted-foreground hover:text-foreground">
                MY ACCOUNT
              </Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block text-sm font-body font-medium tracking-widest text-red-500 hover:text-red-700">
                LOGOUT
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block text-sm font-body font-medium tracking-widest text-muted-foreground hover:text-foreground">
              SIGN IN
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
