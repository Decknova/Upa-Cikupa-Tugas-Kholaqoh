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
    if (!userKey || !data.users[userKey]) return;

    document.getElementById("nama").innerText = data.users[userKey].nama;
    const tbody = document.querySelector("#tabel tbody");
    tbody.innerHTML = ""; // PENTING: reset dulu

    const days = ["Ahad","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

    data.tugas.forEach(tugas => {
      const tr = document.createElement("tr");

      // kolom tugas (kiri)
      const tdTask = document.createElement("td");
      tdTask.textContent = tugas;
      tr.appendChild(tdTask);

      // kolom hari (KE SAMPING)
      days.forEach(day => {
        const storageKey = `${userKey}-${tugas}-${day}`;
        const done = localStorage.getItem(storageKey);

        const td = document.createElement("td");

        const cell = document.createElement("div");
        cell.className = "cell" + (done ? " done" : "");
        cell.textContent = done ? "✓" : "";

        cell.addEventListener("click", () => {
          if (cell.classList.contains("done")) {
            cell.classList.remove("done");
            cell.textContent = "";
            localStorage.removeItem(storageKey);
          } else {
            cell.classList.add("done");
            cell.textContent = "✓";
            localStorage.setItem(storageKey, "1");
          }
        });

        td.appendChild(cell);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  });
