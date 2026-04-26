import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index.tsx";
import ShopPage from "./pages/ShopPage.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import WishlistPage from "./pages/WishlistPage.tsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import CategoriesPage from "./pages/CategoriesPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage.tsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.tsx";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.tsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.tsx";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminOverviewPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="messages" element={<AdminMessagesPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
