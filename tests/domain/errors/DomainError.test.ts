import { describe, it, expect } from 'vitest';
import { DomainError } from '$domain/errors/DomainError';

class ConcreteError extends DomainError {
  readonly code = 'CONCRETE_ERROR';
}

describe('DomainError', () => {
  it('exposes a code and message', () => {
    const err = new ConcreteError('something happened');
    expect(err.code).toBe('CONCRETE_ERROR');
    expect(err.message).toBe('something happened');
  });

  it('is an instance of Error', () => {
    const err = new ConcreteError('boom');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(DomainError);
  });

  it('preserves the class name in the stack', () => {
    const err = new ConcreteError('boom');
    expect(err.name).toBe('ConcreteError');
  });
});
