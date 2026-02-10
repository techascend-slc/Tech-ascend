/**
 * @api Submissions API
 * @route /api/submissions
 * @description Handle file submissions from participants
 */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Submission from '@/models/Submission';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// POST - Upload a submission
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const formData = await request.formData();
    const file = formData.get('file');
    const eventId = formData.get('eventId');
    const eventName = formData.get('eventName');
    const userEmail = formData.get('userEmail');
    const userName = formData.get('userName');

    if (!file || !eventId || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString('base64');
    
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;

    // Create submission with base64 content
    const submission = await Submission.create({
      eventId: parseInt(eventId),
      eventName: eventName || '',
      userEmail,
      userName: userName || '',
      fileName: file.name,
      filePath: `/api/download`, // Virtual path, will append ID when needed or construct in frontend
      fileContent: base64Content,
      fileSize: file.size,
      fileType: file.type,
    });
    
    // Update filePath with ID for download link
    submission.filePath = `/api/download?id=${submission._id}`;
    await submission.save();

    return NextResponse.json({
      success: true,
      submission: {
        id: submission._id,
        fileName: submission.fileName,
        submittedAt: submission.submittedAt,
      }
    });
  } catch (error) {
    console.error('Submission upload error:', error);
    return NextResponse.json({ error: 'Failed to upload submission' }, { status: 500 });
  }
}

// GET - Get submissions for an event (admin) or check user's submission
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const userEmail = searchParams.get('userEmail');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    // If userEmail is provided, check for that user's submission
    if (userEmail) {
      const submission = await Submission.findOne({ 
        eventId: parseInt(eventId), 
        userEmail 
      }).lean();
      
      return NextResponse.json({ 
        hasSubmission: !!submission,
        submission: submission || null
      });
    }

    // Otherwise return all submissions for the event (for admin)
    const submissions = await Submission.find({ 
      eventId: parseInt(eventId) 
    }).sort({ submittedAt: -1 }).lean();

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json({ error: 'Failed to get submissions' }, { status: 500 });
  }
}
