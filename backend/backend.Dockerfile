FROM node:22.16.0

WORKDIR /app

# Copy package files and install dependencies
COPY backend/package*.json ./
RUN npm install
RUN npm install cookie-parser jsonwebtoken bcryptjs

# Copy backend source code
COPY backend/ ./

# Expose port (make sure this matches your APP_PORT in .env)
EXPOSE 3001

# Start your node app
CMD ["node", "index.js"]
