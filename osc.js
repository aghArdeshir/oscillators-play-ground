const keyToFrequencyMap = {
    // source: https://upload.wikimedia.org/wikipedia/commons/a/ad/Piano_key_frequencies.png
    // keymap inspired by FL Studio's key map
    'z': 261.626, // C4
    's': 277.183, // C#4
    'x': 293.665, // ...
    'd': 311.127,
    'c': 329.628,
    'v': 349.228,
    'g': 369.994,
    'b': 391.995,
    'h': 415.305, // ...
    'n': 440,     // A4
    'j': 466.164, // A#4
    'm': 493.883, // B4

    'q': 523.251, // C5
    '2': 554.365, // ...
    'w': 587.330,
    '3': 622.254,
    'e': 659.255,
    'r': 698.456,
    '5': 739.989, // ...
    't': 783.991, // F#5
    '6': 830.609, // G5
    'y': 880,     // A5
    '7': 932.328, // A#5
    'u': 987.767, // B5

    'i': 1046.50, // C6
    '9': 1108.73, // C#6
    'o': 1174.66, // ...
    '0': 1244.51,
    'p': 1318.51,
};

const availableKeys = `zsxdcvgbhnjmq2w3er5t6y7ui9o0p`; // needed for keeping the order
const blackKeys = `sdghj2356790`;

const keyCodeToLetterMap = {
    90: 'z',
    83: 's',
    88: 'x',
    68: 'd',
    67: 'c',
    86: 'v',
    71: 'g',
    66: 'b',
    72: 'h',
    78: 'n',
    74: 'j',
    77: 'm',

    81: 'q',
    50: '2',
    87: 'w',
    51: '3',
    69: 'e',
    82: 'r',
    53: '5',
    84: 't',
    54: '6',
    89: 'y',
    55: '7',
    85: 'u',

    73: 'i',
    57: '9',
    79: 'o',
    48: '0',
    80: 'p',
}

// ------------------------------------------------------------------------------------------------------------------

const oscillatorsMap = {}; // its the map of each letter to created oscillator for that letter
let oscillatorType = 'sine'; //default

const ctx = new AudioContext();

function play(frequency, letter) {
    if (oscillatorsMap[letter]) return; // happens when `keydown` event with same keyCode is emitted multiple times before `keyup` is emitted
    // (e.g. user holding his middle finger on a key) 

    const oscillator = ctx.createOscillator()
    oscillator.type = oscillatorType; // current selected type in ui
    oscillator.frequency.setValueAtTime(frequency, 0);
    oscillator.connect(ctx.destination);
    oscillatorsMap[letter] = oscillator;
    oscillatorsMap[letter].start();
}

function stop(letter) {
    oscillatorsMap[letter].stop();
    oscillatorsMap[letter] = null
}

// ------------------------------------------------------------------------------------------------------------

function changeFrequencyType(e) {
    // called from DOM
    oscillatorType = e.value;
}

function orderPlay(letter) {
    play(keyToFrequencyMap[letter], letter)
}

function orderStop(letter) {
    stop(letter)
}

function initialize() {
    // set default frequency type
    document.querySelector('input[value=sine]').checked = true;

    // populating midi keyboard
    const pianoDom = document.getElementById('midi-keyboard')
    availableKeys.split('').forEach(letter => {
        let className = 'piano-key '
        if (blackKeys.indexOf(letter) > -1) {
            className += 'black '
        }
        const keyDom = document.createElement('div');
        keyDom.setAttribute('class', className)
        keyDom.setAttribute('id', `key-${letter}`);
        keyDom.onmousedown = keyDom.ontouchstart = () => {
            orderPlay(letter)
        }

        keyDom.onmouseup = keyDom.ontouchend = () => {
            orderStop(letter)
        }

        keyDom.innerText = letter
        pianoDom.appendChild(keyDom)
    })
}

function getEventKeyLetter(e) {
    return keyCodeToLetterMap[e.keyCode /* || e.which */]
}

document.addEventListener('keydown', e => {
    const letter = getEventKeyLetter(e);
    if (!letter) return;

    orderPlay(letter)

    let className = 'piano-key pressed '
    if (blackKeys.indexOf(letter) > -1) { className += 'black' }
    document.getElementById(`key-${letter}`).setAttribute('class', className)
})

document.addEventListener('keyup', e => {
    const letter = getEventKeyLetter(e);
    if (!letter) return;

    orderStop(letter)

    let className = 'piano-key '
    if (blackKeys.indexOf(letter) > -1) { className += 'black' }
    document.getElementById(`key-${letter}`).setAttribute('class', className)
})
