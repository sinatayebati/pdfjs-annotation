# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Install a lightweight HTTP server
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 5173

# Command to run the app
CMD ["serve", "-s", "dist", "-l", "5173"]
