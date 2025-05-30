import React, { use, useEffect } from 'react'
import { useRouter } from 'next/router'
export default function Page() {
    const router = useRouter();
  const userId = router.query.userId;

  const [user, setUser] = React.useState(null);
  const [formData, setFormData] = React.useState({ name: '', email: '' });

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      const res = await fetch(`/api/users/?id=${userId}`, {
        headers: {
          'api-key': "API_KEY",
        },
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>; 
  }

    //edit and delete user
    const handleEdit = async () => {
        // Logic for editing the user
        console.log('Edit user:', user._id);
        const res = await fetch(`/api/users`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'api-key': "API_KEY",
            },
            body: JSON.stringify({
                id: user._id, 
                name: formData.name, 
                email: formData.email,
            })
        });

        if (res.ok) {
            console.log('User updated:', user._id);
            router.push(`/users`);
        }
        else {
            console.error('Failed to update user');
        }
    }
    const handleDelete = async () => {

        const res = await fetch(`/api/users`, {
            method: 'DELETE',
            headers: {
                'api-key': "API_KEY", 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: user._id })
        });
        if (res.ok) {
            console.log('User deleted:', user._id);
            router.push('/users'); // Redirect to users list after deletion
        } else {
            console.error('Failed to delete user');
        }
    };




  return (
    <div>
      <h1>User Details</h1>
      <form onSubmit={(e) => e.preventDefault()}>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
        <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
        <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
        <br />
        <button onClick={handleEdit}>Edit User</button>
        <button onClick={handleDelete}>Delete User</button>
        <button onClick={() => router.push('/users')}>Back to Users</button>
    </form>
    </div>
    
  )
}

