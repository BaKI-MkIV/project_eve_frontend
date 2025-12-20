import { useState, useEffect } from 'react';
import styles from './PreviewScreen.module.css';
import { loginUser, fetchCurrentUser, fetchCurrentActor, logoutUser } from '../../api/services/authService';
import { useNavigate } from 'react-router-dom';

export default function PreviewScreen() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [currentActor, setCurrentActor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false); // индикатор при логине
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            loadUserData();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await fetchCurrentUser();
            setCurrentUser(userData);

            const actorData = await fetchCurrentActor();
            setCurrentActor(actorData);

            setIsAuthenticated(true);
        } catch (err) {
            console.error('Ошибка загрузки данных пользователя:', err);
            logoutUser();
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!login || !password) {
            alert('Введите логин и пароль');
            return;
        }

        setLoginLoading(true);
        try {
            await loginUser(login, password);
            await loadUserData(); // перезагружаем данные после логина
            setLogin('');
            setPassword('');
        } catch (err) {
            alert('Ошибка входа: неверный логин или пароль');
            console.error(err);
        } finally {
            setLoginLoading(false);
        }
    };

    const handleContinue = () => {
        navigate('/main');
    };

    const handleLogout = () => {
        logoutUser();
        setIsAuthenticated(false);
        setCurrentUser(null);
        setCurrentActor(null);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <p>Загрузка...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.titleRow}>
                <h1 className={styles.titleLarge}>ДОМ,</h1>
                <h1 className={styles.titleSmall}>КОТОРЫЙ ПОСТРОИЛ</h1>
                <h1 className={styles.titleLarge}>ДЖЕК</h1>
            </div>

            <p className={styles.subtitle}>ЭПИЗОД 2: САМОЕ ЖИВОЕ СОЛНЦЕ</p>

            <div className={styles.authSection}>
                <div className={styles.brushLine} />

                {!isAuthenticated ? (
                    <>
                        <div className={styles.field}>
                            <input
                                type="text"
                                className={styles.input}
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="введите логин"
                                autoComplete="username"
                                disabled={loginLoading}
                            />
                        </div>

                        <div className={styles.field}>
                            <input
                                type="password"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="введите пароль"
                                autoComplete="current-password"
                                disabled={loginLoading}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.field}>
                            <div className={styles.infoText}>
                                Игрок: <strong>{currentUser?.login || 'Неизвестно'}</strong>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <div className={styles.infoText}>
                                Персонаж: <strong>{currentActor?.name || 'Не привязан'}</strong>
                            </div>
                        </div>
                    </>
                )}

                <div className={styles.brushLine} />

                <div className={styles.button}>
                    {!isAuthenticated ? (
                        <button onClick={handleLogin} className="button" disabled={loginLoading}>
                            {loginLoading ? 'Вход...' : 'ВОЙТИ'}
                        </button>
                    ) : (
                        <>
                            <button onClick={handleContinue} className="button">
                                ПРОДОЛЖИТЬ С ЭТИМ АККАУНТОМ
                            </button>
                            <button onClick={handleLogout} className="button">
                                ВЫЙТИ
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}