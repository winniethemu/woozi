# Woozi

## Local Setup

Have a separate terminal window for client and server.

### Client

Inside `${PROJECT_ROOT}/client`, run

```
pnpm install
pnpm run dev
```

### Server

Inside `${PROJECT_ROOT}/server`, run

```
pnpm install
pnpm run dev
```

### MongoDB

(Optional) If setting up for the first time

```shell
docker pull mongodb/mongodb-community-server:latest
```

Then

```shell
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
```

The data in Mongo can be inspected via `mongosh`, if installed.
