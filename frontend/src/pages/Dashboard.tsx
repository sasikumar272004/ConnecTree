import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>Welcome, {user.name}!</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <main className={styles.content}>
                <h2>Dashboard Content</h2>
                <p>You are now logged in to your account.</p>
            </main>
        </div>
    );
}