fetch("data.json?v=123")
.then(r => r.json())
.then(data => {
  const q = new URLSearchParams(location.search);
  const userKey = q.get("user");

  if (!userKey || !data.users[userKey]) return;

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
        td.classList.toggle("done");
        td.innerText = td.classList.contains("done") ? "✓" : "";
        td.classList.contains("done")
          ? localStorage.setItem(key, "1")
          : localStorage.removeItem(key);
      };

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
});
