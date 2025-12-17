// components/DesktopManager/DesktopManager.jsx
import React, { useState } from "react";
import SidebarPanel from "../SidebarPanel/SidebarPanel.jsx";
import Window from "../Window/Window.jsx";
import UserPanel from "../Panels/UserPanel.jsx"; // твой компонент окна

// Импортируй сюда все панели-контенты

// import CharactersPanel from "../windows/CharactersPanel.jsx";
// import WalletPanel from "../windows/WalletPanel.jsx";
// import InventoryPanel from "../windows/InventoryPanel.jsx";

const defaultItems = [
    { name: "Пользователь", content: <UserPanel /> },
    { name: "Персонажи",   content: <div style={{padding: "20px", color: "#fff"}}>Персонажи (в разработке)</div> },
    { name: "Кошелек",     content: <div style={{padding: "20px", color: "#fff"}}>Кошелёк (в разработке)</div> },
    { name: "Инвентарь",   content: <div style={{padding: "20px", color: "#fff"}}>Инвентарь (в разработке)</div> },
];

export default function WindowManager() {
    const [openWindows, setOpenWindows] = useState([]);

    const openOrFocusWindow = (id, title, content) => {
        setOpenWindows((prev) => {
            const existing = prev.find((w) => w.id === id);

            if (existing) {
                // Поднимаем наверх
                const maxZ = Math.max(...prev.map((w) => w.zIndex), 100);
                return prev.map((w) =>
                    w.id === id ? { ...w, zIndex: maxZ + 1 } : w
                );
            }

            // Открываем новое
            const maxZ = Math.max(...prev.map((w) => w.zIndex), 100);
            return [
                ...prev,
                {
                    id,
                    title,
                    content,
                    zIndex: maxZ + 1,
                },
            ];
        });
    };

    const closeWindow = (id) => {
        setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    };

    const bringToFront = (id) => {
        setOpenWindows((prev) => {
            const maxZ = Math.max(...prev.map((w) => w.zIndex), 100);
            return prev.map((w) =>
                w.id === id ? { ...w, zIndex: maxZ + 1 } : w
            );
        });
    };

    return (
        <>
            {/* Боковая панель — всегда сверху */}
            <SidebarPanel
                items={defaultItems}
                onOpenWindow={openOrFocusWindow}
            />

            {/* Все окна */}
            {openWindows.map((win) => (
                <Window
                    key={win.id}
                    title={win.title}
                    onClose={() => closeWindow(win.id)}
                    zIndex={win.zIndex}
                    onFocus={() => bringToFront(win.id)}

                >
                    {win.content}
                </Window>
            ))}
        </>
    );
}