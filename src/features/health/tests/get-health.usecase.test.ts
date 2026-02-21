import { getHealth } from '../service/get-health.usecase';

describe('getHealth', () => {
  it('returns status ok and a timestamp', () => {
    const result = getHealth();
    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).getTime()).not.toBeNaN();
  });
});
