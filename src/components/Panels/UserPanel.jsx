// src/components/Panels/UserPanel.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../api/auth';
import { updateUser } from '../../api/user';
import { useUser } from '../../hooks/useUser';
import styles from './UserPanel.module.css';

export default function UserPanel() {
    const { user, loading, error: loadError, setUser, setError: setLoadError } = useUser();
    const [newLogin, setNewLogin] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [actionError, setActionError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    if (loading) return <div className={styles.message}>Загрузка...</div>;
    if (!user) return <div className={styles.message}>Не авторизован</div>;

    const registrationDate = new Date(user.created_at).toLocaleDateString('ru-RU');

    const handleChangeLogin = async () => {
        setActionError('');
        if (!newLogin.trim()) return setActionError('Введите новый логин');
        if (/[а-яА-ЯёЁ]/.test(newLogin)) return setActionError('Логин не может содержать кириллицу');

        try {
            const updated = await updateUser(token, { login: newLogin.trim() });
            setUser(updated);
            setNewLogin('');
            alert('Логин успешно изменён');
        } catch (err) {
            setActionError(err.message);
        }
    };

    const handleChangePassword = async () => {
        setActionError('');
        if (!newPassword || !confirmPassword) return setActionError('Заполните оба поля');
        if (newPassword !== confirmPassword) return setActionError('Пароли не совпадают');
        if (newPassword.length < 8) return setActionError('Пароль должен быть не менее 8 символов');
        if (/[а-яА-ЯёЁ]/.test(newPassword)) return setActionError('Пароль не может содержать кириллицу');

        try {
            await updateUser(token, { password: newPassword });
            setNewPassword('');
            setConfirmPassword('');
            alert('Пароль успешно изменён');
        } catch (err) {
            setActionError(err.message);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div className={styles.container}>
            {/* Заголовок можно добавить, если хочешь */}
            {/* <h2 className={styles.title}>Личный кабинет</h2> */}

            <div className={styles.info}>
                <p><strong>Логин:</strong> {user.login}</p>
                <p><strong>Дата регистрации:</strong> {registrationDate}</p>
            </div>

            {(loadError || actionError) && (
                <p className={styles.error}>{loadError || actionError}</p>
            )}

            <div className={styles.field}>
                <label className={styles.label}>Сменить логин</label>
                <input
                    className={styles.input}
                    type="text"
                    value={newLogin}
                    onChange={(e) => setNewLogin(e.target.value)}
                    placeholder="Новый логин (латиница)"
                />
                <button className={styles.button} onClick={handleChangeLogin}>
                    Изменить логин
                </button>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Сменить пароль</label>
                <input
                    className={styles.input}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Новый пароль"
                />
                <input
                    className={styles.input}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите пароль"
                />
                <button className={styles.button} onClick={handleChangePassword}>
                    Изменить пароль
                </button>
            </div>


            <button className={styles.logoutButton} onClick={handleLogout}>
                Выйти из аккаунта
            </button>
        </div>
    );
}