'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Heart, Truck, Shield, Clock } from 'lucide-react';
import { Button } from '@myglambeauty/ui';
import { ProductCard } from '@/components/product/product-card';

const featuredProducts = [
  {
    id: '1',
    name: 'Queen Mink Lashes',
    slug: 'queen-mink-lashes',
    priceCents: 2499,
    mainImageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800',
    tags: ['bestseller'],
  },
  {
    id: '2',
    name: 'Princess Faux Mink Set',
    slug: 'princess-faux-mink-set',
    priceCents: 3499,
    mainImageUrl: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=800',
    tags: ['new'],
  },
  {
    id: '3',
    name: 'Natural Beauty Lashes',
    slug: 'natural-beauty-lashes',
    priceCents: 1499,
    mainImageUrl: 'https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?w=800',
    tags: [],
  },
  {
    id: '4',
    name: 'Drama Queen Volume Lashes',
    slug: 'drama-queen-volume-lashes',
    priceCents: 2999,
    mainImageUrl: 'https://images.unsplash.com/photo-1588495752527-77d73a9a0b75?w=800',
    tags: ['popular'],
  },
];

const testimonials = [
  {
    name: 'Sarah J.',
    text: 'These lashes are absolutely stunning! So lightweight and natural-looking. I get compliments every time I wear them.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    name: 'Michelle W.',
    text: 'Best lashes I\'ve ever purchased! The quality is amazing and they last so long. Will definitely be ordering more.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
  {
    name: 'Jessica D.',
    text: 'MYGlamBeauty has become my go-to for lashes. The customer service is incredible and shipping is always fast!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
];

export default function HomePage() {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-gold-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200 rounded-full blur-3xl opacity-30 animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-200 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Luxury Handmade Lashes
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Elevate Your
                <span className="gradient-text block">Glam Game</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Discover our premium collection of handcrafted lashes designed for the modern queen. 
                Luxury beauty that makes you feel like royalty.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="group">
                    Shop Collections
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/booking">
                  <Button variant="outline" size="lg">
                    Book Appointment
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 mt-10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">10K+</p>
                  <p className="text-sm text-gray-500">Happy Queens</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                  <p className="text-sm text-gray-500">Star Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-sm text-gray-500">Handmade</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800"
                  alt="Luxury lashes"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Cruelty Free</p>
                    <p className="text-sm text-gray-500">Vegan Options</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'Premium materials only' },
              { icon: Clock, title: 'Fast Delivery', desc: '2-3 business days' },
              { icon: Heart, title: 'Easy Returns', desc: '30-day return policy' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-brand-50 rounded-full flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-brand-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Bestselling Lashes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most loved styles, handpicked by queens like you
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="https://image2url.com/r2/default/images/1768520505271-2cf62dd1-2547-4f2c-83f6-7bdbbad2a02c.jpg"
                  alt="Laetitia - Owner of My Glam Beauty Supply"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl p-6 shadow-xl">
                <p className="text-3xl font-bold">5+</p>
                <p className="text-brand-100">Years of Excellence</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-brand-500 font-medium">Meet Laetitia</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">
                The Heart Behind My Glam Beauty Supply
              </h2>
              <p className="text-gray-600 mb-6">
                Laetitia started My Glam with one clear mission: to make beauty affordable, 
                accessible, and empowering for women everywhere. She believes every woman 
                deserves to feel confident, glamorous, and seen—without breaking the bank.
              </p>
              <p className="text-gray-600 mb-8">
                Specializing in high-quality hair extensions, weaving, lashes, and premium 
                beauty products, Laetitia carefully curates every item to ensure top-tier 
                quality, style, and value. Her passion goes beyond products—it's about 
                creating an experience where women can step into their glow.
              </p>
              <Link href="/about">
                <Button variant="gold">
                  Learn More About Us
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-brand-50 to-gold-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Queens Say
            </h2>
            <p className="text-gray-600">Real reviews from real customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">Verified Buyer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl lg:text-5xl font-bold mb-6">
              Ready to Elevate Your
              <span className="bg-gradient-to-r from-brand-400 to-gold-400 bg-clip-text text-transparent"> Glam?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Join thousands of queens who trust MYGlamBeauty for their lash needs. 
              Shop now and experience the difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button variant="gold" size="xl">
                  Shop Now
                </Button>
              </Link>
              <Link href="/booking">
                <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Book a Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
