import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import api from '../services/api';

export default function AdminTopbar() {
  const { admin, logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const getReadIds = () => {
    if (!admin) return new Set();
    const stored = localStorage.getItem(`admin_notifications_read_${admin._id}`);
    return new Set(stored ? JSON.parse(stored) : []);
  };

  const saveReadIds = (ids) => {
    if (!admin) return;
    localStorage.setItem(`admin_notifications_read_${admin._id}`, JSON.stringify(Array.from(ids)));
  };

  const markAsRead = (notificationId) => {
    const readIds = getReadIds();
    readIds.add(notificationId);
    saveReadIds(readIds);
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    const readIds = getReadIds();
    notifications.forEach((n) => readIds.add(n._id));
    saveReadIds(readIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    let active = true;
    if (!admin) {
      setNotifications([]);
      return undefined;
    }
    (async () => {
      try {
        const [messagesRes, bookingsRes, paymentsRes, usersRes] = await Promise.all([
          api.get('/admin/messages').catch(() => ({ data: [] })),
          api.get('/admin/bookings').catch(() => ({ data: [] })),
          api.get('/admin/payments').catch(() => ({ data: [] })),
          api.get('/admin/users').catch(() => ({ data: [] }))
        ]);

        if (!active) return;

        const readIds = getReadIds();

        // All messages (new and replied)
        const messageNotes = (messagesRes.data || []).map((m) => ({
          _id: m._id,
          type: 'message',
          title: m.replied ? 'Message replied' : 'New message from user',
          body: m.message.substring(0, 60) + (m.message.length > 60 ? '...' : ''),
          meta: `From: ${m.name || 'User'}`,
          at: new Date(m.updatedAt || m.createdAt),
          read: readIds.has(m._id),
          link: '/admin/messages'
        }));

        // All bookings with status changes
        const bookingNotes = (bookingsRes.data || []).map((b) => {
          const statusText = {
            pending: 'New booking request',
            processing: 'Booking in process',
            completed: 'Booking completed',
            cancelled: 'Booking cancelled'
          }[b.status] || 'Booking updated';

          return {
            _id: `${b._id}-booking`,
            type: 'booking',
            title: statusText,
            body: `${b.processType} – ${b.fabricType} (${b.quantityMeters}m)`,
            meta: `By: ${b.user?.name || 'User'} | Status: ${b.status}`,
            at: new Date(b.updatedAt || b.createdAt),
            read: readIds.has(`${b._id}-booking`),
            link: '/admin/bookings'
          };
        });

        // All payment activities
        const paymentNotes = (paymentsRes.data || []).map((p) => {
          const statusText = {
            success: 'Payment received',
            failed: 'Payment failed',
            created: 'Payment initiated',
            pending: 'Payment pending'
          }[p.status] || 'Payment activity';

          return {
            _id: `${p._id}-payment`,
            type: 'payment',
            title: statusText,
            body: `₹${p.amount} (${p.status})`,
            meta: `From: ${p.user?.name || 'User'}`,
            at: new Date(p.updatedAt || p.createdAt),
            read: readIds.has(`${p._id}-payment`),
            link: '/admin/payments'
          };
        });

        // New user registrations (last 10)
        const userNotes = (usersRes.data || [])
          .slice(0, 10)
          .map((u) => ({
            _id: `${u._id}-user`,
            type: 'user',
            title: 'New user registered',
            body: `${u.name} (${u.email})`,
            meta: `Registered on: ${new Date(u.createdAt).toLocaleDateString()}`,
            at: new Date(u.createdAt),
            read: readIds.has(`${u._id}-user`),
            link: '/admin/users'
          }));

        const combined = [...messageNotes, ...bookingNotes, ...paymentNotes, ...userNotes]
          .sort((a, b) => b.at - a.at)
          .slice(0, 30);

        setNotifications(combined);
      } catch (err) {
        if (active) console.error('Failed to load admin notifications', err);
      }
    })();
    return () => {
      active = false;
    };
  }, [admin]);

  const handleNotificationClick = (n) => {
    markAsRead(n._id);
    const itemId = n._id.replace('-booking', '').replace('-payment', '').replace('-user', '');
    navigate(n.link, {
      state: { highlightId: itemId, notificationType: n.type }
    });
    setOpenNotifications(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between shadow-sm">
      <Link to="/admin/dashboard" className="flex items-center gap-2 text-slate-900 font-extrabold text-xl">
        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg shadow">
          JA
        </span>
        <span>CHINNU TEX Admin</span>
      </Link>
      <div className="flex items-center gap-4">
        {admin && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenNotifications((v) => !v)}
              className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow hover:bg-slate-200 transition relative"
              aria-label="Notifications"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>
            <div
              className={`${
                openNotifications
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-1 pointer-events-none'
              } absolute right-0 mt-3 w-96 bg-white text-gray-800 rounded-xl shadow-2xl z-50 transform-gpu transition`}
            >
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <div className="font-bold text-sm text-gray-700">Admin Notifications</div>
                <span className="text-xs text-gray-500">{notifications.filter((n) => !n.read).length} unread</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-5 text-sm text-gray-500 text-center">No updates yet.</div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n._id}
                      type="button"
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 focus:bg-gray-100 transition ${
                        n.read ? 'opacity-60' : 'font-semibold'
                      }`}
                      title={`Opens ${n.link}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">{n.at.toLocaleString()}</div>
                          <div className="text-sm font-bold text-gray-900">{n.title}</div>
                          {n.body && <div className="text-sm text-gray-700 line-clamp-2">{n.body}</div>}
                          {n.meta && <div className="text-xs text-blue-700 line-clamp-2 mt-1">{n.meta}</div>}
                          <div className="text-xs text-gray-500 mt-1">Opens: {n.link}</div>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>}
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="px-4 py-3 border-t text-right flex items-center justify-between text-sm gap-2">
                <span className="text-gray-500">All activities tracked</span>
                <div className="flex gap-2">
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-slate-800">{admin?.name || 'Admin'}</span>
          <span className="text-xs text-slate-500">Logged in</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:shadow-md transition-transform transform-gpu hover:-translate-y-0.5"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
