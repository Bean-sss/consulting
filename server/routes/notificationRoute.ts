import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Constants
const USER_TYPES = ['vendor', 'contractor'] as const;
const DEFAULT_NOTIFICATION_LIMIT = 50;

// Helper function to create Supabase client
function createSupabaseClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment');
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

// Helper function to validate user type
function isValidUserType(userType: any): boolean {
  return USER_TYPES.includes(userType);
}

// Helper function to parse limit
function parseNotificationLimit(limit: any): number {
  const parsed = parseInt(limit as string);
  return isNaN(parsed) ? DEFAULT_NOTIFICATION_LIMIT : Math.min(parsed, 200);
}

/**
 * GET /api/notifications
 * Retrieves notifications for a user with filtering options
 */
router.get('/notifications', async (req, res) => {
  try {
    const supabase = createSupabaseClient();
    const { user_type, user_id, is_read, limit } = req.query;

    // Validate user type
    if (!isValidUserType(user_type)) {
      return res.status(400).json({
        error: 'Valid user_type required',
        validTypes: USER_TYPES
      });
    }

    // Build the query
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_type', user_type)
      .order('created_at', { ascending: false })
      .limit(parseNotificationLimit(limit));

    // Apply optional filters
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (is_read !== undefined) {
      query = query.eq('is_read', is_read === 'true');
    }

    const { data: notifications, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      notifications,
      count: notifications?.length || 0
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch notifications',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/notification/:notificationId/read
 * Marks a specific notification as read
 */
router.put('/notification/:notificationId/read', async (req, res) => {
  try {
    const supabase = createSupabaseClient();
    const { notificationId } = req.params;

    // Validate notification ID
    if (!notificationId || isNaN(parseInt(notificationId))) {
      return res.status(400).json({
        error: 'Valid notification ID required'
      });
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      notification,
      message: 'Notification marked as read'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to update notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/notifications/read-all
 * Marks all unread notifications as read for a user
 */
router.put('/notifications/read-all', async (req, res) => {
  try {
    const supabase = createSupabaseClient();
    const { user_type, user_id } = req.body;

    // Validate user type
    if (!isValidUserType(user_type)) {
      return res.status(400).json({
        error: 'Valid user_type required',
        validTypes: USER_TYPES
      });
    }

    // Build update query
    let query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_type', user_type)
      .eq('is_read', false);

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data: notifications, error } = await query.select();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      notifications,
      count: notifications?.length || 0,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to update notifications',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/notification
 * Creates a new notification (internal API)
 */
router.post('/notification', async (req, res) => {
  try {
    const supabase = createSupabaseClient();
    const {
      user_type,
      user_id,
      rfp_id,
      type,
      title,
      message,
      metadata
    } = req.body;

    // Validate required fields
    const requiredFields = { user_type, type, title, message };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }

    // Validate user type
    if (!isValidUserType(user_type)) {
      return res.status(400).json({
        error: 'Invalid user_type',
        validTypes: USER_TYPES
      });
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_type,
        user_id,
        rfp_id,
        type,
        title,
        message,
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      notification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to create notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/notification-stats
 * Provides notification statistics for analytics
 */
router.get('/notification-stats', async (req, res) => {
  try {
    const supabase = createSupabaseClient();
    const { user_type, user_id } = req.query;

    // Validate user type
    if (!isValidUserType(user_type)) {
      return res.status(400).json({
        error: 'Valid user_type required',
        validTypes: USER_TYPES
      });
    }

    // Build query
    let baseQuery = supabase
      .from('notifications')
      .select('is_read, type')
      .eq('user_type', user_type);

    if (user_id) {
      baseQuery = baseQuery.eq('user_id', user_id);
    }

    const { data: notifications, error } = await baseQuery;

    if (error) {
      throw error;
    }

    // Calculate statistics
    const stats = notifications?.reduce((acc, notification) => {
      acc.total = (acc.total || 0) + 1;
      acc.unread = (acc.unread || 0) + (notification.is_read ? 0 : 1);
      acc.read = (acc.read || 0) + (notification.is_read ? 1 : 0);
      
      acc.byType = acc.byType || {};
      acc.byType[notification.type] = (acc.byType[notification.type] || 0) + 1;
      
      return acc;
    }, {
      total: 0,
      unread: 0,
      read: 0,
      byType: {} as Record<string, number>
    });

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch notification statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 