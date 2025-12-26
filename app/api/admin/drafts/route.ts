import { NextRequest, NextResponse } from 'next/server';
import { getDraftPosts } from '@/sanity/lib/queries';

export async function GET(request: NextRequest) {
  // Check authentication
  const authCookie = request.cookies.get('admin_auth');
  
  if (authCookie?.value !== 'authenticated') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const drafts = await getDraftPosts();
    return NextResponse.json({ drafts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}
