fetch("data.json?v=999")
  .then(res => res.json())
  .then(data => {

    const params = new URLSearchParams(location.search);
    const userKey = params.get("user");
    const days = ["Ahad","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

    /* ================= INDEX ================= */
    const list = document.getElementById("list");
    if (list && data.users) {
      list.innerHTML = "";
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
      }
    }

    /* ================= GRAFIK SEMUA ORANG ================= */
    const allChart = document.getElementById("allChart");
    if (allChart && data.users) {
      const labels = [];
      const values = [];

      Object.keys(data.users).forEach(key => {
        labels.push(data.users[key].nama);
        values.push(hitungProgress(key, data.tugas, days));
      });

      new Chart(allChart, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "Progres (%)",
            data: values
          }]
        },
        options: {
          scales: {
            y: { min: 0, max: 100 }
          }
        }
      });
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
