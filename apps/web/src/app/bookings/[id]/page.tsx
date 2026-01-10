'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, Check, AlertCircle, CreditCard, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@myglambeauty/ui';

interface BookingDetails {
  id: string;
  service: {
    id: string;
    name: string;
    duration: string;
    price: string;
    category?: string;
    description?: string;
    deposit?: string;
    paymentInfo?: string;
  };
  date: string;
  time: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    notes: string;
    agreeToTerms: boolean;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  depositPaid: boolean;
  createdAt: string;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchBookingDetails(params.id as string);
    }
  }, [params.id]);

  const fetchBookingDetails = async (bookingId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock booking details - in real app, this would be an API call
      const mockBooking: BookingDetails = {
        id: bookingId,
        service: {
          id: 'sew-in-special',
          name: 'FALL IN LOVE WITH HAIR *SEW IN* SPECIAL',
          duration: '4 hours',
          price: '$249.99',
          category: 'specials',
          description: 'SALE VALID UNTIL Nov. 30TH WHILE SUPPLIES LAST\n16IN LOOSE WAVE (x3) bundles included',
          deposit: '$50',
          paymentInfo: '$50 DEPOSIT REQUIRED TO BOOK\nNON-REFUNDABLE\nRemaining balance of $199.99 due at appointment',
        },
        date: '2024-02-15',
        time: '10:00 AM',
        customer: {
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+1 (555) 123-4567',
          notes: 'First time client, excited for the transformation!',
          agreeToTerms: true,
        },
        status: 'confirmed',
        depositPaid: true,
        createdAt: '2024-01-10T10:30:00Z',
      };

      setBooking(mockBooking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Check className="h-5 w-5" />;
      case 'completed': return <Check className="h-5 w-5" />;
      case 'cancelled': return <AlertCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleReschedule = () => {
    // Navigate to booking page with pre-filled data
    router.push('/booking');
  };

  const handleCancel = () => {
    // Show confirmation dialog
    if (confirm('Are you sure you want to cancel this appointment?')) {
      // Cancel booking logic
      alert('Booking cancelled. You will receive a confirmation email.');
      router.push('/account');
    }
  };

  const handleContact = () => {
    // Open email client or messaging
    window.location.href = 'mailto:support@myglambeauty.com?subject=Booking Inquiry - ' + booking?.id;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This booking could not be found.'}</p>
          <Link href="/account">
            <Button>Back to Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-brand-500">
              MYGlamBeauty
            </Link>
            <Link href="/account">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Booking Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Appointment Confirmation
                </h1>
                <p className="text-gray-600">
                  Booking #{booking.id} • Created on {formatDate(booking.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status}
                </div>
                {booking.depositPaid && (
                  <p className="text-sm text-green-600 mt-2">Deposit paid</p>
                )}
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">{booking.service.name}</h3>
                {booking.service.description && (
                  <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">
                    {booking.service.description}
                  </p>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">{booking.service.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-gray-900">{booking.service.price}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              {booking.service.deposit && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Payment Information</h4>
                  <p className="text-sm text-yellow-800 mb-2">{booking.service.deposit}</p>
                  <p className="text-sm text-yellow-800 whitespace-pre-line">
                    {booking.service.paymentInfo}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{booking.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{booking.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{booking.customer.phone}</p>
                  </div>
                </div>
              </div>
              
              {booking.customer.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Special Notes</p>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {booking.customer.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-medium text-blue-900 mb-3">Important Information</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Please arrive 10 minutes early for your appointment</li>
              <li>• Hair must be washed and completely dry before service</li>
              <li>• No children or additional guests during service</li>
              <li>• Contact us at least 24 hours in advance for any changes</li>
              <li>• Remaining balance is due at the time of service</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleContact}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
              {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                <Button variant="outline" onClick={handleReschedule}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              )}
            </div>
            {booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <Button variant="destructive" onClick={handleCancel}>
                Cancel Appointment
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
