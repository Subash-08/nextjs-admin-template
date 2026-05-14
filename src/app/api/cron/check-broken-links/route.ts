import { NextRequest, NextResponse } from 'next/server';
import { checkBrokenLinks } from '@/lib/blog/linkTracking';

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret (Vercel Cron Jobs send this header)
    const authHeader = req.headers.get('authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[CRON] Starting broken link check...');

    await checkBrokenLinks();

    return NextResponse.json({
      success: true,
      message: 'Broken link check completed',
    });
  } catch (error) {
    console.error('[CRON_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
