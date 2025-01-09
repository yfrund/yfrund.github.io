document.getElementById("generateButton").addEventListener("click", () => {
  const userInput = document.getElementById("inputData").value.trim();
  const activities = userInput.split("\n").map(item => item.trim()).filter(item => item.length > 0);

  if (activities.length > 0) {
    generateSchedules(activities);
  } else {
    alert("Please enter activities!");
  }
});

document.getElementById("clearInput").addEventListener("click", () => {
  document.getElementById("inputData").value = "";
  document.getElementById("schedule1Output").innerHTML = "";
  document.getElementById("schedule2Output").innerHTML = "";
});

function generateSchedules(activities) {
  const schedule1 = createSchedule(activities);
  const schedule2 = createSchedule(activities);

  document.getElementById("schedule1Output").innerHTML = generateScheduleTable(schedule1);
  document.getElementById("schedule2Output").innerHTML = generateScheduleTable(schedule2);
}

function createSchedule(activities) {
  const schedule = {};
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

  for (let i = 0; i < days.length; i++) {
    schedule[days[i]] = {};
    for (let j = 0; j < times.length; j++) {
      schedule[days[i]][times[j]] = activities[(i * times.length + j) % activities.length] || "";
    }
  }
  return schedule;
}

function generateScheduleTable(schedule) {
  let tableHTML = "<table border='1'><thead><tr><th>Day</th><th>9:00 AM</th><th>11:00 AM</th><th>1:00 PM</th><th>3:00 PM</th><th>5:00 PM</th></tr></thead><tbody>";

  for (const day in schedule) {
    tableHTML += `<tr><td>${day}</td>`;
    for (const time in schedule[day]) {
      tableHTML += `<td>${schedule[day][time]}</td>`;
    }
    tableHTML += "</tr>";
  }

  tableHTML += "</tbody></table>";
  return tableHTML;
}
