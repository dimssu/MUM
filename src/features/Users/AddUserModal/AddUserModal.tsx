import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Input from '../../../components/Common/Input/Input';
import { registerUser } from '../../../api/users';
import styles from './AddUserModal.module.scss';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserModal = ({ isOpen, onClose, onUserAdded }: AddUserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setEmailError('');
      setPasswordError('');
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Call the registration API using the function from users.ts
      await registerUser({
        email,
        password,
      });
      
      toast.success('User added successfully');
      onClose();
      onUserAdded(); // Trigger refetch of users
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Add New User</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.inputGroup}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
              isValid={!emailError}
              errorMessage={emailError}
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
              isValid={!passwordError}
              errorMessage={passwordError}
              disabled={loading}
            />
          </div>
          <div className={styles.modalActions}>
            <button 
              className={styles.cancelButton} 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className={styles.submitButton} 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
