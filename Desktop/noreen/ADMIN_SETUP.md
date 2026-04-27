# Admin Dashboard Setup Guide

## Overview
The MaaKiRasoi admin dashboard is a complete management system for the single mother owner to manage the food delivery business. It includes menu management, order tracking, and business analytics.

## Accessing the Admin Dashboard

### URL
```
https://yourdomain.com/admin
```

### Authentication
The admin dashboard is protected by Clerk authentication. Only users with the `admin` role can access it.

## Setting Up Admin Access

### Step 1: Create Admin User in Database
After a user signs up via Clerk, you need to set their role to `admin` in the database:

```bash
# Using Prisma Studio (interactive database viewer)
npx prisma studio

# Then:
# 1. Go to the "users" table
# 2. Find the user by email
# 3. Change the "role" field from "customer" to "admin"
# 4. Save
```

Or use a direct database query:
```sql
UPDATE users SET role = 'admin' WHERE email = 'owner@maakirasoi.com';
```

### Step 2: Sign In
1. Go to `/sign-in`
2. Sign in with the admin email
3. Navigate to `/admin`

## Admin Dashboard Features

### 1. Menu Management
**Tab: Menu Items**

#### Add New Item
- Click "Add Item" button
- Fill in:
  - **Item Name**: e.g., "Daal Chawal"
  - **Price**: in Pakistani Rupees (Rs.)
  - **Description**: Brief description of the dish
  - **Emoji/Image**: Single emoji (e.g., 🍛)
  - **Available**: Toggle to mark as available/unavailable
- Click "Add Item"

#### Edit Item
- Click "Edit" on any menu card
- Update the fields
- Click "Update Item"

#### Delete Item
- Click "Delete" on any menu card
- Confirm deletion

#### Availability Toggle
- Items can be marked as unavailable without deleting them
- Unavailable items won't appear in the customer menu

### 2. Order Management
**Tab: Orders**

#### View Orders
- See all orders in a table format
- Filter by status:
  - **Pending**: New orders waiting to be prepared
  - **Preparing**: Orders being prepared in the kitchen
  - **Out for Delivery**: Orders on the way to customer
  - **Delivered**: Completed orders

#### Update Order Status
- Click the status dropdown for any order
- Select new status
- Status updates in real-time
- Customers can see the updated status in their order history

#### Order Details
- Order ID (first 8 characters shown)
- Total amount
- Current status
- Order date
- Quick status update dropdown

### 3. Analytics Dashboard
**Tab: Analytics**

#### Today's Metrics
- **Orders Today**: Number of orders placed today
- **Revenue Today**: Total revenue from today's orders

#### All-Time Metrics
- **Total Orders**: All orders since launch
- **Total Revenue**: All revenue since launch

#### Use Cases
- Track daily performance
- Monitor business growth
- Plan inventory based on order volume
- Identify peak hours

## Database Schema

The admin system uses these database tables:

### Users Table
```
- id: Unique identifier
- email: User email
- name: User name
- role: "customer" or "admin"
- createdAt: Account creation date
```

### Menu Items Table
```
- id: Unique identifier
- name: Item name
- slug: URL-friendly name
- description: Item description
- price: Price in Rs.
- image: Emoji or image URL
- isAvailable: Availability status
- categoryId: Category reference
- createdAt: Creation date
```

### Orders Table
```
- id: Unique identifier
- userId: Customer reference
- addressId: Delivery address reference
- totalAmount: Order total
- status: pending, preparing, out_for_delivery, delivered
- paymentMethod: cod, jazzcash, easypaisa
- paymentStatus: pending, completed, failed
- createdAt: Order date
```

## API Endpoints (Admin Only)

All admin endpoints require authentication and admin role.

### Menu Management
- `GET /api/admin/menu` - List all menu items
- `POST /api/admin/menu` - Create new item
- `PUT /api/admin/menu/[id]` - Update item
- `DELETE /api/admin/menu/[id]` - Delete item

### Order Management
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/[id]` - Update order status

### Analytics
- `GET /api/admin/analytics` - Get business metrics

## Security

- Admin routes are protected by Clerk authentication
- Only users with `role = 'admin'` can access admin endpoints
- All API endpoints verify admin status before processing
- Middleware protects `/admin` route from unauthorized access

## Future Enhancements

Potential features to add:
- Image upload integration (Cloudinary/UploadThing)
- Inventory management
- Customer reviews and ratings
- SMS/Email notifications
- Advanced analytics and charts
- Staff management
- Delivery partner tracking
- Promotional codes/discounts

## Troubleshooting

### Can't access admin dashboard
1. Verify you're signed in with Clerk
2. Check that your user role is set to "admin" in the database
3. Clear browser cache and try again

### Orders not showing
1. Verify orders exist in the database
2. Check that you're signed in as admin
3. Refresh the page

### Can't update menu items
1. Ensure all required fields are filled
2. Check that prices are valid numbers
3. Verify you have admin access

## Support

For issues or questions, check the database directly using:
```bash
npx prisma studio
```

This opens an interactive database viewer where you can inspect and modify data directly.
