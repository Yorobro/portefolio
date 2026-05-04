import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';

export class InvalidMediaAssetError extends DomainError {
  readonly code = 'INVALID_MEDIA_ASSET' as const;
}

export type MediaType = 'image' | 'gif' | 'video';

interface MediaAssetProps {
  type: MediaType;
  src: string;
  alt: string;
  caption?: string | undefined;
}

export class MediaAsset {
  private constructor(public readonly props: Readonly<MediaAssetProps>) {}

  static create(props: MediaAssetProps): Result<MediaAsset, InvalidMediaAssetError> {
    if (props.src.trim().length === 0) {
      return Result.err(new InvalidMediaAssetError('src must not be empty'));
    }
    if (props.type === 'image' && props.alt.trim().length === 0) {
      return Result.err(new InvalidMediaAssetError('alt is required for images (a11y)'));
    }
    return Result.ok(new MediaAsset(Object.freeze({ ...props })));
  }
}
