import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RunService } from '@/api/services/runService';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const runStats = await RunService.getStats(session.user.id);
    return NextResponse.json(runStats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch run stats' },
      { status: 500 },
    );
  }
}
