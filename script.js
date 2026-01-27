fetch("data.json")
.then(r => r.json())
.then(data => {
  const q = new URLSearchParams(location.search);
  const user = q.get("user");

  // HOME
  if (!user) {
    const list = document.getElementById("list");
    Object.keys(data).forEach(k => {
      if (k !== "tugas") {
        const d = document.createElement("div");
        d.className = "card user-card";
        d.innerText = data[k].nama;
        d.onclick = () => location.href = `detail.html?user=${k}`;
        list.appendChild(d);
      }
    });
  }

  // DETAIL
  if (user) {
    document.getElementById("nama").innerText = data[user].nama;
    const table = document.getElementById("tabel");

    data.tugas.forEach(t => {
      const tr = document.createElement("tr");
      const saved = localStorage.getItem(`${user}-${t}`) || "Belum";

      tr.innerHTML = `
        <td>${t}</td>
        <td>
          <select>
            <option ${saved=="Belum"?"selected":""}>Belum</option>
            <option ${saved=="Selesai"?"selected":""}>Selesai</option>
            <option ${saved=="Gagal"?"selected":""}>Gagal</option>
          </select>
        </td>
      `;

      tr.querySelector("select").onchange = (e) => {
        localStorage.setItem(`${user}-${t}`, e.target.value);
      };

      table.appendChild(tr);
    });
  }
});
