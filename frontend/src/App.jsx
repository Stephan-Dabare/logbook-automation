import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import RoleSelection from './components/RoleSelection';
import StudentDashboard from './components/StudentDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import './DesignTokens.css';
import './App.css';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Student', path: '/student' },
  { label: 'Supervisor', path: '/supervisor' }
];

function AppShell() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const itemRefs = useRef([]);

  useEffect(() => {
    const updateIndicator = () => {
      requestAnimationFrame(() => {
        let activeIndex = NAV_ITEMS.findIndex((item) => item.path === location.pathname);
        if (activeIndex === -1) {
          activeIndex = NAV_ITEMS.findIndex(
            (item) => item.path !== '/' && location.pathname.startsWith(item.path)
          );
        }
        if (activeIndex === -1) {
          activeIndex = NAV_ITEMS.findIndex((item) => item.path === '/') ?? 0;
        }
        const target = itemRefs.current[activeIndex] ?? itemRefs.current[0];
        if (target) {
          setIndicatorStyle({ width: target.offsetWidth, left: target.offsetLeft });
        }
      });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [location.pathname, menuOpen]);

  const navIndicatorStyle = {
    width: indicatorStyle.width ? `${indicatorStyle.width}px` : 0,
    transform: `translateX(${indicatorStyle.left}px)`
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="primary-navbar" aria-label="Main navigation">
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <span>Log Book Automation</span>
          </Link>
          <button
            type="button"
            className="navbar-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={`navbar-collapse ${menuOpen ? 'is-open' : ''}`}>
            <ul className="primary-nav-list" role="menubar">
              <div className="nav-indicator" style={navIndicatorStyle} aria-hidden="true" />
              {NAV_ITEMS.map((item, index) => (
                <li
                  key={item.path}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className={`nav-item ${location.pathname.startsWith(item.path) ? 'is-active' : ''}`}
                  role="none"
                >
                  <NavLink
                    to={item.path}
                    className="primary-nav-link"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/supervisor" element={<SupervisorDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;