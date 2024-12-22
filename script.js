let chartInstance = null; // Global variable to store the chart instance

function fetchAndRenderData(country, indicator) {
  const apiKey = "bf35cc360f27453:3r4nueefc19io2e";
  const endpoint = `https://api.tradingeconomics.com/historical/country/${country}/indicator/${indicator}?c=${apiKey}`;

  fetch(endpoint)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No data available for the selected country and indicator.");
      }
      // Parse data for the chart
      const labels = data.map((entry) => entry.DateTime).reverse();
      const values = data.map((entry) => entry.Value).reverse();

      renderChart(labels, values);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function renderChart(labels, values) {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Destroy the previous chart instance if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create a new chart instance
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Indicator Value",
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time", // Specify time axis
          time: {
            parser: "2024-12-22",
            tooltipFormat: "MMM YYYY", // Format for tooltips
            unit: "month", // Adjust the unit (e.g., day, month, year) based on data granularity
            displayFormats: {
              month: "MMM YYYY", // Format for the axis
            },
          },
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Value",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });
}

// Example usage: Fetch and display data for Sweden and Inflation
fetchAndRenderData("sweden", "inflation");
