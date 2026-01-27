fetch("data.json?v=10")
.then(r => r.json())
.then(data => {
  const list = document.getElementById("list");

  Object.keys(data).forEach(k => {
    if (k !== "tugas") {
      const card = document.createElement("div");
      card.className = "user-card";
      card.innerText = data[k].nama;
      card.onclick = () => {
        location.href = `detail.html?user=${k}`;
      };
      list.appendChild(card);
    }
  });
});
