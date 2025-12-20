// src/components/Panels/ActorPanel.jsx
import { useState, useEffect } from 'react';
import { fetchActors, updateActor } from '../../api/user';
import { fetchCurrentActor } from '../../api/auth';
import ActorCard from './ActorCard';
import styles from './Panel.module.css';

export default function ActorPanel() {
    const [actor, setActor] = useState(null);
    const [actors, setActors] = useState([]);
    const [selectedActorId, setSelectedActorId] = useState(
        localStorage.getItem('selectedActorId')
    );

    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const role = localStorage.getItem('role');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError('');

            try {
                if (role === 'player') {
                    const data = await fetchCurrentActor();
                    if (!data) throw new Error('Актор не найден');

                    setActor(data);
                    setNewName(data.name || '');
                    setNewDescription(data.description || '');
                }

                if (role === 'master') {
                    const list = await fetchActors();
                    setActors(list);

                    if (selectedActorId) {
                        const selected = list.find(a => a.id == selectedActorId);
                        if (!selected) {
                            handleResetActor();
                        } else {
                            setActor(selected);
                            setNewName(selected.name || '');
                            setNewDescription(selected.description || '');
                        }
                    }
                }
            } catch (e) {
                setError(e.message || 'Ошибка загрузки');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [role, selectedActorId]);

    const handleSelectActor = (a) => {
        localStorage.setItem('selectedActorId', a.id);
        setSelectedActorId(a.id);
        setActor(a);
        setNewName(a.name || '');
        setNewDescription(a.description || '');
    };

    const handleResetActor = () => {
        localStorage.removeItem('selectedActorId');
        setSelectedActorId(null);
        setActor(null);
        setNewName('');
        setNewDescription('');
    };

    const handleUpdateActor = async () => {
        if (!newName.trim()) {
            setError('Имя не может быть пустым');
            return;
        }

        try {
            let updated;
            if (role === 'master' && selectedActorId) {
                // Мастер редактирует выбранного актора
                updated = await updateAnyActor(selectedActorId, {
                    name: newName.trim(),
                    description: newDescription.trim()
                });
            } else {
                // Игрок или мастер редактирует свой актор
                updated = await updateActor({
                    name: newName.trim(),
                    description: newDescription.trim()
                });
            }

            setActor(updated);
            alert('Актор обновлён');
        } catch (e) {
            setError(e.message || 'Ошибка обновления');
        }
    };

    if (loading) return <div className={styles.message}>Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;


    return (
        <div className={styles.container}>
            {role === 'player' && actor && (
                <>
                    <h2>Ваш персонаж</h2>

                    <div className={styles.field}>
                        <label className="label">Имя</label>
                        <input
                            className="input"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className="label">Описание</label>
                        <textarea
                            className="input"
                            value={newDescription}
                            onChange={e => setNewDescription(e.target.value)}
                        />
                    </div>

                    <button className="button" onClick={handleUpdateActor}>
                        Сохранить
                    </button>
                </>
            )}

            {role === 'master' && (
                <>

                    {actor ? (
                        <>
                            <div className={styles.field}>
                                <label className="label">Имя</label>
                                <input
                                    className="input"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                />
                            </div>

                            <div className={styles.field}>
                                <label className="label">
                                    Описание ({newDescription.length}/255)
                                </label>

                                <textarea
                                    className="input"
                                    maxLength={255}
                                    value={newDescription}
                                    onChange={e => setNewDescription(e.target.value)}
                                />
                            </div>

                            <button className="button" onClick={handleUpdateActor}>
                                Сохранить
                            </button>

                            <button className="button" onClick={handleResetActor}>
                                Сбросить выбор
                            </button>
                        </>
                    ) : (
                        <div className={styles.cardsContainer}>
                            {actors.map(a => (
                                <ActorCard
                                    key={a.id}
                                    actor={a}
                                    onSelect={handleSelectActor}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
