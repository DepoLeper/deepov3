import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.UNAS_API_KEY;
  const apiUrl = process.env.UNAS_API_URL;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyStart: apiKey?.substring(0, 10) || 'N/A',
    apiUrl: apiUrl || 'N/A',
    nodeEnv: process.env.NODE_ENV
  });
} 