# Namecheap Deployment Script

## 🚀 Automated Deployment for Namecheap Hosting

### Quick Deploy Script

```bash
#!/bin/bash
# deploy-namecheap.sh

echo "🚀 Starting MYGlamBeauty deployment to Namecheap..."

# Configuration
DOMAIN="myglambeauty.com"
FTP_HOST="ftp.$DOMAIN"
FTP_USER="your_cpanel_username"
FTP_PASS="your_cpanel_password"
LOCAL_PATH="/Users/horlahdefi/CascadeProjects/myglambeauty-supply"
REMOTE_PATH="/home/your_cpanel_username/public_html"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Step 1: Build frontend
print_status "Building frontend..."
cd apps/web
npm install
npm run build

if [ $? -ne 0 ]; then
    print_error "Frontend build failed"
    exit 1
fi

print_status "Frontend built successfully"

# Step 2: Build backend
print_status "Building backend..."
cd ../../packages/api
npm install
npm run build

if [ $? -ne 0 ]; then
    print_error "Backend build failed"
    exit 1
fi

print_status "Backend built successfully"

# Step 3: Create deployment package
print_status "Creating deployment package..."
cd ../../

# Create deployment directory
mkdir -p deploy-namecheap

# Copy frontend build
cp -r apps/web/.next deploy-namecheap/
cp apps/web/public deploy-namecheap/
cp apps/web/package.json deploy-namecheap/
cp apps/web/next.config.js deploy-namecheap/

# Copy backend build
mkdir -p deploy-namecheap/api
cp -r packages/api/dist deploy-namecheap/api/
cp packages/api/package.json deploy-namecheap/api/
cp packages/api/.env.namecheap deploy-namecheap/api/.env.production

# Copy deployment files
cp docs/namecheap-deployment-guide.md deploy-namecheap/
cp scripts/namecheap-database-setup.sql deploy-namecheap/

# Create .htaccess files
cat > deploy-namecheap/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
</IfModule>

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
EOF

cat > deploy-namecheap/api/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
EOF

# Create deployment script
cat > deploy-namecheap/deploy.sh << 'EOF'
#!/bin/bash
# Remote deployment script

echo "🔧 Setting up MYGlamBeauty on Namecheap..."

# Install backend dependencies
cd api
npm install --production

# Install PM2 globally
npm install -g pm2

# Create PM2 config
cat > ecosystem.config.json << 'PM2_EOF'
{
  "apps": [{
    "name": "myglambeauty-api",
    "script": "dist/index.js",
    "instances": 1,
    "exec_mode": "fork",
    "watch": false,
    "max_memory_restart": "500M",
    "env": {
      "NODE_ENV": "production"
    }
  }]
}
PM2_EOF

# Start the application
pm2 start ecosystem.config.json
pm2 save
pm2 startup

echo "✅ MYGlamBeauty is now live!"
echo "🌐 Visit your website at: https://myglambeauty.com"
echo "📊 API available at: https://myglambeauty.com/api"
EOF

chmod +x deploy-namecheap/deploy.sh

# Create zip file
print_status "Creating deployment package..."
cd deploy-namecheap
zip -r ../myglambeauty-namecheap-deploy.zip .
cd ..

print_status "Deployment package created: myglambeauty-namecheap-deploy.zip"

# Step 4: Instructions
echo ""
print_status "🎉 Deployment package ready!"
echo ""
echo "📋 Next Steps:"
echo "1. Upload myglambeauty-namecheap-deploy.zip to your Namecheap hosting"
echo "2. Extract the files in public_html directory"
echo "3. Set up MySQL database using namecheap-database-setup.sql"
echo "4. Update .env.production with your database credentials"
echo "5. Run deploy.sh to start the application"
echo ""
echo "📁 Files created:"
echo "   - myglambeauty-namecheap-deploy.zip (deployment package)"
echo "   - deploy-namecheap/ (unpacked deployment files)"
echo ""
echo "📖 Full guide: docs/namecheap-deployment-guide.md"
echo ""
print_warning "Remember to:"
echo "   - Update database credentials in .env.production"
echo "   - Configure your SendGrid API key"
echo "   - Set up your Stripe keys"
echo "   - Enable SSL in cPanel"
```

### Manual Upload Script

```bash
#!/bin/bash
# upload-to-namecheap.sh

echo "📤 Uploading files to Namecheap..."

# Configuration
FTP_HOST="ftp.myglambeauty.com"
FTP_USER="your_cpanel_username"
FTP_PASS="your_cpanel_password"
LOCAL_PATH="deploy-namecheap/*"
REMOTE_PATH="/home/your_cpanel_username/public_html"

# Upload using lftp (install with: brew install lftp)
lftp -c "
set ftp:ssl-allow no
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST
cd $REMOTE_PATH
mrm -r *
mput $LOCAL_PATH
bye
"

echo "✅ Files uploaded successfully!"
echo "🌐 Visit: https://myglambeauty.com"
```

### Database Setup Helper

```bash
#!/bin/bash
# setup-namecheap-db.sh

echo "🗄️ Setting up database on Namecheap..."

# Configuration
DB_HOST="localhost"
DB_NAME="myglambeauty_prod"
DB_USER="myglambeauty_user"
DB_PASS="your_password"

# Create database and user
mysql -h $DB_HOST -u root -p << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

# Import schema
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < scripts/namecheap-database-setup.sql

echo "✅ Database setup completed!"
echo "📊 Database: $DB_NAME"
echo "👤 User: $DB_USER"
```

### Testing Script

```bash
#!/bin/bash
# test-namecheap-deployment.sh

echo "🧪 Testing MYGlamBeauty deployment..."

DOMAIN="myglambeauty.com"

# Test frontend
echo "Testing frontend..."
if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200"; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
fi

# Test API
echo "Testing API..."
if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api/health" | grep -q "200"; then
    echo "✅ API is responding"
else
    echo "❌ API is not responding"
fi

# Test database connection
echo "Testing database..."
curl -s "https://$DOMAIN/api/test-db" | grep -q "Database connected" && echo "✅ Database connected" || echo "❌ Database connection failed"

echo "🎉 Testing completed!"
```

## 🚀 Quick Start Commands

### 1. Build and Package
```bash
chmod +x scripts/deploy-namecheap.sh
./scripts/deploy-namecheap.sh
```

### 2. Upload to Namecheap
```bash
# Option 1: Manual upload via cPanel File Manager
# Upload myglambeauty-namecheap-deploy.zip

# Option 2: FTP upload
chmod +x scripts/upload-to-namecheap.sh
./scripts/upload-to-namecheap.sh
```

### 3. Setup Database
```bash
chmod +x scripts/setup-namecheap-db.sh
./scripts/setup-namecheap-db.sh
```

### 4. Test Deployment
```bash
chmod +x scripts/test-namecheap-deployment.sh
./scripts/test-namecheap-deployment.sh
```

This makes deployment to Namecheap super simple! 🎯
