# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /
WORKDIR .

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define the command to run the app using CMD which keeps the container running
CMD [ "npm", "run", "start" ]