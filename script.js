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
        card.textContent = data.users[key].nama;
        card.onclick = () => {
          location.href = `detail.html?user=${key}`;
        };
        list.appendChild(card);
      });

      // MUSIC INDEX ONLY
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
      if (!userKey) return;

      const namaEl = document.getElementById("nama");
      const tbody = document.querySelector("#tabel tbody");
      if (!namaEl || !tbody) return;

      namaEl.innerText = data.users[userKey].nama;
      tbody.innerHTML = "";

      data.tugas.forEach(tugas => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${tugas}</td>`;

        days.forEach(day => {
          const key = `${userKey}-${tugas}-${day}`;
          const td = document.createElement("td");
          td.textContent = localStorage.getItem(key) ? "✓" : "";

          td.onclick = () => {
            if (localStorage.getItem(key)) {
              localStorage.removeItem(key);
              td.textContent = "";
            } else {
              localStorage.setItem(key, "1");
              td.textContent = "✓";
            }
          };

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

      Object.keys(data.users).forEach(userKey => {
        let done = 0;
        data.tugas.forEach(t =>
          days.forEach(d => {
            if (localStorage.getItem(`${userKey}-${t}-${d}`)) done++;
          })
        );
        labels.push(data.users[userKey].nama);
        values.push(done);
      });

      new Chart(canvas, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "Progres (%)",
            data: values
          }]
        },
        options: {
          plugins: {
            datalabels: {
              anchor: "end",
              align: "top",
              formatter: v => v + "%"
            }
          },
          scales: {
            y: { beginAtZero: true, max: 100 }
          }
        },
        plugins: [ChartDataLabels]
      });
    }

  });
