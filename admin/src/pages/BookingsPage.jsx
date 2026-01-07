import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

export default function BookingsPage() {
  const location = useLocation();
  const { highlightId } = location.state || {};
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [highlightedBookingId, setHighlightedBookingId] = useState(highlightId || null);

  useEffect(() => {
    loadBookings();
  }, [filter]);

  useEffect(() => {
    if (highlightId && bookings.length > 0) {
      const element = document.getElementById(`booking-${highlightId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        setHighlightedBookingId(highlightId);
      }
    }
  }, [highlightId, bookings]);

  useEffect(() => {
    if (location.state?.highlightId !== highlightedBookingId) {
      setHighlightedBookingId(location.state?.highlightId || null);
    }
  }, [location.state]);

  const loadBookings = async () => {
    try {
      const url = filter ? `/admin/bookings?status=${filter}` : '/admin/bookings';
      const res = await api.get(url);
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      loadBookings();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const statusColor = (status) => {
    if (status === 'completed') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'processing') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (status === 'pending') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-semibold">Operations</p>
          <h1 className="text-4xl font-extrabold text-slate-900">Booking Management</h1>
          <p className="text-slate-600">Filter, review, and update booking statuses quickly.</p>
        </header>

        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-semibold text-slate-700">Filter by status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-slate-200 px-4 py-2 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Process</th>
                  <th className="p-4 text-left">Quantity</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {bookings.map((b) => (
                  <tr 
                    key={b._id} 
                    id={`booking-${b._id}`}
                    className={`border-t transition-all ${
                      highlightedBookingId === b._id
                        ? 'bg-yellow-100 border-yellow-400 shadow-md'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-4 font-semibold">{b.user?.name || 'N/A'}</td>
                    <td className="p-4 capitalize text-slate-600">{b.processType}</td>
                    <td className="p-4 text-slate-600">{b.quantityMeters}m</td>
                    <td className="p-4 font-semibold text-slate-900">₹{b.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b._id, e.target.value)}
                        className="border border-slate-200 px-3 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
