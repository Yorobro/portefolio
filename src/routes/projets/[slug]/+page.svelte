<script lang="ts">
  import Button from '$components/Button.svelte';
  import Tag from '$components/Tag.svelte';
  let { data } = $props();
  const p = $derived(data.project);
</script>

<svelte:head>
  <title>{p.title} — Yohan Finelle</title>
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
    <section class="media">
      {#each p.media as m (m.src)}
        {#if m.type === 'image' || m.type === 'gif'}
          <figure>
            <img src={m.src} alt={m.alt} loading="lazy" />
            {#if m.caption}<figcaption>{m.caption}</figcaption>{/if}
          </figure>
        {/if}
      {/each}
    </section>
  {/if}
</article>

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
    gap: var(--space-4);
  }
  figure {
    margin: 0;
  }
  figcaption {
    color: var(--color-text-muted);
    font-size: var(--font-size-small);
    margin-top: var(--space-2);
  }
</style>
