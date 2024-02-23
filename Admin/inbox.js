const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";

document.addEventListener("DOMContentLoaded", function () {
  fetch(back_end_url + "/admin/load_notification")
    .then((response) => response.json())
    .then((data) => {
      let role = window.localStorage.getItem("role");
      if (role === undefined || role != 2) {
        window.location.replace(front_end_url + "/Login/login.html");
      } else {
        load_notifcation_table(data["data"]);
      }
    });
});

function load_notifcation_table(data) {
  //   console.log(data);
  const table = document.querySelector("table tbody");
  let history_table = "";

  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML =
      "<tr><td class='no_data' colspan='4'>You don't have any notifications</td></tr>";
    return;
  }
  data.forEach(function ({ id, time, date, message }) {
    history_table += "<tr>";
    history_table += `<td>${time}</td>`;
    history_table += `<td>${date}</td>`;
    history_table += `<td>${message}</td>`;
    history_table += `<td><button class="btn delete_btn" data-id=${id} onclick="deleteAnimalRow(this)">Delete</button></td>`;
    history_table += "</tr>";
  });
  table.innerHTML = history_table;
}
function deleteAnimalRow(object) {
  let id = object.getAttribute("data-id");
  //   console.log(id);
  fetch(back_end_url + "/admin/delete_notification_row/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}
