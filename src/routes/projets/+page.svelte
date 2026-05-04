<script lang="ts">
  import ProjectCard from '$components/ProjectCard.svelte';
  let { data } = $props();
</script>

<svelte:head><title>Projets — Yohan Finelle</title></svelte:head>

<h1>Projets</h1>
<p class="subtitle">Une sélection de mes projets personnels, universitaires, et professionnels.</p>

<div class="grid">
  {#each data.projects as p (p.slug)}
    <ProjectCard project={p} />
  {/each}
</div>

<style>
  .grid {
    display: grid;
    gap: var(--space-4);
    margin-top: var(--space-8);
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  }
</style>
