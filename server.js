const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


const LockerRequest = require("./models/lockerRequestSchema")


app.get('/', (req, res) => {
  res.render('locker-request',{
    API_KEY : `${process.env.GOOGLE_API}`,
});
});

app.post('/api/locker/request', async (req, res) => {
  try {
    const {
      name,
      phone,
      reason,
      locationText,
      areaType,
      urgencyLevel,
      lat,
      lng
    } = req.body;

    if (!name || !phone || !reason || !locationText || !areaType || !urgencyLevel || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "All fields including map location are required."
      });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number."
      });
    }

    const newRequest = new LockerRequest({
      name,
      phone,
      reason,
      locationText,
      areaType,
      urgencyLevel,
      ipAddress: req.ip,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    });

    await newRequest.save();

    res.json({
      success: true
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
















// Start server
app.listen(3000, '0.0.0.0', () => {
  console.log(`Server running on port ${3000}`);
});