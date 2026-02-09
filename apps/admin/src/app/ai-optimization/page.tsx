'use client';

import { useState } from 'react';
import { Brain, MessageSquare, Save, Play, Pause, Plus, Edit, Trash2, TrendingUp, Users, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui/button';

const demoTrainingData = [
  {
    id: '1',
    question: 'What are your best-selling lashes?',
    answer: 'Our best-selling lashes are absolutely gorgeous, Queen! 👑\n\n🌟 **Top Bestsellers:**\n• Queen Mink Lashes - $24.99 (Natural yet glamorous)\n• Princess Faux Mink Set - $34.99 (Dramatic volume)\n• Natural Beauty Lashes - $14.99 (Everyday wear)\n• Drama Queen Volume - $29.99 (Show-stopping style)',
    category: 'Products',
    usage: 156,
    success: 92,
    status: 'active',
  },
  {
    id: '2',
    question: 'How do I track my order?',
    answer: 'Let me help you track your order, gorgeous! 📦\n\nTo check your delivery status:\n• Share your order number (starts with ORD-)\n• Or your email address used for the order\n\nStandard shipping takes 2-3 business days. Express is 1-2 days.',
    category: 'Orders',
    usage: 89,
    success: 88,
    status: 'active',
  },
  {
    id: '3',
    question: 'What if my payment fails?',
    answer: 'I\'m here to help with payment issues, Queen! 💳\n\n**Common Solutions:**\n• Check card details and billing address\n• Try a different payment method\n• Clear your browser cache\n• Use PayPal if available\n\nFor refunds: We process within 5-7 business days.',
    category: 'Payment',
    usage: 45,
    success: 75,
    status: 'needs_review',
  },
];

const demoAnalytics = {
  totalConversations: 2847,
  avgResponseTime: 1.2,
  satisfactionRate: 89.3,
  resolvedIssues: 2431,
  escalatedToHuman: 416,
  topCategories: [
    { category: 'Products', count: 892, percentage: 31.3 },
    { category: 'Orders', count: 678, percentage: 23.8 },
    { category: 'Payment', count: 445, percentage: 15.6 },
    { category: 'Shipping', count: 387, percentage: 13.6 },
    { category: 'Returns', count: 234, percentage: 8.2 },
    { category: 'Other', count: 211, percentage: 7.5 },
  ],
};

export default function AIOptimizationPage() {
  const [activeTab, setActiveTab] = useState('training');
  const [isTraining, setIsTraining] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('Products');

  const tabs = [
    { id: 'training', label: 'Training Data', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
  ];

  const handleTrain = async () => {
    setIsTraining(true);
    // Simulate training process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsTraining(false);
    alert('AI model trained successfully!');
  };

  const handleSaveTraining = async () => {
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsEditing(false);
    setSelectedQuestion(null);
    alert('Training data updated successfully!');
  };

  const handleAddTraining = async () => {
    // Simulate adding new training data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setNewQuestion('');
    setNewAnswer('');
    setNewCategory('Products');
    alert('New training data added successfully!');
  };

  const renderTrainingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Training Data</h3>
          <p className="text-sm text-gray-500">Manage Q&A pairs and responses</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleTrain} isLoading={isTraining}>
            <Brain className="h-4 w-4 mr-2" />
            {isTraining ? 'Training...' : 'Train Model'}
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Training Data
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Add New Training Data</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter customer question..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Enter AI response..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
              >
                <option value="Products">Products</option>
                <option value="Orders">Orders</option>
                <option value="Payment">Payment</option>
                <option value="Shipping">Shipping</option>
                <option value="Returns">Returns</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTraining}>Save Training Data</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Question</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Usage</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Success Rate</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {demoTrainingData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="font-medium text-gray-900 truncate">{item.question}</p>
                    <p className="text-sm text-gray-500 truncate">{item.answer.substring(0, 100)}...</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.usage} times</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{item.success}%</span>
                    {item.success >= 90 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : item.success >= 75 ? (
                      <TrendingUp className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'active' ? 'bg-green-100 text-green-800' :
                    item.status === 'needs_review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status === 'active' ? 'Active' :
                     item.status === 'needs_review' ? 'Needs Review' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                    {item.status === 'active' ? (
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Pause">
                        <Pause className="h-4 w-4 text-yellow-500" />
                      </button>
                    ) : (
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Activate">
                        <Play className="h-4 w-4 text-green-500" />
                      </button>
                    )}
                    <button className="p-2 hover:bg-red-50 rounded-lg" title="Delete">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm font-medium">Total Conversations</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{demoAnalytics.totalConversations.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Satisfaction Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{demoAnalytics.satisfactionRate}%</p>
          <p className="text-sm text-gray-500">Customer satisfaction</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">Resolved Issues</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{demoAnalytics.resolvedIssues.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Without human help</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Escalated</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{demoAnalytics.escalatedToHuman}</p>
          <p className="text-sm text-gray-500">Required human support</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversation Categories</h3>
        <div className="space-y-4">
          {demoAnalytics.topCategories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">{category.category}</span>
                <span className="text-gray-500">{category.count} conversations ({category.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-500 h-2 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConversationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Conversations</h3>
          <p className="text-sm text-gray-500">Review and analyze customer interactions</p>
        </div>
        <Button variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Export Conversations
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {[
            {
              id: '1',
              customer: 'Sarah Johnson',
              question: 'What are your best-selling lashes for beginners?',
              answer: 'For beginners, I recommend our Natural Beauty Lashes...',
              rating: 'positive',
              timestamp: '2 hours ago',
            },
            {
              id: '2',
              customer: 'Mike Chen',
              question: 'How do I track my order?',
              answer: 'Let me help you track your order, gorgeous! 📦...',
              rating: 'positive',
              timestamp: '3 hours ago',
            },
            {
              id: '3',
              customer: 'Emma Wilson',
              question: 'My payment failed, what should I do?',
              answer: 'I\'m here to help with payment issues, Queen! 💳...',
              rating: 'negative',
              timestamp: '5 hours ago',
            },
          ].map((conversation) => (
            <div key={conversation.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-medium text-gray-900">{conversation.customer}</p>
                  <p className="text-sm text-gray-500">{conversation.timestamp}</p>
                </div>
                <div className="flex items-center gap-2">
                  {conversation.rating === 'positive' ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">Helpful</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <ThumbsDown className="h-4 w-4" />
                      <span className="text-sm">Not Helpful</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Customer:</p>
                  <p className="text-sm text-gray-600">{conversation.question}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">AI Assistant:</p>
                  <p className="text-sm text-gray-600">{conversation.answer}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3 mr-1" />
                  Improve Response
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Add to Training
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Agent Optimization</h1>
          <p className="text-gray-500">Train and optimize your AI assistant for better customer service</p>
        </div>
        <Button onClick={handleTrain} isLoading={isTraining}>
          <Brain className="h-4 w-4 mr-2" />
          {isTraining ? 'Training...' : 'Train Model'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'training' && renderTrainingTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'conversations' && renderConversationsTab()}
      </div>
    </div>
  );
}
