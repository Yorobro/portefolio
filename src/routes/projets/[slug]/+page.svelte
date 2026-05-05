<script lang="ts">
  import Button from '$components/Button.svelte';
  import Tag from '$components/Tag.svelte';
  import Lightbox from '$components/Lightbox.svelte';
  import type { ProjectMediaViewModel } from '$presentation/view-models/ProjectDetailViewModel';
  let { data } = $props();
  const p = $derived(data.project);

  let activeMedia: ProjectMediaViewModel | undefined = $state();
  function openMedia(m: ProjectMediaViewModel): void {
    activeMedia = m;
  }
  function closeMedia(): void {
    activeMedia = undefined;
  }
</script>

<svelte:head>
  <title>{p.title} - Yohan Finelle</title>
  <meta name="description" content={p.summary} />
</svelte:head>

<article>
  <header>
    <span class="caption">{p.type}</span>
    <h1>{p.title}</h1>
    <p class="subtitle">{p.summary}</p>
    <ul class="stack">
      {#each p.stack as t (t)}
        <li><Tag>{t}</Tag></li>
      {/each}
    </ul>
    <div class="ctas">
      {#if p.repoUrl}<Button href={p.repoUrl}>Voir le code</Button>{/if}
      {#if p.liveUrl}<Button href={p.liveUrl} variant="secondary">Site en ligne</Button>{/if}
    </div>
  </header>

  <section class="description">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- Trusted: HTML rendered server-side from author-owned markdown via remark. -->
    {@html p.descriptionHtml}
  </section>

  {#if p.architectureHtml}
    <section>
      <h2>Architecture</h2>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- Trusted: HTML rendered server-side from author-owned markdown via remark. -->
      {@html p.architectureHtml}
    </section>
  {/if}

  {#if p.highlights.length > 0}
    <section>
      <h2>Points clés</h2>
      <ul>
        {#each p.highlights as h (h)}
          <li>{h}</li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if p.media.length > 0}
    <section>
      <h2>Aperçu</h2>
      <div class="media">
        {#each p.media as m (m.src)}
          {#if m.type === 'image' || m.type === 'gif'}
            <figure>
              <button
                type="button"
                class="frame"
                aria-label={`Agrandir : ${m.alt}`}
                onclick={() => openMedia(m)}
              >
                <img src={m.src} alt={m.alt} loading="lazy" />
              </button>
              {#if m.caption}<figcaption>{m.caption}</figcaption>{/if}
            </figure>
          {/if}
        {/each}
      </div>
    </section>
  {/if}
</article>

{#if activeMedia}
  <Lightbox
    src={activeMedia.src}
    alt={activeMedia.alt}
    caption={activeMedia.caption}
    onClose={closeMedia}
  />
{/if}

<style>
  article {
    display: grid;
    gap: var(--space-12);
  }
  h1 {
    font-size: var(--font-size-hero);
  }
  .ctas {
    display: flex;
    gap: var(--space-3);
    margin-top: var(--space-3);
  }
  .stack {
    list-style: none;
    padding: 0;
    margin: var(--space-3) 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
  .description :global(p) {
    color: var(--color-text-secondary);
  }
  .media {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
    margin-top: var(--space-4);
  }
  @media (min-width: 48rem) {
    .media {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  figure {
    margin: 0;
    display: grid;
    gap: var(--space-2);
  }
  /* Frame the image: rounded border, subtle background, clickable to open lightbox.
     Let the image dictate its own aspect ratio so we don't crop UI screenshots. */
  .frame {
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-lg);
    overflow: hidden;
    padding: 0;
    cursor: zoom-in;
    transition:
      border-color 120ms ease,
      transform 120ms ease;
  }
  .frame:hover,
  .frame:focus-visible {
    border-color: var(--color-accent);
    transform: translateY(-2px);
  }
  .frame img {
    width: 100%;
    height: auto;
    display: block;
  }
  figcaption {
    color: var(--color-text-muted);
    font-size: var(--font-size-small);
    text-align: center;
  }
</style>
