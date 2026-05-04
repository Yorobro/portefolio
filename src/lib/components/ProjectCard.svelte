<script lang="ts">
  import Tag from './Tag.svelte';
  import type { ProjectListItemViewModel } from '$presentation/view-models/ProjectListItemViewModel';

  let { project }: { project: ProjectListItemViewModel } = $props();

  function statusLabel(status: ProjectListItemViewModel['status']): string {
    switch (status) {
      case 'finished':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      case 'archived':
        return 'Archivé';
    }
  }
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a class="card" href={`/projets/${project.slug}`}>
  <article>
    <header>
      <h3>{project.title}</h3>
      <span class="caption">{statusLabel(project.status)}</span>
    </header>
    <p class="summary">{project.summary}</p>
    <ul class="stack">
      {#each project.stack.slice(0, 4) as tech (tech)}
        <li><Tag>{tech}</Tag></li>
      {/each}
    </ul>
  </article>
</a>

<style>
  .card {
    display: block;
    padding: var(--space-4);
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-lg);
    transition:
      border-color 120ms ease,
      transform 120ms ease;
  }
  .card:hover {
    border-color: var(--color-accent);
    transform: translateY(-2px);
  }
  h3 {
    font-size: var(--font-size-h2);
  }
  .summary {
    color: var(--color-text-secondary);
    margin: var(--space-2) 0 var(--space-4);
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--space-2);
  }
  .stack {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
</style>
