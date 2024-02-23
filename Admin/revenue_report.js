const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";

let load_data = [];

document.addEventListener("DOMContentLoaded", function () {
  let role = window.localStorage.getItem("role");
  if (role === undefined || role != 2)
    window.location.replace(front_end_url + "/Login/login.html");
  // else show_report();
  else get_all_purchse_history();
});

function roundToDecimalPlaces(number, decimalPlaces) {
  let factor = 10 ** decimalPlaces;
  return Math.round(number * factor) / factor;
}

function is_valid_date(date, i) {
  let start_date = document.getElementsByClassName("start_date")[i].value;
  let end_date = document.getElementsByClassName("end_date")[i].value;
  if (start_date === "" && end_date === "") return true;

  return (
    compare_date(start_date, date) <= 0 && compare_date(end_date, date) >= 0
  );
}

function reset_filter(i) {
  document.getElementsByClassName("start_date")[i].value = "";
  document.getElementsByClassName("end_date")[i].value = "";
  document.getElementsByClassName("search_item_name")[i].value = "";
  document.getElementsByClassName("order_by")[i].value = "date_of_purchase";
  show_report();
}

function compare_date(date1, date2) {
  // Create two date objects
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Compare dates return largest date
  if (d1 < d2) {
    return -1;
  } else if (d1 > d2) {
    return 1;
  } else {
    return 0;
  }
}

function filter(i) {
  let start_date = document.getElementsByClassName("start_date")[i].value;
  let end_date = document.getElementsByClassName("end_date")[i].value;
  if (
    start_date === "" ||
    end_date === "" ||
    compare_date(start_date, end_date) === 1
  ) {
    alert("Invalid date");
    return;
  }

  show_report();
}

function search_item(value, i) {
  let total_revenue = 0;
  let search_item = load_data.filter((d) => {
    if (d.item_name.toLowerCase().includes(value)) {
      total_revenue += d.amount * d.quantity;
      return true;
    }
  });
  if (search_item.length != 0) {
    search_item[0].total_revenue = roundToDecimalPlaces(total_revenue, 2);
  }
  let tables = {
    1: document.querySelector("#gift_shop_sales_table"),
    2: document.querySelector("#membership_sales_table"),
    3: document.querySelector("#ticket_sales_table"),
  };

  if (i === 0) {
    load_report_table(search_item);
  } else {
    load_report_table_type(search_item, tables[i]);
  }
}

function order_by(value, i) {
  if (load_data.length === 0) return;
  if (value === "item_name") {
    load_data.sort((a, b) =>
      a.item_name.toLowerCase().localeCompare(b.item_name.toLowerCase())
    );
  } else if (value === "date_of_purchase") {
    load_data.sort((a, b) =>
      a.date_of_purchase.localeCompare(b.date_of_purchase)
    );
  } else {
    load_data.sort((a, b) => b[value] - a[value]);
  }

  search_item(document.getElementsByClassName("search_item_name")[i].value, i);
}

function get_all_purchse_history() {
  fetch(back_end_url + "/admin/get_all_purchase_history")
    .then((response) => response.json())
    .then((data) => {
      let total_revenue = 0;
      let filter_data = data["data"].filter((d) => {
        if (is_valid_date(d.date_of_purchase, 0)) {
          total_revenue += d.amount * d.quantity;
          return true;
        }
      });
      if (filter_data.length != 0) {
        filter_data[0].total_revenue = roundToDecimalPlaces(total_revenue, 2);
      }
      load_data = filter_data;
      load_report_table(filter_data);
    });
}
function load_report_by_type(type, element, i) {
  fetch(back_end_url + "/admin/load_report_by_type/" + type, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      let total_revenue = 0;
      let filter_data = data["data"].filter((d) => {
        if (is_valid_date(d.date_of_purchase, i)) {
          total_revenue += d.amount * d.quantity;
          return true;
        }
      });
      if (filter_data.length != 0) {
        filter_data[0].total_revenue = roundToDecimalPlaces(total_revenue, 2);
      }
      load_data = filter_data;
      load_report_table_type(filter_data, element);
    });
}
function load_report_table_type(data, table) {
  let animal_table = "";

  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML = "<tr><td class='no_data' colspan='6'>NO DATA</td></tr>";
    return;
  }

  data.forEach(function ({
    purchase_id,
    date_of_purchase,
    item_id,
    item_name,
    quantity,
    amount,
  }) {
    animal_table += "<tr>";
    animal_table += `<td>${purchase_id}</td>`;
    animal_table += `<td>${date_of_purchase}</td>`;
    animal_table += `<td>${item_id}</td>`;
    animal_table += `<td>${item_name}</td>`;
    animal_table += `<td>${quantity}</td>`;
    animal_table += `<td>$${amount}</td>`;
    animal_table += "</tr>";
  });
  animal_table += `<tr><td colspan='5'></td><td>Total: $${data[0].total_revenue}</td></tr>`;
  table.innerHTML = animal_table;
}

function load_report_table(data) {
  const table = document.querySelector("#total_revenue_table");
  let animal_table = "";
  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML = "<tr><td class='no_data' colspan='6'>NO DATA</td></tr>";
    return;
  }

  data.forEach(function ({
    purchase_id,
    date_of_purchase,
    item_id,
    quantity,
    amount,
    item_name,
  }) {
    animal_table += "<tr>";
    animal_table += `<td>${purchase_id}</td>`;
    animal_table += `<td>${date_of_purchase}</td>`;
    animal_table += `<td>${item_id}</td>`;
    animal_table += `<td>${item_name}</td>`;
    animal_table += `<td>${quantity}</td>`;
    animal_table += `<td>$${amount}</td>`;
    animal_table += "</tr>";
  });
  animal_table += `<tr><td colspan='5'></td><td>Total: $${data[0].total_revenue}</td></tr>`;
  table.innerHTML = animal_table;
}

function show_report() {
  const selectedValue = document.getElementById("report_type").value;
  const reports = {
    total_revenue: {
      element: document.querySelector("#total_revenue"),
      type: "null",
      i: 0,
    },
    gift_shop_sales: {
      element: document.querySelector("#gift_shop_sales"),
      table: document.querySelector("#gift_shop_sales_table"),
      type: "gift_shop",
      i: 1,
    },
    membership_sales: {
      element: document.querySelector("#membership_sales"),
      table: document.querySelector("#membership_sales_table"),
      type: "membership",
      i: 2,
    },
    tickets_sales: {
      element: document.querySelector("#ticket_sales"),
      table: document.querySelector("#ticket_sales_table"),
      type: "tickets",
      i: 3,
    },
  };

  // Hide all enclosures by default
  for (const key in reports) {
    reports[key].element.hidden = true;
  }

  // Show the selected enclosure
  const selectedEnclosure = reports[selectedValue];
  if (selectedEnclosure) {
    document.getElementsByClassName("search_item_name")[
      selectedEnclosure.i
    ].value = "";
    document.getElementsByClassName("order_by")[selectedEnclosure.i].value =
      "date_of_purchase";
    selectedEnclosure.element.hidden = false;
    if (selectedEnclosure.type != "null")
      load_report_by_type(
        selectedEnclosure.type,
        selectedEnclosure.table,
        selectedEnclosure.i
      );
    else get_all_purchse_history();
  }
}
