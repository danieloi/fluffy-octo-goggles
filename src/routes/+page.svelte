<script lang="ts">
  import { getNodes, getUpstreamDependencies } from "$lib/mockBackend";
  import type { Node, Edge, D3Node } from "$lib/mockBackend";
  import AutoComplete from "./AutoComplete.svelte";
  import Graph from "./Graph.svelte";
  import NodeDetails from "./NodeDetails.svelte";

  const nodes = $state(getNodes());
  let selectedNode = $state<Node | null>(null);
  let graphData = $state<{ nodes: D3Node[]; edges: Edge[] }>({
    nodes: [],
    edges: [],
  });
  let depth = $state(Infinity);

  $effect(() => {
    if (selectedNode) {
      const data = getUpstreamDependencies(selectedNode.node_name, depth);
      graphData = {
        nodes: data.nodes.map((node) => ({
          ...node,
          x: 0,
          y: 0,
          fx: null,
          fy: null,
        })),
        edges: data.edges,
      };
    }
  });

  function handleNodeSelect(node: Node) {
    selectedNode = node;
  }

  function handleDepthChange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    depth = isNaN(value) ? Infinity : value;
  }
</script>

<main class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">DAG Visualizer</h1>

  <div class="mb-4">
    <AutoComplete {nodes} onSelect={(e) => handleNodeSelect(e)} />
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
      <Graph data={graphData} onNodeClick={(e) => handleNodeSelect(e)} />
    </div>
    <div class="w-1/4">
      <NodeDetails node={selectedNode} />
    </div>
  </div>
</main>
