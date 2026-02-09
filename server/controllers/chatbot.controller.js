const ChatbotConversation = require('../models/ChatbotConversation');
const SizingPrice = require('../models/SizingPrice');
const WeavingPrice = require('../models/WeavingPrice');

// Initialize chatbot session
exports.initiateChatbot = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'Session ID required' });

    const conversation = await ChatbotConversation.create({
      sessionId,
      messages: []
    });

    const greeting = `👋 Welcome to CS TEX Chatbot!

I'm your textile pricing assistant! I can help you with:

✅ Sizing Services (yarn pricing per kg)
✅ Weaving Services (fabric pricing per metre)
✅ Instant cost calculations
✅ Booking assistance
✅ Delivery & payment info

💡 Use the quick options below or type your query!`;

    conversation.messages.push({
      sender: 'bot',
      text: greeting
    });

    await conversation.save();
    res.json({ sessionId: conversation.sessionId, greeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Process user message
exports.processUserMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message required' });
    }

    const conversation = await ChatbotConversation.findOne({ sessionId });
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    // Add user message
    conversation.messages.push({ sender: 'user', text: message });

    // Generate bot response
    const botResponse = await generateBotResponse(message, conversation);

    // Add bot response
    conversation.messages.push({ sender: 'bot', text: botResponse });
    await conversation.save();

    res.json({ response: botResponse, conversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get conversation history
exports.getConversationHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const conversation = await ChatbotConversation.findOne({ sessionId });
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Core chatbot logic
async function generateBotResponse(userMessage, conversation) {
  const lowerMessage = userMessage.toLowerCase();

  // Main menu - return to greeting
  if (lowerMessage.includes('main menu') || lowerMessage.includes('home') || userMessage === 'main menu') {
    return `👋 Welcome to CS TEX Chatbot!

I'm your textile pricing assistant! I can help you with:

✅ Sizing Services (yarn pricing per kg)
✅ Weaving Services (fabric pricing per metre)
✅ Instant cost calculations
✅ Booking assistance
✅ Delivery & payment info

💡 Use the quick options below or type your query!`;
  }

  // Detect intent - Sizing
  if (
    lowerMessage.includes('sizing') ||
    lowerMessage.includes('yarn') ||
    lowerMessage.includes('per kg') ||
    lowerMessage === '1'
  ) {
    conversation.serviceType = 'sizing';
    const prices = await SizingPrice.find({ isActive: true }).sort('pricePerKg');
    const yarnList = prices
      .map((p, i) => `${i + 1}. ${p.yarnType} - ₹${p.pricePerKg}/kg`)
      .join('\n');
    return `🧵 **SIZING SERVICES**

Here are our available yarn types:

${yarnList}

💡 **How to order:**
• Type the yarn number (e.g., "1" for Cotton)
• Or specify: "10kg cotton yarn"

📝 Example: "I need 25kg polyester yarn"`;
  }

  // Detect intent - Weaving
  if (
    lowerMessage.includes('weaving') ||
    lowerMessage.includes('fabric') ||
    lowerMessage.includes('per metre') ||
    lowerMessage === '2'
  ) {
    conversation.serviceType = 'weaving';
    const prices = await WeavingPrice.find({ isActive: true }).sort('pricePerMetre');
    const fabricList = prices
      .map((p, i) => `${i + 1}. ${p.fabricType} - ₹${p.pricePerMetre}/metre`)
      .join('\n');
    return `🧶 **WEAVING SERVICES**

Here are our available fabrics:

${fabricList}

💡 **How to order:**
• Type the fabric number (e.g., "3" for Polyester)
• Or specify: "50 metres silk weaving"

📝 Example: "I need 100 metres cotton fabric"`;
  }

  // Calculate sizing cost
  if (
    conversation.serviceType === 'sizing' &&
    /(\d+)\s*(kg|kilogram)/.test(lowerMessage)
  ) {
    const match = lowerMessage.match(/(\d+)\s*(kg|kilogram)/);
    const quantity = parseInt(match[1]);

    const yarnType = extractYarnType(lowerMessage);
    if (yarnType) {
      const price = await SizingPrice.findOne({ slug: yarnType, isActive: true });
      if (price) {
        const totalCost = price.pricePerKg * quantity;
        conversation.selectedYarnFabric = price.yarnType;
        conversation.quantity = quantity;
        conversation.totalCost = totalCost;
        await conversation.save();

        return `✨ **SIZING QUOTE READY!**

📋 **Service:** Yarn Sizing
🧵 **Yarn Type:** ${price.yarnType}
📊 **Quantity:** ${quantity} kg
💰 **Price Per KG:** ₹${price.pricePerKg}

━━━━━━━━━━━━━━━━━━━
✅ **TOTAL COST: ₹${totalCost}**
━━━━━━━━━━━━━━━━━━━

📝 **Calculation:**
₹${price.pricePerKg} × ${quantity} kg = ₹${totalCost}

💬 Ready to proceed? Use quick options below!`;
      }
    }
  }

  // Calculate weaving cost
  if (
    conversation.serviceType === 'weaving' &&
    /(\d+)\s*(metre|meter|m\b)/.test(lowerMessage)
  ) {
    const match = lowerMessage.match(/(\d+)\s*(metre|meter|m\b)/);
    const quantity = parseInt(match[1]);

    const fabricType = extractFabricType(lowerMessage);
    if (fabricType) {
      const price = await WeavingPrice.findOne({ slug: fabricType, isActive: true });
      if (price) {
        const totalCost = price.pricePerMetre * quantity;
        conversation.selectedYarnFabric = price.fabricType;
        conversation.quantity = quantity;
        conversation.totalCost = totalCost;
        await conversation.save();

        return `✨ **WEAVING QUOTE READY!**

📋 **Service:** Fabric Weaving
🧶 **Fabric Type:** ${price.fabricType}
📊 **Quantity:** ${quantity} metres
💰 **Price Per Metre:** ₹${price.pricePerMetre}

━━━━━━━━━━━━━━━━━━━
✅ **TOTAL COST: ₹${totalCost}**
━━━━━━━━━━━━━━━━━━━

📝 **Calculation:**
₹${price.pricePerMetre} × ${quantity} metres = ₹${totalCost}

💬 Ready to proceed? Use quick options below!`;
      }
    }
  }

  // Booking
  if (lowerMessage.includes('book') || lowerMessage.includes('booking')) {
    if (conversation.totalCost) {
      conversation.bookingCreated = true;
      await conversation.save();

      return `🎉 **BOOKING INITIATED!**

📋 **Your Order Summary:**
💰 Total Cost: ₹${conversation.totalCost}

To complete your booking, provide these details:

1️⃣ Full Name
2️⃣ Email Address
3️⃣ Phone Number
4️⃣ Delivery Timeline
   • ASAP
   • 1 week
   • 2 weeks
   • Custom

📝 Reply with your details or use the options below!`;
    }
    return `⚠️ **No Quote Found**

Please first select a service and quantity so I can prepare your quote!

Use the quick options below to get started.`;
  }

  // FAQ responses - Pricing
  if (lowerMessage.includes('pricing') || lowerMessage === '3') {
    return `💰 **PRICING OVERVIEW**

🧵 **Sizing Services (per KG):**
• Cotton: ₹450/kg
• Polyester: ₹520/kg
• Viscose: ₹480/kg
• Nylon: ₹550/kg

🧶 **Weaving Services (per Metre):**
• Cotton: ₹280/m
• Silk: ₹450/m
• Polyester: ₹250/m
• Rayon: ₹320/m

💡 Want exact pricing? Select a service type below!`;
  }

  // FAQ responses - Help/FAQ
  if (lowerMessage.includes('help') || lowerMessage.includes('faq') || lowerMessage === '4' || lowerMessage.includes('main menu')) {
    return `❓ **FREQUENTLY ASKED QUESTIONS**

Choose a topic:

1️⃣ Delivery Information
2️⃣ Payment Methods
3️⃣ Quality Standards
4️⃣ Returns & Refunds

Or ask your specific question!`;
  }

  // FAQ responses
  const faqResponses = {
    delivery: `📦 **DELIVERY INFORMATION**

1. Standard Delivery: 5-7 business days
2. Express Delivery: 2-3 business days (+₹500)
3. Same-day (Metro areas): +₹1000
4. Free shipping on orders ₹5000+

━━━━━━━━━━━━━━━━━━━━━
What else can I help you with?`,

    payment: `💳 **PAYMENT METHODS**

We accept:
1. Credit/Debit Cards
2. Net Banking
3. UPI (Google Pay, PhonePe, Paytm)
4. Bank Transfer
5. Razorpay Secure Gateway

━━━━━━━━━━━━━━━━━━━━━
🔒 All payments are 100% secure!
Anything else?`,

    quality: `✅ **QUALITY ASSURANCE**

Our Standards:
1. ISO Certified Manufacturing
2. Strict Quality Control at Every Stage
3. Testing for Strength, Color & Finish
4. 15+ Years Professional Expertise
5. Customer Satisfaction Guaranteed

━━━━━━━━━━━━━━━━━━━━━
Want to know more about specific services?`,

    returns: `🔄 **RETURNS & REFUNDS**

Our Policy:
1. 7-day return for unused products
2. Full refund if quality issues found
3. Free return shipping
4. Process: Contact → Inspect → Refund

━━━━━━━━━━━━━━━━━━━━━
Got other questions?`
  };

  for (const [key, response] of Object.entries(faqResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  // Default response
  return `I'm here to help! 😊

You can ask about:
🧵 **Sizing Services** - pricing and yarn types
🧵 **Weaving Services** - fabric types and pricing
📦 **Delivery** - shipping timelines
💳 **Payments** - payment methods
✅ **Quality** - our standards
🔄 **Returns** - refund policy

What would you like to know?`;
}

// Helper: Extract yarn type from message
function extractYarnType(message) {
  const yarnTypes = {
    cotton: 'cotton',
    polyester: 'polyester',
    viscose: 'viscose',
    rayon: 'viscose',
    'pc blend': 'pc-blend',
    'pv blend': 'pv-blend',
    nylon: 'nylon',
    acrylic: 'acrylic'
  };

  for (const [key, slug] of Object.entries(yarnTypes)) {
    if (message.toLowerCase().includes(key)) {
      return slug;
    }
  }
  return null;
}

// Helper: Extract fabric type from message
function extractFabricType(message) {
  const fabricTypes = {
    cotton: 'cotton',
    rayon: 'rayon',
    polyester: 'polyester',
    silk: 'silk',
    woollen: 'woollen',
    linen: 'linen',
    nylon: 'nylon',
    acrylic: 'acrylic'
  };

  for (const [key, slug] of Object.entries(fabricTypes)) {
    if (message.toLowerCase().includes(key)) {
      return slug;
    }
  }
  return null;
}
