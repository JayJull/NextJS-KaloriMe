// app/api/reports/route.js
import { NextRequest, NextResponse } from 'next/server';
import { ReportPresenter } from '@/presenters/ReportPresenter';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const days = searchParams.get('days') || '7';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    let result;

    if (startDate && endDate) {
      // Get report by date range
      result = await ReportPresenter.getReportByDateRange(
        userId,
        startDate,
        endDate
      );
    } else {
      // Get report by days
      result = await ReportPresenter.getReportByDays(
        userId,
        parseInt(days)
      );
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error('Error in reports API:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}