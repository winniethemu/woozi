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

### Redis

(Optional) If setting up for the first time

```shell
docker pull redis/redis-stack
```

Then

```shell
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

The data in Redis can be inspected via either the CLI

```shell
redis-cli                             # if installed locally, OR
docker exec -it redis-stack redis-cli # with Docker
```

or the Redis Insight UI, which was exposed by the `docker run` command above at
`localhost:8001`. More info can be found [here](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/docker/).
