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
      card.innerText = data.users[key].nama;
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
      tr.innerHTML = `<td>${tugas}</td>`;

      days.forEach(day => {
        const key = `${userKey}-${tugas}-${day}`;
        const done = localStorage.getItem(key);

        const td = document.createElement("td");
        td.className = "cell" + (done ? " done" : "");
        td.innerText = done ? "✓" : "";

        td.onclick = () => {
          if (td.classList.contains("done")) {
            td.classList.remove("done");
            td.innerText = "";
            localStorage.removeItem(key);
          } else {
            td.classList.add("done");
            td.innerText = "✓";
            localStorage.setItem(key, "1");
          }
        };

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }
});
