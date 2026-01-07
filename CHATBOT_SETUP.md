# 🤖 Chatbot + Pricing System Integration Guide

## 📋 Overview

This implementation includes:
- ✅ **Pricing Database Models** (SizingPrice, WeavingPrice)
- ✅ **Pricing API Endpoints** (Get, Calculate, Admin)
- ✅ **Intelligent Chatbot System** (Conversation tracking, Cost calculation)
- ✅ **Chat UI Component** (Beautiful floating chat widget)
- ✅ **Dynamic Data** (All pages fetch live prices from database)

---

## 🗂️ New Files Created

### Server (Backend)
```
server/
├── models/
│   ├── SizingPrice.js          # Sizing price schema
│   ├── WeavingPrice.js         # Weaving price schema
│   └── ChatbotConversation.js  # Chat history storage
├── controllers/
│   ├── pricing.controller.js   # Price calculations & management
│   └── chatbot.controller.js   # Chatbot logic & NLP
├── routes/
│   ├── pricing.routes.js       # Pricing endpoints
│   └── chatbot.routes.js       # Chatbot endpoints
└── seed.js                      # Updated with pricing data
```

### Client (Frontend)
```
client/src/
├── components/
│   ├── ChatBot.jsx             # Chat widget component
│   └── ChatBot.css             # Chat styling
└── services/
    └── api.js                  # Updated with pricingApi
```

---

## 🚀 Quick Setup

### 1️⃣ Install Dependencies
No new dependencies needed! All models use existing packages.

### 2️⃣ Run Database Seed
```bash
cd server
npm run seed
```
This populates pricing tables:
- **7 Sizing types** (Cotton, Polyester, Viscose, PC Blend, PV Blend, Nylon, Acrylic)
- **8 Weaving types** (Cotton, Rayon, Polyester, Silk, Woollen, Linen, Nylon, Acrylic)

### 3️⃣ Start Server
```bash
npm start
```

### 4️⃣ Test API Endpoints
The following endpoints are now available:

#### **Pricing Endpoints**
```
GET  /api/pricing/sizing/all                    # All sizing prices
GET  /api/pricing/sizing/:slug                  # Specific sizing price
GET  /api/pricing/weaving/all                   # All weaving prices
GET  /api/pricing/weaving/:slug                 # Specific weaving price

POST /api/pricing/calculate/sizing              # Calculate sizing cost
POST /api/pricing/calculate/weaving             # Calculate weaving cost
```

#### **Chatbot Endpoints**
```
POST /api/chatbot/initiate                      # Start new chat session
POST /api/chatbot/message                       # Send user message
GET  /api/chatbot/history/:sessionId            # Get chat history
```

---

## 💬 Chatbot Features

The chatbot automatically:
1. **Detects Intent** - Recognizes "sizing" vs "weaving" service requests
2. **Displays Pricing** - Lists all available yarn/fabric types with prices
3. **Calculates Costs** - Extracts quantity from user input and computes total
4. **Handles Bookings** - Collects user details for service booking
5. **Answers FAQs** - Responds to questions about delivery, payment, quality, returns

### Example Conversations

**User:** "I need cotton weaving for 50 metres"
**Bot:** Calculates ₹280 × 50 = ₹14,000 and prepares booking

**User:** "What's the sizing cost for 10kg polyester?"
**Bot:** Calculates ₹520 × 10 = ₹5,200

---

## 🔧 API Usage Examples

### Get All Sizing Prices
```bash
curl http://localhost:5000/api/pricing/sizing/all
```

Response:
```json
[
  {
    "_id": "...",
    "yarnType": "Cotton",
    "slug": "cotton",
    "pricePerKg": 450,
    "isActive": true
  },
  ...
]
```

### Calculate Weaving Cost
```bash
curl -X POST http://localhost:5000/api/pricing/calculate/weaving \
  -H "Content-Type: application/json" \
  -d '{"slug": "silk", "quantity": 20}'
```

Response:
```json
{
  "fabricType": "Silk",
  "pricePerMetre": 450,
  "quantity": 20,
  "totalCost": 9000,
  "calculation": "₹450 × 20 metres = ₹9000"
}
```

### Start Chatbot Session
```bash
curl -X POST http://localhost:5000/api/chatbot/initiate \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "session_12345"}'
```

### Send Chatbot Message
```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_12345",
    "message": "How much for 50 metres cotton weaving?"
  }'
```

---

## 📊 Database Schema

### SizingPrice
```javascript
{
  yarnType: String,        // "Cotton", "Polyester", etc.
  slug: String,           // "cotton", "polyester"
  pricePerKg: Number,     // Price in rupees
  description: String,    // Optional description
  isActive: Boolean,      // Can disable prices
  createdAt: Date,
  updatedAt: Date
}
```

### WeavingPrice
```javascript
{
  fabricType: String,     // "Cotton", "Silk", etc.
  slug: String,          // "cotton", "silk"
  pricePerMetre: Number, // Price in rupees
  description: String,   // Optional description
  isActive: Boolean,     // Can disable prices
  createdAt: Date,
  updatedAt: Date
}
```

### ChatbotConversation
```javascript
{
  sessionId: String,     // Unique session ID
  messages: [{
    sender: String,      // "user" or "bot"
    text: String,        // Message content
    timestamp: Date
  }],
  serviceType: String,   // "sizing", "weaving", "unknown"
  selectedYarnFabric: String,
  quantity: Number,
  totalCost: Number,
  bookingCreated: Boolean,
  isResolved: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Chat Widget Usage

The ChatBot component is already integrated into `App.jsx`. It:
- ✅ Appears as a floating button in bottom-right corner
- ✅ Opens/closes on click
- ✅ Persists conversation in database
- ✅ Shows loading animation while processing
- ✅ Responsive on mobile & desktop
- ✅ Uses emerald green theme (matches your brand)

### Customize Colors
Edit [ChatBot.css](client/src/components/ChatBot.css):
```css
/* Change button color */
.chatbot-toggle-btn {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

---

## 📱 Frontend Integration

### Using pricingApi in Components
```javascript
import { pricingApi } from '../services/api';

export default function YourComponent() {
  useEffect(() => {
    // Fetch all weaving prices
    pricingApi.getAllWeavingPrices()
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
    
    // Calculate cost
    pricingApi.calculateWeavingCost('silk', 50)
      .then(res => console.log(`Total: ₹${res.data.totalCost}`))
  }, []);
}
```

---

## 🔐 Admin Endpoints

For admins to update prices:

### Update Sizing Price
```bash
POST /api/pricing/admin/sizing
{
  "yarnType": "Cotton",
  "slug": "cotton",
  "pricePerKg": 480
}
```

### Update Weaving Price
```bash
POST /api/pricing/admin/weaving
{
  "fabricType": "Silk",
  "slug": "silk",
  "pricePerMetre": 500
}
```

Add admin auth middleware as needed!

---

## ✨ Features Implemented

- [x] Database models for pricing
- [x] RESTful API for pricing management
- [x] Intelligent chatbot with NLP
- [x] Cost calculation engine
- [x] Chat conversation storage
- [x] Beautiful UI components
- [x] Mobile responsive design
- [x] Error handling & fallbacks
- [x] Dynamic data loading
- [x] Session management

---

## 🐛 Troubleshooting

### Chatbot not responding?
- Check `/api/chatbot/initiate` endpoint
- Verify MONGODB_URI is set in .env
- Check browser console for errors

### Prices not showing?
- Run `npm run seed` to populate data
- Check `/api/pricing/sizing/all` response
- Verify `pricingApi` import in component

### Chat not appearing?
- Ensure ChatBot.jsx is imported in App.jsx
- Check z-index doesn't conflict (set to 9999)
- Clear browser cache

---

## 📈 Next Steps

You can extend this with:
1. **Admin Dashboard** - Manage prices & chat analytics
2. **Analytics** - Track popular services & conversion rates
3. **Recommendations** - AI suggestions based on chat history
4. **Multi-language** - Support multiple languages
5. **WhatsApp Integration** - Same chatbot on WhatsApp

---

## 📞 Support

For issues or questions about the chatbot system:
1. Check chatbot.controller.js for NLP logic
2. Review pricing.routes.js for API structure
3. Test endpoints using curl or Postman
4. Check MongoDB for data integrity

---

**Chatbot System Ready! 🎉**
