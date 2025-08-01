import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API működik',
    hasApiKey: !!process.env.UNAS_API_KEY,
    keyLength: process.env.UNAS_API_KEY?.length || 0,
    nodeEnv: process.env.NODE_ENV
  });
} 