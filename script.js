fetch("data.json?v=999")
  .then(res => res.json())
  .then(data => {

    const params = new URLSearchParams(location.search);
    const userKey = params.get("user");
    const days = ["Ahad","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

    /* ================= INDEX ================= */
    const list = document.getElementById("list");
    const chartBox = document.getElementById("chartBox");
    const chartName = document.getElementById("chartName");
    const chartCanvas = document.getElementById("progressChart");
    let chart; // supaya bisa destroy grafik lama

    if (list && data.users) {
      list.innerHTML = "";

      Object.keys(data.users).forEach(key => {
        const card = document.createElement("div");
        card.className = "user-card";
        card.innerHTML = `<span>${data.users[key].nama}</span>`;

        // ⬇️ KLIK NAMA → TAMPILKAN GRAFIK (TANPA PINDAH HALAMAN)
        card.onclick = () => {
          if (!chartBox || !chartCanvas) return;

          const persen = hitungProgress(key, data.tugas, days);
          chartBox.style.display = "block";
          chartName.textContent = `Progres ${data.users[key].nama} (${persen}%)`;

          if (chart) chart.destroy();

          chart = new Chart(chartCanvas, {
            type: "doughnut",
            data: {
              labels: ["Selesai", "Belum"],
              datasets: [{
                data: [persen, 100 - persen],
                backgroundColor: ["#2ecc71", "#2c3e50"]
              }]
            },
            options: {
              cutout: "70%",
              plugins: { legend: { display: false } }
            }
          });
        };

        list.appendChild(card);
      });
    }

    /* ================= DETAIL ================= */
    if (userKey && data.users[userKey]) {
      const namaEl = document.getElementById("nama");
      const tbody = document.querySelector("#tabel tbody");

      if (namaEl && tbody) {
        namaEl.innerText = data.users[userKey].nama;
        tbody.innerHTML = "";

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
      select.onchange = () => {
        if (!select.value) return;
        audio.src = select.value;
        audio.play().catch(() => {});
        playBtn.textContent = "⏸";
        localStorage.setItem("lastMusic", select.value);
      };

      playBtn.onclick = () => {
        if (!audio.src) return;
        if (audio.paused) {
          audio.play().catch(() => {});
          playBtn.textContent = "⏸";
        } else {
          audio.pause();
          playBtn.textContent = "▶️";
        }
      };

      const last = localStorage.getItem("lastMusic");
      if (last) {
        select.value = last;
        audio.src = last;
        audio.play()
          .then(() => playBtn.textContent = "⏸")
          .catch(() => playBtn.textContent = "▶️");
      }
    }

  })
  .catch(err => console.error("SCRIPT ERROR:", err));


/* ================= HELPER ================= */
function hitungProgress(userKey, tugas, days) {
  let total = tugas.length * days.length;
  let done = 0;

  tugas.forEach(t => {
    days.forEach(d => {
      if (localStorage.getItem(`${userKey}-${t}-${d}`)) done++;
    });
  });

  return Math.round((done / total) * 100);
}
