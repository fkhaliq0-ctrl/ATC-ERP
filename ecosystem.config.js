module.exports = {
  apps: [
    {
      name: 'django-backend',
      script: 'manage.py',
      args: 'runserver 5001',
      cwd: 'E:/ATC-ERP/backend',
      interpreter: 'python',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'react-frontend',
      script: 'start_react.bat',
      cwd: 'E:/ATC-ERP/frontend',
      interpreter: 'cmd.exe',
      watch: false,
      autorestart: true,
      max_restarts: 10
    },
    {
      name: 'whatsapp-server',
      script: 'server_fixed.js',
      cwd: 'E:/ATC-ERP/baileys-server',
      interpreter: 'node',
      watch: false,
      autorestart: true,
      max_restarts: 10
    }
  ]
};
