const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface LeadData {
  email: string;
  name?: string;
  phone?: string;
  tags?: string[];
  notes?: string;
}

class LeadCaptureTool {
  async captureLead(data: LeadData): Promise<{ success: boolean; lead?: any; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'ai_chat',
          tags: [...(data.tags || []), 'ai-captured'],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Failed to capture lead' };
      }

      const lead = await response.json();
      return { success: true, lead };
    } catch (error) {
      console.error('Lead capture error:', error);
      return { success: false, error: 'Failed to connect to lead service' };
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const leadCaptureTool = new LeadCaptureTool();
