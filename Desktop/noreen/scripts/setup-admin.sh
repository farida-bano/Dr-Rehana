#!/bin/bash

# MaaKiRasoi Admin Setup Script
# This script helps set up the admin user in the database

echo "🍛 MaaKiRasoi Admin Setup"
echo "========================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with DATABASE_URL and Clerk keys"
    exit 1
fi

echo "📝 Admin Setup Instructions:"
echo ""
echo "1. First, sign up a new user at: http://localhost:3000/sign-up"
echo "   Use the email you want as admin (e.g., owner@maakirasoi.com)"
echo ""
echo "2. After signing up, run this command to make them admin:"
echo ""
echo "   npx prisma studio"
echo ""
echo "3. In Prisma Studio:"
echo "   - Click on 'users' table"
echo "   - Find your user by email"
echo "   - Change 'role' field from 'customer' to 'admin'"
echo "   - Click 'Save'"
echo ""
echo "4. Sign out and sign back in"
echo ""
echo "5. Visit http://localhost:3000/admin"
echo ""
echo "✅ You're now an admin!"
echo ""
echo "Admin Features:"
echo "  📋 Manage menu items (add, edit, delete)"
echo "  📦 Track orders and update status"
echo "  📊 View business analytics"
echo ""
