import styles from './Panel.module.css';

export default function ActorCard({ actor, onSelect }) {
    return (
        <div className={styles.card}>
            <h4>{actor.name}</h4>
            <small>{actor.description || 'Нет описания'}</small>
            <button className="button" onClick={() => onSelect(actor)}>
                Выбрать
            </button>
        </div>
    );
}
