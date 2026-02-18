# 🚀 Quick Start Guide - iTax Portal

## 🎯 Demo Credentials

Use these credentials to test the application:

### **Individual User**
- **PIN:** `A123456789B`
- **Password:** `password123`
- **Name:** John Kamau
- **Type:** Individual Taxpayer

### **Business User**
- **PIN:** `A987654321C`
- **Password:** `password123`
- **Name:** Sarah Wanjiru
- **Type:** Business Taxpayer

### **Admin User**
- **PIN:** `A555555555D`
- **Password:** `password123`
- **Name:** Admin User
- **Type:** Administrator

---

## 🏃 Running the Application

### **Development Mode**
```bash
cd c:\Users\USER\Desktop\Angular\Test_App
npm run dev
```

Then open: `http://localhost:4200`

### **Production Build**
```bash
npm run build
```

---

## 🧪 Testing Checklist

### ✅ **Authentication Flow**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should show error)
- [ ] Logout from sidebar
- [ ] Session persistence (refresh page while logged in)
- [ ] Protected route access (try `/dashboard` without login)

### ✅ **User Interface**
- [ ] Sidebar shows user name and PIN
- [ ] User type badge displays correctly
- [ ] Sidebar collapse/expand works
- [ ] Mobile menu works on small screens
- [ ] Theme toggle (dark/light mode)

### ✅ **Navigation**
- [ ] All menu items are clickable
- [ ] Active route is highlighted
- [ ] Notifications badges show
- [ ] Back button works correctly

### ✅ **Services Integration**
- [ ] Dashboard shows live statistics
- [ ] Payments page loads data from service
- [ ] Returns page displays submitted returns
- [ ] eTIMS shows invoices

---

## 🔍 Debugging Tips

### **Check Console Logs**
Open browser DevTools (F12) and look for:
- 🔐 Authentication events
- ✅ Success messages
- ❌ Error messages
- 🚪 Logout events

### **Check localStorage**
In DevTools → Application → Local Storage:
- `currentUser` - Current user object
- `authToken` - Mock JWT token

### **Network Tab**
Currently shows no network requests (mock data).
After Laravel integration, you'll see API calls here.

---

## 📱 Responsive Testing

Test on different screen sizes:
- **Desktop:** 1920x1080
- **Tablet:** 768x1024
- **Mobile:** 375x667

Use Chrome DevTools Device Toolbar (Ctrl+Shift+M)

---

## 🎨 Features to Explore

### **Dashboard**
- Live statistics cards
- Revenue chart
- Recent activity feed
- Taxpayer count

### **Payments**
- Generate new PRN
- View pending payments
- Payment history with search
- Download receipts

### **Returns**
- File new returns
- View submitted returns
- Filter by type and period

### **eTIMS**
- Invoice management
- Sync status tracking
- Revenue statistics

---

## 🔧 Common Issues

### **Issue: Build fails**
**Solution:** Run `npm install` to ensure all dependencies are installed

### **Issue: Login doesn't work**
**Solution:** Check console for errors. Ensure you're using exact credentials (case-sensitive)

### **Issue: Page is blank**
**Solution:** Check if you're logged in. Try navigating to `/login` directly

### **Issue: Sidebar doesn't show user info**
**Solution:** Refresh the page. Check if localStorage has `currentUser`

---

## 📚 Next Steps

1. **Explore the codebase** - Check `ARCHITECTURE.md` for detailed documentation
2. **Customize the UI** - Modify colors in global CSS
3. **Add features** - Create new components and services
4. **Integrate backend** - Replace mock data with Laravel API calls

---

**Happy Coding! 🎉**
