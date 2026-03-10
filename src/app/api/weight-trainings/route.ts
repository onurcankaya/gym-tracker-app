import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { WeightTrainingService } from '@/api/services/weightTrainingService';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const weightTrainings = await WeightTrainingService.getAllWeightTrainings(
      session.user.id,
    );
    return NextResponse.json(weightTrainings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weight trainings' },
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
    const weightTraining = await WeightTrainingService.createWeightTraining(
      session.user.id,
      body,
    );

    return NextResponse.json(weightTraining, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create weight training',
      },
      { status: 400 },
    );
  }
}
