fetch("data.json?v=999")
  .then(res => res.json())
  .then(data => {
    const params = new URLSearchParams(location.search);
    const userKey = params.get("user");

    /* ================= INDEX ================= */
    const list = document.getElementById("list");
    if (list) {
      Object.keys(data.users).forEach(key => {
        const card = document.createElement("div");
        card.className = "user-card";
        card.innerHTML = `<span>${data.users[key].nama}</span>`;
        card.onclick = () => {
          location.href = `detail.html?user=${key}`;
        };
        list.appendChild(card);
      });
    }

 /* ================= DETAIL ================= */
if (userKey && data.users[userKey]) {

  const namaEl = document.getElementById("nama");
  const tbody = document.querySelector("#tabel tbody");

  // kalau bukan halaman detail, STOP DI SINI (tanpa return global)
  if (!namaEl || !tbody) {
    // halaman index
  } else {

    namaEl.innerText = data.users[userKey].nama;
    tbody.innerHTML = "";

    const days = ["Ahad","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

    data.tugas.forEach(tugas => {
      const tr = document.createElement("tr");

      const tdTask = document.createElement("td");
      tdTask.textContent = tugas;
      tr.appendChild(tdTask);

      days.forEach(day => {
        const storageKey = `${userKey}-${tugas}-${day}`;
        const done = localStorage.getItem(storageKey);

        const td = document.createElement("td");
        const cell = document.createElement("div");
        cell.className = "cell" + (done ? " done" : "");
        cell.textContent = done ? "✓" : "";

        cell.onclick = () => {
          if (cell.classList.contains("done")) {
            cell.classList.remove("done");
            cell.textContent = "";
            localStorage.removeItem(storageKey);
          } else {
            cell.classList.add("done");
            cell.textContent = "✓";
            localStorage.setItem(storageKey, "1");
          }
        };

        td.appendChild(cell);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }
}

/* ================= MUSIC ================= */
const audio = document.getElementById("audio");
const select = document.getElementById("musicSelect");
const playBtn = document.getElementById("playBtn");

if (audio && select && playBtn) {
  select.addEventListener("change", () => {
    if (!select.value) return;
    audio.src = select.value;
    audio.play();
    playBtn.textContent = "⏸";
    localStorage.setItem("lastMusic", select.value);
  });

  playBtn.addEventListener("click", () => {
    if (!audio.src) return;
    if (audio.paused) {
      audio.play();
      playBtn.textContent = "⏸";
    } else {
      audio.pause();
      playBtn.textContent = "▶️";
    }
  });

  // auto-load lagu terakhir
const last = localStorage.getItem("lastMusic");

if (last) {
  select.value = last;
  audio.src = last;

  // 🔑 AUTO PLAY SAAT PINDAH HALAMAN
  audio.play()
    .then(() => {
      playBtn.textContent = "⏸";
    })
    .catch(() => {
      // browser block auto play, aman
      playBtn.textContent = "▶️";
    });
}

