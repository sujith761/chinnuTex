import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', ratePerMeter: 0, processType: 'sizing' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post('/products', form);
      }
      setForm({ name: '', description: '', ratePerMeter: 0, processType: 'bleaching' });
      loadProducts();
    } catch (err) {
      console.error('Failed to save product', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        loadProducts();
      } catch (err) {
        console.error('Failed to delete product', err);
      }
    }
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditingId(p._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-semibold">Catalog</p>
          <h1 className="text-4xl font-extrabold text-slate-900">Product Management</h1>
          <p className="text-slate-600">Add, edit, and remove processing products quickly.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.2fr]">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: '', description: '', ratePerMeter: 0, processType: 'sizing' });
                  }}
                  className="text-sm px-3 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Name</label>
                <input
                  type="text"
                  placeholder="Product name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  placeholder="Short description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Paisa per meter</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.ratePerMeter}
                    onChange={(e) => setForm({ ...form, ratePerMeter: Number(e.target.value) })}
                    required
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Process Type</label>
                  <select
                    value={form.processType}
                    onChange={(e) => setForm({ ...form, processType: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sizing">Sizing</option>
                    <option value="weaving">Weaving</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow hover:shadow-lg"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wide">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Type</th>
                    <th className="p-4 text-left">Paisa/meter</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-slate-800">
                  {products.map((p) => (
                    <tr key={p._id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-semibold">{p.name}</td>
                      <td className="p-4 capitalize text-slate-600">{p.processType}</td>
                      <td className="p-4 font-semibold text-slate-900">₹{p.ratePerMeter}</td>
                      <td className="p-4 space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="bg-rose-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-rose-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
