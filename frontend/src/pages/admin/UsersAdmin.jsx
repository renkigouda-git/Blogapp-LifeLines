import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { Link } from 'react-router-dom';

export default function UsersAdmin() {
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN');

  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);

    api.get('/api/admin/users')
      .then(res => {
        setUsers(res.data || []);
        setError('');
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <main className="container page">
        <h1>Users</h1>
        <div className="alert">You don’t have permission to view this page.</div>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1>Users</h1>
      <p className="small">Manage roles and ban/unban users.</p>

      {loading && <p>Loading…</p>}
      {error && <p className="alert">{error}</p>}

      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Banned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.banned ? 'Yes' : 'No'}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={e => changeRole(u.id, e.target.value, setUsers)}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  {' '}
                  <button
                    className="btn small"
                    onClick={() => toggleBan(u.id, !u.banned, setUsers)}
                  >
                    {u.banned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link className="btn" to="/admin">← Back to Admin</Link>
    </main>
  );
}

// use POST to match backend
async function changeRole(id, role, setUsers) {
  try {
    const res = await api.post(`/api/admin/users/${id}/role`, { role });
    const updated = res.data;
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  } catch (err) {
    console.error(err);
    alert('Failed to change role');
  }
}

async function toggleBan(id, banned, setUsers) {
  try {
    const res = await api.post(`/api/admin/users/${id}/ban`, { banned });
    const updated = res.data;
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  } catch (err) {
    console.error(err);
    alert('Failed to change ban status');
  }
}
