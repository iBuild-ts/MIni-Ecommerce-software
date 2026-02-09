'use client';

import { useState } from 'react';
import { Save, Store, Mail, DollarSign, Bell, Shield, Palette, Globe, CreditCard } from 'lucide-react';
import { Button, Input } from '@/components/ui/button';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'ai', label: 'AI Assistant', icon: Globe },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  <Input defaultValue="MYGlamBeauty Supply" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
                  <Input defaultValue="hello@myglambeauty.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <Input defaultValue="123 Beauty Ave, Glam City, GC 12345" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Store URLs</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                  <Input defaultValue="https://myglambeauty.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin URL</label>
                  <Input defaultValue="https://admin.myglambeauty.com" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Provider</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500">
                    <option>SendGrid</option>
                    <option>Mailgun</option>
                    <option>SMTP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                  <Input defaultValue="noreply@myglambeauty.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                  <Input defaultValue="MYGlamBeauty Supply" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h3>
              <div className="space-y-3">
                {['Order Confirmation', 'Shipping Update', 'Welcome Email', 'Password Reset'].map((template) => (
                  <div key={template} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <span className="font-medium text-gray-900">{template}</span>
                    <Button variant="outline" size="sm">Customize</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Gateways</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Stripe</p>
                        <p className="text-sm text-gray-500">Credit cards, Apple Pay, Google Pay</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="Stripe Publishable Key" defaultValue="pk_test_..." />
                    <Input placeholder="Stripe Secret Key" defaultValue="sk_test_..." type="password" />
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">PayPal</p>
                        <p className="text-sm text-gray-500">PayPal, Venmo</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency Settings</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500">
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                    <option>GBP - British Pound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency Display</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500">
                    <option>Symbol ($)</option>
                    <option>Code (USD)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Zones</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">United States</p>
                      <p className="text-sm text-gray-500">All 50 states</p>
                    </div>
                    <Button variant="outline" size="sm">Edit Rates</Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Standard Shipping</span>
                      <span>$4.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span>$12.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Free Shipping</span>
                      <span>Orders over $50</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">International</p>
                      <p className="text-sm text-gray-500">Worldwide</p>
                    </div>
                    <Button variant="outline" size="sm">Edit Rates</Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>International Shipping</span>
                      <span>$24.99</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notifications</h3>
              <div className="space-y-3">
                {[
                  'New order received',
                  'Low stock alert',
                  'New customer registration',
                  'Product review submitted',
                  'Payment failed',
                ].map((notification) => (
                  <label key={notification} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <span className="font-medium text-gray-900">{notification}</span>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Notifications</h3>
              <div className="space-y-3">
                {[
                  'Order confirmation',
                  'Shipping confirmation',
                  'Delivery confirmation',
                  'Promotional emails',
                  'Abandoned cart reminders',
                ].map((notification) => (
                  <label key={notification} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <span className="font-medium text-gray-900">{notification}</span>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Session Timeout</p>
                      <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                    </div>
                    <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <div className="flex gap-2">
                    <input type="color" defaultValue="#7c3aed" className="h-10 w-20 border border-gray-200 rounded" />
                    <Input defaultValue="#7c3aed" placeholder="#7c3aed" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <div className="flex gap-2">
                    <input type="color" defaultValue="#f59e0b" className="h-10 w-20 border border-gray-200 rounded" />
                    <Input defaultValue="#f59e0b" placeholder="#f59e0b" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo & Favicon</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
                  <input type="file" accept="image/*" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                  <input type="file" accept="image/*" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
                  <Input type="password" placeholder="sk-..." defaultValue="sk-your-openai-api-key" />
                  <p className="text-sm text-gray-500 mt-1">Used for advanced AI responses. Leave empty to use fallback responses.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assistant Personality</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500">
                    <option>Glam & Empowering</option>
                    <option>Professional & Helpful</option>
                    <option>Friendly & Casual</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Data</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Product Knowledge Base</p>
                      <p className="text-sm text-gray-500">Last updated: 2 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">FAQ Responses</p>
                      <p className="text-sm text-gray-500">45 common questions</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your store configuration and preferences</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-brand-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
