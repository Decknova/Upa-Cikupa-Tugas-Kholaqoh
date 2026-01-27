fetch("data.json?v=99")
.then(r => r.json())
.then(data => {
  const q = new URLSearchParams(location.search);
  const user = q.get("user");
  if (!user) return;

  document.getElementById("nama").innerText = data[user].nama;
  const tbody = document.querySelector("#tabel tbody");
  const days = ["Ahad","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

  data.tugas.forEach(tugas => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${tugas}</td>`;

    days.forEach(day => {
      const key = `${user}-${tugas}-${day}`;
      const status = localStorage.getItem(key);

      const td = document.createElement("td");
      td.className = "cell" + (status === "done" ? " done" : "");
      td.innerText = status === "done" ? "✓" : "";

      td.onclick = () => {
        if (td.classList.contains("done")) {
          td.classList.remove("done");
          td.innerText = "";
          localStorage.removeItem(key);
        } else {
          td.classList.add("done");
          td.innerText = "✓";
          localStorage.setItem(key, "done");
        }
      };

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
});
