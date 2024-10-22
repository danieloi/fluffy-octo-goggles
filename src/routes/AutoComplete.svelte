<script lang="ts">
  import type { Node } from "$lib/mockBackend";

  let searchTerm = $state("");
  let filteredNodes = $state<Node[]>([]);

  const { nodes, onSelect }: { nodes: Node[]; onSelect: (node: Node) => void } =
    $props();

  $effect(() => {
    filteredNodes = nodes.filter((node) =>
      node.node_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  function handleSelect(node: Node) {
    searchTerm = node.node_name;
    onSelect(node);
  }
</script>

<div class="relative">
  <input
    type="text"
    bind:value={searchTerm}
    placeholder="Search nodes..."
    class="w-full px-4 py-2 border rounded"
  />
  {#if searchTerm && filteredNodes.length > 0}
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
