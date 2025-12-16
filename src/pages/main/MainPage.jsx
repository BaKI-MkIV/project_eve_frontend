import { useState } from "react";
import styles from "./MainPage.module.css";
import SpaceBackground from "../../components/SpaceBackground/SpaceBackground";

export default function MainPage() {
    const [selected, setSelected] = useState(null);

    return (
        <div className={styles.page}>
            <div className={styles.background}>
                <SpaceBackground
                    selected={selected}
                    onSelect={setSelected}
                />
            </div>

            <div className={styles.content}>
                {selected && <div>Выбран объект: {selected}</div>}
            </div>
        </div>
    );
}