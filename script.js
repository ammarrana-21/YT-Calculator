let chart;

document.getElementById("manualToggle").addEventListener("change", () => {
  document.getElementById("manualRPM").style.display =
    document.getElementById("manualToggle").checked ? "block" : "none";
});

document.getElementById("plannerToggle").addEventListener("change", () => {
    const plannerSection = document.getElementById("plannerSection");
    plannerSection.style.display = document.getElementById("plannerToggle").checked ? "block" : "none";
  });
  

document.getElementById("themeSwitch").addEventListener("change", () => {
  const isLight = document.body.classList.toggle("light");
  document.getElementById("themeLabel").textContent = isLight ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

window.onload = () => {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    document.getElementById("themeSwitch").checked = true;
    document.getElementById("themeLabel").textContent = "☀️ Light";
  }
  loadSavedScenarios();
};

function calculateEarnings() {
  let views = parseInt(document.getElementById("views").value);
  const usePlanner = document.getElementById("plannerToggle").checked;
  const vpw = parseInt(document.getElementById("videosPerWeek").value);
  const vpv = parseInt(document.getElementById("viewsPerVideo").value);
  const niche = document.getElementById("niche").value;
  const engagement = document.getElementById("engagement").value;
  const manual = document.getElementById("manualToggle").checked;
  const manualRPM = parseFloat(document.getElementById("manualRPM").value);

  if (usePlanner && vpw && vpv) {
    views = vpw * vpv * 4;
    document.getElementById("views").value = views;
  }

  if (!views || views <= 0) return alert("Enter valid views.");

  const rpmRanges = {
    finance: [20, 40],
    tech: [15, 30],
    gaming: [5, 15],
    vlogging: [3, 8],
    education: [8, 18],
    beauty: [5, 12]
  };

  const engagementMod = { low: 0.8, medium: 1, high: 1.2 };
  let avgRPM = ((rpmRanges[niche][0] + rpmRanges[niche][1]) / 2) * engagementMod[engagement];
  if (manual && !isNaN(manualRPM)) avgRPM = manualRPM;

  const monthly = (views / 1000) * avgRPM;
  const yearly = monthly * 12;
  const sponsorCPM = { finance: 40, tech: 30, gaming: 20, vlogging: 15, education: 25, beauty: 20 };
  const sponsorEstimate = (views / 1000) * sponsorCPM[niche];
  const viewsNeeded = Math.ceil((1000 / avgRPM) * 1000);

  document.getElementById("monthly").textContent = `💰 Monthly: $${monthly.toFixed(2)}`;
  document.getElementById("yearly").textContent = `📈 Yearly: $${yearly.toFixed(2)}`;
  document.getElementById("sponsor").textContent = `🤝 Sponsorship Potential: ~$${sponsorEstimate.toFixed(2)}`;
  document.getElementById("goal").textContent = `🎯 To earn $1,000/mo, you’d need ~${viewsNeeded.toLocaleString()} views`;
  document.getElementById("tip").textContent = "💡 Tip: CPM varies by niche and audience location.";

  document.getElementById("resultBox").style.display = "block";
  renderChart(monthly);
}

function renderChart(monthly) {
  const ctx = document.getElementById("revenueChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Monthly Earnings", "Gap to $1K"],
      datasets: [{
        data: [monthly.toFixed(2), Math.max(1000 - monthly, 0)],
        backgroundColor: ["#03dac6", "#333"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } }
    }
  });
}

function copyResults() {
  const result = [
    document.getElementById("monthly").textContent,
    document.getElementById("yearly").textContent,
    document.getElementById("sponsor").textContent,
    document.getElementById("goal").textContent,
    document.getElementById("tip").textContent
  ].join("\n");
  navigator.clipboard.writeText(result).then(() => alert("Copied!"));
}

function saveScenario() {
  const name = document.getElementById("scenarioName").value;
  if (!name) return alert("Name your scenario first.");
  const data = {
    views: document.getElementById("views").value,
    niche: document.getElementById("niche").value,
    engagement: document.getElementById("engagement").value,
    rpm: document.getElementById("manualRPM").value,
    useCustomRPM: document.getElementById("manualToggle").checked
  };
  localStorage.setItem(`scenario-${name}`, JSON.stringify(data));
  loadSavedScenarios();
}

function loadSavedScenarios() {
  const dropdown = document.getElementById("savedScenarios");
  dropdown.innerHTML = `<option value="">🔽 Load Scenario</option>`;
  for (let key in localStorage) {
    if (key.startsWith("scenario-")) {
      const name = key.replace("scenario-", "");
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      dropdown.appendChild(option);
    }
  }
}

function loadScenario() {
  const name = document.getElementById("savedScenarios").value;
  if (!name) return;
  const data = JSON.parse(localStorage.getItem(`scenario-${name}`));
  if (!data) return;
  document.getElementById("views").value = data.views;
  document.getElementById("niche").value = data.niche;
  document.getElementById("engagement").value = data.engagement;
  document.getElementById("manualRPM").value = data.rpm;
  document.getElementById("manualToggle").checked = data.useCustomRPM;
  document.getElementById("manualRPM").style.display = data.useCustomRPM ? "block" : "none";
}
