const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5001;
const DB_PATH = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// Initialize Database
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], tasks: [] }, null, 2));
}

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    if (db.users.find(u => u.email === email)) return res.status(400).json({ message: "User exists" });
    
    const newUser = { id: Date.now(), name, email, password, role: role || 'Member' };
    db.users.push(newUser);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.status(201).json({ message: "User created" });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token: "mock-jwt-token" });
});

// --- USER ROUTES ---
app.get('/api/users', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const safeUsers = db.users.map(({ password, ...u }) => u);
    res.json(safeUsers);
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, role } = req.body;
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const idx = db.users.findIndex(u => u.id === parseInt(id));
    if (idx !== -1) {
        db.users[idx] = { ...db.users[idx], name, role };
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        const { password, ...updatedUser } = db.users[idx];
        res.json(updatedUser);
    } else res.status(404).send();
});

// --- TASK ROUTES ---
app.get('/api/tasks', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    res.json(db.tasks || []);
});

app.post('/api/tasks', (req, res) => {
    const { title, description, priority, dueDate, creatorId, assignedTo } = req.body;
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const newTask = { 
        id: Date.now(), title, description, priority, dueDate, 
        status: 'Pending', creatorId, assignedTo, acceptedBy: null 
    };
    db.tasks.push(newTask);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.status(201).json(newTask);
});

app.patch('/api/tasks/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, userId } = req.body;
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const idx = db.tasks.findIndex(t => t.id === parseInt(id));
    if (idx !== -1) {
        db.tasks[idx].status = status;
        if (status === 'Accepted') db.tasks[idx].acceptedBy = userId;
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        res.json(db.tasks[idx]);
    } else res.status(404).send();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/api/users', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    
    const usersWithCounts = (db.users ?? []).map(user => {
        const { password, ...safeUser } = user;
        
        // BUG FIX: Force string comparison to count tasks correctly
        const taskCount = (db.tasks ?? []).filter(task => 
            String(task.assignedTo) === String(user.id)
        ).length;

        return { ...safeUser, taskCount };
    });

    res.json(usersWithCounts);
});
app.get('/api/users', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const usersWithCounts = (db.users ?? []).map(user => {
        const { password, ...safeUser } = user;
        // Strict ID check to count tasks for each member
        const taskCount = (db.tasks ?? []).filter(task => 
            String(task.assignedTo) === String(user.id)
        ).length;
        return { ...safeUser, taskCount };
    });
    res.json(usersWithCounts);
});