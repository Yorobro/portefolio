<script lang="ts">
  import Timeline from '$components/Timeline.svelte';
  import TimelineItem from '$components/TimelineItem.svelte';
  import Tag from '$components/Tag.svelte';
  import type { SkillViewModel } from '$presentation/view-models/SkillViewModel';
  let { data } = $props();

  const formatRange = (start: string, end: string | null): string => {
    const fmt = (iso: string) =>
      new Date(iso).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    return `${fmt(start)} — ${end ? fmt(end) : 'présent'}`;
  };

  // Group skills by category
  const groups = $derived(
    data.skills.reduce<Record<string, SkillViewModel[]>>((acc, s) => {
      (acc[s.category] ??= []).push(s);
      return acc;
    }, {}),
  );
</script>

<svelte:head><title>Parcours — Yohan Finelle</title></svelte:head>

<h1>Parcours</h1>

<section>
  <h2>Expériences</h2>
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

<section>
  <h2>Compétences</h2>
  {#each Object.entries(groups) as [category, skills] (category)}
    <div class="group">
      <span class="caption">{category}</span>
      <ul class="tags">
        {#each skills as s (s.name)}
          <li><Tag>{s.name}</Tag></li>
        {/each}
      </ul>
    </div>
  {/each}
</section>

<style>
  section {
    margin-top: var(--space-12);
  }
  .group {
    margin: var(--space-4) 0;
  }
  .tags {
    list-style: none;
    padding: 0;
    margin: var(--space-2) 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
</style>
