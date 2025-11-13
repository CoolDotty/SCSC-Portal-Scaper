# Use the official Node.js image as a base
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package.json yarn.lock serverless.yml .env ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port your app listens to (e.g., 3000)
EXPOSE 3000

# Run yarn dev when the container starts
CMD ["yarn", "dev", "--host", "0.0.0.0"]
