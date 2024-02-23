const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";
document.addEventListener("DOMContentLoaded", function () {
  let role = window.localStorage.getItem("role");
  if (role === undefined || role != 2)
    window.location.replace(front_end_url + "/Login/login.html");
  else
    fetch(back_end_url + "/admin/load_shop_items")
      .then((response) => response.json())
      .then((data) => load_inventory_table(data["data"]));
});

let aleart_success = document.getElementById("aleart_success");

document
  .getElementById("item_info_form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = document.getElementById("item_info_form");
    const formData = new FormData(form);

    // Convert the form data to a JSON object
    const jsonObject = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });

    fetch(back_end_url + "/admin/insert_new_item", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(jsonObject),
    })
      .then((response) => response.json())
      .then((data) => {
        insert_item_row(data["data"]);
        event.target.reset();
        aleart_success.hidden = false;
        aleart_success.classList.add("fade_animate");
        setTimeout(() => {
          aleart_success.hidden = true;
          aleart_success.classList.remove("fade_animate");
        }, 2000);
      });
  });
//insert row in animal table
function insert_item_row(data) {
  const table = document.querySelector("table tbody");
  const isTableData = table.querySelector(".no-data");
  let animal_table = "<tr>";

  for (var key in data) {
    if (data.hasOwnProperty(key) && data[key].length > 50) {
      animal_table += `<td><img style="width: 5rem; height: 5rem;" src="${data[key]}" alt="picture of the animal"</td>`;
    } else if (data.hasOwnProperty(key)) {
      animal_table += `<td>${data[key]}</td>`;
    }
  }

  animal_table += `<td><button class="btn edit_btn" data-id=${data.item_id} onclick="edit_item(this)">Edit</button></td>`;
  animal_table += `<td><button class="btn delete_btn" data-id=${data.item_id} onclick="deleteAnimalRow(this)">Delete</button></td>`;

  animal_table += "</tr>";

  if (isTableData) {
    table.innerHTML = animal_table;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = animal_table;
  }
}

//load table when new animal is added
function load_inventory_table(data) {
  const table = document.querySelector("table tbody");
  let animal_table = "";

  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML = "<tr><td class='no_data' colspan='7'>NO DATA</td></tr>";
    return;
  }
  data.forEach(function ({ item_id, image, item_name, quantity, price }) {
    animal_table += "<tr>";
    animal_table += `<td>${item_id}</td>`;
    animal_table += `<td><img class="animal_table_image" src="${image}" alt="picture of item"></td>`;
    animal_table += `<td>${item_name}</td>`;
    animal_table += `<td>${quantity}</td>`;
    animal_table += `<td>$${price}</td>`;
    animal_table += `<td><button class="btn edit_btn" data-id=${item_id} onclick="edit_item(this)">Edit</button></td>`;
    animal_table += `<td><button class="btn delete_btn" data-id=${item_id} onclick="deleteAnimalRow(this)">Delete</button></td>`;
    animal_table += "</tr>";
  });
  table.innerHTML = animal_table;
}
//update animal
async function load_item_by_id(id) {
  const res = await fetch(back_end_url + "/admin/get_item_by_id/" + id, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  let data = await res.json();
  let animal = data.data[0];
  const form = document.querySelector("#item_update_info_form");
  let elements = Array.from(form.elements);
  for (let element of elements) {
    if (animal[element.name]) element.value = animal[element.name];
  }
}

function edit_item(object) {
  const id = object.getAttribute("data-id");
  const updateSection = document.querySelector("#update_form");
  const inputSection = document.querySelector("#input_form");
  inputSection.hidden = true;
  updateSection.hidden = false;

  // Remove the existing event listener for the update form
  const updateForm = document.getElementById("item_update_info_form");
  const clonedForm = updateForm.cloneNode(true);
  updateForm.parentNode.replaceChild(clonedForm, updateForm);

  // Load item data into the update form
  load_item_by_id(id);

  // Add a new event listener for the update form
  clonedForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    const form = document.getElementById("item_update_info_form");
    const formData = new FormData(form);
    // Convert the form data to a JSON object
    const jsonObject = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    jsonObject.id = id;
    fetch(back_end_url + "/admin/update_item", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(jsonObject),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          event.target.reset();
          // Hide the update form and show the add form
          inputSection.hidden = false;
          updateSection.hidden = true;
          location.reload();
        }
        // Reset the form input values
      });
  });
}

function cancel_update() {
  const updateSection = document.querySelector("#update_form");
  const inputSection = document.querySelector("#input_form");
  inputSection.hidden = false;
  updateSection.hidden = true;
  //cancel the values store in the update form when click cancel
  const updateForm = document.getElementById("item_update_info_form");
  const clonedForm = updateForm.cloneNode(true);
  updateForm.parentNode.replaceChild(clonedForm, updateForm);
}
//delete animal
function deleteAnimalRow(object) {
  let id = object.getAttribute("data-id");
  fetch(back_end_url + "/admin/delete_item_row/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}
