import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import services from '../data/services';
import api from '../services/api';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [openServices, setOpenServices] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [openWhy, setOpenWhy] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { label: 'Savings', to: '/why-chinnu-tex/savings', summary: 'Cost efficiency & bulk advantages', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Sustainability', to: '/why-chinnu-tex/sustainability', summary: 'Water reuse, eco-friendly practices', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  const serviceItems = [
    { label: 'Sizing', to: '/services', summary: 'Slasher, warp, single-end positioning', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { label: 'Weaving', to: '/services/weaving', summary: 'Modern air-jet loom weaving', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' }
  ];

  const productItems = [
    { label: 'Sizing Yarns', to: '/products/sizing', summary: 'Starch, synthetic, blended details', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Weaving Cloths', to: '/products/weaving', summary: 'High quality grey fabrics', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
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

  // Helper for Nav Links
  const NavLink = ({ to, children, active }) => (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${active
          ? 'bg-indigo-50 text-indigo-600 shadow-sm'
          : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
        }`}
    >
      {children}
    </Link>
  );

  // Helper for Dropdown Menu
  const DropdownMenu = ({ items, isOpen, close }) => (
    <div
      className={`absolute left-0 top-full mt-2 w-72 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] z-50 transition-all duration-300 origin-top-left ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
    >
      <div className="p-2 space-y-1">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={close}
            className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">{item.label}</div>
              <div className="text-xs text-slate-500 leading-tight mt-1">{item.summary}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm py-2'
          : 'bg-transparent py-4'
        }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
            C
          </div>
          <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-slate-800'}`}>
            CHINNU TEX
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-1">
          <li><NavLink to="/" active={location.pathname === '/'}>Home</NavLink></li>

          <li className="relative group" onMouseEnter={() => setOpenWhy(true)} onMouseLeave={() => setOpenWhy(false)}>
            <button className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${openWhy ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'}`}>
              Why Us <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <DropdownMenu items={whyItems} isOpen={openWhy} close={() => setOpenWhy(false)} />
          </li>

          <li className="relative group" onMouseEnter={() => setOpenServices(true)} onMouseLeave={() => setOpenServices(false)}>
            <button className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${openServices ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'}`}>
              Services <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <DropdownMenu items={serviceItems} isOpen={openServices} close={() => setOpenServices(false)} />
          </li>

          <li className="relative group" onMouseEnter={() => setOpenProducts(true)} onMouseLeave={() => setOpenProducts(false)}>
            <button className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${openProducts ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'}`}>
              Products <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <DropdownMenu items={productItems} isOpen={openProducts} close={() => setOpenProducts(false)} />
          </li>

          {user && <li><NavLink to="/my-orders" active={location.pathname === '/my-orders'}>My Orders</NavLink></li>}
          <li><NavLink to="/contact" active={location.pathname === '/contact'}>Contact</NavLink></li>
        </ul>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenNotifications((v) => !v)}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <div className={`absolute right-0 mt-4 w-96 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] z-50 transition-all duration-300 origin-top-right ${openNotifications ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{notifications.filter((n) => !n.read).length} new</span>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      <p>All caught up! No new notifications.</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n._id}
                        onClick={() => navigateForNotification(n)}
                        className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-4 ${!n.read ? 'bg-indigo-50/30' : ''}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.read ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                        <div>
                          <h4 className={`text-sm ${!n.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{n.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.body}</p>
                          <span className="text-[10px] text-slate-400 mt-2 block">{n.at.toLocaleString()}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-between">
                  <button onClick={markAllAsRead} className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Mark all read</button>
                  <Link to="/contact" className="text-xs font-bold text-indigo-600 hover:text-indigo-700" onClick={() => setOpenNotifications(false)}>View all activity</Link>
                </div>
              </div>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800">{user.name}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Client</div>
              </div>
              <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-colors" title="Logout">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                Sign In
              </Link>
              <Link to="/register" className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
