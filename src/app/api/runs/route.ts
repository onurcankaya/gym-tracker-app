import { NextRequest, NextResponse } from 'next/server';
import { RunService } from '@/api/services/runService';

export async function GET() {
  try {
    const runs = await RunService.getAllRuns();
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
    const body = await request.json();
    const run = await RunService.createRun(body);

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
