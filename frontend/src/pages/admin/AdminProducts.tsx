import { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { adminAPI, AdminProduct, PaginatedResponse } from '@/services/adminApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    stock_count: '',
    is_active: true,
    is_featured: false,
    is_new: false,
    image_urls: [] as string[],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  // Load products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.products.list({ search });
      setProducts(res.data.results || res.data);
    } catch (err) {
      toast.error('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await adminAPI.categories.list();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = () => {
    setEditingId(null);
    setFormData({
      name: '',
      brand: '',
      description: '',
      price: '',
      original_price: '',
      category: '',
      stock_count: '',
      is_active: true,
      is_featured: false,
      is_new: false,
      image_urls: [],
    });
    setImageUrlInput('');
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: AdminProduct) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      original_price: product.original_price,
      category: product.category.toString(),
      stock_count: product.stock_count.toString(),
      is_active: product.is_active,
      is_featured: product.is_featured,
      is_new: product.is_new,
      image_urls: product.images.map((img) => img.image_url),
    });
    setIsDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock_count: parseInt(formData.stock_count),
        category: parseInt(formData.category),
      };

      if (editingId) {
        await adminAPI.products.update(editingId, data);
        toast.success('Product updated successfully');
      } else {
        await adminAPI.products.create(data);
        toast.success('Product created successfully');
      }

      setIsDialogOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminAPI.products.delete(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData({
        ...formData,
        image_urls: [...formData.image_urls, imageUrlInput.trim()],
      });
      setImageUrlInput('');
    }
  };

  const removeImageUrl = (index: number) => {
    setFormData({
      ...formData,
      image_urls: formData.image_urls.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={handleAddProduct} className="bg-amber-600 hover:bg-amber-700">
          <Plus size={20} className="mr-2" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-gray-800 border-gray-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            placeholder="Search products..."
            className="pl-10 bg-gray-700 border-gray-600 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card className="bg-gray-800 border-gray-700 p-6">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-400">Product</th>
                  <th className="text-left py-3 px-4 text-gray-400">Category</th>
                  <th className="text-left py-3 px-4 text-gray-400">Price</th>
                  <th className="text-left py-3 px-4 text-gray-400">Stock</th>
                  <th className="text-left py-3 px-4 text-gray-400">Status</th>
                  <th className="text-center py-3 px-4 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {product.images[0] && (
                          <img
                            src={product.images[0].image_url}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{product.category_name}</td>
                    <td className="py-4 px-4 font-semibold">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          product.stock_count > 5
                            ? 'bg-green-900/50 text-green-400'
                            : product.stock_count > 0
                              ? 'bg-yellow-900/50 text-yellow-400'
                              : 'bg-red-900/50 text-red-400'
                        }`}
                      >
                        {product.stock_count}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {product.is_active ? (
                        <span className="text-green-400 text-xs">Active</span>
                      ) : (
                        <span className="text-red-400 text-xs">Inactive</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-400 hover:bg-blue-900/50"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-400 hover:bg-red-900/50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-400">No products found</div>
        )}
      </Card>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>Fill in the product details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <label className="text-sm font-semibold">Product Name *</label>
              <Input
                className="bg-gray-700 border-gray-600 mt-1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Brand</label>
                <Input
                  className="bg-gray-700 border-gray-600 mt-1"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Category *</label>
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold">Description</label>
              <textarea
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white mt-1 text-sm"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold">Price *</label>
                <Input
                  type="number"
                  step="0.01"
                  className="bg-gray-700 border-gray-600 mt-1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Original Price</label>
                <Input
                  type="number"
                  step="0.01"
                  className="bg-gray-700 border-gray-600 mt-1"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Stock Count</label>
                <Input
                  type="number"
                  className="bg-gray-700 border-gray-600 mt-1"
                  value={formData.stock_count}
                  onChange={(e) => setFormData({ ...formData, stock_count: e.target.value })}
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="text-sm font-semibold">Image URLs</label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="url"
                  placeholder="https://..."
                  className="bg-gray-700 border-gray-600"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addImageUrl()}
                />
                <Button onClick={addImageUrl} variant="outline" className="border-gray-600">
                  Add
                </Button>
              </div>
              {formData.image_urls.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.image_urls.map((url, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-700 p-2 rounded text-xs"
                    >
                      <span className="truncate">{url}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeImageUrl(idx)}
                        className="text-red-400"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">New</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} className="bg-amber-600 hover:bg-amber-700">
              {editingId ? 'Update' : 'Create'} Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
