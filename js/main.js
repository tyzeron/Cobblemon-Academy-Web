
// Function to update parallax layers
function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    
    // Calculate scroll progress for layer-specific zoom effects
    const scrollProgress = Math.min(scrolled / maxScroll, 1);
    
    // Update parallax layers
    parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed);
        
        // Extract layer number from class name to determine zoom behavior
        const layerClass = Array.from(layer.classList).find(cls => cls.startsWith('layer-'));
        const layerNumber = parseInt(layerClass.replace('layer-', ''));
        
        // Calculate different zoom scales based on layer position
        let layerZoom;
        if ((layerNumber >= 1 && layerNumber <= 6) || (layerNumber >= 11 && layerNumber < 14)) {
            const foregroundInitialZoom = 2;
            const foregroundFinalZoom = 1;
            layerZoom = foregroundInitialZoom - (scrollProgress * (foregroundInitialZoom - foregroundFinalZoom));
        } else if (layerNumber >= 7 && layerNumber <= 10) {
            const middleInitialZoom = 1.5;
            const middleFinalZoom = 1.0;
            layerZoom = middleInitialZoom - (scrollProgress * (middleInitialZoom - middleFinalZoom));
        } else { // layer 14
            const backgroundInitialZoom = 1.5;
            const backgroundFinalZoom = 0.8;
            layerZoom = backgroundInitialZoom + (scrollProgress * (backgroundFinalZoom - backgroundInitialZoom));
        }
        
        // Calculate initial offset based on layer speed (opposite direction from scroll)
        // Faster layers get larger initial offsets to create immediate parallax effect
        const initialOffset = speed * 500; // Adjust multiplier to control initial separation
        
        // Combine scroll-based movement with initial offset
        const yPos = initialOffset - (scrolled * speed);
        
        // Use translate3d for hardware acceleration and combine with layer-specific zoom scaling
        layer.style.transform = `translate3d(0, ${yPos}px, 0) scale(${layerZoom})`;
    });
    
    // Update parallax group effects
    const parallaxGroups = document.querySelectorAll('.parallax-group');
    const currentTime = Date.now() * 0.001; // Convert to seconds
    
    parallaxGroups.forEach(group => {
        const groupScrollProgress = Math.min(scrolled / (window.innerHeight * 0.8), 1);
        
        // Calculate bobbing offset for each section
        let bobbingOffset = 0;
        if (group.classList.contains('cobblemon-section')) {
            bobbingOffset = Math.sin(currentTime * (2 * Math.PI / 4)) * -8; // 4 second cycle, 8px amplitude
        } else if (group.classList.contains('tavern-section')) {
            bobbingOffset = Math.sin((currentTime + 0.5) * (2 * Math.PI / 3.5)) * -6; // 3.5 second cycle, 6px amplitude, 0.5s offset
        }
        
        // Different effects for different groups
        if (group.classList.contains('cobblemon-section')) {
            if (groupScrollProgress <= 0.3) {
                // Cobblemon section: scale down during first 30% of scroll
                const normalizedProgress = groupScrollProgress / 0.3;
                const scale = 1.8 - (normalizedProgress * 1.5);
                const opacity = 1 - (normalizedProgress * 0.8);
                const yOffset = groupScrollProgress * 50 + bobbingOffset;
                group.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale})`;
                group.style.opacity = opacity;
            } else {
                // Apply bobbing when no scroll-based transform is active
                group.style.transform = `translate3d(0, ${bobbingOffset}px, 0)`;
                group.style.opacity = 0.2; // Keep faded opacity
            }
        } else if (group.classList.contains('tavern-section')) {
            if (groupScrollProgress > 0.3 && groupScrollProgress <= 0.8) {
                // Tavern section: scale up from 0.3 to 0.8
                const normalizedProgress = (groupScrollProgress - 0.3) / 0.5;
                const scale = 1.0 + (normalizedProgress * 1.7);
                const yOffset = groupScrollProgress * 50 + bobbingOffset;
                group.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale})`;
                group.style.opacity = 1; // Full opacity during scaling up
            } else if (groupScrollProgress > 0.8) {
                // Tavern section: scale down from 0.8 onwards
                const normalizedProgress = (groupScrollProgress - 0.8) / 0.2;
                const scale = 1.8 - (normalizedProgress * 1);
                const opacity = 1 - (normalizedProgress * 0.8);
                const yOffset = groupScrollProgress * 50 + bobbingOffset;
                group.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale})`;
                group.style.opacity = opacity;
            } else {
                // Apply bobbing when no scroll-based transform is active
                group.style.transform = `translate3d(0, ${bobbingOffset}px, 0)`;
                group.style.opacity = 1; // Full opacity when just bobbing
            }
        } else if (group.classList.contains('server-info') && groupScrollProgress > 0.8) {
            // Server-info section: scale up from 0.8 onwards
            const normalizedProgress = (groupScrollProgress - 0.8) / 0.2;
            const scale = 0.8 + (normalizedProgress * 0.5);
            const yOffset = groupScrollProgress * 50;
            group.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale})`;
        }
    });
    
    // Update scroll indicator visibility
    updateScrollIndicator();
}

// Enhanced parallax scrolling effect with zoom and initial offset
window.addEventListener('scroll', updateParallax);

// Initialize parallax effect on page load
window.addEventListener('load', updateParallax);
window.addEventListener('DOMContentLoaded', updateParallax);

// Continuous animation loop for bobbing effect
function animationLoop() {
    updateParallax();
    requestAnimationFrame(animationLoop);
}

// Start the animation loop
animationLoop();

// Copy IP to clipboard function
function copyIP() {
    const fallbackIP = 'play.cobblemonacademy.com';

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(fallbackIP).then(() => {
            showCopiedMessage();
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = fallbackIP;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showCopiedMessage();
        } catch (err) {
            console.error('Failed to copy IP:', err);
        }
        document.body.removeChild(textArea);
    }
}

function showCopiedMessage() {
    const message = document.getElementById('copiedMessage');
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 2000);
}

// Scroll indicator management
function updateScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    const scrolled = window.pageYOffset;
    const threshold = 150; // Hide after scrolling 150px
    
    if (scrollIndicator) {
        if (scrolled > threshold) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    }
}
