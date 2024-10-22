<script lang="ts">
  import mermaid from "mermaid";
  import type { Node, Edge } from "$lib/mockBackend";
  import { generateMermaidGraph } from "$lib/mockBackend";

  let {
    data,
    onNodeSelect,
  }: {
    data: { nodes: Node[]; edges: Edge[] };
    onNodeSelect: (node: Node | null) => void;
  } = $props();

  let graphDiv: HTMLDivElement;
  let graphRendered = $state(false);
  let mermaidGraph = $state("");

  $effect(() => {
    graphRendered = false;
    if (data) {
      mermaidGraph = generateMermaidGraph(data.edges);
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

      graphDiv.querySelectorAll(".node rect").forEach((rect) => {
        rect.addEventListener("click", (event) => {
          const nodeElement = (event.target as SVGElement).closest(".node");
          if (nodeElement) {
            const nodeId = nodeElement.id;
            console.log({ nodeId });
            // Extract the actual node name from the Mermaid-generated ID
            const nodeName = nodeId.split("-")[1];
            if (nodeName) {
              onNodeSelect(
                data.nodes.find((n) => n.node_name === nodeName) || null
              );
            }
          }
        });
      });
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
