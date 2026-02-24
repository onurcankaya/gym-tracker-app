import { NextRequest, NextResponse } from 'next/server';
import { WorkoutService } from '@/api/services/workoutService';

export async function GET() {
  try {
    const workouts = await WorkoutService.getAllWorkouts();
    return NextResponse.json(workouts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const workout = await WorkoutService.createWorkout(body);

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create workout',
      },
      { status: 400 },
    );
  }
}
