import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { getUsers, deleteUser, User } from '../../api/users';
import styles from './Users.module.scss';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  return (
    <div className={styles.usersContainer}>
      <div className={styles.header}>
        <h1>Users</h1>
        <Link to="/users/new" className={styles.addButton}>
          Add New User
        </Link>
      </div>

      {users.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No users found. Create your first user to get started.</p>
          <Link to="/users/new" className={styles.addButton}>
            Add New User
          </Link>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{dayjs(user.createdAt).format('MMM D, YYYY')}</td>
                  <td className={styles.actions}>
                    <Link to={`/users/${user.id}`} className={styles.viewButton}>
                      View
                    </Link>
                    <Link to={`/users/${user.id}/edit`} className={styles.editButton}>
                      Edit
                    </Link>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users; 