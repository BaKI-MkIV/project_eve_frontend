import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TWO_PI = Math.PI * 2;
const ORBIT_START_CLEARANCE = 2.0;
const ORBIT_GAP = 1.2;
const SELECTION_CLEARANCE = 2.0;

/* ---------- Орбита (тонкая линия) ---------- */
function Orbit({ radius }) {
    const points = [];
    const segments = 128;

    for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * TWO_PI;
        points.push(
            new THREE.Vector3(
                Math.cos(a) * radius,
                0,
                Math.sin(a) * radius
            )
        );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    return (
        <lineLoop geometry={geometry}>
            <lineBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.2}
                depthWrite={false}
                depthTest={false}
            />
        </lineLoop>
    );
}

function SelectionRing({ data }) {
    let ringRadius;

    switch (data.type) {
        case "sphere":
            ringRadius = data.radius;
            break;
        case "box":
            { const side = (data.radius || 0.5) * 2;
            ringRadius = (side * Math.sqrt(3)) / 2; // до вершины куба
            break; }
        case "triangle":
            // Вершины треугольника: (0,1), (-1,-1), (1,-1)
            // Максимальное расстояние до центра = sqrt(1^2 + 0^2) = 1
            // После масштабирования на data.radius
            ringRadius = (data.radius || 0.5) * 8; // подгонка, чтобы кольцо выглядело нормально
            break;

        default:
            ringRadius = data.radius || 0.5;
    }

    const THICKNESS = 0.1;
    const OFFSET = 0.5;
    const inner = ringRadius + OFFSET;
    const outer = inner + THICKNESS;

    return (
        <mesh position={[0, 0.08, 0]}>
            <ringGeometry args={[inner, outer, 64]} />
            <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.95}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    );
}

/* ---------- Тело ---------- */
function Body({ data, selected, onSelect, orbitRadius }) {
    const ref = useRef();

    // Устанавливаем позицию один раз при монтировании
    useEffect(() => {
        if (!ref.current) return;

        // Если это центральный объект — ставим в центр
        if (!orbitRadius) {
            ref.current.position.set(0, 0, 0);
            return;
        }

        // Для объектов на орбите
        let angle;

        // Если угол задан в градусах — конвертируем
        if (data.angleDeg !== undefined) {
            angle = (data.angleDeg * Math.PI) / 180;
        } else if (data.angle !== undefined) {
            angle = data.angle; // уже в радианах
        } else {
            // запасной вариант — случайный угол
            angle = Math.random() * Math.PI * 2;
        }

        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius;

        ref.current.position.set(x, 0, z);
    }, [orbitRadius, data.angle, data.angleDeg]);

    // ... остальной код геометрии и материала (без изменений)
    let geometry;
    let scale = [1, 1, 1];
    switch (data.type) {
        case "sphere":
            geometry = <sphereGeometry args={[data.radius || 0.5, 32, 32]} />;
            break;
        case "box":
            { const size = (data.radius || 0.5) * 2;
            geometry = <boxGeometry args={[size, size, size]} />;
            break; }
        case "triangle":
            { const shape = new THREE.Shape();
            shape.moveTo(0, 1);
            shape.lineTo(-1, -1);
            shape.lineTo(1, -1);
            shape.closePath();
            geometry = <shapeGeometry args={[shape]} />;
            scale = [data.radius || 0.5, data.radius || 0.5, data.radius || 0.5];
            break; }
        default:
            geometry = <sphereGeometry args={[0.5, 32, 32]} />;
    }

    return (
        <group
            ref={ref}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={scale}
            onClick={(e) => {
                e.stopPropagation();
                if (selected === data.id) {
                    // Если объект уже выбран, снимаем выделение
                    onSelect?.(null);
                } else {
                    // Иначе выбираем
                    onSelect?.(data.id);
                }
            }}
        >
            <mesh>
                {geometry}
                <meshBasicMaterial color={data.color || "#ff00ff"} />
            </mesh>

            {selected === data.id && <SelectionRing data={data} />}
        </group>
    );
}

/* ---------- Canvas ---------- */
export default function CanvasPseudo3D({ selected, onSelect, planet, moons }) {
    // Генерация орбит на основе planet.numOrbits
    const orbitRadii = {};
    let currentRadius = planet.radius + ORBIT_START_CLEARANCE;
    for (let i = 1; i <= planet.numOrbits; i++) {
        orbitRadii[i] = currentRadius;
        currentRadius += ORBIT_GAP;
    }

    const orbits = Object.entries(orbitRadii).map(([num, radius]) => ({
        id: `orbit_${num}`,
        radius,
    }));

    const bodies = [planet, ...moons].filter(o => o.visible !== false);

    // Максимальная орбита для кольца частиц
    const lastOrbit = orbits.length > 0 ? orbits[orbits.length - 1].radius : planet.radius + SELECTION_CLEARANCE;

    return (
        <Canvas
            orthographic
            camera={{ position: [0, 30, 0], zoom: 25, near: 0.1, far: 100 }}
        >

            <ambientLight intensity={0.4} />
            <pointLight position={[0, 0, 0]} intensity={1.3} color="#ffaa55" />

            {/* Орбиты */}
            {orbits.map(o => (
                <Orbit key={o.id} radius={o.radius} />
            ))}

            {/* Тела */}
            {bodies.map(b => {
                const orbitRadius = b === planet ? undefined : orbitRadii[b.orbitNumber];
                return <Body
                    key={b.id}
                    data={b}
                    selected={selected}
                    onSelect={onSelect}
                    orbitRadius={orbitRadius}
                />;
            })}

            {/* Кольцо частиц, если есть */}
            {planet.hasRing && (
                <Ring inner={lastOrbit + 5} outer={lastOrbit + 18} />
            )}
        </Canvas>
    );
}

/* ---------- Кольцо частиц ---------- */
function Ring({ inner, outer }) {
    const ref = useRef();
    const count = 3000;

    useEffect(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const a = Math.random() * TWO_PI;
            const r = inner + Math.random() * (outer - inner);

            pos[i * 3] = Math.cos(a) * r;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
            pos[i * 3 + 2] = Math.sin(a) * r;
        }
        ref.current.geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    }, [inner, outer]);

    useFrame((_, d) => {
        if (ref.current) ref.current.rotation.y += d * 0.05;
    });

    return (
        <points ref={ref}>
            <bufferGeometry />
            <pointsMaterial
                color="#b8b8b8"
                size={0.06}
                transparent
                opacity={0.75}
                depthWrite={false}
            />
        </points>
    );
}