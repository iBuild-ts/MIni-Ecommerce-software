'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Sparkles, Crown, Star } from 'lucide-react';
import { Button } from '@myglambeauty/ui';
import Image from 'next/image';

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
            Welcome to <span className="text-brand-500">My Glam Beauty Supply</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Where your glam begins. We're not just selling beauty products – 
            we're empowering you to feel confident, glamorous, and absolutely fabulous.
          </p>
        </div>

        {/* Meet the Owner Section */}
        <section className="py-16">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Owner Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative h-[500px] md:h-auto"
              >
                <Image
                  src="https://image2url.com/r2/default/images/1768520505271-2cf62dd1-2547-4f2c-83f6-7bdbbad2a02c.jpg"
                  alt="Laetitia - Owner of My Glam Beauty Supply"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
              
              {/* Owner Bio */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-8 md:p-12 flex flex-col justify-center"
              >
                <div className="inline-flex items-center gap-2 text-brand-500 font-medium mb-4">
                  <Star className="h-5 w-5 fill-current" />
                  <span>Meet the Owner</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Laetitia</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Laetitia is the heart and vision behind My Glam Beauty Supply & Beauty Bar. 
                    With a deep love for all things beauty, she started My Glam with one clear mission: 
                    <strong className="text-gray-900"> to make beauty affordable, accessible, and empowering for women everywhere.</strong>
                  </p>
                  <p>
                    She believes every woman deserves to feel confident, glamorous, and seen—without breaking the bank.
                  </p>
                  <p>
                    Specializing in high-quality hair extensions, weaving, lashes, and premium beauty products, 
                    Laetitia carefully curates every item to ensure top-tier quality, style, and value. 
                    Her passion goes beyond products—it's about creating an experience where women can express themselves, 
                    elevate their look, and step into their glow.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At My Glam Beauty Supply, we believe every woman deserves to feel like royalty. 
              Our mission is to provide premium quality hair extensions, lashes, and beauty accessories that 
              enhance your natural beauty while maintaining affordability and accessibility. 
              We're committed to helping you discover your inner queen and step into your glow.
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
                My Glam Beauty Supply was born from a simple observation: finding high-quality, 
                beautiful hair extensions, lashes, and beauty products shouldn't be a luxury reserved for the few. 
                Laetitia, a beauty enthusiast herself, grew tired of compromising between quality and 
                affordability.
              </p>
              <p>
                What started as a passion for beauty has grown into a full-service beauty destination. 
                We've expanded our offerings to include premium hair extensions, weaving services, 
                professional lash applications, and a carefully curated collection of beauty products.
              </p>
              <p>
                Today, we're proud to serve a growing community of customers who trust us to deliver 
                not just products, but confidence, style, and a touch of glamour to their 
                everyday lives. Every item is hand-picked by Laetitia to ensure it meets our 
                standards of quality and value.
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

        {/* CTA - Join Glam Squad */}
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-brand-500 to-gold-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ✨ Ready to Level Up Your Glam?
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Join <strong className="text-brand-600">Laetitia's Glam Squad</strong> and become part of a beauty community 
              that celebrates confidence, quality, and self-love.
            </p>
            <p className="text-xl font-medium text-brand-500 mb-8">
              Welcome to My Glam Beauty Supply—where your glam begins. 💖
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => window.location.href = '/products'}>
                Shop Now
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/booking'}>
                Book a Service
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
