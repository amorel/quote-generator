import { Container } from '../../src/container';

describe('Container', () => {
  it('should create singleton instance', () => {
    const instance1 = Container.getInstance();
    const instance2 = Container.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should throw error for non-existent service', () => {
    const container = Container.getInstance();
    expect(() => container.get('nonexistent')).toThrow();
  });
});