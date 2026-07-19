// Single shared scroll-direction tracker for the whole app.
// Avoids every ScrollBlurFade instance attaching its own scroll listener.

let lastY = typeof window !== "undefined" ? window.scrollY : 0;
let direction = "down"; // "down" | "up"
let ticking = false;

function update() {
    const currentY = window.scrollY;
    if (currentY > lastY) direction = "down";
    else if (currentY < lastY) direction = "up";
    lastY = currentY;
    ticking = false;
}

function onScroll() {
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
    }
}

if (typeof window !== "undefined") {
    window.addEventListener("scroll", onScroll, { passive: true });
}

export function getScrollDirection() {
    return direction;
}