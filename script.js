const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const album = document.getElementById("player-album-art");

const allSongs = [
  { id: 0, title: "Scratching The Surface", artist: "Quincy Larson", duration: "4:25", src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3" },
  { id: 1, title: "Can't Stay Down", artist: "Quincy Larson", duration: "4:15", src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3" },
  { id: 2, title: "Still Learning", artist: "Quincy Larson", duration: "3:51", src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3" },
  { id: 3, title: "SoundHelix Song 1", artist: "SoundHelix", duration: "6:12", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 4, title: "SoundHelix Song 2", artist: "SoundHelix", duration: "5:33", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 5, title: "SoundHelix Song 3", artist: "SoundHelix", duration: "5:03", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

const audio = new Audio();

let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

/* ▶ PLAY */
const playSong = (id) => {
  const song = userData.songs.find(s => s.id === id);

  audio.src = song.src;
  audio.currentTime = 0;

  userData.currentSong = song;

  album.classList.add("playing");

  setPlayerDisplay();
  highlightCurrentSong();

  audio.play();
};

/* ⏸ PAUSE */
const pauseSong = () => {
  album.classList.remove("playing");
  audio.pause();
};

/* ⏭ NEXT */
const playNextSong = () => {
  if (!userData.currentSong) return playSong(userData.songs[0].id);

  let i = userData.songs.indexOf(userData.currentSong);
  i = (i + 1) % userData.songs.length;
  playSong(userData.songs[i].id);
};

/* ⏮ PREVIOUS */
const playPreviousSong = () => {
  if (!userData.currentSong) return;

  let i = userData.songs.indexOf(userData.currentSong);
  i = (i - 1 + userData.songs.length) % userData.songs.length;
  playSong(userData.songs[i].id);
};

/* 🔀 SHUFFLE */
const shuffle = () => {
  userData.songs.sort(() => Math.random() - 0.5);
  renderSongs(userData.songs);
};

/* ❌ DELETE */
const deleteSong = (id) => {
  if (userData.currentSong?.id === id) {
    pauseSong();
    userData.currentSong = null;
  }

  userData.songs = userData.songs.filter(song => song.id !== id);
  renderSongs(userData.songs);
};

/* 🎧 DISPLAY */
const setPlayerDisplay = () => {
  document.getElementById("player-song-title").textContent =
    userData.currentSong?.title || "";

  document.getElementById("player-song-artist").textContent =
    userData.currentSong?.artist || "";
};

/* 🔥 HIGHLIGHT */
const highlightCurrentSong = () => {
  document.querySelectorAll(".playlist-song").forEach(el =>
    el.removeAttribute("aria-current")
  );

  const current = document.getElementById(`song-${userData.currentSong?.id}`);
  if (current) current.setAttribute("aria-current", "true");
};

/* 📜 RENDER */
const renderSongs = (songs) => {
  playlistSongs.innerHTML = songs.map(song => `
    <li id="song-${song.id}" class="playlist-song">
      
      <button onclick="playSong(${song.id})" class="playlist-song-info">
        ${song.title} - ${song.artist}
      </button>

      <button onclick="deleteSong(${song.id})" class="playlist-song-delete">
        ❌
      </button>

    </li>
  `).join("");
};

/* 🎮 EVENTS */
playButton.addEventListener("click", () => {
  if (!userData.currentSong) {
    playSong(userData.songs[0].id);
  } else {
    playSong(userData.currentSong.id);
  }
});

pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
shuffleButton.addEventListener("click", shuffle);

/* ⏱ PROGRESS */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  progress.value = (audio.currentTime / audio.duration) * 100;

  const format = (t) => {
    let m = Math.floor(t / 60);
    let s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  currentTimeEl.textContent = format(audio.currentTime);
  durationEl.textContent = format(audio.duration);
});

/* 🎚 SEEK */
progress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

/* 🚀 INIT */
renderSongs(userData.songs);