<script lang="ts">
  import Tag from '$components/Tag.svelte';
  import type { SkillViewModel } from '$presentation/view-models/SkillViewModel';
  let { data } = $props();

  type SkillCategory = SkillViewModel['category'];

  // Display order + French labels for each technical skill category.
  // Soft skills are surfaced on the home page instead, not here.
  const categories: ReadonlyArray<{ key: SkillCategory; label: string; description: string }> = [
    {
      key: 'language',
      label: 'Langages',
      description: "Les langages que j'utilise en projet ou en cours.",
    },
    {
      key: 'framework',
      label: 'Frameworks',
      description: 'Les frameworks et bibliothèques avec lesquels je travaille.',
    },
    {
      key: 'database',
      label: 'Bases de données',
      description: 'SGBD relationnels et orientés graphes.',
    },
    {
      key: 'devops',
      label: 'DevOps',
      description: 'Versionnage et chaînes CI/CD.',
    },
    {
      key: 'deployment',
      label: 'Déploiement',
      description: 'Conteneurisation et migrations applicatives.',
    },
    {
      key: 'design',
      label: 'Conception et design',
      description: 'Outils de modélisation et de maquettage.',
    },
  ];

  const grouped = $derived(
    categories.map((cat) => ({
      ...cat,
      skills: data.skills.filter((s) => s.category === cat.key),
    })),
  );
</script>

<svelte:head>
  <title>Compétences - Yohan Finelle</title>
  <meta
    name="description"
    content="Mes compétences : langages, frameworks, bases de données, DevOps, déploiement et conception."
  />
</svelte:head>

<header class="page-header">
  <h1>Compétences</h1>
  <p class="subtitle">Mes compétences techniques, regroupées par domaine.</p>
</header>

<div class="categories">
  {#each grouped as group (group.key)}
    {#if group.skills.length > 0}
      <section class="category">
        <header class="category-header">
          <h2>{group.label}</h2>
          <p class="subtitle">{group.description}</p>
        </header>
        <ul class="tags">
          {#each group.skills as s (s.name)}
            <li><Tag>{s.name}</Tag></li>
          {/each}
        </ul>
      </section>
    {/if}
  {/each}
</div>

<style>
  .page-header {
    margin-bottom: var(--space-12);
  }

  .categories {
    display: grid;
    gap: var(--space-8);
    grid-template-columns: 1fr;
  }

  /* Side-by-side layout once there's enough room */
  @media (min-width: 60rem) {
    .categories {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 90rem) {
    .categories {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .category-header {
    margin-bottom: var(--space-4);
  }

  .tags {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
</style>
