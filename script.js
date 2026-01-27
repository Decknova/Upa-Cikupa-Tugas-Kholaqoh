fetch("data.json")
.then(res => res.json())
.then(data => {
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user");

  // HOME
  if (!user) {
    const list = document.getElementById("list");
    Object.keys(data).forEach(key => {
      const div = document.createElement("div");
      div.className = "card user-card";
      div.innerText = data[key].nama;
      div.onclick = () => {
        location.href = `detail.html?user=${key}`;
      };
      list.appendChild(div);
    });
  }

  // DETAIL
  if (user && data[user]) {
    document.getElementById("nama").innerText = data[user].nama;
    const tugas = document.getElementById("tugas");

    data[user].tugas.forEach(t => {
      const div = document.createElement("div");
      div.className = "card task";
      div.innerHTML = `
        <span>${t}</span>
        <select>
          <option>Belum</option>
          <option>Selesai</option>
          <option>Gagal</option>
        </select>
      `;
      tugas.appendChild(div);
    });
  }
});
