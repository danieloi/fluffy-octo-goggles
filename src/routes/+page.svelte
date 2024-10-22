<script lang="ts">
  import {
    getNodes,
    getEdges,
    getUpstreamDependencies,
  } from "$lib/mockBackend";
  import type { Node, Edge } from "$lib/mockBackend";
  import AutoComplete from "./AutoComplete.svelte";
  import Graph from "./Graph.svelte";
  import NodeDetails from "./NodeDetails.svelte";

  let nodes = $state(getNodes());
  let edges = $state(getEdges());
  let selectedNode = $state<Node | null>(null);
  let graphData = $state<{ nodes: Node[]; edges: Edge[] }>({
    nodes: nodes,
    edges: edges,
  });
  let depth = $state(Infinity);

  $effect(() => {
    if (selectedNode) {
      $inspect(selectedNode);
      const data = getUpstreamDependencies(selectedNode.node_name, depth);
      graphData = {
        nodes: data.nodes,
        edges: data.edges,
      };
      $inspect(graphData);
    } else {
      graphData = {
        nodes: nodes,
        edges: edges,
      };
    }
  });

  function handleNodeSelect(node: Node | null) {
    selectedNode = node;
  }

  function handleDepthChange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    depth = isNaN(value) ? Infinity : value;
  }

  function clearDepth() {
    depth = Infinity;
  }
</script>

<main class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">DAG Visualizer</h1>

  <div class="mb-4">
    <AutoComplete
      {nodes}
      onNodeSelect={handleNodeSelect}
      {selectedNode}
      onClear={clearDepth}
    />
  </div>

  <div class="mb-4">
    <label for="depth" class="mr-2">Depth limit:</label>
    <input
      type="number"
      id="depth"
      min="1"
      value={depth === Infinity ? "" : depth}
      oninput={handleDepthChange}
      class="border rounded px-2 py-1"
    />
  </div>

  <div class="flex">
    <div class="w-3/4 pr-4">
      <Graph data={graphData} onNodeSelect={handleNodeSelect} />
    </div>
    <div class="w-1/4">
      <NodeDetails node={selectedNode} />
    </div>
  </div>
</main>
