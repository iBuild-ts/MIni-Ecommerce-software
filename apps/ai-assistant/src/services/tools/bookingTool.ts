const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface BookingData {
  email: string;
  name?: string;
  phone?: string;
  scheduledFor: string;
  service?: string;
  notes?: string;
}

class BookingTool {
  async createBooking(data: BookingData): Promise<{ success: boolean; booking?: any; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'ai_chat',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Failed to create booking' };
      }

      const booking = await response.json();
      return { success: true, booking };
    } catch (error) {
      console.error('Booking error:', error);
      return { success: false, error: 'Failed to connect to booking service' };
    }
  }

  async getAvailableSlots(date: string): Promise<Date[]> {
    try {
      const response = await fetch(`${API_URL}/api/bookings/slots?date=${date}`);
      if (!response.ok) return this.getFallbackSlots(date);
      return response.json();
    } catch (error) {
      console.error('Slots fetch error:', error);
      return this.getFallbackSlots(date);
    }
  }

  private getFallbackSlots(dateStr: string): Date[] {
    const date = new Date(dateStr);
    const slots: Date[] = [];
    
    for (let hour = 9; hour < 18; hour++) {
      const slot = new Date(date);
      slot.setHours(hour, 0, 0, 0);
      slots.push(slot);
    }
    
    return slots;
  }
}

export const bookingTool = new BookingTool();
