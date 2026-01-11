# MYGlamBeauty - Namecheap Deployment Guide

## 🚀 Budget-Friendly Deployment on Namecheap

### Prerequisites
- Namecheap hosting account (cPanel)
- Domain name (myglambeauty.com)
- Node.js support enabled
- MySQL database access

## 📋 Step-by-Step Deployment

### 1. Database Setup

#### Create MySQL Database
1. Log into your Namecheap cPanel
2. Go to "MySQL Databases"
3. Create a new database:
   - Database name: `myglambeauty_prod`
   - Username: `myglambeauty_user`
   - Password: Generate strong password
4. Add user to database with all privileges

#### Import Database Schema
```sql
-- Run these SQL commands in phpMyAdmin
CREATE DATABASE myglambeauty_prod;
USE myglambeauty_prod;

-- Import your schema here
-- (We'll generate this from Prisma)
```

### 2. Backend Configuration

#### Update Environment Variables
Copy `.env.namecheap` to `.env.production` and update:

```env
# Database credentials from cPanel
DATABASE_URL=mysql://myglambeauty_user:YOUR_PASSWORD@localhost:3306/myglambeauty_prod

# Your actual domain
NEXT_PUBLIC_API_URL=https://myglambeauty.com/api

# Your SendGrid API key
SMTP_PASS=your_sendgrid_api_key
```

#### Build Backend
```bash
cd packages/api
npm install
npm run build
```

### 3. Frontend Configuration

#### Update API Configuration
```typescript
// apps/web/src/config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://myglambeauty.com/api';
```

#### Build Frontend
```bash
cd apps/web
npm install
npm run build
```

### 4. Upload Files to Namecheap

#### Directory Structure
```
/home/yourusername/public_html/
├── api/                    # Backend files
│   ├── dist/              # Built backend
│   ├── node_modules/      # Dependencies
│   └── package.json       # Dependencies list
├── _next/                 # Next.js build files
├── uploads/               # File uploads
├── .next/                 # Next.js build cache
├── package.json           # Frontend dependencies
├── next.config.js         # Next.js config
└── index.html             # Frontend entry
```

#### Upload Method 1: File Manager
1. Go to cPanel → File Manager
2. Upload all files to `public_html/`
3. Set permissions: folders (755), files (644)

#### Upload Method 2: FTP
```bash
# Use FileZilla or similar FTP client
# Host: ftp.yourdomain.com
# Username: cPanel username
# Password: cPanel password
```

### 5. Configure Server

#### Create .htaccess for API
```apache
# /public_html/api/.htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

#### Create .htaccess for Frontend
```apache
# /public_html/.htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

### 6. Install Dependencies

#### Via cPanel Terminal
```bash
cd /home/yourusername/public_html/api
npm install --production
```

#### Via SSH (if available)
```bash
ssh yourusername@yourdomain.com
cd public_html/api
npm install --production
```

### 7. Set Up Process Manager

#### Install PM2
```bash
npm install -g pm2
```

#### Create PM2 Config
```json
{
  "apps": [{
    "name": "myglambeauty-api",
    "script": "dist/index.js",
    "cwd": "/home/yourusername/public_html/api",
    "instances": 1,
    "exec_mode": "fork",
    "watch": false,
    "max_memory_restart": "500M",
    "env": {
      "NODE_ENV": "production"
    }
  }]
}
```

#### Start Application
```bash
cd /home/yourusername/public_html/api
pm2 start ecosystem.config.json
pm2 save
pm2 startup
```

### 8. Configure Cron Jobs

#### Set up cron for automated tasks
```bash
# In cPanel → Cron Jobs
# Add these commands:

# Backup database daily at 2 AM
0 2 * * * /usr/bin/mysqldump -u myglambeauty_user -p'PASSWORD' myglambeauty_prod > /home/yourusername/backups/db_$(date +\%Y\%m\%d).sql

# Restart PM2 if needed
*/5 * * * * cd /home/yourusername/public_html/api && pm2 restart myglambeauty-api || pm2 start ecosystem.config.json
```

### 9. SSL Certificate

#### Free SSL via Namecheap
1. Go to cPanel → SSL/TLS Status
2. Enable "AutoSSL" for your domain
3. Wait for certificate installation
4. Force HTTPS redirect

#### Force HTTPS in .htaccess
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 10. Test Everything

#### Test Backend API
```bash
curl https://myglambeauty.com/api/health
```

#### Test Frontend
- Visit https://myglambeauty.com
- Check all pages load
- Test booking functionality
- Test payment processing

## 🔧 Troubleshooting

### Common Issues

#### 500 Internal Server Error
- Check file permissions (755 for folders, 644 for files)
- Verify .htaccess syntax
- Check error logs in cPanel

#### Database Connection Failed
- Verify database credentials
- Check if database exists
- Test connection via phpMyAdmin

#### API Not Responding
- Check if PM2 is running: `pm2 list`
- Restart PM2: `pm2 restart myglambeauty-api`
- Check logs: `pm2 logs myglambeauty-api`

#### Images Not Uploading
- Create uploads directory: `mkdir uploads`
- Set permissions: `chmod 755 uploads`
- Check PHP upload limits

### Getting Help

#### Check Logs
- cPanel → Metrics → Errors
- PM2 logs: `pm2 logs myglambeauty-api`
- Apache logs: `/usr/local/apache/logs/error_log`

#### Contact Support
- Namecheap live chat
- cPanel documentation
- Community forums

## 📊 Performance Optimization

### Enable Caching
```apache
# In .htaccess
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
</IfModule>
```

### Enable Gzip Compression
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

## 🎉 You're Live!

Once you complete these steps, your MYGlamBeauty application will be fully functional on Namecheap hosting:

- ✅ Frontend: https://myglambeauty.com
- ✅ Backend API: https://myglambeauty.com/api
- ✅ Database: MySQL on Namecheap
- ✅ SSL: Free certificate
- ✅ Email: SendGrid integration
- ✅ File uploads: Local storage

Total monthly cost: Just your Namecheap hosting fee! 🎊
