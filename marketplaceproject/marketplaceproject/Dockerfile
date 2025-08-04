# frontend/Dockerfile

# === Build Stage ===
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# === Serve Stage ===
FROM nginx:alpine

# Copy custom Nginx config
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app
COPY --from=build /app/dist/ecommerce-frontend /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]