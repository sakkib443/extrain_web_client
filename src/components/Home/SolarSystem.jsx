"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";

// A 3D solar system for a section background, built with CSS 3D only (see the .sys-* rules in globals.css).
// It leans with the mouse, tilts and turns a little as you scroll, and every planet keeps orbiting.
//
//   p, mx, my, reduce → from useSectionMotion()

// Stylised continents on a 2:1 tile. The tile is slid sideways across the Earth ball → a spinning globe.
const EARTH_SVG =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'>" +
    "<g fill='#48b560'>" +
    "<path d='M20 18C30 10 45 14 48 24C50 32 42 36 44 44C46 52 40 58 36 66C33 74 28 82 24 76C22 66 26 58 22 50C18 42 10 36 12 28C13 22 16 20 20 18Z'/>" +
    "<path d='M92 20C100 14 112 16 116 24C120 30 112 34 114 42C116 50 120 56 114 66C108 74 100 72 98 62C96 54 100 48 94 42C88 36 86 26 92 20Z'/>" +
    "<path d='M128 18C140 10 164 12 176 22C184 30 178 38 166 38C156 38 150 46 140 44C130 42 122 30 128 18Z'/>" +
    "<path d='M160 62C168 58 178 62 178 70C178 76 168 80 162 76C156 72 154 66 160 62Z'/>" +
    "</g>" +
    "<g fill='#dccb8c' opacity='.85'><path d='M100 26C104 24 110 28 108 34C106 38 100 36 98 32Z'/></g>" +
    "<g fill='#fff' opacity='.92'><ellipse cx='100' cy='0' rx='110' ry='5'/><ellipse cx='100' cy='100' rx='110' ry='5'/></g>" +
    "</svg>";
const EARTH_LAND = `url("data:image/svg+xml,${encodeURIComponent(EARTH_SVG)}")`;
const EARTH_OCEAN = "radial-gradient(circle at 36% 32%, #66bdff 0%, #2a80e2 42%, #0c3e8e 100%)";

const JUPITER =
    "radial-gradient(ellipse 22% 14% at 66% 62%, rgba(186,68,40,.9), rgba(186,68,40,0) 72%)," +
    "repeating-linear-gradient(180deg, #ecd3ae 0 8%, #c68f5f 8% 15%, #f3e1c1 15% 27%, #b97a4c 27% 34%, #e7c89e 34% 46%, #a86a40 46% 52%)";
const SATURN = "repeating-linear-gradient(180deg, #f5e4be 0 12%, #d9ba84 12% 22%, #edd7a5 22% 36%)";

// ring = orbit diameter in % of the scene · size = planet diameter in % of the scene
// period = seconds per orbit · angle = where it starts
const PLANETS = [
    { id: "mercury", ring: 22, empty: true },
    { id: "venus", ring: 34, size: 3.9, period: 30, angle: 205, bg: "radial-gradient(circle at 35% 30%, #f4ddae, #c99a52 58%, #7a5a2a)" },
    { id: "earth", ring: 48, size: 6.3, period: 46, angle: 120, earth: true },
    { id: "mars", ring: 61, empty: true },
    { id: "jupiter", ring: 80, size: 9.6, period: 100, angle: 18, bg: JUPITER },
    { id: "saturn", ring: 98, size: 7.6, period: 150, angle: 238, bg: SATURN, saturn: true },
];

const SCENE_W = "min(1100px, 80vw)";
const BASE_TILT = 67; // degrees the orbit plane is laid back

const SolarSystem = ({ p, mx, my, reduce }) => {
    // mouse up/down changes the viewing angle; scrolling tilts it a little and turns the whole system
    const tilt = useTransform([p, my], ([pv, mv]) => BASE_TILT + (0.5 - pv) * 8 + mv * 8);
    const tiltVar = useTransform(tilt, (v) => `${v.toFixed(2)}deg`);
    const spin = useTransform([p, mx], ([pv, xv]) => (pv - 0.5) * 70 - xv * 14);
    const rise = useTransform(p, [0, 1], [50, -50]);

    const sceneStyle = reduce
        ? { rotateX: BASE_TILT, transformStyle: "preserve-3d", "--tilt": `${BASE_TILT}deg` }
        : { rotateX: tilt, y: rise, transformStyle: "preserve-3d", "--tilt": tiltVar };
    const planeStyle = reduce ? { transformStyle: "preserve-3d" } : { rotate: spin, transformStyle: "preserve-3d" };

    const box = (diameter) => ({
        top: `${(100 - diameter) / 2}%`,
        left: `${(100 - diameter) / 2}%`,
        width: `${diameter}%`,
        height: `${diameter}%`,
    });

    return (
        <div
            aria-hidden="true"
            // opacity: the whole system is only a faint backdrop — it must never compete with the cards and text
            className="pointer-events-none absolute left-[82%] top-[15%] hidden opacity-[0.3] md:block"
            style={{
                width: SCENE_W,
                height: SCENE_W,
                marginLeft: `calc(${SCENE_W} / -2)`,
                marginTop: `calc(${SCENE_W} / -2)`,
                fontSize: `calc(${SCENE_W} / 100)`, // 1em = 1% of the scene
                perspective: "1700px",
            }}
        >
            <motion.div style={sceneStyle} className="absolute inset-0">
                <motion.div style={planeStyle} className="absolute inset-0">
                    {PLANETS.map((pl, i) => (
                        <div
                            key={pl.id}
                            className="sys-ring"
                            style={{ ...box(pl.ring), "--a": `${pl.angle}deg`, "--t": `${pl.period}s` }}
                        >
                            <i className={`sys-line ${i % 2 ? "sys-line-dash" : ""}`} />
                            {!pl.empty && <div className="sys-mover">
                                <div className="sys-holder">
                                    <div className="sys-counter">
                                        <div className="sys-face" style={{ fontSize: `${pl.size}em` }}>
                                            {pl.earth ? (
                                                <>
                                                    <i className="sys-body sys-earth" style={{ background: EARTH_OCEAN }}>
                                                        <b className="sys-earth-land" style={{ backgroundImage: EARTH_LAND }} />
                                                    </i>
                                                    <i className="sys-moon-orbit">
                                                        <b className="sys-moon" />
                                                    </i>
                                                </>
                                            ) : pl.saturn ? (
                                                <>
                                                    <i className="sys-sat-ring" />
                                                    <i className="sys-body" style={{ background: pl.bg }} />
                                                    <i className="sys-sat-ring sys-sat-front" />
                                                </>
                                            ) : (
                                                <i className="sys-body" style={{ background: pl.bg }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    ))}

                    {/* the sun */}
                    <div className="sys-sun">
                        <i />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SolarSystem;
