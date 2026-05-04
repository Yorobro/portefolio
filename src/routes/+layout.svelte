<script lang="ts">
  import '@fontsource-variable/inter/index.css';
  import '@fontsource/jetbrains-mono/index.css';
  import '$styles/reset.css';
  import '$styles/tokens.css';
  import '$styles/typography.css';
  let { children } = $props();
</script>

{@render children()}
