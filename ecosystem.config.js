module.exports = {
  apps: [
    {
      name: 'artapi',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: './build/server.js',
    }
  ]
}
