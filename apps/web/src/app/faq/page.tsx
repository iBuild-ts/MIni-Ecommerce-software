'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, Package, Truck, CreditCard, ChevronDown } from 'lucide-react';
import { Button } from '@myglambeauty/ui';

const faqs = [
  {
    question: "What are your business hours?",
    answer: "Monday-Thursday: 3pm-7pm, Friday: 3pm-8pm, Saturday: 10am-8pm, Sunday: Closed"
  },
  {
    question: "How can I track my order?",
    answer: "You can track your order through our Track Order page or contact us directly at 786-985-6411."
  },
  {
    question: "What is your return policy?",
    answer: "Returns are accepted within 14 days of purchase. Items must be unused and in original packaging. Contact us at Myglambeauty@gmail.com for returns."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship worldwide! International shipping takes 10-15 business days and costs $29.99."
  },
  {
    question: "How long does processing take?",
    answer: "Orders are typically processed within 1-2 business days before shipping."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and digital payment methods through our secure checkout."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our products and services
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-brand-500 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                </div>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="px-6 pb-4"
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-brand-100 mb-6">
              Can't find what you're looking for? Our customer service team is here to help!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact-us">
                <Button variant="secondary">Contact Us</Button>
              </a>
              <a href="/track-order">
                <Button variant="secondary">Track Order</Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
// BREAK CACHE: Sat May  9 16:00:57 PDT 2026
