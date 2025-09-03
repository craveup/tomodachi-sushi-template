import { NextRequest, NextResponse } from 'next/server';
import { CRAVEUP_API_BASE, getServerApiKey, handleAPIResponse } from '@/lib/api/config';

// Fallback time intervals data for development
const getFallbackTimeIntervals = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const formatDay = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 11; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  return {
    orderDays: [
      {
        value: formatDate(today),
        label: formatDay(today),
        intervals: generateTimeSlots(),
      },
      {
        value: formatDate(tomorrow), 
        label: formatDay(tomorrow),
        intervals: generateTimeSlots(),
      },
      {
        value: formatDate(dayAfter),
        label: formatDay(dayAfter), 
        intervals: generateTimeSlots(),
      },
    ],
  };
};

export async function GET(request: NextRequest) {
  try {
    const locationId = request.nextUrl.searchParams.get('locationId');
    if (!locationId) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }
    
    const apiKey = getServerApiKey();
    
    // If no API key is configured, return fallback data for development
    if (!apiKey) {
      console.log('No API key found, returning fallback time intervals data');
      return NextResponse.json(getFallbackTimeIntervals());
    }
    
    const apiUrl = `${CRAVEUP_API_BASE}/api/v1/locations/${locationId}/time-intervals`;
    
    console.log('Time intervals API call:', {
      url: apiUrl,
      hasApiKey: Boolean(apiKey),
      locationId,
    });
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
      });

      console.log('Time intervals API response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      const data = await handleAPIResponse(response);
      return NextResponse.json(data);
    } catch (apiError) {
      // If external API fails, fallback to mock data
      console.warn('External API failed, using fallback time intervals:', apiError);
      return NextResponse.json(getFallbackTimeIntervals());
    }
  } catch (error: any) {
    console.error('Time intervals fetch error:', error);
    // Return fallback data even on unexpected errors
    return NextResponse.json(getFallbackTimeIntervals());
  }
}