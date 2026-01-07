const mongoose = require('mongoose');

const chatbotConversationSchema = new mongoose.Schema(
  {
    userId: { type: String }, // Optional: link to user if logged in
    sessionId: { type: String, required: true, unique: true },
    messages: [
      {
        sender: { type: String, enum: ['user', 'bot'], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    serviceType: { type: String, enum: ['sizing', 'weaving', 'unknown'] },
    selectedYarnFabric: { type: String },
    quantity: { type: Number },
    totalCost: { type: Number },
    bookingCreated: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatbotConversation', chatbotConversationSchema);
