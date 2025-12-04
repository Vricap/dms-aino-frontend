# --- Stage 1: Build React app ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

RUN npm ci --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the production version
RUN npm run build

# --- Stage 2: Serve with NGINX ---
FROM nginx:alpine

# Copy the built React files from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
