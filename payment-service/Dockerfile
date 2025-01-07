# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3002

# Run the application
CMD ["npm", "start"]
