import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RunService } from '@/api/services/runService';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const runs = await RunService.getAllRuns(session.user.id);
    return NextResponse.json(runs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch runs' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const run = await RunService.createRun(session.user.id, body);

    return NextResponse.json(run, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create run',
      },
      { status: 400 },
    );
  }
}
