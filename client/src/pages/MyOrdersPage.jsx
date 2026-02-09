import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

function StatusBadge({ status }) {
  const config = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', icon: '⏱️' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', icon: '⚙️' },
    completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', icon: '✓' },
    cancelled: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300', icon: '✕' }
  };
  const { bg, text, border, icon } = config[status] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', icon: '?' };
  return (
    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${bg} ${text} border ${border} inline-flex items-center gap-2`}>
      <span className="text-lg">{icon}</span> 
      <span className="capitalize">{status}</span>
    </span>
  );
}

export default function MyOrdersPage() {
  const location = useLocation();
  const { highlightId } = location.state || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);
  const [sortDirection, setSortDirection] = useState('desc');
  const [highlightedOrderId, setHighlightedOrderId] = useState(highlightId?.replace('-status', '').replace('-pay', '') || null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setError('');
        const res = await api.get('/bookings/my');
        if (active) setOrders(res.data || []);
      } catch (e) {
        if (active) setError(e.response?.data?.message || 'Failed to load orders');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [refreshTick]);

  useEffect(() => {
    if (highlightedOrderId && orders.length > 0) {
      const element = document.getElementById(`order-${highlightedOrderId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [highlightedOrderId, orders]);

  useEffect(() => {
    if (location.state?.highlightId) {
      const cleanId = location.state.highlightId.replace('-status', '').replace('-pay', '');
      if (cleanId !== highlightedOrderId) {
        setHighlightedOrderId(cleanId);
      }
    }
  }, [location.state]);

  const refresh = () => setRefreshTick((x) => x + 1);

  const sortedOrders = [...orders].sort((a, b) => {
    const diff = new Date(a.createdAt) - new Date(b.createdAt);
    return sortDirection === 'asc' ? diff : -diff;
  });

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.patch(`/bookings/${orderId}`, { status: 'cancelled' });
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  return (
	<div className="min-h-screen bg-gradient-to-b from-primary-50 via-accent-light/40 to-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-6xl md:text-7xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-teal-600">
                Your Orders
              </h1>
              <p className="text-lg text-slate-600">Track and manage all your fabric processing orders in one place</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSortDirection((d) => d === 'desc' ? 'asc' : 'desc')} 
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-semibold hover:shadow-md hover:border-slate-300 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m-8 6l4 4 4-4" />
                </svg>
                {sortDirection === 'desc' ? 'Newest' : 'Oldest'}
              </button>
              <button 
                onClick={refresh} 
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-slate-700">{orders.length}</div>
                  <div className="text-sm text-slate-600 mt-2">Total Orders</div>
                </div>
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">📦</div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-blue-600">{orders.filter(o => o.status === 'processing').length}</div>
                  <div className="text-sm text-slate-600 mt-2">In Progress</div>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">⚙️</div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-emerald-600">{orders.filter(o => o.status === 'completed').length}</div>
                  <div className="text-sm text-slate-600 mt-2">Completed</div>
                </div>
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">✓</div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-amber-600">{orders.filter(o => o.status === 'pending').length}</div>
                  <div className="text-sm text-slate-600 mt-2">Pending</div>
                </div>
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">⏱️</div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-3xl shadow-sm p-24 text-center border border-slate-200">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-slate-600 text-lg font-medium">Loading your orders...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-rose-50 border-2 border-rose-300 text-rose-700 px-8 py-6 rounded-3xl flex items-center gap-4">
            <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Unable to load orders</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {!loading && !orders.length && (
          <div className="bg-white rounded-3xl shadow-sm p-20 text-center border border-slate-200">
            <div className="w-28 h-28 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-3">No orders yet</h3>
            <p className="text-slate-600 mb-8 text-lg">You haven't created any orders. Start by selecting a service and creating your first booking!</p>
            <a href="/services" className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
              Browse Services
            </a>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-slate-100 to-teal-100 border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-5 text-left font-bold text-slate-700">Date</th>
                      <th className="px-8 py-5 text-left font-bold text-slate-700">Process Type</th>
                      <th className="px-8 py-5 text-left font-bold text-slate-700">Material</th>
                      <th className="px-8 py-5 text-left font-bold text-slate-700">Quantity</th>
                      <th className="px-8 py-5 text-left font-bold text-slate-700">Amount</th>
                      <th className="px-8 py-5 text-left font-bold text-slate-700">Status</th>
                      <th className="px-8 py-5 text-left font-bold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders.map((o, idx) => (
                      <tr 
                        key={o._id} 
                        id={`order-${o._id}`}
                        className={`border-b border-slate-100 transition-all hover:bg-slate-50/50 ${
                          highlightedOrderId === o._id
                            ? 'bg-teal-50 shadow-sm border-l-4 border-l-teal-500'
                            : ''
                        }`}
                      >
                        <td className="px-8 py-5 text-sm text-slate-700 font-medium">
                          {new Date(o.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold capitalize">
                            {o.processType}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-slate-700 font-medium">{o.fabricType}</td>
                        <td className="px-8 py-5 font-semibold text-slate-800">{o.quantityMeters} <span className="text-sm text-slate-600">m</span></td>
                        <td className="px-8 py-5 font-bold text-teal-600">₹{o.totalAmount}</td>
                        <td className="px-8 py-5"><StatusBadge status={o.status} /></td>
                        <td className="px-8 py-5">
                          {o.status === 'pending' && (
                            <button
                              onClick={() => handleCancelOrder(o._id)}
                              className="px-4 py-2 bg-rose-100 text-rose-700 border border-rose-300 text-sm rounded-lg font-semibold hover:bg-rose-200 transition-all"
                            >
                              Cancel
                            </button>
                          )}
                          {o.status !== 'pending' && (
                            <span className="text-sm text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-5">
              {sortedOrders.map((o) => (
                <div 
                  key={o._id} 
                  id={`order-${o._id}`}
                  className={`rounded-3xl shadow-sm p-6 border-2 transition-all ${
                    highlightedOrderId === o._id
                      ? 'bg-teal-50 border-teal-400 shadow-md'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-semibold">Order Date</div>
                      <div className="text-lg font-bold text-slate-800">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>

                  <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Type:</span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold capitalize">
                        {o.processType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Material:</span>
                      <span className="font-semibold text-slate-800">{o.fabricType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Quantity:</span>
                      <span className="font-semibold text-slate-800">{o.quantityMeters} m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Amount:</span>
                      <span className="font-bold text-teal-600 text-lg">₹{o.totalAmount}</span>
                    </div>
                  </div>

                  {o.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(o._id)}
                      className="w-full px-4 py-3 bg-rose-100 text-rose-700 border border-rose-300 rounded-xl font-semibold hover:bg-rose-200 transition-all"
                    >
                      Cancel Order
                    </button>
                  )}
                  {o.status !== 'pending' && (
                    <div className="text-center py-3 text-slate-500 text-sm">No actions available</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <p className="text-sm text-slate-500 mt-10 text-center">
            💡 <strong>Tip:</strong> Click Refresh to see updates after the admin changes your order status.
          </p>
        )}
      </div>
    </div>
  );
}
