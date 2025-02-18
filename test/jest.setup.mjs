import { jest } from '@jest/globals';
import pool from '../config/database.mjs';
import mongoose from 'mongoose';
import { server } from '../server.mjs';
import { Server } from 'socket.io';
import { createServer } from 'http';

// Increase timeout for deployment tests
jest.setTimeout(60000);

// Mock Socket.io
jest.mock('socket.io', () => {
    const mockOn = jest.fn();
    const mockEmit = jest.fn();
    const mockTo = jest.fn(() => ({ emit: mockEmit }));
    const mockJoin = jest.fn();
    const mockLeave = jest.fn();

    return {
        Server: jest.fn(() => ({
            on: mockOn,
            emit: mockEmit,
            to: mockTo,
            join: mockJoin,
            leave: mockLeave,
            use: jest.fn((fn) => fn({
                handshake: { auth: { token: 'mock-token' } },
                on: mockOn,
                join: mockJoin,
                leave: mockLeave
            }, jest.fn()))
        }))
    };
});

// Environment-specific setup
const isDeployment = process.env.NODE_ENV === 'production';

// Silence logs in test environment
if (!isDeployment) {
    global.console = {
        ...console,
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };
}

beforeAll(async () => {
    // Additional deployment checks
    if (isDeployment) {
        console.log('Running deployment tests...');
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    await pool.end();
    if (server) {
        await new Promise(resolve => server.close(resolve));
    }
    // Give time for connections to close
    await new Promise(resolve => setTimeout(resolve, 500));
}); 