import { useState, useEffect } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  }
  return (
    <nav>
      <a href="#hero" className="nav-logo" onClick={e => { e.preventDefault(); scrollTo('hero') }}>SONU_DEV</a>
      <ul className="nav-links">
        {[['hero', 'Home'], ['about', 'About'], ['skills', 'Skills'], ['projects', 'Projects'], ['achievements', 'Achievements'], ['contact', 'Contact']].map(([id, label]) => (
          <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a></li>
        ))}
      </ul>
      <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="nav-dot"><div className="ndot"/>Open to work</div>
      </div>
    </nav>
  )
}
