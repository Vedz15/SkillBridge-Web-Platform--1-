const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const MESSAGES_FILE = path.join(__dirname, '../database/messages.json');
const USERS_FILE = path.join(__dirname, '../database/users.json');

// Helper functions
const readMessages = () => {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeMessages = (messages) => {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
};

const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Get conversations for a user
router.get('/conversations/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const messages = readMessages();
    const users = readUsers();

    // Find all messages involving this user
    const userMessages = messages.filter(msg => 
      msg.from_user === userId || msg.to_user === userId
    );

    // Group messages by conversation partner
    const conversations = {};
    userMessages.forEach(msg => {
      const partnerId = msg.from_user === userId ? msg.to_user : msg.from_user;
      
      if (!conversations[partnerId]) {
        const partner = users.find(u => u.id === partnerId);
        conversations[partnerId] = {
          partner_id: partnerId,
          partner_name: partner ? partner.name : 'Unknown User',
          partner_image: partner ? partner.profile_image : null,
          partner_role: partner ? partner.role : null,
          messages: [],
          last_message: null,
          unread_count: 0
        };
      }
      
      conversations[partnerId].messages.push(msg);
      
      // Count unread messages (messages from partner that are not read)
      if (msg.to_user === userId && !msg.is_read) {
        conversations[partnerId].unread_count++;
      }
    });

    // Sort messages in each conversation and get last message
    Object.keys(conversations).forEach(partnerId => {
      conversations[partnerId].messages.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
      
      const lastMsg = conversations[partnerId].messages[conversations[partnerId].messages.length - 1];
      conversations[partnerId].last_message = {
        text: lastMsg.text,
        created_at: lastMsg.created_at,
        from_user: lastMsg.from_user
      };
    });

    // Convert to array and sort by last message time
    const conversationList = Object.values(conversations).sort((a, b) => 
      new Date(b.last_message.created_at) - new Date(a.last_message.created_at)
    );

    res.json({
      success: true,
      data: {
        conversations: conversationList
      }
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
});

// Get messages between two users
router.get('/:userId1/:userId2', (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = readMessages();
    const users = readUsers();

    // Find messages between these two users
    const conversation = messages.filter(msg => 
      (msg.from_user === userId1 && msg.to_user === userId2) ||
      (msg.from_user === userId2 && msg.to_user === userId1)
    );

    // Sort by creation time
    conversation.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Add sender information
    const conversationWithSenders = conversation.map(msg => {
      const sender = users.find(u => u.id === msg.from_user);
      return {
        ...msg,
        sender: sender ? {
          id: sender.id,
          name: sender.name,
          profile_image: sender.profile_image,
          role: sender.role
        } : null
      };
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMessages = conversationWithSenders.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        messages: paginatedMessages,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(conversation.length / limit),
          total_count: conversation.length,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// Send a new message
router.post('/', (req, res) => {
  try {
    const { from_user, to_user, text } = req.body;

    if (!from_user || !to_user || !text) {
      return res.status(400).json({
        success: false,
        message: 'from_user, to_user, and text are required'
      });
    }

    const messages = readMessages();
    const users = readUsers();

    // Verify both users exist
    const sender = users.find(u => u.id === from_user);
    const recipient = users.find(u => u.id === to_user);

    if (!sender || !recipient) {
      return res.status(404).json({
        success: false,
        message: 'One or both users not found'
      });
    }

    // Create conversation_id based on user IDs (consistent ordering)
    const conversationId = [from_user, to_user].sort().join('-');

    const newMessage = {
      id: Date.now(), // Simple numeric ID for demo
      from_user,
      to_user,
      text: text.trim(),
      created_at: new Date().toISOString(),
      is_read: false,
      conversation_id: conversationId
    };

    messages.push(newMessage);
    writeMessages(messages);

    // Add sender info to response
    const messageWithSender = {
      ...newMessage,
      sender: {
        id: sender.id,
        name: sender.name,
        profile_image: sender.profile_image,
        role: sender.role
      }
    };

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: messageWithSender
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Mark messages as read
router.put('/read/:messageId', (req, res) => {
  try {
    const { messageId } = req.params;
    const messages = readMessages();
    
    const messageIndex = messages.findIndex(msg => msg.id === messageId);

    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    messages[messageIndex].is_read = true;
    messages[messageIndex].read_at = new Date().toISOString();

    writeMessages(messages);

    res.json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read',
      error: error.message
    });
  }
});

// Mark all messages in a conversation as read
router.put('/read/conversation/:userId1/:userId2', (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = readMessages();
    
    let updatedCount = 0;
    messages.forEach(msg => {
      // Mark as read only messages sent TO userId1 FROM userId2 that are unread
      if (msg.from_user === userId2 && msg.to_user === userId1 && !msg.is_read) {
        msg.is_read = true;
        msg.read_at = new Date().toISOString();
        updatedCount++;
      }
    });

    writeMessages(messages);

    res.json({
      success: true,
      message: `${updatedCount} messages marked as read`
    });

  } catch (error) {
    console.error('Mark conversation as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark conversation as read',
      error: error.message
    });
  }
});

// Delete a message
router.delete('/:messageId', (req, res) => {
  try {
    const { messageId } = req.params;
    const messages = readMessages();
    
    const messageIndex = messages.findIndex(msg => msg.id === messageId);

    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    messages.splice(messageIndex, 1);
    writeMessages(messages);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
});

module.exports = router;