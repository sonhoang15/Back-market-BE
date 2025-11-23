# Stage 1: Build the application
FROM node:20 AS builder
WORKDIR /app

# Install locales
RUN apt-get update && apt-get install -y locales \
    && sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
    && locale-gen en_US.UTF-8

ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:20
WORKDIR /app

ENV NODE_ENV=production
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

COPY package*.json ./
# Install production dependencies
RUN npm install --omit=dev

# Copy built app and necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.sequelizerc ./.sequelizerc
COPY --from=builder /app/isrgrootx1.pem ./isrgrootx1.pem

EXPOSE 8080
CMD ["sh", "-c", "npx sequelize-cli db:migrate && npm run start:prod"]