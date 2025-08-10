
const gifs = [
  "https://pa1.aminoapps.com/5845/5749d2581b8ff83d442fbee9935fcbc5f0715067_hq.gif",
  "https://pa1.aminoapps.com/5845/9cb2168430d3538abdda1ce6676bf3c37f517369_hq.gif",
  "https://pa1.aminoapps.com/5845/d6890eeb58a89ef075cdfbe7b940b231bec61a49_hq.gif",
  "https://pa1.aminoapps.com/5845/32c70e035bc4ac6802178e43be9066e445095bed_hq.gif",
  "https://i.pinimg.com/originals/e5/a1/7e/e5a17eb79c5472b5fea8ab36282f3696.gif",
  "https://pa1.aminoapps.com/5845/aa86445c253d52c324bfa0ce378bb049253e7f01_hq.gif",
  "https://pa1.aminoapps.com/5845/3e279f21d4b8e146c8076013eb93613d441d1c4b_hq.gif",
  "https://i.pinimg.com/originals/99/f4/36/99f43636e89075b308a720bff365b132.gif",
  "https://i.redd.it/r152bcq4zhv51.gif",
  "https://i.gifer.com/1toU.gif"
];

// Shuffle helper
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Store shuffled list in sessionStorage
if (!sessionStorage.getItem('gifQueue') || JSON.parse(sessionStorage.getItem('gifQueue')).length === 0) {
  sessionStorage.setItem('gifQueue', JSON.stringify(shuffleArray([...gifs])));
}

const gifQueue = JSON.parse(sessionStorage.getItem('gifQueue'));
const nextGif = gifQueue.shift();
sessionStorage.setItem('gifQueue', JSON.stringify(gifQueue));
document.querySelector(".overlay").style.backgroundImage = `url('${nextGif}')`;

// script.js
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;
  const isDark = localStorage.getItem('theme') === 'dark';

  if (isDark) body.classList.add('dark');

  toggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
  });
});

async function fetchDownloads(projectId, elementId) {
  try {
    const response = await fetch(`https://api.modrinth.com/v2/project/${projectId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    const downloads = data.downloads.toLocaleString();
    const el = document.getElementById(elementId);
    el.textContent = downloads;
    colorizeDownloads(elementId);
  } catch (error) {
    console.error(`Failed to fetch downloads for ${projectId}:`, error);
    const el = document.getElementById(elementId);
    el.textContent = 'Error';
    el.style.color = 'gray';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const mods = [
    'fullbrightgamerule',
    'rickroll-mod-fabric',
    'illegal-craftings',
    'illegal-craftings-fabric',
    'rickroll-mod',
    'from-the-nether',
    'from-the-nether-expansion-pack'
  ];

  const modpacks = [
    'vanillairl',
    'bedrock-edition-modpack',
    'bedrock-edition',
    'faster-performance',
    'faster-quality'
  ];

  mods.forEach(id => fetchDownloads(id, `downloads-${id}`));
  modpacks.forEach(id => fetchDownloads(id, `downloads-${id}`));
});

function colorizeDownloads(elementId) {
  const el = document.getElementById(elementId);
  const text = el.textContent.replace(/,/g, '');
  const count = parseInt(text, 10);

  if (isNaN(count)) {
    el.style.color = 'gray';
    return;
  }

  if (count >= 1000) {
    el.style.color = 'limegreen';
  } else if (count >= 100) {
    el.style.color = 'orange';
  } else {
    el.style.color = 'red';
  }
}

