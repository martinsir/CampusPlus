import { gsap } from 'gsap';

// Animation for the splash screen
const splashAnimation = () => {
    const tl = gsap.timeline();

    // Fade in the logo and text
    tl.from('.splash-logo', {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        ease: 'power2.out',
    })
    .from('.splash h1', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out',
    }, '-=0.5') // Overlap with previous animation

    // Hold the splash screen for a moment
    .to('.splash', {
        opacity: 0,
        duration: 1,
        ease: 'power2.in',
        delay: 1,
        onComplete: () => {
            // Hide splash screen and show main content
            document.getElementById('splash').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        },
    });
};

// Run the animation
splashAnimation();
