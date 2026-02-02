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

      // MUSIC (INDEX ONLY)
      const audio = document.getElementById("audio");
      const select = document.getElementById("musicSelect");
      const playBtn = document.getElementById("playBtn");

      if (audio && select && playBtn) {
        select.onchange = () => {
          if (!select.value) return;
          audio.src = select.value;
          audio.play().catch(()=>{});
          playBtn.textContent = "⏸";
          localStorage.setItem("lastMusic", select.value);
        };

        playBtn.onclick = () => {
          if (!audio.src) return;
          if (audio.paused) {
            audio.play().catch(()=>{});
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
    }

    /* ================= DETAIL ================= */
    if (document.body.id === "page-detail") {
      const userKey = new URLSearchParams(location.search).get("user");
      if (!userKey || !data.users[userKey]) return;

      const namaEl = document.getElementById("nama");
      const tbody = document.querySelector("#tabel tbody");
      if (!namaEl || !tbody) return;

      namaEl.textContent = data.users[userKey].nama;
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

    /* ================= GRAFIK ================= */
    if (document.body.id === "page-grafik") {
      const canvas = document.getElementById("allChart");
      if (!canvas) return;

      const labels = [];
      const values = [];

      const totalMax = data.tugas.length * days.length;

      Object.keys(data.users).forEach(userKey => {
        let doneCount = 0;

        data.tugas.forEach(t =>
          days.forEach(d => {
            if (localStorage.getItem(`${userKey}-${t}-${d}`)) {
              doneCount++;
            }
          })
        );

        const percent = Math.round((doneCount / totalMax) * 100);
        labels.push(data.users[userKey].nama);
        values.push(percent);
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
              ticks: {
                callback: v => v + "%"
              }
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
