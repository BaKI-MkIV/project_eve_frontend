import React, { useState, useRef, useEffect, useMemo } from "react";
import styles from "./Window.module.css";
import {
    FaWindowMinimize,
    FaWindowMaximize,
    FaWindowRestore,
} from "react-icons/fa";

export default function Window({
                                   title = "Window",
                                   children,
                                   onClose,
                                   zIndex = 10,
                                   bringToFront,
                                   isMinimized = false,
                                   onMinimize,
                                   onMaximize,
                                   onRestore,
                                   previousSize,
                                   previousPosition,
                               }) {
    const offset = useMemo(
        () => ({ x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 }),
        []
    );

    const [position, setPosition] = useState(
        previousPosition || {
            x: window.innerWidth / 2 - 300 + offset.x,
            y: window.innerHeight / 2 - 200 + offset.y,
        }
    );

    const [size, setSize] = useState(
        previousSize || { width: "auto", height: "auto" }
    );

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isMaximized, setIsMaximized] = useState(false);

    const windowRef = useRef(null);

    const handleMouseDown = (e, type) => {
        e.stopPropagation();
        bringToFront?.();

        if (type === "drag" && !isMaximized) {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }

        if (type === "resize" && !isMaximized) {
            setIsResizing(true);
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && windowRef.current && !isMaximized) {
            let newX = e.clientX - dragOffset.x;
            let newY = e.clientY - dragOffset.y;

            const winW = windowRef.current.offsetWidth;
            const winH = windowRef.current.offsetHeight;

            newX = Math.max(-winW + 100, Math.min(newX, window.innerWidth - 100));
            newY = Math.max(-winH + 100, Math.min(newY, window.innerHeight - 100));

            setPosition({ x: newX, y: newY });
        }

        if (isResizing && windowRef.current && !isMaximized) {
            const rect = windowRef.current.getBoundingClientRect();
            const newWidth = Math.max(300, e.clientX - rect.left);
            const newHeight = Math.max(200, e.clientY - rect.top);

            setSize({
                width: `${newWidth}px`,
                height: `${newHeight}px`,
            });
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
    }, [isDragging, isResizing, dragOffset, isMaximized]);

    const toggleMaximize = () => {
        if (isMaximized) {
            setSize(previousSize || { width: "auto", height: "auto" });
            setPosition(
                previousPosition || {
                    x: window.innerWidth / 2 - 300,
                    y: window.innerHeight / 2 - 200,
                }
            );
            setIsMaximized(false);
            onRestore?.();
        } else {
            onMaximize?.({ size, position });
            setSize({
                width: "calc(100vw - 240px)",
                height: "calc(100vh - 80px)",
            });
            setPosition({ x: 200, y: 40 });
            setIsMaximized(true);
        }

        bringToFront?.();
    };

    return (
        <div
            ref={windowRef}
            className={`${styles.window} ${
                isMaximized ? styles.maximized : ""
            } ${isMinimized ? styles.hidden : ""}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: size.width,
                height: size.height,
                zIndex,
            }}
            onMouseDown={bringToFront}
        >
            <div
                className={styles.titleBar}
                onMouseDown={(e) => handleMouseDown(e, "drag")}
            >
                <span className={styles.title}>{title}</span>

                <div className={styles.windowControls}>
                    <button
                        className={styles.controlButton}
                        onClick={onMinimize}
                        title="Свернуть"
                    >
                        <FaWindowMinimize />
                    </button>

                    <button
                        className={styles.controlButton}
                        onClick={toggleMaximize}
                        title="Развернуть"
                    >
                        {isMaximized ? (
                            <FaWindowRestore />
                        ) : (
                            <FaWindowMaximize />
                        )}
                    </button>

                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        title="Закрыть"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className={styles.content}>{children}</div>

            {!isMaximized && (
                <div
                    className={styles.resizeHandle}
                    onMouseDown={(e) => handleMouseDown(e, "resize")}
                />
            )}
        </div>
    );
}
