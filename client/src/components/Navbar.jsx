import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import services from '../data/services';
import api from '../services/api';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openServices, setOpenServices] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [openWhy, setOpenWhy] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const getReadIds = () => {
    if (!user) return new Set();
    const stored = localStorage.getItem(`notifications_read_${user._id}`);
    return new Set(stored ? JSON.parse(stored) : []);
  };

  const saveReadIds = (ids) => {
    if (!user) return;
    localStorage.setItem(`notifications_read_${user._id}`, JSON.stringify(Array.from(ids)));
  };

  const markAsRead = (notificationId) => {
    const readIds = getReadIds();
    readIds.add(notificationId);
    saveReadIds(readIds);
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notificationId ? { ...n, read: true } : n
      )
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
    if (!user) {
      setNotifications([]);
      return undefined;
    }
    (async () => {
      try {
        const [contactRes, bookingsRes] = await Promise.all([
          api.get('/contact/my').catch(() => ({ data: [] })),
          api.get('/bookings/my').catch(() => ({ data: [] }))
        ]);

        if (!active) return;

        const readIds = getReadIds();

        const contactNotes = (contactRes.data || [])
          .filter((m) => m.reply)
          .map((m) => ({
            _id: m._id,
            type: 'message',
            title: 'Admin replied to your message',
            body: m.reply,
            meta: m.message,
            at: new Date(m.updatedAt || m.createdAt),
            read: readIds.has(m._id)
          }));

        const bookingNotes = (bookingsRes.data || []).flatMap((b) => {
          const entries = [];
          const statusText = {
            pending: 'Booking pending review',
            processing: 'Booking confirmed / in process',
            completed: 'Order completed',
            cancelled: 'Order cancelled'
          }[b.status];

          if (statusText) {
            entries.push({
              _id: `${b._id}-status`,
              type: 'booking',
              title: statusText,
              body: `${b.processType} – ${b.fabricType} (${b.quantityMeters}m)`,
              at: new Date(b.updatedAt || b.createdAt),
              read: readIds.has(`${b._id}-status`)
            });
          }

          if (b.payment && b.payment.status) {
            const payText = {
              success: 'Payment confirmed',
              failed: 'Payment failed',
              created: 'Payment initiated',
              pending: 'Payment pending'
            }[b.payment.status];
            if (payText) {
              entries.push({
                _id: `${b._id}-pay`,
                type: 'payment',
                title: payText,
                body: `Amount ₹${b.payment.amount || b.totalAmount}`,
                at: new Date(b.payment.updatedAt || b.payment.createdAt || b.updatedAt || b.createdAt),
                read: readIds.has(`${b._id}-pay`)
              });
            }
          }

          return entries;
        });

        const combined = [...contactNotes, ...bookingNotes]
          .sort((a, b) => b.at - a.at)
          .slice(0, 20);

        setNotifications(combined);
      } catch (err) {
        if (active) console.error('Failed to load notifications', err);
      }
    })();
    return () => { active = false; };
  }, [user]);

  const whyItems = [
    { label: 'Savings', to: '/why-chinnu-tex/savings', summary: 'Cost efficiency & bulk advantages' },
    { label: 'Sustainability', to: '/why-chinnu-tex/sustainability', summary: 'Water reuse, eco-friendly chemistries' }
  ];

  const serviceItems = [
    { label: 'Sizing', to: '/services', summary: 'Slasher, warp, single-end & more sizing services' },
    { label: 'Weaving', to: '/products/weaving', summary: 'Modern loom weaving services' }
  ];

  const productItems = [
    { label: 'Sizing', to: '/products/sizing', summary: 'Starch, synthetic, blended sizing' },
    { label: 'Weaving', to: '/products/weaving', summary: 'Modern loom weaving services' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const destinationForNotification = (n) => {
    if (n.type === 'message') return '/contact';
    if (n.type === 'booking' || n.type === 'payment') return '/my-orders';
    return '/';
  };

  const navigateForNotification = (n) => {
    markAsRead(n._id);
    navigate(destinationForNotification(n), { 
      state: { highlightId: n._id, notificationType: n.type }
    });
    setOpenNotifications(false);
  };

  return (
    <nav className="bg-white/90 border-b border-gray-200 sticky top-0 z-40 shadow-sm backdrop-blur">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-semibold text-primary-800 tracking-tight">
          CHINNU TEX
        </Link>
        <ul className="hidden md:flex space-x-8 items-center">
          <li><Link to="/" className="text-sm font-medium text-primary-800/80 hover:text-primary-800">Home</Link></li>
          <li><Link to="/careers" className="text-sm font-medium text-primary-800/80 hover:text-primary-800">Careers</Link></li>
          <li className="relative group" onMouseEnter={() => setOpenWhy(true)} onMouseLeave={() => setOpenWhy(false)}>
            <button className="text-sm font-medium text-primary-800/80 hover:text-primary-800 flex items-center gap-1">
              Why Chinnu Tex
              <span className="text-xs">▾</span>
            </button>
            <div className={`${openWhy ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'} absolute left-0 top-full pt-2 w-64 bg-white border border-primary-100 rounded-lg shadow-lg z-20 transition-all duration-200`}>
              <div className="p-3 border-b border-primary-50 text-xs font-semibold text-primary-700 uppercase">Explore strengths</div>
              <ul>
                {whyItems.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="block px-4 py-3 hover:bg-primary-50/70" onClick={() => setOpenWhy(false)}>
                      <div className="text-sm font-semibold text-primary-800">{item.label}</div>
                      <div className="text-xs text-primary-700/80">{item.summary}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="relative group" onMouseEnter={() => setOpenServices(true)} onMouseLeave={() => setOpenServices(false)}>
            <button className="text-sm font-medium text-primary-800/80 hover:text-primary-800 flex items-center gap-1">
              Services
              <span className="text-xs">▾</span>
            </button>
            <div className={`${openServices ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'} absolute left-0 top-full pt-2 w-64 bg-white border border-primary-100 rounded-lg shadow-lg z-20 transition-all duration-200`}>
              <div className="p-3 border-b border-primary-50 text-xs font-semibold text-primary-700 uppercase">Choose a service</div>
              <ul>
                {serviceItems.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="block px-4 py-3 hover:bg-primary-50/70" onClick={() => setOpenServices(false)}>
                      <div className="text-sm font-semibold text-primary-800">{item.label}</div>
                      <div className="text-xs text-primary-700/80">{item.summary}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="relative group" onMouseEnter={() => setOpenProducts(true)} onMouseLeave={() => setOpenProducts(false)}>
            <button className="text-sm font-medium text-primary-800/80 hover:text-primary-800 flex items-center gap-1">
              Products
              <span className="text-xs">▾</span>
            </button>
            <div className={`${openProducts ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'} absolute left-0 top-full pt-2 w-64 bg-white border border-primary-100 rounded-lg shadow-lg z-20 transition-all duration-200`}>
              <div className="p-3 border-b border-primary-50 text-xs font-semibold text-primary-700 uppercase">Browse categories</div>
              <ul>
                {productItems.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="block px-4 py-3 hover:bg-primary-50/70" onClick={() => setOpenProducts(false)}>
                      <div className="text-sm font-semibold text-primary-800">{item.label}</div>
                      <div className="text-xs text-primary-700/80">{item.summary}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          {user && <li><Link to="/my-orders" className="text-sm font-medium text-primary-800/80 hover:text-primary-800">My Orders</Link></li>}
          <li><Link to="/contact" className="text-sm font-medium text-primary-800/80 hover:text-primary-800">Contact Us</Link></li>
        </ul>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenNotifications((v) => !v)}
                className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center hover:bg-primary-100 transition"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>
              <div
                className={`${openNotifications ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'} absolute right-0 mt-2 w-80 bg-white border border-primary-100 rounded-lg shadow-lg z-30 transition-all duration-200`}
              >
                <div className="px-4 py-3 border-b border-primary-100 flex items-center justify-between">
                  <div className="font-semibold text-sm text-primary-800">Notifications</div>
                  <span className="text-xs text-primary-700/80">{notifications.filter((n) => !n.read).length} unread</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-5 text-sm text-gray-500 text-center">No updates yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n._id}
                        type="button"
                        onClick={() => navigateForNotification(n)}
                        className={`w-full text-left px-4 py-3 border-b border-primary-50 hover:bg-primary-50/70 transition ${
                          n.read ? 'opacity-60' : ''
                        }`}
                        title={`Opens ${destinationForNotification(n)}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">{n.at.toLocaleString()}</div>
                            <div className="text-sm font-bold text-gray-900">{n.title}</div>
                            {n.body && <div className="text-sm text-gray-700 line-clamp-2">{n.body}</div>}
                            {n.meta && <div className="text-xs text-primary-700/80 line-clamp-2 mt-1">Message: {n.meta}</div>}
                            <div className="text-xs text-primary-700/70 mt-1">Opens: {destinationForNotification(n) === '/contact' ? 'Contact page' : 'My Orders'}</div>
                          </div>
                          {!n.read && <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>}
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="px-4 py-3 border-t border-primary-100 text-right flex items-center justify-between text-sm gap-2">
                  <span className="text-primary-700/80 text-xs">Includes messages, bookings, payments</span>
                  <div className="flex gap-2">
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-primary-700 font-medium hover:text-primary-800"
                      >
                        Mark all read
                      </button>
                    )}
                    <Link to="/contact" className="text-primary-700 font-medium hover:text-primary-800" onClick={() => setOpenNotifications(false)}>
                      View all
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          {user ? (
            <>
              <span className="text-sm font-medium text-primary-800">Hi, {user.name}</span>
              <button onClick={handleLogout} className="bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-800 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-800 transition">Sign In</Link>
              <Link to="/register" className="border-2 border-primary-700 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 hover:text-white transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
