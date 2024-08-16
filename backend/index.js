const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/users');
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
mongoose.connect('mongodb+srv://codersaro:Sarorosy12@cluster0.av48khu.mongodb.net/instareact', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))

.catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/users', usersRoutes);
// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
