const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const mqtt = require('mqtt');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallbackSecretKey';


//const userId = 1;

// Swagger Setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Hydroponics Automation API',
    version: '1.0.0',
    description: 'API for controlling hydroponics sensor automation',
  },
};
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./server.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  const { username, password, productId } = req.body;

  if (!username || !password || !productId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO users (username, password, product_id) VALUES (?, ?, ?)`;

  db.query(sql, [username, hashedPassword, productId], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Username already exists" });
      }
      console.error("Error registering user:", err);
      return res.status(500).json({ error: "User registration failed" });
    }

    res.json({ success: true, message: "User registered successfully" });
  });
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];

    console.log("Login attempt for:", username);
    console.log("Entered password:", password);
    console.log("Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Match result:", isMatch); 

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, token });
  });
});


const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Token missing" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};


// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_garden',
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

// MQTT Connection
const mqttClient = mqtt.connect('ws://broker.emqx.io:8083/mqtt');
mqttClient.on('connect', () => {
  console.log('✅ Connected to MQTT broker');

  const sql = `
    SELECT id AS product_id, mqtt_broker, topic_pH, topic_ultrasonik, topic_humidity, topic_TDS
    FROM product
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch product topics:', err);
      return;
    }

    results.forEach(product => {
      const topics = [
        product.topic_pH,
        product.topic_ultrasonik,
        product.topic_humidity,
        product.topic_TDS
      ];

      topics.forEach(topic => {
        if (topic) {
          mqttClient.subscribe(topic, (err) => {
            if (err) {
              console.error(`❌ Failed to subscribe to topic ${topic}:`, err);
            } else {
              console.log(`📡 Subscribed to topic: ${topic}`);
            }
          });
        }
      });
    });
  });

  const actuatorSQL = `SELECT id FROM product`;
  db.query(actuatorSQL, (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch product IDs for actuator logs:', err);
      return;
    }

    results.forEach(({ id: product_id }) => {
      const topic = `device/${product_id}/actuator_log`;
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error(`❌ Failed to subscribe to actuator topic ${topic}:`, err);
        } else {
          console.log(`📡 Subscribed to actuator log topic: ${topic}`);
        }
      });
    });
  });
});


const sensorBuffer = {}; // { [user_id]: { temperature, water_level, pH, TDS, lastUpdate } }

function tryInsertBufferedData(user_id) {
  const entry = sensorBuffer[user_id];
  if (
    entry &&
    entry.temperature !== undefined &&
    entry.water_level !== undefined &&
    entry.pH !== undefined &&
    entry.TDS !== undefined
  ) {
    const sql = `
      INSERT INTO garden_logs (user_id, temperature, water_level, pH, TDS)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [user_id, entry.temperature, entry.water_level, entry.pH, entry.TDS], (err, result) => {
      if (err) {
        console.error('❌ Failed to insert sensor data into DB:', err);
      } else {
        console.log(`✅ Sensor data inserted into garden_logs for user ${user_id}`);
        delete sensorBuffer[user_id]; 
      }
    });
  } else {
    console.log(`🕓 Waiting for full sensor data for user ${user_id}...`, entry);
  }
}

mqttClient.on('message', (topic, messageBuffer) => {

  function checkThresholdAndNotify(user_id, type, value) {
  const thresholdSQL = `
    SELECT min_temperature, max_temperature,
           min_pH, max_pH,
           min_TDS, max_TDS,
           min_water_level, max_water_level
    FROM automation_parameters
    WHERE user_id = ?
  `;

  db.query(thresholdSQL, [user_id], (err, results) => {
    if (err || results.length === 0) {
      console.error(`❌ Failed to fetch thresholds for user ${user_id}`, err);
      return;
    }

    const t = results[0];

    const limitMap = {
      temperature: [t.min_temperature, t.max_temperature],
      pH: [t.min_pH, t.max_pH],
      TDS: [t.min_TDS, t.max_TDS],
      water_level: [t.min_water_level, t.max_water_level],
    };

    const [min, max] = limitMap[type];
    if (min === null || max === null) return;

    if (value < min || value > max) {
      const title = `${type} Alert`;
      const message = `${type} = ${value} is out of range (${min} - ${max})`;

      const insertNotifSQL = `
        INSERT INTO notifications (user_id, title, message)
        VALUES (?, ?, ?)
      `;

      db.query(insertNotifSQL, [user_id, title, message], (err) => {
        if (err) {
          console.error('❌ Failed to insert notification:', err);
        } else {
          console.log(`🔔 Notification saved: ${title} - ${message}`);
        }
      });
    }
  });
}


  try {
    const raw = messageBuffer.toString();
    let payload;

    if (!isNaN(Number(raw))) {
      payload = { value: Number(raw) };
    } else {
      payload = JSON.parse(raw);
    }

    console.log(`📥 Received on ${topic}:`, payload);

    if (topic.includes('/actuator_log')) {
      const productId = topic.split('/')[1];

      const sql = `SELECT id FROM users WHERE product_id = ? LIMIT 1`;

      db.query(sql, [productId], (err, results) => {
        if (err || results.length === 0) {
          console.warn(`⚠️ No user found for product ${productId}`);
          return;
        }

        const user_id = results[0].id;
        const { action, status } = typeof payload === 'object' ? payload : {};

        if (!action || !status) {
          console.warn(`⚠️ Missing actuator log fields in payload:`, payload);
          return;
        }

        const insertSQL = `
          INSERT INTO actuator_logs (user_id, action, status)
          VALUES (?, ?, ?)
        `;

        db.query(insertSQL, [user_id, action, status], (err) => {
          if (err) {
            console.error('❌ Failed to insert actuator log:', err);
          } else {
            console.log(`📝 Actuator log inserted for user ${user_id}`);
          }
        });
      });

      return;
    }

    const topicLookupSQL = `
      SELECT users.id AS user_id FROM users
      JOIN product ON users.product_id = product.id
      WHERE ? IN (product.topic_pH, product.topic_ultrasonik, product.topic_humidity, product.topic_TDS)
    `;

    db.query(topicLookupSQL, [topic], (err, results) => {
      if (err) {
        console.error('❌ Error finding user for topic:', err);
        return;
      }

      if (results.length === 0) {
        console.warn(`⚠️ No user found for topic: ${topic}`);
        return;
      }

      const user_id = results[0].user_id;

      if (!sensorBuffer[user_id]) {
        sensorBuffer[user_id] = { lastUpdate: Date.now() };
      }

      if (topic.includes('pH')) {
        const value = payload.pH ?? payload.value;
        sensorBuffer[user_id].pH = value;
        checkThresholdAndNotify(user_id, 'pH', value);
      } else if (topic.includes('TDS')) {
        const value = payload.TDS ?? payload.value;
        sensorBuffer[user_id].TDS = value;
        checkThresholdAndNotify(user_id, 'TDS', value);
      } else if (topic.includes('ultrasonik') || topic.includes('ultrasonic')) {
        const value = payload.water_level ?? payload.value;
        sensorBuffer[user_id].water_level = value;
        checkThresholdAndNotify(user_id, 'water_level', value);
      } else if (topic.includes('humidity')) {
        const value = payload.temperature ?? payload.value;
        sensorBuffer[user_id].temperature = value;
        checkThresholdAndNotify(user_id, 'temperature', value);
      }

      console.log(`📊 Buffered for user ${user_id}:`, sensorBuffer[user_id]);
      tryInsertBufferedData(user_id);
    });
  } catch (err) {
    console.error('❌ Error processing MQTT message:', err);
  }
});



/**
 * @openapi
 * /save-settings:
 *   post:
 *     summary: Save min/max settings for sensors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               min_temperature: { type: number }
 *               max_temperature: { type: number }
 *               min_humidity: { type: number }
 *               max_humidity: { type: number }
 *               min_water_level: { type: number }
 *               max_water_level: { type: number }
 *               min_pH: { type: number }
 *               max_pH: { type: number }
 *               min_TDS: { type: number }
 *               max_TDS: { type: number }
 *     responses:
 *       200:
 *         description: Settings saved successfully
 */
app.post('/save-settings', authenticate, (req, res) => {
  const {
    min_temperature, max_temperature,
    // min_humidity, max_humidity,
    min_pH, max_pH,
    min_TDS, max_TDS,
    min_water_level, max_water_level
  } = req.body;

  const userId = req.user.id; 

  const sql = `
    INSERT INTO automation_parameters 
    (user_id, min_temperature, max_temperature, min_pH, max_pH, min_TDS, max_TDS, min_water_level, max_water_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      min_temperature = VALUES(min_temperature),
      max_temperature = VALUES(max_temperature),
      min_pH = VALUES(min_pH),
      max_pH = VALUES(max_pH),
      min_TDS = VALUES(min_TDS),
      max_TDS = VALUES(max_TDS),
      min_water_level = VALUES(min_water_level),
      max_water_level = VALUES(max_water_level)
  `;

  db.query(sql, [
    userId, min_temperature, max_temperature,
    min_pH, max_pH,
    min_TDS, max_TDS,
    min_water_level, max_water_level
  ], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, error: 'Database error' });
    }

    res.json({ success: true, message: 'Settings updated' });
  });
});


/**
 * @openapi
 * /get-settings:
 *   get:
 *     summary: Retrieve min/max sensor settings
 *     responses:
 *       200:
 *         description: Returns automation thresholds
 */
app.get('/get-settings', authenticate, (req, res) => {
  const sql = `SELECT * FROM automation_parameters WHERE user_id = ? LIMIT 1`;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(404).json({ error: 'No settings found' });
    }

    res.json(results[0]);
  });
});


/**
 * @openapi
 * /sensor-summary:
 *   get:
 *     summary: Get sensor data summary for dashboard
 *     parameters:
 *       - name: type
 *         in: query
 *         required: true
 *         description: Sensor type (temperature, humidity, pH, TDS, water_level)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns latest, 7-day average, and historical data
 */
app.get('/sensor-summary', authenticate, (req, res) => {
  const typeMap = {
    waterLevel: 'water_level',
    temperature: 'temperature',
    pH: 'pH',
    TDS: 'TDS',
  };

  const type = req.query.type;
  const column = typeMap[type];

  if (!column) {
    return res.status(400).json({ error: 'Invalid or missing sensor type' });
  }

  const sql = `
    SELECT \`${column}\`, created_at
    FROM garden_logs
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 100
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error('Database error occurred:', err);
      return res.status(500).json({ error: 'Database query failed', details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No data available' });
    }

    const history = results
      .slice(0, 10)
      .map(row => row[column])
      .reverse();

    const latest = results[0][column];

    const sevenDayAvg = (() => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const valuesInLast7Days = results
        .filter(row => new Date(row.created_at) >= sevenDaysAgo)
        .map(row => row[column]);

      const sum = valuesInLast7Days.reduce((acc, val) => acc + val, 0);
      return valuesInLast7Days.length > 0
        ? parseFloat((sum / valuesInLast7Days.length).toFixed(2))
        : 0;
    })();

    res.json({
      latest,
      average7days: sevenDayAvg,
      history
    });
  });
});


app.get('/get-logs', authenticate, (req, res) => {
  const sql = `SELECT * FROM actuator_logs WHERE user_id = ? ORDER BY created_at DESC`;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results); 
  });
});

app.get('/actuator_logs/:id', authenticate, (req, res) => {
  const { id } = req.params;

  const sql = 'SELECT * FROM actuator_logs WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching actuator log:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve actuator log' });
    }

    console.log('Actuator log query result:', result);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Actuator log not found' });
    }

    res.json({ success: true, actuator_log: result[0] });
  });
});



app.delete('/delete-log/:id', authenticate, (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM actuator_logs WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Failed to delete log:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ success: true, message: 'Log deleted successfully' });
  });
});

app.get('/get-garden-logs', authenticate, (req, res) => {
  const sql = `
    SELECT *
    FROM garden_logs
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error('Database error occurred:', err);
      return res.status(500).json({ error: 'Database query failed', details: err });
    }

    console.log("Garden logs fetched from database:", results);
    res.json(results); 
  });
});

app.get("/garden_logs/:id", authenticate, (req, res) => {
  const logId = req.params.id;
  const sql = `
    SELECT *
    FROM garden_logs
    WHERE id = ?
  `;

  db.query(sql, [logId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Log not found" });
    }

    res.json({ success: true, garden_log: results[0] });
  });
});


app.delete('/delete-garden-log/:id', authenticate, (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM garden_logs WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Failed to delete log:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ success: true, message: 'Log deleted successfully' });
  });
});

app.get('/get-notifications', authenticate, (req, res) => {
  const sql = `
    SELECT *
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    console.log("Notifications fetched from database:", results);
    res.json(results);  
  });
});


app.get("/notifications/:id", authenticate, (req, res) => {
  const notificationId = req.params.id;

  const sql = "SELECT * FROM notifications WHERE id = ?";

  db.query(sql, [notificationId], (err, results) => {
    if (err) {
      console.error("Error fetching notification:", err);
      return res.status(500).json({ success: false, error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }

    res.json({ success: true, notification: results[0] });
  });
});


app.delete("/delete-notification/:id", authenticate, (req, res) => {
  const notificationId = req.params.id;

  const sql = "DELETE FROM notifications WHERE id = ?";

  db.query(sql, [notificationId], (err, result) => {
    if (err) {
      console.error("Error deleting notification:", err);
      return res.status(500).json({ success: false, error: "Database deletion failed." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Notification not found." });
    }

    res.json({ success: true, message: "Notification deleted successfully." });
  });
});


app.get('/check-environment', authenticate, (req, res) => {
  const userId = req.user.id;

  const getEnvironmentData = `
    SELECT env_id, water_level, temperature, pH, TDS
    FROM garden_logs
    WHERE user_id = ? LIMIT 1;
  `;

  db.query(getEnvironmentData, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching environment data:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    const environment = results[0]; 

    const getThresholds = `
      SELECT water_level_max, temperature_max, pH_max, TDS_max
      FROM automation_parameters
      WHERE user_id = ?;
    `;

    db.query(getThresholds, [userId], (err, thresholds) => {
      if (err) {
        console.error('Error fetching thresholds:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }

      const threshold = thresholds[0];  

      let notifications = [];

      if (environment.water_level > threshold.water_level_max) {
        notifications.push({
          title: 'Water Level Overflow',
          message: `Water level exceeds the max threshold: ${environment.water_level} > ${threshold.water_level_max}. It is overflowing.`,
        });
      }

      if (environment.temperature > threshold.temperature_max) {
        notifications.push({
          title: 'Temperature Alert',
          message: `Temperature exceeds the max threshold: ${environment.temperature} > ${threshold.temperature_max}.`,
        });
      }

      if (environment.pH > threshold.pH_max) {
        notifications.push({
          title: 'pH Level Alert',
          message: `pH level exceeds the max threshold: ${environment.pH} > ${threshold.pH_max}.`,
        });
      }

      if (environment.TDS > threshold.TDS_max) {
        notifications.push({
          title: 'TDS Level Alert',
          message: `TDS level exceeds the max threshold: ${environment.TDS} > ${threshold.TDS_max}.`,
        });
      }

      if (notifications.length > 0) {
        notifications.forEach(notification => {
          const insertNotification = `
            INSERT INTO notifications (user_id, title, message)
            VALUES (?, ?, ?);
          `;

          db.query(insertNotification, [userId, notification.title, notification.message], (err, result) => {
            if (err) {
              console.error('Error inserting notification:', err);
            }
          });
        });
      }

      res.json({ message: 'Environment checked and notifications sent (if applicable)' });
    });
  });
});

app.get('/get-maintenance-logs', authenticate, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT *
    FROM maintenance
    WHERE user_id = ?
    ORDER BY created_at DESC;
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.json(results); 
  });
});

app.post('/add-note', authenticate, (req, res) => {
  const { activity } = req.body;
  const user_id = req.user.id; 

  const sql = `
    INSERT INTO maintenance (user_id, activity)
    VALUES (?, ?)
  `;

  db.query(sql, [user_id, activity], (err, result) => {
    if (err) {
      console.error('Error inserting note:', err);
      return res.status(500).json({ success: false, error: 'Failed to add note' });
    }

    res.json({
      success: true,
      message: 'Note added successfully',
      id: result.insertId
    });
  });
});


app.post("/update-note/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { activity } = req.body;

  const sql = `
    UPDATE maintenance
    SET activity = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(sql, [activity, id], (err, result) => {
    if (err) {
      console.error("Error updating note:", err);
      return res.status(500).json({ success: false, error: "Failed to update note" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.json({ success: true, message: "Note updated successfully" });
  });
});


app.delete('/delete-note/:id', authenticate, (req, res) => {
  const { id } = req.params;  

  const sql = `
    DELETE FROM maintenance WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting note:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete note' });
    }

    if (result.affectedRows > 0) {
      //console.log(sql)
      res.json({ success: true, message: 'Note deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Note not found' });
    }
  });
});


app.get('/get-note/:log_id', authenticate, (req, res) => {
  const { log_id } = req.params;
  const userId = req.user.id;

  const sql = `
    SELECT * FROM maintenance
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [log_id, userId], (err, result) => {
    if (err) {
      console.error('Error fetching note:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve note' });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Note not found or not accessible' });
    }

    res.json({ success: true, note: result[0] });
  });
});



app.get('/', (req, res) => {
  res.send('🌱 Hydroponics API running!');
});

app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
  console.log(`📘 Swagger UI available at http://localhost:${port}/api-docs`);
});
