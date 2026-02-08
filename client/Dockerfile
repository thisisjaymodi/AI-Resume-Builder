# --- Stage 1: Build the React App ---
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# ENV NODE_OPTIONS="--max-old-space-size=4096"
# ... inside client/Dockerfile (Stage 1) ...
RUN npm run build

# ADD THIS DEBUG LINE:
RUN ls -la /app && ls -la /app/dist || echo "Dist folder missing!"

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine
# Copy built files from previous stage to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Add Nginx config to handle React Router (redirect 404s to index.html)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
