import React from "react";
import styles from "./SidebarPanel.module.css";
import { FaStar } from "react-icons/fa";

export default function SidebarPanel({
                                         items = [],
                                         onOpenWindow,
                                         blinkingIcons = new Set(),
                                     }) {
    const handleClick = (item) => {
        onOpenWindow?.(item);
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.cornerTL} />
            <div className={styles.cornerTR} />
            <div className={styles.cornerBL} />
            <div className={styles.cornerBR} />

            <div className={styles.iconsContainer}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`${styles.iconWrapper} ${
                            blinkingIcons.has(item.id) ? styles.blinking : ""
                        }`}
                        onClick={() => handleClick(item)}
                    >
                        <div className={styles.icon}>
                            <FaStar size={40} />
                        </div>
                        <span className={styles.tooltip}>{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
