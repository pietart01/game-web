# Set the working directory in the container
WORKDIR /app

# Set the timezone
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./package*.json ./

RUN npm install pm2@latest --g

# Install the app dependencies
RUN npm install

# Copy the app source code to the container
COPY ./ .

# Expose the port the app will run on
EXPOSE 3000

COPY process.json .

CMD ["pm2-runtime", "process.json"]