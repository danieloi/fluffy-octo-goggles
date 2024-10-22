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

  $effect(() => {
    // if (graphDiv) {
    renderGraph();
    // }
  });

  async function renderGraph() {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "neutral",
      flowchart: {
        curve: "basis",
        nodeSpacing: 50,
        rankSpacing: 50,
        padding: 15,
      },
    });
    const mermaidGraph = generateMermaidGraph(data.nodes, data.edges);
    const { svg } = await mermaid.render("graphDiv", mermaidGraph);
    graphDiv.innerHTML = svg;
  }
</script>

<div bind:this={graphDiv} class="w-full h-full overflow-auto"></div>

<style>
  :global(.node:hover) {
    cursor: pointer;
  }
</style>
