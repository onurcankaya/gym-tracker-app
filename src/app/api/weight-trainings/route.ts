import { NextRequest, NextResponse } from 'next/server';
import { WeightTrainingService } from '@/api/services/weightTrainingService';

export async function GET() {
  try {
    const weightTrainings = await WeightTrainingService.getAllWeightTrainings();
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
    const body = await request.json();
    const weightTraining =
      await WeightTrainingService.createWeightTraining(body);

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
