const express = require("express");
const app = express();
const cors = require("cors");
const port = 3100;
const dbService = require("./db");

app.use(cors());
app.use(express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post("/admin/insert", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const { image, name, species, enclosure, enclosure_id, age, gender, weight } =
    request.body;
  const result = db.insertNewAnimal(
    image,
    name,
    species,
    enclosure,
    enclosure_id,
    age,
    gender,
    weight
  );

  result
    //send this data back to the front end
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});
app.post("/user/insert_customer_info", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { first_name, last_name, phone_number, address, city, state, zipcode } =
    req.body;
  const result = db.insert_customer_info(
    first_name,
    last_name,
    phone_number,
    address,
    city,
    state,
    zipcode
  );

  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});
app.post("/user/insert_into_purchase_history", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const {
    customer_id,
    date_of_purchase,
    item_id,
    quantity,
    amount,
    update_quantity,
    item_name,
    item_from,
  } = req.body;

  // Use Promise.all to wait for both promises to resolve
  Promise.all([
    db.insert_into_purchase_history(
      customer_id,
      date_of_purchase,
      item_id,
      quantity,
      amount,
      item_name,
      item_from
    ),
    db.update_inventory_quantity(update_quantity, item_id),
  ])
    .then(([purchaseResult, inventoryResult]) => {
      // Send a combined response
      res.json({ success: { purchaseResult, inventoryResult } });
    })
    .catch((err) => console.log(err));
});
app.post("/user/insert_into_ticket", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const {
    customer_id,
    ticket_type,
    quantity,
    price,
    purchase_date,
    ticket_date,
  } = req.body;

  const results = db.insert_into_ticket(
    customer_id,
    ticket_type,
    quantity,
    price,
    purchase_date,
    ticket_date
  );
  results
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});
//get
app.get("/admin/animaltable", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const results = db.getAllAnimalData();
  results
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/admin/getall_enclosure_report", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const results = db.getAllReport();

  results
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/admin/get_animal_by_id/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();
  const results = db.get_animal_by_id(id);

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/admin/get_item_by_id/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();
  const results = db.get_item_by_id(id);

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/admin/load_animal_by_enclosure/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();
  const results = db.load_animal_by_enclosure(id);

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/admin/load_report_by_type/:type", (req, res) => {
  const { type } = req.params;
  const db = dbService.getDbServiceInstance();
  const results = db.load_report_by_type(type);

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/user/load_memberships", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const results = db.load_memberships();

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/user/get_customer_info/:email", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { email } = req.params;
  const results = db.get_customer_info(email);

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/user/load_shop_items", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const results = db.load_shop_items();

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/admin/load_shop_items", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const results = db.load_shop_items();

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/admin/get_all_purchase_history", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const results = db.get_all_purchase_history();

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
//update
app.patch("/admin/update_animal", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const { id, image, name, species, enclosure, age, gender, weight } =
    request.body;
  const result = db.update_animal(
    id,
    image,
    name,
    species,
    enclosure,
    age,
    gender,
    weight
  );

  result
    //send this data back to the front end
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});
app.patch("/admin/update_item", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const { id, image, name, quantity, price } = request.body;
  const result = db.update_item(id, image, name, quantity, price);

  result
    //send this data back to the front end
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});
app.patch("/user/update_cus_membership", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { email, membership_id } = req.body;
  const result = db.update_cus_membership(email, membership_id);

  result
    //send this data back to the front end
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

//delete
app.delete("/admin/delete_animal_row/:id", (request, response) => {
  // get id from this prams "admin/delete_animal_row/:id"
  const { id } = request.params;
  //   console.log(request.params);
  const db = dbService.getDbServiceInstance();
  const result = db.delete_animal_row(id);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});
app.delete("/admin/delete_item_row/:id", (request, response) => {
  // get id from this prams "admin/delete_animal_row/:id"
  const { id } = request.params;
  //   console.log(request.params);
  const db = dbService.getDbServiceInstance();
  const result = db.delete_item_row(id);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});
// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const db = dbService.getDbServiceInstance();
  const results = db.authenticateUser(username, password);

  results
    .then((data) => {
      if (data.length === 0)
        throw new Error("Username or password does not match");
      return res.json({ data });
    })
    .catch((err) => {
      return res.status(401).json({ message: err.message });
    });
});
app.post("/user/register", async (req, res) => {
  const { username, password, role } = req.body;
  const db = dbService.getDbServiceInstance();

  try {
    const usernameExists = await db.checkUsernameExists(username);
    if (usernameExists) {
      // Username already exists, handle accordingly
      return res.status(400).json({ message: "Email already exists" });
    }
    const registrationResult = await db.user_register(username, password, role);
    if (registrationResult) {
      // Registration successful
      await db.insert_cus_email(username);
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      // Registration failed
      return res.status(500).json({ message: "User registration failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/user/insert_cus_email", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { username } = req.body;
  const result = db.insert_cus_email(username);

  result
    //send this data back to the front end
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

app.post("/admin/insert_new_item", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { image, name, quantity, price } = req.body;
  const result = db.insert_new_item(image, name, quantity, price);

  result
    //send this data back to the front end
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

// attractions
app.post("/admin/insertattraction", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const { image, exhibit, name, description, ride } = request.body;
  const result = db.insertNewAttraction(
    image,
    exhibit,
    name,
    description,
    ride
  );

  result
    //send this data back to the front end
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.get("/admin/attractionstable", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const results = db.getAllAttractionData();
  results
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.patch("/admin/update_attraction/:id", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const { id } = request.params;
  const { image, exhibit, name, description, ride } = request.body;
  const result = db.update_attraction(
    id,
    image,
    exhibit,
    name,
    description,
    ride
  );

  result
    //send this data back to the front end
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

app.delete("/admin/delete_attraction_row/:id", (request, response) => {
  // get id from this prams "admin/delete_animal_row/:id"
  const { id } = request.params;
  //   console.log(request.params);
  const db = dbService.getDbServiceInstance();
  const result = db.delete_attraction_row(id);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});
// end of attractions

app.get("/user/load_ticket_history/:id", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { id } = req.params;
  const results = db.load_ticket_table(id);
  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

app.get("/user/load_purchase_history_by_id/:id", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { id } = req.params;
  const results = db.load_history_by_id(id);
  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

app.get("/admin/load_notification", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const results = db.load_notification();
  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

app.delete("/admin/delete_notification_row/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();
  const result = db.delete_notification_row(id);

  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
