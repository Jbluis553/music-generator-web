const playBtn = document.getElementById('playBtn');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playNote(frequency, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine'; // Puedes cambiar a 'square' o 'sawtooth'
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

playBtn.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    // Genera 8 notas aleatorias
    for (let i = 0; i < 8; i++) {
        const randomFreq = 200 + Math.random() * 600;
        setTimeout(() => playNote(randomFreq, 0.5), i * 500);
    }
});
