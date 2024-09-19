require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware for parsing JSON and form-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for serving HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/form.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

app.get('/confirmation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'confirmation.html'));
});

app.get('/cancel.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cancel.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/service.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'service.html'));
});

// MongoDB URI with `logistics` as the database
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/logistics';

if (!MONGO_URI) {
    console.error('MongoDB URI is not defined in environment variables.');
    process.exit(1);
}

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB (logistics database)');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

// Booking Schema for logistics booking form
const bookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true },
    senderName: String,
    senderMobile: String,
    senderEmail: String,
    senderHouseNumber: String,
    senderStreetName: String,
    senderCity: String,
    senderState: String,
    senderPinCode: String,
    receiverName: String,
    receiverMobile: String,
    receiverEmail: String,
    receiverHouseNumber: String,
    receiverStreetName: String,
    receiverCity: String,
    receiverState: String,
    receiverPinCode: String,
    itemDescription: String,
    itemWeight: Number
});

// Contact Schema for storing Contact Us form data
const contactSchema = new mongoose.Schema({
    contactId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true }
});

// Create models for MongoDB collections
const Booking = mongoose.model('Booking', bookingSchema);
const Contact = mongoose.model('Contact', contactSchema, 'contacts');  // Explicitly set the collection name to 'contacts'

// POST route for handling bookings form submissions
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking({
            bookingId: uuidv4(),
            ...req.body
        });
        const savedBooking = await newBooking.save();
        
        console.log('New booking saved:', savedBooking); // Debug statement

        // Redirect to confirmation page with booking ID
        res.redirect(`/confirmation.html?bookingId=${savedBooking.bookingId}`);
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST route for handling Contact Us form submissions
// Add this route to handle contact form submission
app.post('/submitContact', async (req, res) => {
    try {
        const { name, email, phone, city, message } = req.body;

        const newContact = new Contact({
            contactId: uuidv4(),
            name: name,
            email: email,
            phone: phone,
            city: city,
            message: message
        });

        const savedContact = await newContact.save();
        console.log('New contact saved:', savedContact); // Debugging output

        // Respond with success message
        res.status(200).json({ message: 'Contact saved successfully' });
    } catch (error) {
        console.error('Error saving contact form data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// DELETE route for canceling bookings
app.delete('/api/bookings/:id', async (req, res) => {
    const { id } = req.params;

    // Validate the booking ID format
    const isValidUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

    if (!id || !isValidUUID) {
        return res.status(400).json({ message: 'Invalid Booking ID.' });
    }

    try {
        const deletedBooking = await Booking.findOneAndDelete({ bookingId: id });
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.json({ message: 'Booking canceled successfully.' });
    } catch (error) {
        console.error('Error canceling booking:', error);
        res.status(500).json({ message: 'Error canceling booking.' });
    }
});

// Start the server on the specified port
const PORT = process.env.PORT || 3039;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
