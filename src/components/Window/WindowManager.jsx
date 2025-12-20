// src/components/WindowManager.jsx

import React, { useState } from "react";
import SidebarPanel from "../SidebarPanel/SidebarPanel.jsx";
import Window from "../Window/Window.jsx";
import UserPanel from "../Panels/UserPanel.jsx";
import ActorPanel from "../Panels/ActorPanel.jsx";
import WalletPanel from "../Panels/WalletPanel.jsx";
import InventoryPanel from "../Panels/InventoryPanel.jsx";
import DevPanel from "../Panels/DevPanel.jsx";
import TransferPanel from "../Panels/TransferPanel.jsx"; // ← твоя консоль мастера

/*
  ВАЖНО:
  - content → component
  - храним ССЫЛКУ на компонент, а не JSX
*/
const allItems = [
    { id: "user", title: "Пользователь", component: UserPanel },
    { id: "actor", title: "Персонаж", component: ActorPanel },
    { id: "wallet", title: "Кошелёк", component: WalletPanel },
    { id: "inventory", title: "Инвентарь", component: InventoryPanel },
    // DevPanel — только для мастера
    {
        id: "dev",
        title: "🔧 DevMod",
        component: DevPanel,
        visibleFor: 'master'  // ← ключевой флаг
    },
    { id: "transfer", title: "Переводы", component: TransferPanel },
];

export default function WindowManager() {
    const [windows, setWindows] = useState([]);
    const [blinkingIcons, setBlinkingIcons] = useState(new Set());

    // Получаем роль один раз при рендере
    const role = localStorage.getItem('role') || 'player';

    // Фильтруем элементы боковой панели по роли
    const sidebarItems = allItems.filter(item => {
        if (item.visibleFor) {
            return role === item.visibleFor;
        }
        return true;
    });

    const bringToFront = (id) => {
        setWindows((prev) => {
            const maxZ = Math.max(...prev.map((w) => w.zIndex), 100);
            return prev.map((w) =>
                w.id === id ? { ...w, zIndex: maxZ + 1 } : w
            );
        });
    };

    const openOrFocusWindow = (id, title, component) => {
        setWindows((prev) => {
            const existing = prev.find((w) => w.id === id);

            if (existing) {
                if (existing.isMinimized) {
                    setBlinkingIcons((prevSet) => {
                        const next = new Set(prevSet);
                        next.delete(id);
                        return next;
                    });

                    return prev.map((w) =>
                        w.id === id
                            ? {
                                ...w,
                                isMinimized: false,
                                zIndex: Math.max(...prev.map((ww) => ww.zIndex)) + 1,
                            }
                            : w
                    );
                }

                bringToFront(id);
                return prev;
            }

            const maxZ = Math.max(...prev.map((w) => w.zIndex), 100);

            return [
                ...prev,
                {
                    id,
                    title,
                    Component: component,
                    zIndex: maxZ + 1,
                    isMinimized: false,
                    previousSize: null,
                    previousPosition: null,
                },
            ];
        });
    };

    const minimizeWindow = (id) => {
        setWindows((prev) =>
            prev.map((w) =>
                w.id === id ? { ...w, isMinimized: true } : w
            )
        );

        setBlinkingIcons((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    };

    const maximizeWindow = (id, { size, position }) => {
        setWindows((prev) =>
            prev.map((w) =>
                w.id === id
                    ? {
                        ...w,
                        previousSize: size,
                        previousPosition: position,
                    }
                    : w
            )
        );
    };

    const restoreWindow = (id) => {
        setWindows((prev) =>
            prev.map((w) =>
                w.id === id
                    ? {
                        ...w,
                        previousSize: null,
                        previousPosition: null,
                    }
                    : w
            )
        );
    };

    const closeWindow = (id) => {
        setWindows((prev) => prev.filter((w) => w.id !== id));

        setBlinkingIcons((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    return (
        <>
            <SidebarPanel
                items={sidebarItems}  // ← передаём отфильтрованный список
                onOpenWindow={(item) =>
                    openOrFocusWindow(item.id, item.title, item.component)
                }
                blinkingIcons={blinkingIcons}
            />

            {windows.map((win) => (
                <Window
                    key={win.id}
                    title={win.title}
                    zIndex={win.zIndex}
                    isMinimized={win.isMinimized}
                    bringToFront={() => bringToFront(win.id)}
                    onClose={() => closeWindow(win.id)}
                    onMinimize={() => minimizeWindow(win.id)}
                    onMaximize={(state) => maximizeWindow(win.id, state)}
                    onRestore={() => restoreWindow(win.id)}
                    previousSize={win.previousSize}
                    previousPosition={win.previousPosition}
                >
                    <win.Component />
                </Window>
            ))}
        </>
    );
}