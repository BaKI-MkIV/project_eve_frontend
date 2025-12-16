// SpaceBackground.jsx
import { useMemo } from "react";
import CanvasPseudo3D from "./CanvasPseudo3D";
import planetData from "../../../public/planet.json";
import moonsData from "../../../public/moons.json";

export default function SpaceBackground({ selected, onSelect }) {
    const planet = useMemo(() => ({
        ...planetData,
        type: "sphere",
        color:
            planetData.type === "star" ? "#ffff00" :
                planetData.type === "gas giant" ? "#ffaa55" :
                    planetData.type === "terrestrial" ? "#00aaff" :
                        "#ff00ff",
    }), []);

    const moons = useMemo(() =>
            moonsData.map(moon => ({
                ...moon,
                type:
                    moon.displayType === "circle" ? "sphere" :
                        moon.displayType === "square" ? "box" :
                            moon.displayType === "triangle" ? "triangle" :
                                "sphere",
                color: moon.color || "#bbbbbb",
            })),
        []);

    return (
        <CanvasPseudo3D
            selected={selected}
            onSelect={onSelect}
            planet={planet}
            moons={moons}
        />
    );
}
