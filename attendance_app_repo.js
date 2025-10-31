# Simple Attendance App (Node.js + Express + MongoDB)

This repository contains a minimal attendance (absensi) web application built with Node.js, Express, Mongoose and a tiny frontend. It is structured so you can upload it to GitHub and import into OpenShift (using S2I NodeJS builder or Docker image).

---

## Files in this repo

- README.md
- package.json
- .gitignore
- server.js
- models/Attendance.js
- public/index.html
- public/app.js
- Dockerfile
- openshift/template.yaml
- .env.example

---

## README.md

```markdown
# Simple Attendance App

Minimal attendance app (Node.js + Express + MongoDB). Usage:

- Start with local MongoDB or provide MONGODB_URI to connect to a remote DB.
- Expose port 8080.

## Run locally

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. `npm install`
3. `npm start`

## Deploy to OpenShift

### Option A: Import from Git (S2I)
- Create a GitHub repo and push these files.
- In OpenShift Console: "Add -> Import from Git", paste the repo URL and choose `NodeJS` builder image (s2i).

### Option B: Build from Dockerfile
- Push to GitHub and let OpenShift build using Docker strategy, or build an image externally and push to registry.

### Environment variables
- `MONGODB_URI` - MongoDB connection string
- `PORT` - (optional) port, default 8080

```
```

---

## package.json

```json
{
  "name": "attendance-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "NODE_ENV=development node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5"
  }
}
```

---

## .gitignore

```
node_modules/
.env
```

---

## .env.example

```
PORT=8080
MONGODB_URI=mongodb://username:password@host:27017/attendance_db
```

---

## server.js

```javascript
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_db';
const PORT = process.env.PORT || 8080;

// Model
const Attendance = require('./models/Attendance');

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/attendances', async (req, res) => {
  const items = await Attendance.find().sort({ createdAt: -1 });
  res.json(items);
});

app.post('/api/attendances', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const item = new Attendance({ name, time: new Date() });
  await item.save();
  res.json(item);
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## models/Attendance.js

```javascript
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
```

---

## public/index.html

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Absensi Sederhana</title>
</head>
<body>
  <h1>Absensi Sederhana</h1>
  <form id="form">
    <input id="name" placeholder="Nama" required />
    <button type="submit">Absen</button>
  </form>
  <ul id="list"></ul>

  <script src="/app.js"></script>
</body>
</html>
```

---

## public/app.js

```javascript
async function fetchList(){
  const res = await fetch('/api/attendances');
  const data = await res.json();
  const list = document.getElementById('list');
  list.innerHTML = '';
  data.forEach(i => {
    const li = document.createElement('li');
    li.textContent = `${new Date(i.time).toLocaleString()} — ${i.name}`;
    list.appendChild(li);
  });
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  if(!name) return;
  await fetch('/api/attendances', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  document.getElementById('name').value = '';
  fetchList();
});

fetchList();
```

---

## Dockerfile

```Dockerfile
FROM node:18-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["node","server.js"]
```

---

## openshift/template.yaml

```yaml
apiVersion: v1
kind: Template
metadata:
  name: attendance-app-template
objects:
  - apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: attendance-app
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: attendance-app
      template:
        metadata:
          labels:
            app: attendance-app
        spec:
          containers:
            - name: attendance-app
              image: '' # fill with image if using Docker strategy
              ports:
                - containerPort: 8080
              env:
                - name: MONGODB_URI
                  value: ""
  - apiVersion: v1
    kind: Service
    metadata:
      name: attendance-app
    spec:
      selector:
        app: attendance-app
      ports:
        - protocol: TCP
          port: 8080
          targetPort: 8080
  - apiVersion: route.openshift.io/v1
    kind: Route
    metadata:
      name: attendance-app
    spec:
      to:
        kind: Service
        name: attendance-app
parameters:
  - name: MONGODB_URI
    description: MongoDB connection string
```

---

## How to upload to GitHub from Windows *without* installing Git

1. Create a new repository on GitHub (via github.com -> New repository).
2. On the repo page click "Add file" → "Upload files".
3. Drag & drop all project files (or use the file picker), then commit.

Or, if you have Git installed locally, use:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

---

## How to import into OpenShift

### Using OpenShift Web Console (Source-to-Image)
1. In OpenShift Console choose "Add -> Import from Git".
2. Paste your repo HTTPS URL.
3. Choose Node.js builder image (NodeJS 18 S2I) and set environment variable `MONGODB_URI`.
4. Create app; OpenShift will build and deploy.

### Using `oc` CLI (S2I)

```bash
oc new-app nodejs:18~https://github.com/YOUR_USERNAME/REPO_NAME.git --name=attendance-app
oc set env dc/attendance-app MONGODB_URI="mongodb://..."
oc expose svc/attendance-app
```

### If using Dockerfile strategy
- Make sure the Dockerfile is present and OpenShift project allows building images from source. You can create a BuildConfig for Docker strategy or push image to registry and set Deployment image.

---

## Notes
- For production, secure MongoDB credentials (use Secrets in OpenShift) and enable HTTPS via route/ingress
- This is intentionally minimal to be easy to understand and import. Feel free to ask for features (user list export CSV, authentication, CSV import, etc.).
