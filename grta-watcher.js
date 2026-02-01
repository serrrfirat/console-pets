#!/usr/bin/env node

/**
 * GRTA Pet Watcher - Monitors OpenClaw and updates pet mood
 */

import pet from './index.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const POLL_INTERVAL = 10000; // 10 seconds
const OPENCLAW_HTTP = 'http://127.0.0.1:18789';
const DEFAULT_PET = 'lobster';

// Track activity
let lastActivityTime = Date.now();
let activeAgentCount = 0;
let lastAgentCount = 0;

async function getOpenClawStatus() {
  try {
    // Try to connect to OpenClaw gateway via HTTP
    const response = await fetch('http://127.0.0.1:18789/status', {
      signal: AbortSignal.timeout(2000)
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (e) {
    // Gateway not responding via HTTP
  }
  
  return null;
}

function determineMood(activeCount, timeSinceLastActivity) {
  // Time thresholds (in milliseconds)
  const IDLE_THRESHOLD = 5 * 60 * 1000; // 5 minutes
  const THINKING_THRESHOLD = 2 * 60 * 1000; // 2 minutes
  const SLEEPING_THRESHOLD = 30 * 60 * 1000; // 30 minutes (night hours: 2am-6am)
  
  const hour = new Date().getHours();
  const isNight = hour >= 2 && hour < 6;
  
  if (isNight && timeSinceLastActivity > SLEEPING_THRESHOLD) {
    return 'sleeping';
  }
  
  if (timeSinceLastActivity > IDLE_THRESHOLD) {
    return 'idle';
  }
  
  if (activeCount > 5) {
    return 'excited'; // Lots of activity
  }
  
  if (timeSinceLastActivity > THINKING_THRESHOLD) {
    return 'thinking'; // Some recent activity but quiet
  }
  
  if (activeCount === 0) {
    return 'sad'; // No active agents
  }
  
  return 'happy'; // Normal activity
}

async function updatePetMood(mood) {
  try {
    await pet[mood](DEFAULT_PET);
    console.log(`[${new Date().toISOString()}] GRTA mood: ${mood.toUpperCase()}`);
  } catch (e) {
    console.error(`Failed to show pet mood: ${e.message}`);
  }
}

async function runHeartbeat() {
  // Try to get OpenClaw status
  const status = await getOpenClawStatus();
  
  if (status) {
    // Extract active agent count from status
    activeAgentCount = status.activeAgents || status.agents?.filter(a => a.active)?.length || 0;
    lastActivityTime = status.lastActivity || Date.now();
  } else {
    // Fallback: check if OpenClaw process is running
    try {
      const { stdout } = await execAsync('pgrep -f "openclaw" | wc -l');
      const count = parseInt(stdout.trim()) || 0;
      if (count > 0) {
        activeAgentCount = 3; // Assume some activity
      } else {
        activeAgentCount = 0;
      }
    } catch (e) {
      activeAgentCount = 0;
    }
  }
  
  const timeSinceLastActivity = Date.now() - lastActivityTime;
  const mood = determineMood(activeAgentCount, timeSinceLastActivity);
  
  await updatePetMood(mood);
  
  // Update last known count
  lastAgentCount = activeAgentCount;
}

// Main loop
console.log('🦞 GRTA Pet Watcher Started');
console.log(`📡 OpenClaw: ${OPENCLAW_HTTP}`);
console.log(`⏱️ Poll interval: ${POLL_INTERVAL / 1000}s`);
console.log(`🐾 Default pet: ${DEFAULT_PET}`);
console.log('');

// Initial heartbeat
await runHeartbeat();

// Set up interval
setInterval(runHeartbeat, POLL_INTERVAL);

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n👋 GRTA Pet Watcher shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 GRTA Pet Watcher shutting down...');
  process.exit(0);
});
