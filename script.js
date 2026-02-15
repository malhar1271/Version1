const canvas = document.getElementById('connections');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const totalFrames = 12;
const frames = [];
const links = [];

// --- METADATA FOR EACH IMAGE ---
const metadata = [
  {
    file: "Image-1.png",
    title: "Versa-Lite",
    date: "2024",
    description: "Designed for Finnish student life, it provides dynamic lighting in a dynamic work environment"
  },
  {
    file: "Image-2.jpg",
    title: "The Re-Frame Project",
    date: "2025",
    description: "A piece of furniture at the intersection of space and form. Using only plywood as a material, we were tasked to create outdoor furniture that belonged specifically to the space it was designed for"
  },
  {
    file: "Image-3.jpg",
    title: "Peace Encaged",
    date: "2026",
    description: "A lighting object designed for the LUX Helsinki '26 event around the theme of peace"
  },
  {
    file: "Image-4.JPG",
    title: "WhyTheFuggNot",
    date: "2024",
    description: "The project of two jobless students, James and I, documented on Instagram @WhyTheFuggNot. It must slot-in from the top, onto the extension poles that are a part of Aalto infrastructure"
  },
  {
    file: "Image-5.png",
    title: "Versa-Lite",
    date: "2024",
    description: "Testing to find the perfect balance between flexibility and strength"
  },
  {
    file: "Image-6.png",
    title: "Versa-Lite",
    date: "2024",
    description: "Works with a min. 3 individual pieces. The base and aluminium profiles are constant, but the lampshades are customisable"
  },
  {
    file: "Image-7.jpg",
    title: "The Re-Frame Project",
    date: "2025",
    description: "A piece of furniture at the intersection of space and form. Using only plywood as a material, we were tasked to create outdoor furniture that belonged specifically to the space it was designed for"
  },
  {
    file: "Image-8.jpg",
    title: "The Re-Frame Project",
    date: "2025",
    description: "A piece of furniture at the intersection of space and form. Using only plywood as a material, we were tasked to create outdoor furniture that belonged specifically to the space it was designed for"
  },
  {
    file: "Image-9.jpg",
    title: "Peace Encaged",
    date: "2026",
    description: "The process was driven by the material choice, and the material choice was driven by the concept of peace encaged"
  },
  {
    file: "Image-10.jpg",
    title: "Peace Encaged",
    date: "2026",
    description: "Peace Encaged captures the idea that peace can exist even within imposed boundaries"
  },
  {
    file: "Image-11.JPG",
    title: "WhyTheFuggNot",
    date: "2024",
    description: "The project of two jobless students, James and I, documented on Instagram @WhyTheFuggNot"
  },
  {
    file: "Image-12.JPG",
    title: "WhyTheFuggNot",
    date: "2024",
    description: "The form followed the aesthetics of the space: functional yet minimal"
  },

];

let mouseX = 0;
let mouseY = 0;
let activeFrame = null;
let offsetX = 0;
let offsetY = 0;

// Physics parameters
const damping = 0.9;
const repulsion = 15000; // stronger for organic spacing
const spring = 0.001;     // small spring toward center to keep overall balance

// Initialize frames
for (let i = 0; i < totalFrames; i++) {
    const frame = document.createElement('div');
    frame.classList.add('frame');

    const img = document.createElement('img');
img.src = `images/${metadata[i].file}`; // uses the file name from metadata
frame.appendChild(img);
    document.body.appendChild(frame);

    frame.x = Math.random() * (canvas.width - 150);
    frame.y = Math.random() * (canvas.height - 150);
    frame.vx = 0;
    frame.vy = 0;
    
    frame.width = 120;
    frame.height = 120;

    frame.style.width = frame.width + 'px';
    frame.style.height = frame.height + 'px';
    frame.style.left = frame.x + 'px';
    frame.style.top = frame.y + 'px';

        // --- NEW: metadata for hover ---
    // --- metadata for hover ---
frame.meta = metadata[i];

    frames.push(frame);
    
}

// Connect all frames visually
for (let i = 0; i < frames.length; i++) {
    for (let j = i + 1; j < frames.length; j++) {
        links.push([frames[i], frames[j]]);
    }
}

// Mouse events
document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

frames.forEach(frame => {
    frame.addEventListener('mousedown', e => {
        e.preventDefault();
        activeFrame = frame;
        offsetX = mouseX - frame.x;
        offsetY = mouseY - frame.y;
        frame.style.cursor = 'grabbing';
    });
});

document.addEventListener('mouseup', () => {
    if (activeFrame) activeFrame.style.cursor = 'grab';
    activeFrame = null;
});

// Animate function
function animate() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    frames.forEach(f1 => {
        // Determine scale based on distance from center
        const dxC = f1.x + f1.width / 2 - centerX;
        const dyC = f1.y + f1.height / 2 - centerY;
        const distC = Math.hypot(dxC, dyC);
        const maxDist = Math.hypot(centerX, centerY);
        const minScale = 0.1;
        const maxScale = 2.5;
        const scale = maxScale - (distC / maxDist) * (maxScale - minScale);

        const fWidth = f1.width * scale;
        const fHeight = f1.height * scale;

        if (f1 !== activeFrame) {
            let fx = 0;
            let fy = 0;

            // Repulsion from all other frames
            frames.forEach(f2 => {
                if (f1 === f2) return;

                const dx = (f1.x + fWidth/2) - (f2.x + f2.width * scale / 2);
                const dy = (f1.y + fHeight/2) - (f2.y + f2.height * scale / 2);
                const dist = Math.hypot(dx, dy) || 1;

                const force = repulsion / (dist * dist);
                fx += (dx / dist) * force;
                fy += (dy / dist) * force;
            });

            // Slight spring toward center to avoid edges
            const dxCenter = centerX - (f1.x + fWidth / 2);
            const dyCenter = centerY - (f1.y + fHeight / 2);
            fx += dxCenter * spring;
            fy += dyCenter * spring;

            f1.vx = (f1.vx + fx) * damping;
            f1.vy = (f1.vy + fy) * damping;

            f1.x += f1.vx;
            f1.y += f1.vy;
        } else {
            // Dragged frame follows mouse
            f1.x = mouseX - offsetX;
            f1.y = mouseY - offsetY;
        }

        // Keep inside canvas
        f1.x = Math.max(0, Math.min(canvas.width - fWidth, f1.x));
        f1.y = Math.max(0, Math.min(canvas.height - fHeight, f1.y));

        f1.style.left = f1.x + 'px';
        f1.style.top = f1.y + 'px';
        f1.style.transform = `scale(${scale})`;
    });

    // Draw connecting lines
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    links.forEach(([f1, f2]) => {
        ctx.beginPath();
        ctx.moveTo(f1.x + f1.width / 2, f1.y + f1.height / 2);
        ctx.lineTo(f2.x + f2.width / 2, f2.y + f2.height / 2);
        ctx.stroke();
    });

    requestAnimationFrame(animate);
}

animate();

// =============================
// NEW: Hover Info Panels
// =============================

const hoverLeft = document.querySelector('.hover-left');
const hoverRight = document.querySelector('.hover-right');

frames.forEach(frame => {

    frame.addEventListener('mouseenter', () => {

        if (!hoverLeft || !hoverRight) return;

        hoverLeft.innerHTML = `
            <div>${frame.meta.title}</div>
            <div style="opacity:0.6;">${frame.meta.date}</div>
        `;

        hoverRight.innerHTML = `
            <div>${frame.meta.description}</div>
        `;

        hoverLeft.classList.add('active');
        hoverRight.classList.add('active');
    });

    frame.addEventListener('mouseleave', () => {

        if (!hoverLeft || !hoverRight) return;

        hoverLeft.classList.remove('active');
        hoverRight.classList.remove('active');
    });

});