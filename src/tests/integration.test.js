import { endpoints } from '../config/api';
import { authService } from '../services/authService';
import { ownerService } from '../services/ownerService';

describe('Frontend-Backend Integration', () => {
    test('Authentication Flow', async () => {
        const loginResponse = await authService.login({
            email: 'eeznetsolutions@gmail.com',
            password: 'owner123'
        });
        expect(loginResponse.token).toBeDefined();
    });

    test('Owner Dashboard Data', async () => {
        const analytics = await ownerService.getSystemAnalytics();
        expect(analytics).toBeDefined();
    });

    test('Real-time Tracking', async () => {
        const tracking = await ownerService.getActiveDeliveries();
        expect(tracking).toBeDefined();
    });
}); 