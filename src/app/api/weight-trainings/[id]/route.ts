import { NextRequest, NextResponse } from 'next/server';
import { WeightTrainingService } from '@/api/services/weightTrainingService';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;

    await WeightTrainingService.deleteWeightTraining(params.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete weight training',
      },
      { status: 400 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const weightTraining = await WeightTrainingService.updateWeightTraining(
      params.id,
      body,
    );

    return NextResponse.json(weightTraining, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update weight training',
      },
      { status: 400 },
    );
  }
}
