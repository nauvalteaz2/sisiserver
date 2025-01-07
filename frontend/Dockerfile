# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy frontend code
COPY src/ ./src

# Expose port
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]
