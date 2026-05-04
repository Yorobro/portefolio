<script lang="ts">
  import ProjectCard from '$components/ProjectCard.svelte';
  import type { ProjectListItemViewModel } from '$presentation/view-models/ProjectListItemViewModel';
  let { data } = $props();

  type ProjectType = ProjectListItemViewModel['type'];

  // Display order + French labels for each category. `professional` excluded:
  // pro experiences live on /parcours.
  const categories: ReadonlyArray<{ type: ProjectType; label: string; description: string }> = [
    {
      type: 'personal',
      label: 'Projets personnels',
      description: 'Réalisations sur mon temps libre, exploratoires ou aboutis.',
    },
    {
      type: 'academic',
      label: 'Projets universitaires',
      description: 'Travaux d’équipe réalisés dans le cadre du BUT Informatique.',
    },
    {
      type: 'competitive',
      label: 'Projets compétitifs',
      description: 'Hackathons et concours, livrés sous contrainte de temps.',
    },
  ];

  const grouped = $derived(
    categories.map((cat) => ({
      ...cat,
      projects: data.projects.filter((p) => p.type === cat.type),
    })),
  );
</script>

<svelte:head><title>Projets — Yohan Finelle</title></svelte:head>

<h1>Projets</h1>
<p class="subtitle">
  Une sélection de mes projets, regroupés par catégorie : personnels, universitaires et compétitifs.
</p>

{#each grouped as group (group.type)}
  {#if group.projects.length > 0}
    <section class="category">
      <header>
        <h2>{group.label}</h2>
        <p class="subtitle">{group.description}</p>
      </header>
      <div class="grid">
        {#each group.projects as p (p.slug)}
          <ProjectCard project={p} />
        {/each}
      </div>
    </section>
  {/if}
{/each}

<style>
  .category {
    margin-top: var(--space-12);
  }
  .category header {
    margin-bottom: var(--space-4);
  }
  .grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  }
</style>
