Ping-Pong App with Ingress
🎯 Goal
Enhance your Kubernetes cluster by:

Creating a new microservice called ping-pong

Exposing a /pingpong endpoint that returns pong <counter>

Keeping track of the counter in memory

Routing /pingpong requests using Ingress

Preserving existing paths (like / for other apps)

📁 Project Structure
pgsql
Copy
Edit
ping-pong/
├── Dockerfile
├── index.js
├── package.json
manifests/
├── pingpong-deployment.yaml
├── ingress.yaml
🧠 Application Code
index.js
js
Copy
Edit
const express = require('express');
const app = express();

let counter = 0;

app.get('/pingpong', (req, res) => {
  counter += 1;
  res.send(`pong ${counter}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ping-pong app listening on port ${PORT}`);
});
package.json
json
Copy
Edit
{
  "name": "ping-pong",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
🐳 Docker Setup
Dockerfile
dockerfile
Copy
Edit
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
Build and Push
bash
Copy
Edit
docker build -t your-dockerhub-username/ping-pong:1.0 .
docker push your-dockerhub-username/ping-pong:1.0
☸️ Kubernetes Deployment
manifests/pingpong-deployment.yaml
yaml
Copy
Edit
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pingpong-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: pingpong
  template:
    metadata:
      labels:
        app: pingpong
    spec:
      containers:
        - name: pingpong
          image: your-dockerhub-username/ping-pong:1.0
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: pingpong-service
spec:
  selector:
    app: pingpong
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
Apply:

bash
Copy
Edit
kubectl apply -f manifests/pingpong-deployment.yaml
🌐 Ingress Configuration
manifests/ingress.yaml
yaml
Copy
Edit
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: todo-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: todo.localhost
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: todo-app-service
                port:
                  number: 3000
          - path: /pingpong
            pathType: Prefix
            backend:
              service:
                name: pingpong-service
                port:
                  number: 80
Apply:

bash
Copy
Edit
kubectl apply -f manifests/ingress.yaml
🔍 Test the App
Ensure /etc/hosts contains:

Copy
Edit
127.0.0.1 todo.localhost
Then visit:

👉 http://todo.localhost:8080/pingpong

Expected output:

python-repl
Copy
Edit
pong 1
pong 2
...
🚀 GitHub Release
bash
Copy
Edit
git add .
git commit -m "Exercise 1.9: Added ping-pong app and updated ingress"
git push origin main

git tag -a v1.9 -m "Add ping-pong app with ingress route"
git push origin v1.9
