import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Newsletter from '@/models/Newsletter';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, source = 'blog-footer' } = body;

    // Basic validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { success: false, error: 'This email is already subscribed.' },
          { status: 409 }
        );
      }
      // Re-subscribe if they previously unsubscribed
      existing.status = 'active';
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = undefined;
      await existing.save();
      return NextResponse.json({ success: true, message: 'Welcome back! You\'ve been re-subscribed.' });
    }

    // Get IP for spam prevention (don't store full IP in prod, just log it)
    const forwarded = req.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

    await Newsletter.create({
      email: normalizedEmail,
      source,
      ipAddress,
      subscribedAt: new Date(),
    });

    return NextResponse.json({ success: true, message: 'Successfully subscribed!' }, { status: 201 });
  } catch (error: any) {
    // Duplicate key error (race condition)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'This email is already subscribed.' },
        { status: 409 }
      );
    }
    console.error('[NEWSLETTER_SUBSCRIBE_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
