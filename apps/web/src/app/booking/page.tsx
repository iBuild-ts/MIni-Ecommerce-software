'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, Sparkles, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { Button, Input } from '@myglambeauty/ui';
import { api } from '@/lib/api';

const services = [
  // FALL IN LOVE WITH HAIR SPECIALS
  {
    id: 'sew-in-special',
    name: 'FALL IN LOVE WITH HAIR *SEW IN* SPECIAL',
    duration: '4 hours',
    price: '$249.99',
    category: 'specials',
    description: 'SALE VALID UNTIL Nov. 30TH WHILE SUPPLIES LAST\n16IN LOOSE WAVE (x3) bundles included',
    deposit: '$10 Cash App deposit required',
    paymentInfo: 'CASHAPP: $MYGLAMBEAUTY\nZELLE: MYGLAMBEAUTYSUPPLY.COM'
  },
  {
    id: 'makeup-special',
    name: 'FALL IN LOVE WITH HAIR *MAKEUP *SPECIAL',
    duration: '1 hour',
    price: '$75.00',
    category: 'specials',
    description: 'NATURAL MAKEUP WITH LASHES INCLUDED',
    deposit: '$10 CASH APP DEPOSIT WITH YOUR NAME & DATE OF APPOINTMENT\nDEPOSIT IS TRANSFERABLE BUT NOT REFUNDABLE.',
    paymentInfo: 'CASHAPP: $MYGLAMBEAUTY\nZELLE: MYGLAMBEAUTYSUPPLY.COM'
  },
  {
    id: 'quick-weave-special',
    name: 'FALL IN LOVE WITH HAIR *ANY STYLE QUICK WEAVE*',
    duration: '1 hour',
    price: '$125.00',
    category: 'specials',
    description: 'ANY QUICK WEAVE STYLE THAT DOES NOT REQUIRE A FRONTAL OR CLOSURE.',
    deposit: '$10 CASH APP DEPOSIT WITH YOUR NAME & DATE OF APPOINTMENT\nDEPOSIT IS TRANSFERABLE BUT NOT REFUNDABLE.',
    paymentInfo: 'CASHAPP: $MYGLAMBEAUTY\nZELLE: MYGLAMBEAUTYSUPPLY.COM'
  },

  // ASSIST SERVICES
  {
    id: 'plaits-takedown',
    name: 'PLAITS TAKE DOWN',
    duration: '45 minutes',
    price: '$45.00',
    category: 'assist',
    description: 'Let us remove your plaits for you.'
  },
  {
    id: 'sew-in-removal',
    name: 'Sew in/Bond In removal',
    duration: '30 minutes',
    price: '$35.00',
    category: 'assist',
    description: 'Let us safely remove your Bond in or sew in.'
  },

  // MAKEUP SERVICES
  {
    id: 'strip-lashes',
    name: 'Strip lashes',
    duration: '15 minutes',
    price: '$10.00',
    category: 'makeup',
    description: 'Bring your own lashes or choose from assorted lashes upon arrival\nYou can also purchase mink lashes from me price range from $2-$12 mink lashes\nprice of lashes is additional to the service fee.'
  },
  {
    id: 'eyebrow-tinting',
    name: 'Eyebrow tinting',
    duration: '20 minutes',
    price: '$10.00',
    category: 'makeup',
    description: 'Brows will sculpted and will be cleaned up as needed (pluck or arch) tint will be applied and brows concealed. Last up to 7-10 days with proper care & maintenance.'
  },
  {
    id: 'glam-me-up',
    name: 'Glam Me Up',
    duration: '30 minutes',
    price: '$35.00',
    category: 'makeup',
    description: 'Eyebrow arch-clen up\nEyebrow tint\nMink Strip lashes (lashes included 15-25mm any eyelash of your choice)'
  },
  {
    id: 'naked-natural',
    name: 'Naked Natural',
    duration: '1 hour 15 minutes',
    price: '$75.00',
    category: 'makeup',
    description: '-Brow enhancement\n-Full coverage foundation\n-Natural wispy lashes (included)\n-Powered contour\n-Highlight\n-Blush\n-Lip gloss or lip color of choice\n-Basic nude eyeshadow is included with this look (1 color)'
  },
  {
    id: 'beat-glam',
    name: 'Beat Glam',
    duration: '1 hour 30 minutes',
    price: '$85.00',
    category: 'makeup',
    description: '-Brow enhancement\n-Full coverage foundation\n-Natural wispy lashes or 3D Lashes (included)\n-Natural or cut crease Eyeshadow (2-3 colors)\n-Cream contour\n-Highlight\n-Blush\n-Lip gloss or lip color of choice'
  },
  {
    id: 'glam-beauty',
    name: 'Glam Beauty',
    duration: '2 hours',
    price: '$95.00',
    category: 'makeup',
    description: '-Brow enhancement\n-Full coverage foundation\n-Any Mink lashes 15-25mm (included)\n-Cream contour/Power contour\n-Highlight\n-Blush\n-Cut crease eyeshadow or Chunky glitter\n-Lip gloss or lip color of choice'
  },
  {
    id: 'wedding-makeup',
    name: 'Wedding Makeup',
    duration: '1 hour 30 minutes',
    price: '$100.00',
    category: 'makeup',
    description: 'This is a single person fee and does not reflect groups. Groups 5 or less $95/each Groups 6-10 $90/each Please note there\'s a travel fee of $40 (Miami) $50(Broward) added to this service. Prices vary if out of state travel is required ...'
  },

  // PONYTAILS
  {
    id: 'braided-ponytail',
    name: 'Braided Ponytail (Hair Included)',
    duration: '1 hour 30 minutes',
    price: '$85.00',
    category: 'ponytails',
    description: 'Hair must be washed prior to service free of oils and products. Natural hair must be blown out prior to arrival. Your hair will be flat ironed for this service! 1 Pack of hair is included with this service. You can choose to provide your own hair if desired.'
  },
  {
    id: 'simple-ponytail',
    name: 'Simple ponytail (Hair Included)',
    duration: '1 hour 30 minutes',
    price: '$95.00',
    category: 'ponytails',
    description: 'Hair must be washed prior to service free of oils and products. Natural hair must be blown out prior to arrival. Your hair will be flat ironed for this service! 1 Pack of hair is included in this service. You can choose to provide your own hair if desired.'
  },
  {
    id: 'simple-frontal-ponytail',
    name: 'Simple Frontal Ponytail',
    duration: '2 hours',
    price: '$100.00',
    category: 'ponytails',
    description: ''
  },
  {
    id: 'frontal-ponytail-bang',
    name: 'Frontal ponytail W/ bang',
    duration: '2 hours',
    price: '$125.00',
    category: 'ponytails',
    description: ''
  },
  {
    id: 'twin-braided-ponytails',
    name: 'Twin braided ponytails (Hair Included)',
    duration: '1 hour 30 minutes',
    price: '$125.00',
    category: 'ponytails',
    description: 'Hair must be washed prior to service free of oils and products.\nNatural hair must be blown out prior to arrival.\nYour hair will be flat ironed for this service!\nHair is included in this service.'
  },

  // QUICK WEAVE (BOND IN)
  {
    id: '2-bundle-bond-leave-out',
    name: '2 Bundle Bond-In w/leave-out',
    duration: '2 hours',
    price: '$100.00',
    category: 'bond-in',
    description: ''
  },
  {
    id: '2-bundle-bond-closure',
    name: '2 Bundle Bond-In w/closure',
    duration: '2 hours 30 minutes',
    price: '$125.00',
    category: 'bond-in',
    description: ''
  },
  {
    id: '2-bundle-bond-frontal',
    name: '2 Bundle Bond-In w/frontal',
    duration: '2 hours 45 minutes',
    price: '$150.00',
    category: 'bond-in',
    description: ''
  },
  {
    id: '3-bundle-bond-leave-out',
    name: '3 Bundle Bond-In w/leave-out',
    duration: '2 hours 15 minutes',
    price: '$150.00',
    category: 'bond-in',
    description: ''
  },
  {
    id: '3-bundle-bond-closure',
    name: '3 Bundle Bond-In w/closures',
    duration: '2 hours 45 minutes',
    price: '$165.00',
    category: 'bond-in',
    description: ''
  },
  {
    id: '3-bundle-bond-frontal',
    name: '3 Bundle Bond-In w/frontal',
    duration: '3 hours',
    price: '$175.00',
    category: 'bond-in',
    description: ''
  },
  {
    id: 'half-up-half-down-bond',
    name: 'Half up Half down Bond-In',
    duration: '2 hours 30 minutes',
    price: '$145.00',
    category: 'bond-in',
    description: ''
  },

  // SEW INS
  {
    id: 'half-up-half-down-sew',
    name: 'Half up Half down Sew-In',
    duration: '3 hours',
    price: '$165.00',
    category: 'sew-ins',
    description: ''
  },
  {
    id: '2-bundle-sew-leave-out',
    name: '2 Bundle Sew-In w/ leave out',
    duration: '2 hours 15 minutes',
    price: '$125.00',
    category: 'sew-ins',
    description: ''
  },
  {
    id: '2-bundle-sew-closure',
    name: '2 Bundle Sew-In w/closure',
    duration: '3 hours',
    price: '$150.00',
    category: 'sew-ins',
    description: ''
  },
  {
    id: '2-bundle-sew-frontal',
    name: '2 Bundle Sew-In w/frontal',
    duration: '3 hours',
    price: '$165.00',
    category: 'sew-ins',
    description: ''
  },
  {
    id: '3-bundle-sew-leave-out',
    name: '3 Bundle Sew-In w/leave out',
    duration: '2 hours 45 minutes',
    price: '$150.00',
    category: 'sew-ins',
    description: ''
  },
  {
    id: '3-bundle-sew-closure',
    name: '3 Bundle Sew-In w/closure',
    duration: '3 hours 15 minutes',
    price: '$175.00',
    category: 'sew-ins',
    description: ''
  },
  {
    id: '3-bundle-sew-frontal',
    name: '3 Bundle Sew-In w/frontal',
    duration: '3 hours 30 minutes',
    price: '$200.00',
    category: 'sew-ins',
    description: ''
  },

  // WIG MAINTENANCE
  {
    id: 'wig-rejuvenation',
    name: 'Wig Rejuvenation',
    duration: '1 hour',
    price: '$25.00',
    category: 'wig-maintenance',
    description: 'Detangle/Wash/treatment'
  },
  {
    id: 'closure-wig-revamp',
    name: 'Closure Wig Revamp',
    duration: '1 hour',
    price: '$85.00',
    category: 'wig-maintenance',
    description: 'Detangle\nwash/treatment\nclosure replacement\nBleach, Pluck & Style (middle or side part)\nAdd or replace elastic band'
  },
  {
    id: 'frontal-wig-revamp',
    name: 'Frontal Wig Revamp',
    duration: '1 hour',
    price: '$95.00',
    category: 'wig-maintenance',
    description: 'Detangle\nwash/treatment\nfrontal replacement\nBleach, Pluck & Style (middle or side part)\nAdd or replace elastic band'
  },
  {
    id: 'closure-wig-revamp-bundle',
    name: 'Closure Wig Revamp + add a bundle',
    duration: '1 hour',
    price: '$100.00',
    category: 'wig-maintenance',
    description: 'Detangle\nWash/treatment\nClosure replacement\nBleach, Pluck & Style (middle or side part)\nAdd or replace elastic band\nSew in an extra bundle for fullness'
  },
  {
    id: 'frontal-wig-revamp-bundle',
    name: 'Frontal Wig Revamp + add a bundle',
    duration: '1 hour',
    price: '$125.00',
    category: 'wig-maintenance',
    description: 'Detangle\nWash/treatment\nfrontal replacement\nBleach, Pluck & Style (middle or side part)\nAdd or replace elastic band\nSew in an extra bundle'
  },
  {
    id: 'wig-knots-color-correction',
    name: 'Wig knots color correction',
    duration: '30 minutes',
    price: '$35.00',
    category: 'wig-maintenance',
    description: 'Did you over bleach the knots on your wig and want it repaired. This service includes the dye for correction & wash/treatment'
  },
  {
    id: 'water-color-dye',
    name: 'Water-color dye',
    duration: '30 minutes',
    price: '$25.00',
    category: 'wig-maintenance',
    description: 'Dye included'
  },

  // WIGS
  {
    id: 'wig-touch-ups',
    name: 'Wig Touch ups',
    duration: '35 minutes',
    price: '$50.00',
    category: 'wigs',
    description: 'Touch up your wig\nWig must still be glued attached\nbaby hairs touch up, glue down sides\noption to switch parts or keep the same style with a silk press'
  },
  {
    id: 'glam-wig-install',
    name: 'GLAM Wig Install',
    duration: '1 hour 30 minutes',
    price: '$95.00',
    category: 'wigs',
    description: 'ONLY FOR WIGS PURCHASED AT MY STORE\nBraid down\nPluck/Tint\nInstall\nMiddle or side part\nNew closure Wigs/lace fronts'
  },
  {
    id: 'deluxe-wig-install',
    name: 'Deluxe Wig Install',
    duration: '2 hours',
    price: '$125.00',
    category: 'wigs',
    description: 'WIGS NOT PURCHASED FROM OUR STORE-BRING YOUR OWN WIG\nNew wig or reinstall\nBraid down\nBleach knots\nPluck/Tint\nInstall\nPress or curl enhancement\nMiddle or side part only'
  },
  {
    id: 'premium-wig-install',
    name: 'Premium wig install',
    duration: '2 hours 30 minutes',
    price: '$150.00',
    category: 'wigs',
    description: 'Braid down\nBleached knots\nPluck/ Tint\nInstall\npress\nStyle of your choice OR curls'
  }
];

const categories = [
  { id: 'all', name: 'All Services' },
  { id: 'specials', name: 'Specials' },
  { id: 'assist', name: 'Assist Services' },
  { id: 'makeup', name: 'Makeup' },
  { id: 'ponytails', name: 'Ponytails' },
  { id: 'bond-in', name: 'Quick Weave (Bond In)' },
  { id: 'sew-ins', name: 'Sew Ins' },
  { id: 'wig-maintenance', name: 'Wig Maintenance' },
  { id: 'wigs', name: 'Wigs' }
];

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    notes: '',
    agreeToTerms: false 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!selectedTime) {
        throw new Error('Please select a time for your appointment');
      }

      const bookingData = {
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        customer: formData,
      };

      // Send to API
      const createdBooking = await api.bookings.create(bookingData);
      console.log('Booking created successfully:', createdBooking);
      
      setIsComplete(true);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedService !== null;
    if (step === 2) return selectedDate && selectedTime;
    if (step === 3) return formData.name && formData.email && formData.agreeToTerms;
    return false;
  };

  if (isComplete) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-gradient-to-br from-brand-50 to-gold-50">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
          >
            <Check className="h-12 w-12 text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you, {formData.name}! Your appointment has been scheduled. We&apos;ve sent a confirmation email to {formData.email}.
          </p>
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
            <div className="space-y-2 text-left">
              <p><strong>Service:</strong> {selectedService?.name}</p>
              <p><strong>Duration:</strong> {selectedService?.duration}</p>
              <p><strong>Price:</strong> {selectedService?.price}</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
            </div>
            {selectedService?.deposit && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Deposit Required:</strong> {selectedService.deposit}
                </p>
                <p className="text-sm text-yellow-800 mt-1">
                  {selectedService.paymentInfo}
                </p>
              </div>
            )}
          </div>
          <Button onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gradient-to-br from-brand-50 to-gold-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Select Appointment
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Glam Session</h1>
          <p className="text-gray-600">Choose a service and time that works for you</p>
        </div>

        {/* Important Notice */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-brand-500 mt-1 flex-shrink-0" />
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>1.</strong> Hair must be washed prior to service.</p>
              <p><strong>2.</strong> No children, No men, or entourage while service is being performed!</p>
              <p><strong>3.</strong> Please communicate with your service provider via text message if you have any questions or need special assistance.</p>
              <p className="pt-2 font-medium">Thank you for choosing MyGlamBeauty your business is greatly appreciated.</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 mx-2 ${step > s ? 'bg-brand-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm"
        >
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select a Service</h2>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Services Grid */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                      selectedService?.id === service.id
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-200 hover:border-brand-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 flex-1">{service.name}</h3>
                      <span className="text-brand-600 font-bold ml-4">{service.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 whitespace-pre-line">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        {service.duration}
                      </div>
                      {service.deposit && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Deposit Required
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Choose Date & Time</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedTime === time
                            ? 'bg-brand-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Selected Service Summary */}
              {selectedService && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Selected Service:</h3>
                  <p className="text-sm text-gray-700">{selectedService.name}</p>
                  <p className="text-sm text-gray-600">{selectedService.duration} • {selectedService.price}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Contact Info */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Information</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special requests or notes..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
                
                {/* Payment Info for services requiring deposit */}
                {selectedService?.deposit && (
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <h4 className="font-semibold text-yellow-800 mb-2">Payment Information</h4>
                    <p className="text-sm text-yellow-800 mb-2">{selectedService.deposit}</p>
                    <p className="text-sm text-yellow-800 whitespace-pre-line">{selectedService.paymentInfo}</p>
                  </div>
                )}

                {/* Terms Agreement */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="mt-1 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the salon policies: Hair must be washed prior to service, no children/men/entourage during service, and I will communicate via text message for any questions or special assistance.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!canProceed()}>
                Confirm Booking
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
