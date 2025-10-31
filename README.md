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

