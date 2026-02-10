
/**
 * @api Download API
 * @route /api/download
 * @description Download submitted files
 * @methods GET
 */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Submission from '@/models/Submission';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Submission ID required' }, { status: 400 });
    }

    // Find submission and include fileContent (which is excluded by default)
    const submission = await Submission.findById(id).select('+fileContent').lean();

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (!submission.fileContent) {
      return NextResponse.json({ error: 'File content not found' }, { status: 404 });
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(submission.fileContent, 'base64');

    // Return file response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': submission.fileType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${submission.fileName}"`,
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
