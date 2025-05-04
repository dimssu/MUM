import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { getUsers, deleteUser, updateUser, User } from '../../api/users';
import styles from './Users.module.scss';
import Avatar from '../../components/Common/Avatar/Avatar';
import SideDrawer from '../../components/Common/SideDrawer/SideDrawer';
import Form, { FormField, FormValues } from '../../components/Common/Form/Form';
import AddUserModal from './AddUserModal/AddUserModal';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers(users.filter(user => user._id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

//   // Handle view user
//   const handleView = (id: string) => {
//     console.log('Viewing user:', id);
//   };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ORG_ADMIN':
        return 'Org Admin';
      case 'ORG_USER':
        return 'Org User';
      default:
        return '-';
    }
  };

  // Handle edit user
  const handleEdit = (id: string) => {
    const user = users.find(user => user._id === id);
    if (user) {
      setSelectedUser(user);
      setIsDrawerOpen(true);
    }
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
  };

  // Handle add user button click
  const handleAddUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddUserModalOpen(true);
  };

  // Handle save user changes
  const handleSaveUser = async (values: FormValues) => {
    if (!selectedUser) return;
    
    try {
      setFormLoading(true);
      
      // Call the API to update the user
      await updateUser(selectedUser._id, values);
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user._id === selectedUser._id 
          ? { ...user, ...values } 
          : user
      ));
      
      toast.success('User updated successfully');
      setIsDrawerOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    } finally {
      setFormLoading(false);
    }
  };

  // Helper function to get full name
  const getFullName = (user: User) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || '-';
  };

  // Form fields for user edit
  const getUserFormFields = (): FormField[] => [
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      required: false,
      value: selectedUser?.first_name || '',
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      required: false,
      value: selectedUser?.last_name || '',
    },
    {
        name: 'userName',
        label: 'Username',
        type: 'text',
        required: false,
        value: selectedUser?.userName || '',
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: false,
        value: selectedUser?.email || '',
    },
    {
      name: 'profile_picture_url',
      label: 'Profile Picture URL',
      type: 'text',
      value: selectedUser?.profile_picture_url || '',
    },
    {
      name: 'phone_number',
      label: 'Phone Number',
      type: 'tel',
      patternMessage: 'Phone number must be 10 digits',
      value: selectedUser?.phone_number || '',
    },
  ];

  // Get initial values for the form
  const getInitialValues = (): FormValues => {
    if (!selectedUser) return {};
    
    return {
      userName: selectedUser.userName || '',
      first_name: selectedUser.first_name || '',
      last_name: selectedUser.last_name || '',
      profile_picture_url: selectedUser.profile_picture_url || '',
      phone_number: selectedUser.phone_number || '',
      email: selectedUser.email || '',
    };
  };

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  return (
    <>
    <div className={styles.usersContainer}>
      <div className={styles.header}>
        <h1>Users</h1>
        <a href="#" onClick={handleAddUserClick} className={styles.addButton}>
          Add New User
        </a>
      </div>

      {users?.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No users found. Create your first user to get started.</p>
          <a href="#" onClick={handleAddUserClick} className={styles.addButton}>
            Add New User
          </a>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.length > 0 && users?.map(user => (
                <tr key={user._id} onClick={() => handleEdit(user._id)}>
                  <td className={styles.avatarCell}>
                    <Avatar 
                      src={user.profile_picture_url} 
                      alt={getFullName(user)}
                      size={28}
                    />
                  </td>
                  <td>{getFullName(user)}</td>
                  <td>{user.userName || '-'}</td>
                  <td>{user.email || '-'}</td>
                  <td>{user.phone_number || '-'}</td>
                  <td><span className={styles.roleText}>{getRoleText(user.role)}</span></td>
                  <td>{dayjs(user.createdAt).format('MMM D, YYYY')}</td>
                  <td>{user.isVerified ? 'Verified' : 'Unverified'}</td>
                  <td className={styles.actions}>
                    {/* <button onClick={() => handleView(user._id)} className={styles.viewButton}>
                      View
                    </button> */}
                    <button onClick={() => handleEdit(user._id)} className={styles.editButton}>
                      Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(user._id)}
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

    {/* User Edit Side Drawer */}
    <SideDrawer
      isOpen={isDrawerOpen}
      onClose={handleDrawerClose}
      title={`Edit User: ${selectedUser ? getFullName(selectedUser) : ''}`}
      width="700px"
      onPrimaryClick={() => {}}
      onSecondaryClick={handleDrawerClose}
      drawerContainerStyle={{ backgroundColor: '#fff' }}
    >
      {selectedUser && (
        <>
          <div className={styles.profilePictureContainer}>
            <Avatar 
              src={selectedUser.profile_picture_url} 
              alt={getFullName(selectedUser)}
              size={100}
            />
            <h3>{getFullName(selectedUser)}</h3>
          </div>
          <div className={styles.userEditForm}>
            <Form
                fields={getUserFormFields()}
                initialValues={getInitialValues()}
                onSubmit={handleSaveUser}
                submitButtonText="Save Changes"
                cancelButtonText="Cancel"
                onCancel={handleDrawerClose}
                loading={formLoading}
            />
          </div>
        </>
        )}
      </SideDrawer>

    {/* Add User Modal */}
    <AddUserModal 
      isOpen={isAddUserModalOpen}
      onClose={() => setIsAddUserModalOpen(false)}
      onUserAdded={fetchUsers}
    />
    </>
  );
};

export default Users; 