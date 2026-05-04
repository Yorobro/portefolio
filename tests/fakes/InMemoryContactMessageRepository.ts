import type { ContactMessageRepository } from '$application/ports/ContactMessageRepository';
import type { ContactMessage } from '$domain/entities/ContactMessage';
import { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export class InMemoryContactMessageRepository implements ContactMessageRepository {
  public saved: ContactMessage[] = [];
  public emailSent: Set<string> = new Set();
  public recentCounts: Map<string, number> = new Map();

  async save(message: ContactMessage): Promise<Result<void, DomainError>> {
    this.saved.push(message);
    return Result.ok<void, DomainError>(undefined);
  }

  async countRecentByIpHash(ipHash: string, _since: Date): Promise<Result<number, DomainError>> {
    return Result.ok<number, DomainError>(this.recentCounts.get(ipHash) ?? 0);
  }

  async markEmailSent(id: string): Promise<Result<void, DomainError>> {
    this.emailSent.add(id);
    return Result.ok<void, DomainError>(undefined);
  }
}
