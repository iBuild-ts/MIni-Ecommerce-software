import OpenAI from 'openai';
import { productSearchTool } from './tools/productSearchTool';
import { bookingTool } from './tools/bookingTool';
import { leadCaptureTool } from './tools/leadCaptureTool';

const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key' 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

const SYSTEM_PROMPT = `You are the friendly AI assistant for MYGlamBeauty Supply, a luxury beauty store specializing in handmade lashes. Your name is "Glam Assistant".

About the store:
- MYGlamBeauty Supply offers premium handcrafted lashes for queens and princesses
- Products include mink lashes, faux mink lashes, magnetic lashes, and accessories
- Price range: $8.99 - $39.99
- Free shipping on orders over $50
- 30-day return policy
- Professional services: lash applications, consultations, lessons, glam parties

Your capabilities:
1. Answer questions about products (lashes, accessories, pricing, availability)
2. Help customers find the right lashes for their needs
3. Show best-selling products and new arrivals
4. Capture leads (collect email for promotions)
5. Book, reschedule, and cancel appointments
6. Monitor delivery status and tracking
7. Handle payment issues and refunds
8. Provide expert advice on all beauty categories
9. Connect customers with human support when needed

Personality:
- Warm, friendly, and empowering
- Use phrases like "Queen", "gorgeous", "slay"
- Be helpful and thorough
- Always encourage customers to explore products or book appointments
- For complex issues, direct customers to book appointments

If you don't know something specific or the issue is complex, offer to connect them with customer service at hello@myglambeauty.com or suggest booking an appointment.`;

class NLPService {
  async generateResponse(
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string> {
    try {
      const lowerMessage = message.toLowerCase();

      // Best-selling products
      if (lowerMessage.includes('bestseller') || lowerMessage.includes('best selling') || lowerMessage.includes('popular') || lowerMessage.includes('top seller')) {
        return `Our best-selling lashes are absolutely gorgeous, Queen! 👑\n\n🌟 **Top Bestsellers:**\n• Queen Mink Lashes - $24.99 (Natural yet glamorous)\n• Princess Faux Mink Set - $34.99 (Dramatic volume)\n• Natural Beauty Lashes - $14.99 (Everyday wear)\n• Drama Queen Volume - $29.99 (Show-stopping style)\n\nThese are customer favorites for a reason! Would you like details on any of these, or shall I help you find the perfect pair for your style?`;
      }

      // New arrivals
      if (lowerMessage.includes('new') || lowerMessage.includes('arrival') || lowerMessage.includes('latest') || lowerMessage.includes('just in')) {
        return `You're in for a treat, gorgeous! 💫 Our new arrivals are stunning!\n\n🆕 **Just Dropped:**\n• Magnetic Lash Kit - $39.99 (Easy application magic)\n• Rose Gold Lash Collection - $32.99 (Trendy & elegant)\n• Volume XL Collection - $27.99 (Extra drama)\n• Lash Adhesive Pro - $8.99 (Stronger hold)\n\nNew arrivals get special attention! Want to see what makes these so special, Queen?`;
      }

      // Product search
      if (lowerMessage.includes('product') || lowerMessage.includes('lash') || lowerMessage.includes('price')) {
        const products = await productSearchTool.search(message);
        if (products.length > 0) {
          const productInfo = products.slice(0, 3).map(p => 
            `• ${p.name} - $${(p.priceCents / 100).toFixed(2)}`
          ).join('\n');
          return `Here are some products that might interest you, Queen! 👑\n\n${productInfo}\n\nWould you like more details on any of these, or shall I help you find something specific?`;
        }
      }

      // Booking appointments
      if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('consultation')) {
        return `I'd love to help you book a consultation! 💖\n\nOur lash experts are available Monday-Saturday, 9 AM - 6 PM.\n\n**Services Available:**\n• Lash Consultation - FREE (30 min)\n• Lash Application - $25 (45 min)\n• Lash Application Lesson - $50 (60 min)\n• Glam Party Booking - $150 (2 hours)\n\nTo book, I'll need:\n• Your name\n• Email address\n• Preferred date and time\n\nOr you can book directly at myglambeauty.com/booking. What works best for you, gorgeous?`;
      }

      // Reschedule appointments
      if (lowerMessage.includes('reschedule') || lowerMessage.includes('change appointment') || lowerMessage.includes('move appointment')) {
        return `No problem, Queen! I can help you reschedule your appointment. 🔄\n\nTo reschedule, I'll need:\n• Your current appointment date/time\n• Your preferred new date/time\n• Your email or phone number\n\nOr you can manage your booking at myglambeauty.com/booking. What's your current appointment, gorgeous?`;
      }

      // Cancel appointments
      if (lowerMessage.includes('cancel') || lowerMessage.includes('cancellation')) {
        return `I understand plans change, Queen! 💕\n\nTo cancel your appointment:\n• Reply with your appointment date/time\n• Or email hello@myglambeauty.com\n• Or call us at (555) 123-4567\n\nWe require 24-hour notice for cancellations to avoid any fees. When is your appointment scheduled?`;
      }

      // Delivery tracking
      if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping') || lowerMessage.includes('track') || lowerMessage.includes('order status')) {
        return `Let me help you track your order, gorgeous! 📦\n\nTo check your delivery status:\n• Share your order number (starts with ORD-)\n• Or your email address used for the order\n\nStandard shipping takes 2-3 business days. Express is 1-2 days.\n\nYou can also track directly at myglambeauty.com/track. What's your order number, Queen?`;
      }

      // Payment issues
      if (lowerMessage.includes('payment') || lowerMessage.includes('charge') || lowerMessage.includes('billing') || lowerMessage.includes('credit card') || lowerMessage.includes('refund')) {
        return `I'm here to help with payment issues, Queen! 💳\n\n**Common Solutions:**\n• Check card details and billing address\n• Try a different payment method\n• Clear your browser cache\n• Use PayPal if available\n\nFor refunds: We process within 5-7 business days.\n\nIf the issue persists, I recommend booking a consultation with our billing specialist at myglambeauty.com/booking. What specific payment issue are you experiencing?`;
      }

      // Category expertise
      if (lowerMessage.includes('category') || lowerMessage.includes('type') || lowerMessage.includes('style') || lowerMessage.includes('recommend')) {
        return `I'm your lash expert, Queen! 👑\n\n**Our Categories:**\n\n🌸 **Mink Lashes** - Most natural, lightweight, reusable 25+ times\n\n✨ **Faux Mink** - Vegan alternative, dramatic look, cruelty-free\n\n🧲 **Magnetic Lashes** - No adhesive needed, perfect for beginners\n\n💎 **Volume Lashes** - Full, dramatic, special occasions\n\n🌿 **Natural Lashes** - Subtle enhancement, everyday wear\n\nWhat's your style preference or occasion? I'll find your perfect match!`;
      }

      // Email/newsletter
      if (lowerMessage.includes('email') || lowerMessage.includes('newsletter') || lowerMessage.includes('promo') || lowerMessage.includes('discount')) {
        return `Great choice, Queen! 🌟\n\nSign up for our newsletter to get:\n• 15% off your first order\n• Early access to new lash drops\n• Exclusive promotions\n• Beauty tips and tutorials\n\nJust share your email and I'll get you set up! Or visit myglambeauty.com to subscribe.`;
      }

      // Complex issues - direct to appointment
      if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('complaint') || lowerMessage.includes('frustrated') || lowerMessage.includes('angry')) {
        return `I understand you're experiencing an issue, Queen, and I'm here to help! 💕\n\nFor complex problems, I recommend booking a consultation with our customer care specialist who can give you personalized attention.\n\nThey can help with:\n• Complex order issues\n• Product concerns\n• Special requests\n• Account problems\n\nBook at myglambeauty.com/booking or share your email and I'll help you schedule. What specific issue are you facing?`;
      }

      // OpenAI fallback
      if (openai) {
        const messages: any[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 400,
          temperature: 0.7,
        });

        return completion.choices[0]?.message?.content || this.getFallbackResponse(message);
      }

      return this.getFallbackResponse(message);
    } catch (error) {
      console.error('NLP error:', error);
      return this.getFallbackResponse(message);
    }
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return "Hey gorgeous! 👑 Welcome to MYGlamBeauty Supply! I'm your Glam Assistant. I can help you with:\n\n💫 Finding best-selling lashes\n🆕 Checking new arrivals\n📅 Booking appointments\n📦 Tracking orders\n💳 Payment issues\n🌟 Product recommendations\n\nWhat can I help you slay with today, Queen?";
    }

    if (lowerMessage.includes('thank')) {
      return "You're so welcome, Queen! 💖 Is there anything else I can help you with? Remember, you deserve to look and feel amazing! ✨";
    }

    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return "Great question! 📦 We offer FREE shipping on orders over $50! \n\n• Standard: 2-3 business days\n• Express: 1-2 business days\n• International: 7-14 days\n\nTrack your order with your order number at myglambeauty.com/track. Ready to shop?";
    }

    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return "We've got you covered, Queen! 💫 \n\n**30-Day Return Policy:**\n• Unused items in original packaging\n• Full refund or exchange\n• Free return shipping on defective items\n\nEmail hello@myglambeauty.com or visit myglambeauty.com/returns. Need help with a specific return?";
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return "I'm here to help, gorgeous! 💕 Here's how to reach us:\n\n📧 Email: hello@myglambeauty.com\n📞 Phone: (555) 123-4567\n💬 Chat: Right here with me 24/7!\n📍 Location: 123 Beauty Ave, Glam City\n\nFor complex issues, book a consultation at myglambeauty.com/booking. What do you need help with?";
    }

    if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
      return "Here's our schedule, Queen! 🕐\n\n**Store Hours:**\n• Monday-Friday: 9 AM - 7 PM\n• Saturday: 9 AM - 6 PM\n• Sunday: 11 AM - 5 PM\n\n**Online:** 24/7 (that's me! 👑)\n**Customer Service:** Mon-Sat 9 AM - 6 PM\n\nWhen would you like to visit or chat?";
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
      return "Great question about pricing, Queen! 💰\n\n**Our Range:**\n• Natural Lashes: $14.99 - $19.99\n• Mink Lashes: $24.99 - $34.99\n• Magnetic Kits: $39.99\n• Accessories: $8.99 - $15.99\n\nPlus FREE shipping over $50! What's your budget range? I'll find you something gorgeous!";
    }

    if (lowerMessage.includes('quality') || lowerMessage.includes('real') || lowerMessage.includes('authentic')) {
      return "We only sell premium quality, Queen! 👑\n\n✅ 100% authentic products\n✅ Handcrafted with care\n✅ Cruelty-free options available\n✅ Quality guaranteed\n✅ 30-day satisfaction guarantee\n\nAll our lashes are reusable 20-25 times with proper care. Want to see our best-sellers?";
    }

    if (lowerMessage.includes('beginner') || lowerMessage.includes('first time') || lowerMessage.includes('new to lashes')) {
      return "Welcome to the lash world, gorgeous! 💫\n\n**Perfect for Beginners:**\n• Natural Beauty Lashes - $14.99\n• Magnetic Lash Kit - $39.99 (no glue!)\n• Lash Application Lesson - $50\n\nI also recommend booking a free consultation! Our experts will teach you everything. Want to start with magnetic lashes or traditional?";
    }

    return "Thanks for reaching out, gorgeous! 💖 I'm your Glam Assistant and I'm here to help you find the perfect lashes, answer questions, book appointments, track orders, or handle any beauty needs.\n\nI can help with:\n🌟 Best-selling products\n🆕 New arrivals\n📅 Appointments\n📦 Order tracking\n💳 Payment help\n\nWhat would you like to know about, Queen?";
  }
}

export const nlpService = new NLPService();
