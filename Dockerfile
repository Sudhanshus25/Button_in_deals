# Use official PHP + Apache image
FROM php:8.2-apache

# Copy all files to Apache web root
COPY . /var/www/html/

# Enable Apache mod_rewrite (optional but good for routing)
RUN a2enmod rewrite

# Expose port
EXPOSE 80

# Apache runs automatically with this base image
