import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RunService } from '@/api/services/runService';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    const dateRange = {
      from: searchParams.get('fromDate'),
      to: searchParams.get('toDate'),
    };

    const runStats = await RunService.getStats(session.user.id, dateRange);
    return NextResponse.json(runStats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch run stats' },
      { status: 500 },
    );
  }
}
