<script lang="ts">
  import type { SkillViewModel } from '$presentation/view-models/SkillViewModel';

  let { skills }: { skills: readonly SkillViewModel[] } = $props();

  // Pair each soft skill with a one-line gloss so the section reads like
  // an actual story, not a list of tags. Lookup is keyed on the skill name
  // (must match content/skills/skills.md exactly).
  const descriptions: Readonly<Record<string, string>> = {
    Curiosité: "M'investir dans les sujets que je touche, comprendre comment les choses marchent.",
    Adaptabilité: "M'aligner sur une nouvelle stack ou un nouveau contexte rapidement.",
    Autonomie: "Avancer sur un sujet de bout en bout sans avoir besoin d'être encadré.",
    'Esprit critique': 'Questionner les choix techniques et défendre mes positions.',
  };
</script>

<ul class="grid">
  {#each skills as s (s.name)}
    <li class="card">
      <h3>{s.name}</h3>
      {#if descriptions[s.name]}
        <p>{descriptions[s.name]}</p>
      {/if}
    </li>
  {/each}
</ul>

<style>
  .grid {
    list-style: none;
    padding: 0;
    margin: var(--space-6) 0 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: var(--space-4);
  }
  .card {
    padding: var(--space-4);
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-lg);
    display: grid;
    gap: var(--space-2);
    transition: border-color 120ms ease;
  }
  .card:hover {
    border-color: var(--color-accent);
  }
  h3 {
    font-size: var(--font-size-h2);
    color: var(--color-accent);
  }
  p {
    color: var(--color-text-secondary);
    margin: 0;
  }
</style>
