# 🚀 KRA iTax Angular Application

## 📁 **Project Structure**

This is the **Angular Frontend** only. The PHP backend is located at:
```
C:\xampp\htdocs\kra-api\
```

## 🎯 **Quick Start**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Start Development Server**
```bash
ng serve
```

### **3. Access Application**
```
http://localhost:4200
```

## 🔗 **Backend Integration**

The Angular app connects to the PHP backend at:
```
http://localhost/kra-api/get_payments.php
```

### **Backend Requirements**
- XAMPP with Apache & MySQL running
- Database: `kra_itax` with `payments` table
- PHP files in: `C:\xampp\htdocs\kra-api\`

## 📂 **Key Files**

- **`src/app/services/payment.service.ts`** - API integration
- **`src/app/pages/payments.component.ts`** - Payments UI
- **`src/app/models/app.models.ts`** - Data models
- **`src/app/app.config.ts`** - HTTP client configuration

## 🎨 **Features**

- Modern UI with glassmorphism effects
- Real-time data from MySQL database
- Responsive design
- Payment management interface
- Search and filtering functionality

## 🛠 **Development**

This is a standalone Angular application that communicates with a separate PHP/MySQL backend via HTTP API calls.
