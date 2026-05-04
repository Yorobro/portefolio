import type { ContactMessage } from '$domain/entities/ContactMessage';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ContactMessageRepository {
  save(message: ContactMessage): Promise<Result<void, DomainError>>;
  countRecentByIpHash(ipHash: string, since: Date): Promise<Result<number, DomainError>>;
  markEmailSent(id: string): Promise<Result<void, DomainError>>;
}
