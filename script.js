// 1. Configuración de Modelos e Instrumentos
const musicRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
const drumSynth = new Tone.MembraneSynth().toDestination();

const GENRES = {
    'REGGAETON': { bpm: 92, steps: 16, temperature: 1.1 },
    'REGIONAL': { bpm: 125, steps: 12, temperature: 0.9 }, // Compás de 3/4 o 6/8
    'TRAP': { bpm: 140, steps: 16, temperature: 1.2 }
};

let isPlaying = false;

async function initAI() {
    document.getElementById('statusText').innerText = "Cargando IA...";
    await musicRNN.initialize();
    document.getElementById('statusText').innerText = "IA Lista";
}

async function generateBeat() {
    if (isPlaying) return;
    isPlaying = true;
    
    const genreKey = document.getElementById('genreSelect').value;
    const config = GENRES[genreKey];
    
    Tone.Transport.bpm.value = config.bpm;
    document.getElementById('statusText').innerText = "Componiendo...";

    // Creamos una semilla (seed) básica para que la IA empiece
    const seed = {
        notes: [
            { pitch: 60, startTime: 0, endTime: 0.5 },
            { pitch: 64, startTime: 0.5, endTime: 1.0 }
        ],
        totalTime: 1.0
    };

    // La IA genera la continuación
    const result = await musicRNN.continueSequence(seed, config.steps, config.temperature);
    
    playSequence(result);
}

function playSequence(sequence) {
    document.getElementById('statusText').innerText = "Reproduciendo Beat...";
    
    const now = Tone.now();
    sequence.notes.forEach(note => {
        synth.triggerAttackRelease(
            Tone.Frequency(note.pitch, "midi").toNote(),
            note.endTime - note.startTime,
            now + note.startTime
        );
    });
    
    // Simulación de base rítmica básica
    if(document.getElementById('genreSelect').value === 'REGGAETON') {
        playDembow(now);
    }
}

function playDembow(time) {
    // Patrón clásico de Reggaetón
    const pattern = [0, 0.75, 1, 1.75]; 
    pattern.forEach(t => drumSynth.triggerAttackRelease("C1", "8n", time + t));
}

// Eventos
document.getElementById('generateBtn').addEventListener('click', () => {
    Tone.start(); // Necesario para audio en navegadores
    generateBeat();
});

document.getElementById('stopBtn').addEventListener('click', () => {
    Tone.Transport.stop();
    location.reload(); // Forma rápida de limpiar el audio
});

initAI();
