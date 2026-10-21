import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('Checking backend…');
  useEffect(() => {
    fetch(`${API}/api/health`)
      .then((r) => { if (!r.ok) throw new Error('Backend unavailable'); return r.json(); })
      .then(() => { setStatus('All services connected'); return fetch(`${API}/api/tasks`); })
      .then((r) => r.json()).then(setTasks)
      .catch(() => setStatus('Backend is unavailable. Check Docker logs.'));
  }, []);
  return <main className="shell">
    <header><div className="mark">TM</div><div><p className="eyebrow">CONTAINERIZED WORKSPACE</p><h1>Task Management</h1></div></header>
    <section className="hero"><span className="pill">● Docker Compose</span><h2>Your stack, running together.</h2>
      <p>React frontend · Express API · MongoDB database</p>
      <div className="status"><span className="dot"></span>{status}</div>
    </section>
    <section className="services"><article><small>01 / CLIENT</small><h3>React Frontend</h3><p>Served by Nginx</p><b>localhost:5173</b></article>
      <article><small>02 / API</small><h3>Node + Express</h3><p>REST health endpoint</p><b>localhost:5000</b></article>
      <article><small>03 / STORAGE</small><h3>MongoDB</h3><p>Persistent named volume</p><b>mongodb:27017</b></article></section>
    <section className="tasks"><div><h2>Recent tasks</h2><p>Loaded through the backend API</p></div>
      {tasks.length ? tasks.map((t, i) => <div className="task" key={t._id || i}>{t.title || 'Task item'}</div>) :
      <div className="empty"><span>✓</span><b>Application interface is ready</b><p>No task records returned yet. The health endpoint confirms the API is reachable.</p></div>}
    </section><footer>Practical 11 · Containerization with Docker Compose</footer>
  </main>;
}
