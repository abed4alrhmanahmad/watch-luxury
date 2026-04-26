import { useEffect, useMemo, useState } from 'react';
import {
  adminAPI,
  AdminCategory,
  AdminProduct,
  PaginatedResponse,
} from '@/services/adminApi';

interface ProductForm {
  id?: number;
  name: string;
  brand: string;
  description: string;
  price: string;
  original_price: string;
  category: string;
  stock_count: string;
  is_featured: boolean;
  is_new: boolean;
  image_urls: string;
  image_files: File[];
}

const initialForm: ProductForm = {
  name: '',
  brand: '',
  description: '',
  price: '',
  original_price: '',
  category: '',
  stock_count: '0',
  is_featured: false,
  is_new: false,
  image_urls: '',
  image_files: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [stockDraft, setStockDraft] = useState<Record<number, number>>({});

  const load = async (urlParams?: Record<string, string>) => {
    try {
      setLoading(true);
      setError('');

      const [{ data: categoryData }, { data: productData }] = await Promise.all([
        adminAPI.categories.list(),
        adminAPI.products.list(urlParams || {
          search,
          ...(categoryFilter ? { category: categoryFilter } : {}),
        }),
      ]);

      setCategories(categoryData);

      const paged = productData as PaginatedResponse<AdminProduct>;
      setProducts(paged.results || []);
      setNextPage(paged.next);
      setPrevPage(paged.previous);
      setStockDraft((curr) => {
        const draft = { ...curr };
        (paged.results || []).forEach((p) => {
          draft[p.id] = draft[p.id] ?? p.stock_count;
        });
        return draft;
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categoryNameById = useMemo(() => {
    const map: Record<number, string> = {};
    categories.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  const openCreate = () => {
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (p: AdminProduct) => {
    setForm({
      id: p.id,
      name: p.name,
      brand: p.brand,
      description: p.description,
      price: p.price,
      original_price: p.original_price || '',
      category: String(p.category),
      stock_count: String(p.stock_count),
      is_featured: p.is_featured,
      is_new: p.is_new,
      image_urls: p.images.map((img) => img.image_url).filter(Boolean).join('\n'),
      image_files: [],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('brand', form.brand);
      fd.append('description', form.description);
      fd.append('price', form.price);
      if (form.original_price) fd.append('original_price', form.original_price);
      fd.append('category', form.category);
      fd.append('stock_count', form.stock_count || '0');
      fd.append('is_featured', String(form.is_featured));
      fd.append('is_new', String(form.is_new));
      fd.append('is_active', String(Number(form.stock_count) > 0));

      form.image_urls
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((url) => fd.append('image_urls', url));

      form.image_files.forEach((file) => fd.append('image_files', file));

      if (form.id) {
        await adminAPI.products.update(form.id, fd);
      } else {
        await adminAPI.products.create(fd);
      }

      closeModal();
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminAPI.products.delete(id);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const updateStock = async (p: AdminProduct) => {
    const stock = Math.max(0, Number(stockDraft[p.id] ?? p.stock_count));
    try {
      await adminAPI.products.update(p.id, {
        ...p,
        stock_count: stock,
        is_active: stock > 0,
        category: p.category,
      });
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update stock');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-3xl font-bold">Products & Inventory</h2>
          <p className="text-sm text-muted-foreground">Create, edit, delete products and control stock</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">
          Add Product
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-3 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or brand"
          className="px-3 py-2 border border-border rounded-md bg-background text-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={() => load({ search, ...(categoryFilter ? { category: categoryFilter } : {}) })}
          className="px-4 py-2 rounded-md border border-border text-sm"
        >
          Apply Filters
        </button>
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md">{error}</div>}

      <div className="bg-card border border-border rounded-lg overflow-auto">
        {loading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading products...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Inventory Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const lowStock = p.stock_count > 0 && p.stock_count <= 5;
                const outOfStock = p.stock_count === 0;
                return (
                  <tr key={p.id} className="border-b border-border/60 align-top">
                    <td className="p-3">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.brand}</p>
                    </td>
                    <td className="p-3">{categoryNameById[p.category] || p.category_name}</td>
                    <td className="p-3">${Number(p.price).toFixed(2)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={stockDraft[p.id] ?? p.stock_count}
                          onChange={(e) => setStockDraft((s) => ({ ...s, [p.id]: Number(e.target.value) }))}
                          className="w-20 px-2 py-1 border border-border rounded-md bg-background"
                        />
                        <button onClick={() => updateStock(p)} className="px-2 py-1 text-xs border border-border rounded-md">
                          Save
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      {outOfStock && <span className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive">Out of stock</span>}
                      {!outOfStock && lowStock && <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-700">Low stock</span>}
                      {!outOfStock && !lowStock && <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-700">Healthy</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="px-2 py-1 text-xs border border-border rounded-md">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="px-2 py-1 text-xs border border-destructive/40 text-destructive rounded-md">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={!prevPage}
          onClick={() => prevPage && load({ page: new URL(prevPage).searchParams.get('page') || '1' })}
          className="px-3 py-2 text-xs border border-border rounded-md disabled:opacity-40"
        >
          Previous
        </button>
        <button
          disabled={!nextPage}
          onClick={() => nextPage && load({ page: new URL(nextPage).searchParams.get('page') || '1' })}
          className="px-3 py-2 text-xs border border-border rounded-md disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-lg p-4 max-h-[90vh] overflow-auto">
            <h3 className="font-heading text-2xl mb-3">{form.id ? 'Edit Product' : 'Create Product'}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className="px-3 py-2 border rounded-md bg-background" />
              <input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} placeholder="Brand" className="px-3 py-2 border rounded-md bg-background" />
              <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="Price" className="px-3 py-2 border rounded-md bg-background" />
              <input value={form.original_price} onChange={(e) => setForm((f) => ({ ...f, original_price: e.target.value }))} placeholder="Original Price" className="px-3 py-2 border rounded-md bg-background" />
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="px-3 py-2 border rounded-md bg-background">
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input value={form.stock_count} onChange={(e) => setForm((f) => ({ ...f, stock_count: e.target.value }))} placeholder="Stock Count" type="number" min={0} className="px-3 py-2 border rounded-md bg-background" />
            </div>

            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description"
              className="mt-3 w-full px-3 py-2 border rounded-md bg-background min-h-24"
            />

            <textarea
              value={form.image_urls}
              onChange={(e) => setForm((f) => ({ ...f, image_urls: e.target.value }))}
              placeholder="Image URLs (one per line)"
              className="mt-3 w-full px-3 py-2 border rounded-md bg-background min-h-24"
            />

            <div className="mt-3">
              <label className="text-sm font-medium">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setForm((f) => ({ ...f, image_files: Array.from(e.target.files || []) }))}
                className="mt-1 block w-full text-sm"
              />
            </div>

            <div className="mt-3 flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_new} onChange={(e) => setForm((f) => ({ ...f, is_new: e.target.checked }))} />
                New
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 border border-border rounded-md text-sm">Cancel</button>
              <button disabled={saving} onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
