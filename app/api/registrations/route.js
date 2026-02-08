import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to store registrations (using a JSON file for simplicity)
const dataFilePath = path.join(process.cwd(), 'data', 'registrations.json');

// Ensure data directory and file exist
function ensureDataFile() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
  }
}

// Get all registrations
function getRegistrations() {
  ensureDataFile();
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
}

// Save registrations
function saveRegistrations(registrations) {
  ensureDataFile();
  fs.writeFileSync(dataFilePath, JSON.stringify(registrations, null, 2));
}

// GET - Fetch all registrations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const eventId = searchParams.get('eventId');
    
    const registrations = getRegistrations();
    
    // If email and eventId provided, check if user is registered for specific event
    if (email && eventId) {
      const isRegistered = registrations.some(
        reg => reg.email === email && reg.eventId === parseInt(eventId)
      );
      return NextResponse.json({ isRegistered });
    }
    
    // Return all registrations
    return NextResponse.json({ registrations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

// POST - Create new registration
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, course, year, college, phone, eventId, eventName } = body;
    
    if (!name || !email || !eventId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const registrations = getRegistrations();
    
    // Check if already registered
    const existingRegistration = registrations.find(
      reg => reg.email === email && reg.eventId === eventId
    );
    
    if (existingRegistration) {
      return NextResponse.json({ 
        error: 'Already registered', 
        alreadyRegistered: true 
      }, { status: 409 });
    }
    
    // Create new registration
    const newRegistration = {
      id: Date.now(),
      name: name,
      email: email,
      course: course || 'Not specified',
      year: year || 'Not specified',
      college: college || 'Not specified',
      phone: phone || 'Not provided',
      eventId,
      eventName: eventName || 'Unknown Event',
      registeredAt: new Date().toISOString()
    };
    
    registrations.push(newRegistration);
    saveRegistrations(registrations);
    
    return NextResponse.json({ 
      success: true, 
      registration: newRegistration 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 });
  }
}

// DELETE - Remove a registration
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 });
    }
    
    const registrations = getRegistrations();
    const index = registrations.findIndex(reg => reg.id === parseInt(id));
    
    if (index === -1) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    
    registrations.splice(index, 1);
    saveRegistrations(registrations);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
  }
}
