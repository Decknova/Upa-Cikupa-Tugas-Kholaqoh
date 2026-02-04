fetch("data.json")
  .then(res => res.json())
  .then(data => {

    const days = ["Ahad","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

    /* ================= INDEX ================= */
    if (document.body.id === "page-index") {
      const list = document.getElementById("list");
      if (!list || !data.users) return;

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

      // MUSIC PLAYER
      const audio = document.getElementById("audio");
      const select = document.getElementById("musicSelect");
      const playBtn = document.getElementById("playBtn");

      if (audio && select && playBtn) {
        select.onchange = () => {
          if (!select.value) return;
          audio.src = select.value;
          audio.load();
          playBtn.textContent = "▶️";
        };

        playBtn.onclick = () => {
          if (!audio.src) return alert("Pilih musik dulu");
          if (audio.paused) {
            audio.play().then(() => playBtn.textContent = "⏸");
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
      if (!userKey || !data.users || !data.users[userKey]) return;

      // 🔥 FIX UTAMA DI SINI
      const tugasList = Array.isArray(data.tugas)
        ? data.tugas
        : Object.values(data.tugas || {});

      if (!tugasList.length) {
        console.error("TUGAS KOSONG / FORMAT SALAH", data.tugas);
        return;
      }

      const namaEl = document.getElementById("nama");
      const thead = document.getElementById("thead");
      const tbody = document.querySelector("#tabel tbody");

      namaEl.textContent = data.users[userKey].nama;

      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());

      thead.innerHTML = `
        <tr>
          <th>Tugas</th>
          ${days.map((d,i)=>{
            const dt = new Date(start);
            dt.setDate(start.getDate()+i);
            return `<th>${d}<br>${dt.getDate()}/${dt.getMonth()+1}</th>`;
          }).join("")}
        </tr>
      `;

      tbody.innerHTML = "";

      tugasList.forEach(tugas => {
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
      if (!canvas || !data.users || !data.tugas) return;

      const tugasList = Array.isArray(data.tugas)
        ? data.tugas
        : Object.values(data.tugas);

      const labels = [];
      const values = [];
      const total = tugasList.length * days.length;

      Object.keys(data.users).forEach(userKey => {
        let done = 0;
        tugasList.forEach(t =>
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
            data: values
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true, max: 100 }
          }
        }
      });
    }

  })
  .catch(err => console.error("SCRIPT ERROR:", err));
