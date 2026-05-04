<script lang="ts">
  import { onMount } from 'svelte';

  type Props = {
    src: string;
    alt: string;
    caption?: string | null;
    onClose: () => void;
  };

  let { src, alt, caption = null, onClose }: Props = $props();

  let dialogEl: HTMLDivElement | undefined = $state();
  let closeBtn: HTMLButtonElement | undefined = $state();

  // Trap focus and lock the page scroll while the lightbox is open.
  onMount(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  });

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === 'Tab' && dialogEl) {
      // Keep focus inside the dialog (only one focusable element here, so just refocus it).
      const focusables = dialogEl.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function handleBackdropClick(event: MouseEvent): void {
    // Close only when clicking the backdrop itself, not the inner figure.
    if (event.target === event.currentTarget) onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  bind:this={dialogEl}
  class="backdrop"
  role="dialog"
  aria-modal="true"
  aria-label={alt}
  onclick={handleBackdropClick}
  onkeydown={handleKeydown}
  tabindex="-1"
>
  <button
    bind:this={closeBtn}
    type="button"
    class="close"
    aria-label="Fermer l'aperçu"
    onclick={onClose}
  >
    <svg
      class="close-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  </button>

  <figure class="figure">
    <img {src} {alt} />
    {#if caption}<figcaption>{caption}</figcaption>{/if}
  </figure>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(10, 14, 10, 0.92);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: grid;
    grid-template-rows: auto 1fr;
    padding: var(--space-4);
    cursor: zoom-out;
  }
  .close {
    place-self: end;
    width: 2.75rem;
    height: 2.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    border-radius: 50%;
    background: var(--color-bg-elevated);
    color: var(--color-text);
    cursor: pointer;
    transition:
      border-color 120ms ease,
      transform 120ms ease;
  }
  .close:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: scale(1.05);
  }
  .figure {
    margin: 0;
    display: grid;
    place-items: center;
    gap: var(--space-3);
    overflow: auto;
    cursor: default;
  }
  .figure img {
    max-width: min(100%, 90vw);
    max-height: 80vh;
    height: auto;
    width: auto;
    object-fit: contain;
    border-radius: var(--radius-lg);
    box-shadow: 0 0 0 1px var(--color-border);
  }
  figcaption {
    color: var(--color-text-secondary);
    font-size: var(--font-size-body);
    text-align: center;
    max-width: 60ch;
  }
</style>
