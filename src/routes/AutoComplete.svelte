<script lang="ts">
  import type { Node } from "$lib/mockBackend";

  let searchTerm = $state("");
  let filteredNodes = $state<Node[]>([]);
  let isNodeSelected = $state(false);

  const {
    nodes,
    onNodeSelect,
    selectedNode,
    onClear,
  }: {
    nodes: Node[];
    onNodeSelect: (node: Node | null) => void;
    selectedNode: Node | null;
    onClear: () => void;
  } = $props();

  $effect(() => {
    filteredNodes = nodes.filter((node) =>
      node.node_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  $effect(() => {
    if (selectedNode) {
      searchTerm = selectedNode.node_name;
      isNodeSelected = true;
    }
  });

  function handleSelect(node: Node) {
    searchTerm = node.node_name;
    isNodeSelected = true;
    onNodeSelect(node);
  }

  function handleInput() {
    isNodeSelected = false;
  }
</script>

<div class="relative">
  <div class="flex">
    <input
      type="text"
      bind:value={searchTerm}
      oninput={handleInput}
      placeholder="Search nodes..."
      class="w-full px-4 py-2 border rounded-l"
    />
    <button
      class="px-4 py-2 bg-gray-200 rounded-r"
      onclick={() => {
        searchTerm = "";
        isNodeSelected = false;
        onNodeSelect(null);
        onClear();
      }}
    >
      Clear
    </button>
  </div>
  {#if searchTerm && filteredNodes.length > 0 && !isNodeSelected}
    <ul class="absolute z-10 w-full bg-white border rounded mt-1">
      {#each filteredNodes as node}
        <button
          class="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onclick={() => handleSelect(node)}
        >
          {node.node_name}
        </button>
      {/each}
    </ul>
  {/if}
</div>
