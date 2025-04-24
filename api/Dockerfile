# Start by choosing the base image. Node 14 is a good LTS version, but you can choose the version that suits your project
FROM node:14

# Create the directory inside the container
WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install



COPY . .


EXPOSE 8000


CMD ["npm", "start"]
