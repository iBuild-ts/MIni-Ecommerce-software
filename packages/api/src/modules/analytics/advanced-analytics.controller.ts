import { Request, Response } from 'express';
import { advancedAnalyticsService } from './advanced-analytics.service';

export class AdvancedAnalyticsController {
  async getComprehensiveMetrics(req: Request, res: Response) {
    try {
      const metrics = await advancedAnalyticsService.getComprehensiveMetrics();
      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error('Error fetching comprehensive metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch metrics',
      });
    }
  }

  async getRealTimeMetrics(req: Request, res: Response) {
    try {
      const metrics = await advancedAnalyticsService.getRealTimeMetrics();
      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch real-time metrics',
      });
    }
  }

  async generateReport(req: Request, res: Response) {
    try {
      const { type } = req.query;
      
      if (!type || !['daily', 'weekly', 'monthly'].includes(type as string)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid report type. Must be daily, weekly, or monthly',
        });
      }

      const report = await advancedAnalyticsService.generateReport(type as 'daily' | 'weekly' | 'monthly');
      
      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate report',
      });
    }
  }

  async getPerformanceInsights(req: Request, res: Response) {
    try {
      const metrics = await advancedAnalyticsService.getComprehensiveMetrics();
      
      // Generate insights based on metrics
      const insights = this.generatePerformanceInsights(metrics);
      
      res.json({
        success: true,
        data: {
          insights,
          metrics,
          generatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error generating performance insights:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate insights',
      });
    }
  }

  private generatePerformanceInsights(metrics: any) {
    const insights = [];

    // Revenue insights
    if (metrics.revenue.growth.monthly > 15) {
      insights.push({
        type: 'success',
        title: 'Exceptional Revenue Growth',
        description: `Monthly revenue growth of ${metrics.revenue.growth.monthly}% exceeds targets`,
        recommendation: 'Consider scaling marketing efforts to maintain momentum',
      });
    } else if (metrics.revenue.growth.monthly < 5) {
      insights.push({
        type: 'warning',
        title: 'Slow Revenue Growth',
        description: `Monthly revenue growth of ${metrics.revenue.growth.monthly}% is below target`,
        recommendation: 'Review pricing strategy and marketing campaigns',
      });
    }

    // Booking insights
    if (metrics.bookings.conversionRate < 60) {
      insights.push({
        type: 'warning',
        title: 'Low Booking Conversion Rate',
        description: `Only ${metrics.bookings.conversionRate}% of bookings are confirmed`,
        recommendation: 'Implement automated follow-up emails for pending bookings',
      });
    }

    // Customer insights
    const newCustomerRatio = (metrics.customers.new / metrics.customers.total) * 100;
    if (newCustomerRatio < 20) {
      insights.push({
        type: 'info',
        title: 'Customer Acquisition Opportunity',
        description: `Only ${newCustomerRatio.toFixed(1)}% of customers are new`,
        recommendation: 'Focus on customer acquisition campaigns',
      });
    }

    // Performance insights
    if (metrics.performance.averageResponseTime > 500) {
      insights.push({
        type: 'error',
        title: 'Performance Degradation',
        description: `Average response time of ${metrics.performance.averageResponseTime}ms is slow`,
        recommendation: 'Optimize database queries and implement caching',
      });
    }

    return insights;
  }
}
