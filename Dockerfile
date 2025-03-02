# Fetching the latest node image on apline linux
FROM node:alpine AS builder

# Declaring env
ENV NODE_ENV production
ARG VITE_API_URL 

ENV VITE_API_URL=$VITE_API_URL

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY ./package*.json ./
RUN npm install --include=dev --legacy-peer-deps

# Copying all the files in our project
COPY . .

# Building our application
RUN npm run build

# Fetching the latest nginx image
FROM nginx

# Remove the default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copying built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
