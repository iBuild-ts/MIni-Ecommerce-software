# Namecheap Database Setup Script

## 🗄️ MySQL Database Configuration for Namecheap

### Database Schema for MYGlamBeauty

```sql
-- Create main database
CREATE DATABASE IF NOT EXISTS myglambeauty_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE myglambeauty_prod;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'STAFF', 'ADMIN') DEFAULT 'CUSTOMER',
    phone VARCHAR(20),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Services table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priceCents INT NOT NULL,
    durationMinutes INT NOT NULL,
    category VARCHAR(100),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (isActive)
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerEmail VARCHAR(255) NOT NULL,
    customerName VARCHAR(255) NOT NULL,
    customerPhone VARCHAR(20),
    serviceId INT NOT NULL,
    serviceName VARCHAR(255) NOT NULL,
    scheduledFor TIMESTAMP NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    notes TEXT,
    totalCents INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (serviceId) REFERENCES services(id),
    INDEX idx_customer_email (customerEmail),
    INDEX idx_scheduled_for (scheduledFor),
    INDEX idx_status (status),
    INDEX idx_service (serviceId)
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priceCents INT NOT NULL,
    category VARCHAR(100),
    imageUrl VARCHAR(500),
    inStock BOOLEAN DEFAULT TRUE,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (isActive)
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerEmail VARCHAR(255) NOT NULL,
    customerName VARCHAR(255) NOT NULL,
    customerPhone VARCHAR(20),
    status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    totalCents INT NOT NULL,
    shippingAddress TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customer_email (customerEmail),
    INDEX idx_status (status)
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    priceCents INT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id),
    INDEX idx_order (orderId),
    INDEX idx_product (productId)
);

-- Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookingId INT,
    orderId INT,
    stripePaymentId VARCHAR(255),
    amountCents INT NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    paymentMethod VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingId) REFERENCES bookings(id),
    FOREIGN KEY (orderId) REFERENCES orders(id),
    INDEX idx_booking (bookingId),
    INDEX idx_order (orderId),
    INDEX idx_status (status)
);

-- Notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    email VARCHAR(255),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    INDEX idx_user (userId),
    INDEX idx_email (email),
    INDEX idx_read (isRead)
);

-- Reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookingId INT,
    customerId INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    isApproved BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingId) REFERENCES bookings(id),
    FOREIGN KEY (customerId) REFERENCES users(id),
    INDEX idx_booking (bookingId),
    INDEX idx_customer (customerId),
    INDEX idx_rating (rating)
);

-- Settings table (for admin configuration)
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keyName VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (keyName)
);

-- Insert default settings
INSERT INTO settings (keyName, value, description) VALUES
('site_name', 'MYGlamBeauty', 'Website name'),
('site_description', 'Professional Beauty Salon Management', 'Site description'),
('contact_email', 'contact@myglambeauty.com', 'Contact email'),
('phone_number', '+1-555-0123', 'Contact phone'),
('address', '123 Beauty Street, Salon City, SC 12345', 'Business address'),
('currency', 'USD', 'Default currency'),
('timezone', 'America/New_York', 'Default timezone');

-- Insert sample services
INSERT INTO services (name, description, priceCents, durationMinutes, category) VALUES
('Hair Styling', 'Professional hair styling and cut', 5000, 60, 'Hair'),
('Hair Coloring', 'Full hair coloring service', 8000, 120, 'Hair'),
('Manicure', 'Classic manicure with nail polish', 2500, 45, 'Nails'),
('Pedicure', 'Relaxing pedicure with foot massage', 3500, 60, 'Nails'),
('Facial Treatment', 'Deep cleansing facial treatment', 6000, 75, 'Skincare'),
('Massage Therapy', 'Full body Swedish massage', 7000, 90, 'Massage'),
('Makeup Application', 'Professional makeup for special occasions', 4500, 60, 'Beauty'),
('Waxing Services', 'Full body waxing', 4000, 45, 'Hair Removal');

-- Insert sample products
INSERT INTO products (name, description, priceCents, category, imageUrl) VALUES
('Shampoo & Conditioner Set', 'Premium salon-quality hair care products', 3000, 'Hair Care', '/images/shampoo-set.jpg'),
('Face Moisturizer', 'Hydrating facial moisturizer for all skin types', 2500, 'Skincare', '/images/moisturizer.jpg'),
('Nail Polish Collection', 'Set of 10 premium nail polish colors', 2000, 'Nails', '/images/nail-polish.jpg'),
('Massage Oil', 'Relaxing lavender massage oil', 1500, 'Massage', '/images/massage-oil.jpg'),
('Makeup Brush Set', 'Professional makeup brush set (12 pieces)', 3500, 'Beauty', '/images/brush-set.jpg');

-- Create admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) VALUES 
('admin@myglambeauty.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQj', 'Admin User', 'ADMIN');

-- Create indexes for better performance
CREATE INDEX idx_bookings_date_range ON bookings(scheduledFor, status);
CREATE INDEX idx_orders_date_range ON orders(createdAt, status);
CREATE INDEX idx_payments_date_range ON payments(createdAt, status);
CREATE INDEX idx_notifications_unread ON notifications(isRead, createdAt);

-- Create view for booking statistics
CREATE VIEW booking_stats AS
SELECT 
    DATE(scheduledFor) as date,
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'CONFIRMED' THEN 1 END) as confirmed_bookings,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_bookings,
    SUM(totalCents) as total_revenue
FROM bookings 
GROUP BY DATE(scheduledFor);

-- Create view for product statistics
CREATE VIEW product_stats AS
SELECT 
    p.id,
    p.name,
    p.category,
    COUNT(oi.id) as times_ordered,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.quantity * oi.priceCents) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.productId
LEFT JOIN orders o ON oi.orderId = o.id AND o.status != 'CANCELLED'
GROUP BY p.id, p.name, p.category;
```

### Database Backup Script

```bash
#!/bin/bash
# backup_database.sh

# Database credentials
DB_NAME="myglambeauty_prod"
DB_USER="myglambeauty_user"
DB_PASS="your_password"

# Backup directory
BACKUP_DIR="/home/yourusername/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Database backup completed: backup_$DATE.sql.gz"
```

### Database Restore Script

```bash
#!/bin/bash
# restore_database.sh

# Database credentials
DB_NAME="myglambeauty_prod"
DB_USER="myglambeauty_user"
DB_PASS="your_password"

# Backup file to restore
BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | mysql -u $DB_USER -p$DB_PASS $DB_NAME
else
    mysql -u $DB_USER -p$DB_PASS $DB_NAME < $BACKUP_FILE
fi

echo "Database restored from: $BACKUP_FILE"
```

### Performance Optimization

```sql
-- Optimize database performance
OPTIMIZE TABLE users, services, bookings, products, orders, order_items, payments, notifications, reviews, settings;

-- Analyze tables for better query planning
ANALYZE TABLE users, services, bookings, products, orders, order_items, payments, notifications, reviews, settings;
```

### Security Hardening

```sql
-- Create read-only user for reports
CREATE USER 'myglambeauty_readonly'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT ON myglambeauty_prod.* TO 'myglambeauty_readonly'@'localhost';

-- Remove test database if exists
DROP DATABASE IF EXISTS test;

-- Remove anonymous users
DELETE FROM mysql.user WHERE User='';

-- Flush privileges
FLUSH PRIVILEGES;
```

This database setup provides everything needed for MYGlamBeauty to run on Namecheap hosting! 🗄️
