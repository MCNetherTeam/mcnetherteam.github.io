
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


async function getTotalDownloadsForProjects(projectIds) {
  let total = 0;
  for (const id of projectIds) {
    try {
      const res = await fetch(`https://api.modrinth.com/v2/project/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch project ${id}`);
      const data = await res.json();
      total += data.downloads || 0;
    } catch (e) {
      console.error(`Error fetching project ${id}:`, e);
    }
  }
  return total;
}

async function fetchCombinedDownloads() {
  try {
    const userRes = await fetch('https://api.modrinth.com/v2/user/Anakama/project_ids');
    if (!userRes.ok) throw new Error('Failed to fetch user projects');
    const userProjects = await userRes.json();

    const orgRes = await fetch('https://api.modrinth.com/v2/organization/netherteam/project_ids');
    if (!orgRes.ok) throw new Error('Failed to fetch organization projects');
    const orgProjects = await orgRes.json();

    const userTotal = await getTotalDownloadsForProjects(userProjects);
    const orgTotal = await getTotalDownloadsForProjects(orgProjects);

    document.getElementById('downloads-anakama').textContent = userTotal.toLocaleString();
    document.getElementById('downloads-combine').textContent = orgTotal.toLocaleString();
  } catch (error) {
    console.error(error);
    document.getElementById('downloads-combine').textContent = 'Error';
  }
}

fetchCombinedDownloads();

document.addEventListener('DOMContentLoaded', () => {
  const sortBtn = document.getElementById('sortModsBtn');
  let ascending = true; // start with A-Z

  sortBtn.addEventListener('click', () => {
    const container = document.querySelector('section.container');
    const mods = Array.from(container.querySelectorAll('div.mod-entry'));

    mods.sort((a, b) => {
      const nameA = a.querySelector('h3.modpack-name a').textContent.trim().toLowerCase();
      const nameB = b.querySelector('h3.modpack-name a').textContent.trim().toLowerCase();

      return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    mods.forEach(mod => mod.remove());
    mods.forEach(mod => container.appendChild(mod));

    ascending = !ascending; // flip sort order for next click thing

    sortBtn.textContent = ascending ? "Sort A-Z" : "Sort Z-A";
  });
});
