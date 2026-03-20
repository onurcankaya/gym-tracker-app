import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { WeightTrainingService } from '@/api/services/weightTrainingService';

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

    const weightTrainingStats = await WeightTrainingService.getStats(
      session.user.id,
      dateRange,
    );
    return NextResponse.json(weightTrainingStats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weight training stats' },
      { status: 500 },
    );
  }
}
