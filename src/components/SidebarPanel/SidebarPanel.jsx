// SidebarPanel.jsx
import React from "react";
import styles from "./SidebarPanel.module.css";
import { FaStar } from "react-icons/fa";

export default function SidebarPanel({ items = [], onOpenWindow }) {
    const handleClick = (idx) => {
        const item = items[idx];
        if (item && item.content && onOpenWindow) {
            onOpenWindow(idx, item.name, item.content);
        }
    };

    return (
        <div className={styles.sidebar}>
            {/* Углы рамки */}
            <div className={styles.cornerTL}></div>
            <div className={styles.cornerTR}></div>
            <div className={styles.cornerBL}></div>
            <div className={styles.cornerBR}></div>

            <div className={styles.iconsContainer}>
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className={styles.iconWrapper}
                        onClick={() => handleClick(idx)}
                    >
                        <div className={styles.icon}>
                            <FaStar size={40} />
                        </div>
                        <span className={styles.tooltip}>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}