
import { useState, useEffect } from 'react';

export default function UsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch('/api/users', {
                headers: {
                    'api-key': "API_KEY", // Ensure you have your API key set in environment variables
                },
            });
            const data = await res.json();
            setUsers(data);
        };

        fetchUsers();
    }, []);
    console.log(users);

    return (
        <div>
            <h1>Users</h1>
            <ul>

                {users.map(user => (
                    <>
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                    <a href={`/${user._id}`}>View Details</a>
                    </>
                ))}

            </ul>
            <a href="/createuser">Add New User</a>
            
        </div>
    );
}