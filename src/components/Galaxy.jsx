import { useEffect, useRef } from 'react';

export const Galaxy = ({
    starSpeed = 0.3,
    density = 1,
    hueShift = 120,
    speed = 0.2,
    glowIntensity = 0.2,
    saturation = 0,
    mouseRepulsion = true,
    repulsionStrength = 0.5,
    twinkleIntensity = 0.25,
    rotationSpeed = 0.05,
    transparent = false,
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let stars = [];
        const mouse = { x: null, y: null };
        let rotation = 0;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleScroll = () => {
            // Optional: Pass scroll via props or handle here
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                // Uniform distribution across the screen
                this.baseX = (Math.random() - 0.5) * canvas.width * 1.5; // Wider spread
                this.baseY = (Math.random() - 0.5) * canvas.height * 1.5;

                this.x = canvas.width / 2 + this.baseX;
                this.y = canvas.height / 2 + this.baseY;

                this.size = Math.random() * 1.5 + 0.2; // Slightly smaller, sharper range
                this.twinklePhase = Math.random() * Math.PI * 2;
                this.baseAlpha = 0.6 + Math.random() * 0.4; // Higher base alpha for sharpness
                this.colorShift = Math.random() * 50;
            }

            update(scrollY) {
                // Twinkle - cleaner
                this.twinklePhase += starSpeed * 0.1;
                const twinkle = Math.sin(this.twinklePhase) * twinkleIntensity;
                this.alpha = Math.max(0.4, Math.min(1, this.baseAlpha + twinkle)); // Keep minimal visibility

                // Global Rotation
                const center = { x: canvas.width / 2, y: canvas.height / 2 };

                // Rotate base position
                const cos = Math.cos(rotationSpeed * 0.01);
                const sin = Math.sin(rotationSpeed * 0.01);
                const dbx = this.baseX;
                const dby = this.baseY;
                this.baseX = dbx * cos - dby * sin;
                this.baseY = dbx * sin + dby * cos;

                // Scroll Parallax
                const parallax = scrollY * 0.08 * (this.size / 2);

                this.x = center.x + this.baseX;
                this.y = center.y + this.baseY - parallax;

                // Mouse Repulsion
                if (mouseRepulsion && mouse.x !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const pushRadius = 250; // Slightly larger radius

                    if (dist < pushRadius) {
                        const force = (pushRadius - dist) / pushRadius;
                        const push = force * repulsionStrength * 40;
                        const angle = Math.atan2(dy, dx);
                        this.x += Math.cos(angle) * push;
                        this.y += Math.sin(angle) * push;
                    }
                }
            }

            draw() {
                // Color with hue shift
                const hue = hueShift + this.colorShift;
                const color = `hsla(${hue}, ${saturation}%, 85%, ${this.alpha})`; // Brighter white

                ctx.fillStyle = color;
                ctx.beginPath();

                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initStars = () => {
            // Density calculation
            const count = Math.floor((canvas.width * canvas.height) / 10000 * density * 5);
            stars = [];
            for (let i = 0; i < count; i++) {
                stars.push(new Star());
            }
        };

        const animate = () => {
            if (!transparent) {
                ctx.fillStyle = '#000'; // Default black if not transparent
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            const currentScrollY = window.scrollY;

            stars.forEach(star => {
                star.update(currentScrollY);
                star.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [starSpeed, density, hueShift, speed, glowIntensity, saturation, mouseRepulsion, repulsionStrength, twinkleIntensity, rotationSpeed, transparent]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 z-0 ${transparent ? 'bg-transparent' : 'bg-black'}`}
        />
    );
};
