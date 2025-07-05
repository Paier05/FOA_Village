# Use official Node.js image as build stage
FROM node:22.16.0 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY front-end/package*.json ./
RUN npm install
RUN npm install react-custom-roulette --legacy-peer-deps
RUN npm install react-wheel-of-prizes --legacy-peer-deps

# Copy source code
COPY front-end/ ./

# Build the React app for production
RUN npm run build

# Use nginx to serve the static files
FROM nginx:stable-alpine

# Copy built React files to nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
