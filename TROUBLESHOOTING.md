# 🔧 Troubleshooting & FAQ

## Common Issues & Solutions

### 🤖 Chat Widget Not Appearing

**Problem:** The floating chat button doesn't show on the page.

**Solutions:**

1. **Check Component Import**
   ```javascript
   // In App.jsx, verify:
   import ChatBot from './components/ChatBot';
   
   // And it's rendered before closing </div>:
   <ChatBot />
   ```

2. **Check CSS Loading**
   - Verify `ChatBot.css` is in same folder as `ChatBot.jsx`
   - Check browser console for CSS errors
   - Try clearing browser cache (Ctrl+Shift+Delete)

3. **Check Z-index Conflict**
   - Open browser DevTools (F12)
   - Find `.chatbot-container` element
   - Check if another element has higher z-index
   - Solution: Increase z-index in ChatBot.css

**Test:**
```bash
# In browser console, paste:
const bot = document.querySelector('.chatbot-container');
console.log(bot ? 'ChatBot loaded ✅' : 'ChatBot NOT loaded ❌');
```

---

### 📊 Prices Not Loading

**Problem:** SizingPage or WeavingPage show "Loading pricing data..." but never load.

**Solutions:**

1. **Check if Server is Running**
   ```bash
   # Open new terminal and run:
   curl http://localhost:5000/api/pricing/sizing/all
   
   # Should see JSON array of prices
   ```

2. **Check Database Connection**
   ```bash
   # In server terminal, look for message:
   # "✅ Seed complete - Pricing data loaded"
   # If not, run:
   npm run seed
   ```

3. **Check Network Tab**
   - Open DevTools → Network tab
   - Click on a page with pricing
   - Look for `/pricing/*/all` requests
   - Check status code (should be 200)
   - Check response (should be JSON array)

4. **Check Environment Variables**
   ```bash
   # In server/.env, verify:
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB=chinnutex
   ```

**Test:**
```bash
# Terminal:
curl -s http://localhost:5000/api/pricing/weaving/all | jq '.'
# Should output JSON array with prices
```

---

### 💬 Chatbot Not Responding

**Problem:** Chat widget opens but bot doesn't respond to messages.

**Solutions:**

1. **Check Console Errors**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red errors
   - Note the error message

2. **Verify API Endpoint**
   ```bash
   # Test chatbot endpoints:
   curl -X POST http://localhost:5000/api/chatbot/initiate \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"test_123"}'
   
   # Should return greeting message
   ```

3. **Check CORS Settings**
   - If you see "CORS error" in console:
   - Add your frontend URL to `server/.env`:
     ```
     CLIENT_URL=http://localhost:5173
     ```
   - Restart server: `npm start`

4. **Check Database**
   ```bash
   # Verify MongoDB is running
   # Check connection in server logs
   ```

**Test:**
```javascript
// In browser console:
fetch('http://localhost:5000/api/chatbot/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionId: 'test' })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

---

### ❌ CORS Errors

**Problem:** "Cross-Origin Request Blocked" or "Access denied"

**Solution:**

1. **Check server/server.js**
   ```javascript
   // Should have CORS middleware:
   const corsOrigin = (origin, cb) => {
     if (!origin) return cb(null, true);
     if (explicitOrigins.includes(origin)) return cb(null, true);
     if (/^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
     return cb(new Error('Not allowed by CORS'));
   };
   ```

2. **Add Frontend URL to .env**
   ```bash
   CLIENT_URL=http://localhost:5173,http://localhost:3000
   ```

3. **Restart Server**
   ```bash
   # Stop: Ctrl+C
   npm start
   ```

---

### 🗄️ Database Not Seeding

**Problem:** `npm run seed` doesn't create pricing data.

**Solutions:**

1. **Check MongoDB Connection**
   ```bash
   # Verify MONGODB_URI in .env is correct
   # Test connection:
   mongosh your_connection_string
   # Should connect successfully
   ```

2. **Check Error Message**
   ```bash
   # Run seed again and note any errors:
   npm run seed
   # Look for error messages
   ```

3. **Manual Seed Verification**
   ```bash
   # In MongoDB client:
   use chinnutex
   db.sizingprices.find()
   # Should show 7 documents
   
   db.weavingprices.find()
   # Should show 8 documents
   ```

4. **Clear & Reseed**
   ```bash
   # Delete old data and reseed:
   npm run seed
   ```

---

### 🎨 Chat Widget Styling Issues

**Problem:** Chat looks broken or misaligned.

**Solutions:**

1. **Check Tailwind CSS**
   - Verify client has Tailwind configured
   - Chat uses both Tailwind and custom CSS
   - Check for CSS conflicts

2. **Check Mobile Responsiveness**
   - On mobile, chat should resize
   - Check ChatBot.css media queries
   - Test on phone browser

3. **Clear Cache**
   ```bash
   # Hard refresh:
   Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   ```

**CSS Debug:**
```javascript
// In browser console:
const chatBot = document.querySelector('.chatbot-window');
console.log('Chat CSS:', window.getComputedStyle(chatBot));
```

---

### 🔑 Authentication Issues

**Problem:** Can't access protected routes or booking page.

**Solutions:**

1. **Check Token Storage**
   ```javascript
   // In browser console:
   localStorage.getItem('token')
   // Should return a JWT token
   ```

2. **Check AuthContext**
   - Verify AuthProvider wraps entire app
   - Check `/context/AuthContext.jsx` exists
   - Verify login sets token correctly

3. **Verify JWT**
   ```javascript
   // Decode token at jwt.io to check expiry
   // Should not be expired
   ```

---

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot read properties of undefined (reading 'map')` | Empty pricing array | Run `npm run seed` in server |
| `Failed to fetch` | Server not running | Start server: `npm start` |
| `404 Not Found` | Wrong API endpoint | Check `/api/pricing/weaving/all` |
| `CORS policy` | Frontend URL not allowed | Add to server `.env` CLIENT_URL |
| `MongooseError: connected` | Database unreachable | Check MONGODB_URI in .env |
| `Cannot GET /api/chatbot/...` | Route not registered | Verify server.js has `app.use('/api/chatbot', ...)` |
| `socket hang up` | Server crashed | Check server logs for errors |

---

## Performance Issues

### Slow Page Load

1. **Check Network Requests**
   - DevTools → Network tab
   - Look for slow requests
   - Pricing API should be <200ms

2. **Check MongoDB Indexes**
   ```bash
   # Ensure slug fields are indexed:
   db.weavingprices.createIndex({ "slug": 1 })
   db.sizingprices.createIndex({ "slug": 1 })
   ```

3. **Enable Caching**
   ```javascript
   // Add to pricing routes:
   res.set('Cache-Control', 'public, max-age=3600');
   ```

### Chat Lag

1. **Check Message Processing**
   - Is bot response slow?
   - Check server logs for processing time

2. **Reduce Database Queries**
   - Cache pricing data on load
   - Avoid repeated queries

---

## Testing API Endpoints

### Using cURL

```bash
# Test sizing prices
curl http://localhost:5000/api/pricing/sizing/all

# Test weaving prices  
curl http://localhost:5000/api/pricing/weaving/all

# Calculate cost
curl -X POST http://localhost:5000/api/pricing/calculate/weaving \
  -H "Content-Type: application/json" \
  -d '{"slug":"silk","quantity":50}'

# Start chatbot
curl -X POST http://localhost:5000/api/chatbot/initiate \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test123"}'

# Send message
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test123","message":"50 metres cotton"}'
```

### Using Postman

1. **Create Collection**
   - Name: "CS TEX"
   - Add requests for each endpoint

2. **Set Variables**
   ```json
   {
     "base_url": "http://localhost:5000/api",
     "session_id": "test_session_123"
   }
   ```

3. **Test Each Endpoint**
   - Pricing endpoints (GET/POST)
   - Chatbot endpoints

---

## Debug Mode

### Enable Verbose Logging

**Server-side:**
```javascript
// In controllers, add logging:
console.log('Request:', req.body);
console.log('Response:', response);
```

**Client-side:**
```javascript
// In ChatBot.jsx:
const sendMessage = async (e) => {
  console.log('Sending:', inputValue);
  // ... fetch code ...
  console.log('Received:', data.response);
};
```

### Browser Console Commands

```javascript
// Check chat component
document.querySelector('.chatbot-window')

// Check messages array
document.querySelectorAll('.message')

// Test API
fetch('/api/pricing/weaving/all')
  .then(r => r.json())
  .then(d => console.table(d))

// Check local storage
Object.keys(localStorage)
localStorage.getItem('token')
```

---

## Still Having Issues?

### Checklist Before Asking for Help

- [ ] Server is running on port 5000
- [ ] Client is running on port 5173
- [ ] Database seed completed (`npm run seed`)
- [ ] `.env` file has correct MongoDB URI
- [ ] Browser console has no errors
- [ ] Network tab shows successful responses
- [ ] Cache cleared (Ctrl+Shift+Delete)
- [ ] Tried hard refresh (Ctrl+Shift+R)

### Information to Gather

If you still have issues, collect:
1. **Error message** (screenshot or exact text)
2. **Reproduction steps** (what you did when it failed)
3. **Server logs** (console output from `npm start`)
4. **Browser console errors** (DevTools → Console)
5. **Network request details** (DevTools → Network)
6. **Browser & OS** (Chrome/Firefox, Windows/Mac)

---

## Getting Help

### Check These First

1. **QUICK_START.md** - Launch instructions
2. **CHATBOT_SETUP.md** - Technical details
3. **ARCHITECTURE.md** - System design
4. **This file** - Troubleshooting

### Debug Commands

```bash
# Check server health
curl http://localhost:5000/

# List all pricing
curl http://localhost:5000/api/pricing/sizing/all | jq '.'

# Test chatbot
curl -X POST http://localhost:5000/api/chatbot/initiate \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test"}'
```

---

## Advanced Troubleshooting

### Memory Leaks

```javascript
// Check memory usage (DevTools):
// Performance → Record → Stop
// Look for growing memory over time
```

### Database Performance

```bash
# Check slow queries:
mongosh
db.setProfilingLevel(1)
db.system.profile.find().limit(1).pretty()
```

### Network Issues

```bash
# Check latency:
curl -w "@curl-format.txt" http://localhost:5000/api/pricing/all
# Measure response time
```

---

**Most issues resolve with:**
1. Restarting server: `Ctrl+C` then `npm start`
2. Clearing browser cache: `Ctrl+Shift+Delete`
3. Running seed again: `npm run seed`
4. Checking .env file
5. Hard refresh: `Ctrl+Shift+R`

Good luck! 🚀
