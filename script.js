fetch("data.json")
  .then(res => res.json())
  .then(data => {

    const days = ["Ahad","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

    /* ================= INDEX ================= */
    const list = document.getElementById("list");
    if (list && data.users) {
      list.innerHTML = "";

      Object.keys(data.users).forEach(key => {
        const div = document.createElement("div");
        div.className = "user-card";
        div.textContent = data.users[key].nama;

        div.onclick = () => {
          window.location.href = `detail.html?user=${key}`;
        };

        list.appendChild(div);
      });
    }

    /* ================= GRAFIK ================= */
    const chartCanvas = document.getElementById("allChart");
    if (chartCanvas && data.users && data.tugas) {
      const labels = [];
      const values = [];

      Object.keys(data.users).forEach(userKey => {
        let done = 0;

        data.tugas.forEach(tugas => {
          days.forEach(day => {
            if (localStorage.getItem(`${userKey}-${tugas}-${day}`)) {
              done++;
            }
          });
        });

        labels.push(data.users[userKey].nama);
        values.push(done);
      });

      new Chart(chartCanvas, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Total Tugas Selesai",
            data: values
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }

  })
  .catch(err => console.error("ERROR:", err));
