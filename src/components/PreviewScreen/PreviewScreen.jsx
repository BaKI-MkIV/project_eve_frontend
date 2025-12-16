import { useState, useEffect } from 'react';
import styles from './PreviewScreen.module.css';
import { loginUser, fetchCurrentUser, fetchCurrentActor, logoutUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';


export default function PreviewScreen() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [currentActor, setCurrentActor] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();



    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            loadUserData(token);
        } else {
            setLoading(false);
        }
    }, []);

    const loadUserData = async (token) => {
        try {
            const userData = await fetchCurrentUser(token);
            setCurrentUser(userData);

            const actorData = await fetchCurrentActor(token);
            setCurrentActor(actorData);

            setIsAuthenticated(true);
        } catch (err) {
            logoutUser();
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { access, refresh } = await loginUser(login, password);
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            await loadUserData(access);
            setLogin('');
            setPassword('');
        } catch (err) {
            alert(err.message);
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
        return <div className={styles.container}>Загрузка...</div>;
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
                            <div className={styles.label}></div>
                            <input
                                type="text"
                                className={styles.input}
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="введите логин"
                                autoComplete="username"
                            />
                        </div>

                        <div className={styles.field}>
                            <div className={styles.label}></div>
                            <input
                                type="password"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="введите пароль"
                                autoComplete="current-password"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.field}>
                            <div className={styles.label}></div>
                            <div className={styles.infoText}>
                                {currentUser?.login || 'Пользователь'}
                            </div>
                        </div>

                        <div className={styles.field}>
                            <div className={styles.label}></div>
                            <div className={styles.infoText}>
                                {currentActor?.name || 'Актор не привязан'}
                            </div>
                        </div>
                    </>
                )}

                <div className={styles.brushLine} />

                <div className={styles.buttons}>
                    {!isAuthenticated ? (
                        <>
                            <button onClick={handleLogin} className={styles.button}>
                                ВОЙТИ
                            </button>

                            <button className={styles.button} style={{ visibility: 'hidden' }}></button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleContinue} className={styles.button}>
                                ПРОДОЛЖИТЬ С ЭТИМ АККАУНТОМ
                            </button>
                            <button onClick={handleLogout} className={styles.button}>
                                ВЫЙТИ
                            </button>
                        </>
                    )}
                </div>


            </div>
        </div>
    );
}