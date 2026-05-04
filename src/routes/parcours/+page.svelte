<script lang="ts">
  import Timeline from '$components/Timeline.svelte';
  import TimelineItem from '$components/TimelineItem.svelte';
  let { data } = $props();

  const formatRange = (start: string, end: string | null): string => {
    const fmt = (iso: string) =>
      new Date(iso).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    return `${fmt(start)} — ${end ? fmt(end) : 'présent'}`;
  };
</script>

<svelte:head>
  <title>Parcours — Yohan Finelle</title>
  <meta
    name="description"
    content="Parcours professionnel de Yohan Finelle : alternances et stages dans le développement logiciel."
  />
</svelte:head>

<header class="page-header">
  <h1>Parcours</h1>
  <p class="subtitle">Mes expériences professionnelles, du plus récent au plus ancien.</p>
</header>

<section>
  <Timeline>
    {#each data.experiences as e (e.company + e.dateStartIso)}
      <TimelineItem
        title={e.role}
        subtitle={`${e.company} · ${e.location}`}
        dateLabel={formatRange(e.dateStartIso, e.dateEndIso)}
      >
        <p>{e.summary}</p>
        {#if e.highlights.length > 0}
          <ul>
            {#each e.highlights as h (h)}<li>{h}</li>{/each}
          </ul>
        {/if}
      </TimelineItem>
    {/each}
  </Timeline>
</section>

<style>
  .page-header {
    margin-bottom: var(--space-12);
  }
</style>
