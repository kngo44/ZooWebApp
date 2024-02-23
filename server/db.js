const mysql = require("mysql");
let instance = null;

const connection = mysql.createConnection({
  host: "team7db.cymql2sd4zy7.us-east-1.rds.amazonaws.com",
  database: "zoo2",
  user: "team7db",
  password: "Team71042002",
});

// const connection = mysql.createConnection({
//   host: "localhost",
//   database: "zoo",
//   user: "root",
//   password: "root1234",
// });

connection.connect((err) => {
  if (err) throw err;
  console.log("database conneced successfully!");
});

//class contains all the functions to add create delete
class dbService {
  //create new instance
  static getDbServiceInstance() {
    //if not null create new instance
    return instance ? instance : new dbService();
  }
  //get animal info from database to appears on the table
  async getAllAnimalData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT animal_id, image, animal_name, species, enclosure, age, gender, weight FROM animals;";
        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  //insert new animal into database
  async insertNewAnimal(
    image,
    name,
    species,
    enclosure,
    enclosure_id,
    age,
    gender,
    weight
  ) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO animals (image, animal_name, species, enclosure, enclosure_id, age, gender, weight) VALUES (?,?,?,?,?,?,?,?);";
        connection.query(
          query,
          [image, name, species, enclosure, enclosure_id, age, gender, weight],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else if (result && result.insertId) {
              resolve(result.insertId);
            } else {
              reject(new Error("Insert operation did not return an insertId."));
            }
          }
        );
      });

      return {
        id: insertId,
        image: image,
        name: name,
        species: species,
        enclosure: enclosure,
        age: age,
        gender: gender,
        weight: weight,
      };
    } catch (error) {
      console.log(error);
    }
  }

  //function to delete animal row
  async delete_animal_row(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM animals WHERE animal_id = ?;";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async update_animal(
    id,
    image,
    name,
    species,
    enclosure,
    age,
    gender,
    weight
  ) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE animals SET image = ?, animal_name = ?, species = ?, enclosure = ?, age = ?, gender = ?, weight = ? WHERE animal_id = ?";

        connection.query(
          query,
          [image, name, species, enclosure, age, gender, weight, id],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.affectedRows);
          }
        );
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  //report
  async getAllReport() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT enclosures.enclosure_id, enclosures.enclosure_name, enclosures.capacity, GROUP_CONCAT(animals.animal_name ORDER BY animals.animal_name) AS name_list, COUNT(animals.animal_id) AS animal_count FROM enclosures LEFT JOIN animals ON enclosures.enclosure_id = animals.enclosure_id GROUP BY enclosures.enclosure_id, enclosures.enclosure_name;";
        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async authenticateUser(username, password) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT username, role, customer_id FROM login INNER JOIN customers ON username = email WHERE username = ? AND password = ?;";
        connection.query(query, [username, password], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async user_register(username, password, role) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO login (username, password, role) VALUES (?,?,?);";
        connection.query(query, [username, password, role], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.insertId);
        });
      });
      return response === 0 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async insert_cus_email(username) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "INSERT INTO customers (email) VALUES (?);";
        connection.query(query, [username], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response.affectedRows === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async checkUsernameExists(username) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT COUNT(*) as count FROM login WHERE username = ?;";
        connection.query(query, [username], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result[0].count > 0);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async get_animal_by_id(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT image, animal_name as name, species, enclosure, age, gender, weight FROM animals WHERE animal_id = ?;";
        connection.query(query, [id], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async load_animal_by_enclosure(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT animal_id, image, animal_name, species, enclosure, age, gender, weight FROM animals WHERE enclosure_id = ?;";
        connection.query(query, [id], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async load_memberships() {
    try {
      const response = await new Promise((resolve, reject) => {
        // WHERE membership_id != 1
        const query = "SELECT * FROM memberships ";
        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  //insert new membership for user
  async insert_customer_info({
    first_name,
    last_name,
    phone_number,
    email,
    address,
    membership_id,
    city,
    state,
    zipcode,
  }) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO customers (first_name, last_name, phone_number, address, membership_id, city, state, zipcode ) values (?,?,?,?,?,?,?,?) WHERE email = ?;";

        connection.query(
          query,
          [
            first_name,
            last_name,
            phone_number,
            address,
            membership_id,
            city,
            state,
            zipcode,
            email,
          ],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });

      return response === 0 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async get_customer_info(email) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM customers WHERE email = ?";
        connection.query(query, [email], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async update_cus_membership(email, membership_id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE customers SET membership_id = ? WHERE email = ?";

        connection.query(query, [membership_id, email], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async insert_into_purchase_history(
    customer_id,
    date_of_purchase,
    item_id,
    quantity,
    amount,
    item_name,
    item_from
  ) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO purchase_history (customer_id, date_of_purchase, item_id, quantity, amount, item_name, item_from ) values (?,?,?,?,?,?,?);";

        connection.query(
          query,
          [
            customer_id,
            date_of_purchase,
            item_id,
            quantity,
            amount,
            item_name,
            item_from,
          ],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });

      return response.affectedRows === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async load_shop_items() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM inventory;";
        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async update_inventory_quantity(update_quantity, item_id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE inventory SET quantity = ? WHERE item_id = ?";

        connection.query(query, [update_quantity, item_id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async insert_into_ticket(
    customer_id,
    ticket_type,
    quantity,
    price,
    purchase_date,
    ticket_date
  ) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO ticket_inventory (customer_id, ticket_type, quantity, price, purchase_date, ticket_date) VALUES (?,?,?,?,?,?)";

        connection.query(
          query,
          [
            customer_id,
            ticket_type,
            quantity,
            price,
            purchase_date,
            ticket_date,
          ],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });
      return response.affectedRows === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async get_all_purchase_history() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT purchase_id, DATE_FORMAT(date_of_purchase, '%Y-%m-%d') as date_of_purchase, item_id, item_name , quantity, amount, ROUND(SUM(amount) OVER (), 2) AS total_revenue FROM purchase_history;";
        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async load_report_by_type(type) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT purchase_id, DATE_FORMAT(date_of_purchase, '%Y-%m-%d') as date_of_purchase, item_id, item_name, quantity, amount, ROUND(SUM(amount) OVER (), 2) AS total_revenue FROM purchase_history WHERE item_from = ?;";
        connection.query(query, [type], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async insert_new_item(image, name, quantity, price) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO inventory (image, item_name, quantity, price) VALUES (?,?,?,?);";
        connection.query(
          query,
          [image, name, quantity, price],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.insertId);
          }
        );
      });
      return {
        item_id: insertId,
        image: image,
        item_name: name,
        quantity: quantity,
        price: price,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async delete_item_row(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM inventory WHERE item_id = ?;";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async get_item_by_id(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT image, item_name as name, quantity, price FROM inventory WHERE item_id = ?;";
        connection.query(query, [id], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async update_item(id, image, name, quantity, price) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE inventory SET image = ?, item_name = ?, quantity = ?, price = ? WHERE item_id = ?";

        connection.query(
          query,
          [image, name, quantity, price, id],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.affectedRows);
          }
        );
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  // attractions
  async getAllAttractionData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT attraction_id, image, exhibit_name, animal_name, description, ride FROM attractions;";
        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async insertNewAttraction(image, exhibit, name, description, ride) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO attractions (image, exhibit_name, animal_name, description, ride) VALUES (?,?,?,?,?);";
        connection.query(
          query,
          [image, exhibit, name, description, ride],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.insertId);
          }
        );
      });
      return {
        id: insertId,
        image: image,
        exhibit: exhibit,
        name: name,
        description: description,
        ride: ride,
      };
    } catch {
      console.log(error);
    }
  }
  async delete_attraction_row(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM attractions WHERE attraction_id = ?;";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async update_attraction(id, image, exhibit, name, description, ride) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE attractions SET image = ?, exhibit_name = ?, animal_name = ?, description = ?, ride = ? WHERE attraction_id = ?";

        connection.query(
          query,
          [image, exhibit, name, description, ride, id],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async load_ticket_table(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT DATE_FORMAT(purchase_date, '%Y-%m-%d') as purchase_date, DATE_FORMAT(ticket_date, '%Y-%m-%d') as ticket_date, ticket_type, quantity FROM ticket_inventory WHERE customer_id = ?;";
        connection.query(query, [id], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async load_history_by_id(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT purchase_id, DATE_FORMAT(date_of_purchase, '%Y-%m-%d') as purchase_date, item_id, item_name, quantity, amount FROM purchase_history WHERE customer_id = ?;";
        connection.query(query, [id], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async load_notification() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT id, SUBSTRING(time, 12, 5) AS time, DATE_FORMAT(date, '%Y-%m-%d') as date, message FROM notification_table;";
        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async delete_notification_row(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM notification_table WHERE id = ?;";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = dbService;
