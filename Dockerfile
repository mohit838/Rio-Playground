# FROM nginx:stable-perl
# COPY . /usr/share/nginx/html/

# Stage 1: Build the Vite project
FROM node:slim as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Vite project files
COPY . .

# Build the project for production
RUN npm run build

# Stage 2: Set up Nginx to serve the files
FROM nginx:stable-perl

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
