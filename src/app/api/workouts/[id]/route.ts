import { NextRequest, NextResponse } from 'next/server';
import { WorkoutService } from '@/api/services/workoutService';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;

    await WorkoutService.deleteWorkout(params.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to delete workout',
      },
      { status: 400 },
    );
  }
}
