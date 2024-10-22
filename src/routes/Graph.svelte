<script lang="ts">
  import mermaid from "mermaid";
  import type { Node, Edge } from "$lib/mockBackend";
  import { generateMermaidGraph } from "$lib/mockBackend";

  let {
    data,
  }: {
    data: { nodes: Node[]; edges: Edge[] };
  } = $props();

  let graphDiv: HTMLDivElement;
  let graphRendered = $state(false);
  let mermaidGraph = $state("");

  $effect(() => {
    graphRendered = false;
    if (data) {
      mermaidGraph = generateMermaidGraph(data.nodes, data.edges);
    }
  });

  $effect(() => {
    if (graphDiv && mermaidGraph && !graphRendered) {
      renderGraph();
    }
  });

  async function renderGraph() {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "neutral",
      flowchart: {
        curve: "basis",
        nodeSpacing: 50,
        rankSpacing: 50,
        padding: 15,
      },
    });

    try {
      const { svg } = await mermaid.render("graphDiv", mermaidGraph);
      graphDiv.innerHTML = svg;
      graphRendered = true;
    } catch (error) {
      console.error("Error rendering graph:", error);
    }
  }
</script>

{#if !graphRendered}
  <div>Loading graph...</div>
{/if}

<div
  bind:this={graphDiv}
  class="w-full h-full overflow-auto"
  style:display={graphRendered ? "block" : "none"}
></div>

<style>
  :global(.node:hover) {
    cursor: pointer;
  }
</style>
