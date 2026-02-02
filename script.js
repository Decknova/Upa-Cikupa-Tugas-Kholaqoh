fetch("data.json")
  .then(res => res.json())
  .then(data => {

    const days = ["Ahad","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

    /* ================= INDEX ================= */
    if (document.body.id === "page-index") {
      const list = document.getElementById("list");
      if (!list) return;

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

      // 🎵 MUSIC PLAYER (INDEX ONLY)
      const audio = document.getElementById("audio");
      const select = document.getElementById("musicSelect");
      const playBtn = document.getElementById("playBtn");

      if (audio && select && playBtn) {
        select.onchange = () => {
          if (!select.value) return;
          audio.src = select.value;
          audio.play().catch(() => {});
          playBtn.textContent = "⏸";
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
      }
    }

    /* ================= DETAIL ================= */
    if (document.body.id === "page-detail") {
      const userKey = new URLSearchParams(location.search).get("user");
      if (!userKey || !data.users[userKey]) return;

      const namaEl = document.getElementById("nama");
      const tbody = document.querySelector("#tabel tbody");
      const thead = document.getElementById("thead");

      if (!namaEl || !tbody || !thead) return;

      namaEl.textContent = data.users[userKey].nama;
      tbody.innerHTML = "";
      thead.innerHTML = "";

      // === BUAT HEADER DENGAN TANGGAL ===
      const trHead = document.createElement("tr");
      trHead.innerHTML = `<th>Tugas</th>`;

      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay()); // mulai Ahad

      days.forEach((day, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const tgl = d.getDate();

        const th = document.createElement("th");
        th.innerHTML = `${day}<br><small>${tgl}</small>`;
        trHead.appendChild(th);
      });

      thead.appendChild(trHead);

      // === ISI TABEL ===
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

    /* ================= GRAFIK ================= */
    if (document.body.id === "page-grafik") {
      const canvas = document.getElementById("allChart");
      if (!canvas) return;

      const labels = [];
      const values = [];
      const total = data.tugas.length * days.length;

      Object.keys(data.users).forEach(userKey => {
        let done = 0;
        data.tugas.forEach(t =>
          days.forEach(d => {
            if (localStorage.getItem(`${userKey}-${t}-${d}`)) done++;
          })
        );
        labels.push(data.users[userKey].nama);
        values.push(Math.round((done / total) * 100));
      });

      new Chart(canvas, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "Progres (%)",
            data: values,
            backgroundColor: "#2ecc71"
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { callback: v => v + "%" }
            }
          },
          plugins: {
            datalabels: {
              color: "#fff",
              anchor: "end",
              align: "top",
              formatter: v => v + "%"
            }
          }
        },
        plugins: [ChartDataLabels]
      });
    }

  })
  .catch(err => console.error("SCRIPT ERROR:", err));
