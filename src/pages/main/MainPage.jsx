import { useState } from "react";
import styles from "./MainPage.module.css";
import SpaceBackground from "../../components/SpaceBackground/SpaceBackground";
import SidebarPanel from "../../components/SidebarPanel/SidebarPanel.jsx";
import WindowManager from "../../components/Window/WindowManager.jsx";


export default function MainPage() {
    const [selected, setSelected] = useState(null);

    return (
        <div className={styles.page}>
            {/* Фон — самый нижний слой */}
            <div className={styles.background}>
                <SpaceBackground
                    selected={selected}
                    onSelect={setSelected}
                />
            </div>

            {/* Менеджер рабочего стола — поверх фона */}
            <WindowManager />

            {/* Если будут другие элементы (например, HUD) — клади их сюда */}
        </div>
    );
}