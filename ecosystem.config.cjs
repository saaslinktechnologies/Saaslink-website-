/**
 * PM2 Process Manager Configuration for SaaSLink Technologies Ltd
 * Enterprise High-Availability Production Deployment
 *
 * Usage:
 *   Build:   npm run build
 *   Start:   pm2 start ecosystem.config.cjs
 *   Reload:  pm2 reload ecosystem.config.cjs
 *   Logs:    pm2 logs saaslink-platform
 *   Status:  pm2 status
 */

module.exports = {
  apps: [
    {
      name: 'saaslink-platform',
      script: './dist/server.cjs',
      instances: 1, // Set to 'max' for multi-core cluster mode
      exec_mode: 'fork', // Set to 'cluster' if scaling horizontally with Redis/MySQL
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      listen_timeout: 10000,
      kill_timeout: 5000,
      restart_delay: 2000,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOST: '0.0.0.0',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
