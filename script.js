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

      // ⬇️ INI YANG DI-FIX (PAKE span, BIAR CSS MASUK)
      card.innerHTML = `<span>${data.users[key].nama}</span>`;

      card.onclick = () => {
        location.href = `detail.html?user=${key}`;
      };
      list.appendChild(card);
    });
  }

  /* ================= DETAIL ================= */
  if (userKey && data.users[userKey]) {
  document.getElementById("nama").innerText = data.users[userKey].nama;
  const tbody = document.querySelector("#tabel tbody");
  const days = ["Ahad","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

  data.tugas.forEach(tugas => {
    const tr = document.createElement("tr");

    // kolom tugas (kiri)
    const tdTask = document.createElement("td");
    tdTask.innerText = tugas;
    tr.appendChild(tdTask);

    // kolom hari (KANAN)
    days.forEach(day => {
      const key = `${userKey}-${tugas}-${day}`;
      const done = localStorage.getItem(key);

      const td = document.createElement("td");
      td.innerHTML = `<div class="cell ${done ? "done" : ""}">${done ? "✓" : ""}</div>`;

      td.onclick = () => {
        const cell = td.querySelector(".cell");
        if (cell.classList.contains("done")) {
          cell.classList.remove("done");
          cell.innerText = "";
          localStorage.removeItem(key);
        } else {
          cell.classList.add("done");
          cell.innerText = "✓";
          localStorage.setItem(key, "1");
        }
      };

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}
