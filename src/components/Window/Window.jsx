// components/Window/Window.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from "./Window.module.css";

export default function Window({
                                   title = "Window",
                                   children,
                                   onClose,
                                   zIndex = 10,
                                   bringToFront,
                               }) {
    // Смещение для новых окон (чтобы не накладывались)
    const offset = React.useMemo(() => ({
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
    }), []);

    const [position, setPosition] = useState({
        x: window.innerWidth / 2 - 300 + offset.x,
        y: window.innerHeight / 2 - 200 + offset.y,
    });

    const [size, setSize] = useState({ width: "40vw", height: "25vh" });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const windowRef = useRef(null);

    // Поднимаем окно при монтировании и при клике
    useEffect(() => {
        if (bringToFront) bringToFront();
    }, [bringToFront]);

    const handleMouseDown = (e, type) => {
        e.stopPropagation(); // Важно!
        if (bringToFront) bringToFront();

        if (type === "drag") {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        } else if (type === "resize") {
            setIsResizing(true);
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && windowRef.current) {
            let newX = e.clientX - dragOffset.x;
            let newY = e.clientY - dragOffset.y;

            const winWidth = windowRef.current.offsetWidth;
            const winHeight = windowRef.current.offsetHeight;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            newX = Math.max(-winWidth / 2, Math.min(newX, vw - winWidth / 2));
            newY = Math.max(-winHeight / 2, Math.min(newY, vh - winHeight / 2));

            setPosition({ x: newX, y: newY });
        } else if (isResizing && windowRef.current) {
            const rect = windowRef.current.getBoundingClientRect();
            let newWidth = e.clientX - rect.left;
            let newHeight = e.clientY - rect.top;

            newWidth = Math.max(300, newWidth);  // мин. ширина
            newHeight = Math.max(200, newHeight); // мин. высота

            setSize({ width: `${newWidth}px`, height: `${newHeight}px` });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isResizing, dragOffset]);

    return (
        <div
            ref={windowRef}
            className={styles.window}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: size.width,
                height: size.height,
                zIndex: zIndex,
            }}
            onMouseDown={bringToFront} // Клик в любом месте окна поднимает его наверх
        >
            <div
                className={styles.titleBar}
                onMouseDown={(e) => handleMouseDown(e, "drag")}
            >
                <span className={styles.title}>{title}</span>
                <button className={styles.closeButton} onClick={onClose}>
                    ×
                </button>
            </div>
            <div className={styles.content}>{children}</div>
            <div
                className={styles.resizeHandle}
                onMouseDown={(e) => handleMouseDown(e, "resize")}
            />
        </div>
    );
}