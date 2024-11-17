# REST API service

## About system overload

A system can vecome overloaded when the incoming workload exceeds the server's
capacity to handle it efficiently. In Node.js or any other backend, overload leads
to increased latency, dropped requests, or even a crash if resource limits are
breached.

### Causes of Overload

1. Too many requests:
  - A flood of incoming requests can exhaust the server's ability to process them.
  - Example: Handling 10,000 reqeusts per seconds on a server designed for 1,000 RPS

2. Blocking operations:
  - Blocking tasks (e.g., large computations, synchronous file operations) can
  prevent the event loop from handling new requests.
  - Example: Reading a large file synchronously or processing CPU-heavy task in a
  single thread.

3. Slow downstream services:
  - If the server relies on external services (e.g. a database or an API), and they
  are slow, requests pile up, consuming resources like memory and connections.
  Example: A slow database query holding open connections for too long.

4. Limited resources:
  - CPU: High CPU usage due to compute-heavy tasks (e.g., encryption, compression).
  - Memory: Memory leaks or unoptimized data handling can cause the system to run
  out of RAM.
  - Network: Bandwidth saturation occurs when the server sends/receives large
  amounts of data.

5. Inefficient code:
  - Porly written code (e.g., unoprimized loops, redundant processing) can degrade
  performance.
  - Example: Nested loops or lack of caching for frequently used data.

6. Concurrency Limits:
  - Node.js uses an internal thread pool (via libuv) for I/O tasks like file operations
  and DNS lookups. If the thread pool is full, tasks are queued, increasing latency.
  - Default thread pool size: 4 threads (can be increased using UV_THREADPOOL_SIZE).


### Symptoms of Overload

1. Increased Latency: Response times grow as the server struggles to process requests.

2. Dropped Requests: Incoming requests are rejected or timeout.

3. Resource Saturation:
  - CPU usage spikes to 100%.
  - Memory consumption reaches system limits.
  - Network bandwidth becomes saturated.

4. Crash or Failure:
  - "Out of memory" errors.
  - Server becomes unresponsive due to resource exhaustion.


### How to handle Overload

1. Optimize Node.js Code
  - Use Asynchronous I/O:
    - Avoid synchronous operations (e.g., fs.readFileSync)
    - Replace them with asynchronous versions (fs.readFile)
  
  - Avoid blocking the Event Loop:
    - Identify slow tasks (e.g., heavy computations).
    - Use tools like `node --prof` or   `clinic.js` to profile your code.
  
  - Cache Repeated Data:
    - Use in-memory caches (e.g., Redis) to reduce redundant database/API calls.

2. Scale Horizontally
  - Add more servers and distribute traffic using a __load balancer__ (e.g., Nginx,
  Kubernetes, AWS ELB)
  
  - Use a __cluster mode__ in Node.js to utilize multiple CPU cores:
    ```
    const cluster = require('cluster');
    const http = require('http');
    const numCPUs = require('os').availableParallelism();

    if (cluster.isMaster) {
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Hello, world!');
      }).listen(8000);
    }
    ```

3. Rate Limiting
  - Use rate limiting to control the number of requests per client
  (e.g., express-rate-limiting):
    ```
    const rateLimit = require('express-rate-limit');

    const limiter = rateLimit({
      windowMs: 1 * 60  * 1000, // 1 minute
      max: 100, // Limit each IP to 100 requests per windowMs
    });

    app.use(limiter);
    ```

4. Offload Heavy Tasks
  - Move heavy computations to Worker Threads:
    - Use Node.js `worker-threads` to offload CPU-bound tasks.
      ```
      const { Worker } = require('worker_threads');

      const worker = new Worker('./heavy-task.js');
      worker.on('message', (result) => {
        console.log('Task result: ', result);
      })
      ```
  - Use Message Queues:
    - Queue tasks for background processing with RabbitMQ, Redis

5. Use Caching
  - Reduce load on the server by caching frequently accessed data.
  - Example: Use __Redis__ for  caching:
    ```
    const Redis = require('ioredis');
    const redis = new Redis();

    // Set cache
    redis.set('key', 'value', 'EX', 60); // Expires in 60 seconds

    // Get cache
    redis.get('key', (err, value) => {
      console.log(value);
    });
    ```

6. Monitor and Adjust
  - Monitor server performance using tools like:
    - __PM2__: For process management and monitoring
    - __New Relic__ or __Datadog__: For application performance monitoring
  - Use system metrics (`top`, `htop`, or `vmstat`) to identify bottlenecks.


### Example Scenario of Overload
If your server is set to handle 800 RPS and:
1. Your database can handle only 500 RPS.
2. You don't use caching.
3. Heavy computations exist in the main thread.

Results:
- Requests start queueing up.
- Memory consumption rises as open connections pile up.
- Latency increases because the event loop is blocked.

### Summary
A system is overloaded when it consistently operates beyond its resource limits.
Effective handling requires a combination of:

1. Writing efficient, non-blocking code.
2. Scaling resources horizontally (or vertically).
3. Implementing rate limiting and caching.
4. Offloading heavy tasks.