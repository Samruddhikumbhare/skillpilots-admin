# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the app using `serve`
FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy build from previous stage
COPY --from=builder /app/build ./build

# Expose the port you want to serve on
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", "build", "-l", "3000"]
