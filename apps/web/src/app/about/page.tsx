'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Sparkles, Crown, Star } from 'lucide-react';
import { Button } from '@myglambeauty/ui';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-gradient-to-br from-brand-50 via-white to-gold-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full flex items-center justify-center"
          >
            <Crown className="h-12 w-12 text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-brand-500">MYGlamBeauty</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Where beauty meets elegance. We're not just selling lashes and accessories – 
            we're empowering you to feel confident, glamorous, and absolutely fabulous.
          </p>
        </div>

        {/* Mission */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At MYGlamBeauty Supply, we believe every woman deserves to feel like royalty. 
              Our mission is to provide premium quality lashes and beauty accessories that 
              enhance your natural beauty while maintaining affordability and accessibility. 
              We're committed to helping you discover your inner queen, one lash at a time.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                Every product is carefully selected and tested to ensure it meets our 
                highest standards of quality and safety.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gold-100 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Empowerment</h3>
              <p className="text-gray-600">
                We're dedicated to helping women feel confident and empowered through 
                beauty products that enhance their unique features.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We're building a community of beauty lovers who support, inspire, 
                and celebrate each other's unique beauty journeys.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-white rounded-3xl shadow-sm p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600">
              <p>
                MYGlamBeauty Supply was born from a simple observation: finding high-quality, 
                beautiful lashes shouldn't be a luxury reserved for the few. Our founder, 
                a beauty enthusiast herself, grew tired of compromising between quality and 
                affordability.
              </p>
              <p>
                What started as a small collection of carefully curated lashes has grown 
                into a full-service beauty destination. We've expanded our offerings to include 
                professional services, personalized consultations, and a supportive community 
                of beauty lovers.
              </p>
              <p>
                Today, we're proud to serve thousands of customers who trust us to deliver 
                not just products, but confidence, style, and a touch of glamour to their 
                everyday lives.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-500 mb-2">50K+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-500 mb-2">100+</div>
              <p className="text-gray-600">Premium Products</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-500 mb-2">4.9★</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-500 mb-2">24/7</div>
              <p className="text-gray-600">AI Support</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-brand-500 to-gold-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Look?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of satisfied customers who've discovered their perfect 
              beauty match with MYGlamBeauty Supply.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = '/products'}>
                Shop Now
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/booking'}>
                Book Consultation
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
