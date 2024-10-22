<script lang="ts">
  import type { Node } from "$lib/mockBackend";

  let { node }: { node: Node | null } = $props();
</script>

{#if node}
  <div class="bg-white shadow rounded p-4">
    <h2 class="text-xl font-bold mb-2">{node.node_name}</h2>
    <p class="mb-2"><strong>Type:</strong> {node.node_type}</p>
    <div>
      <strong>Tags:</strong>
      <div class="mt-2 flex flex-wrap gap-2">
        {#each node.tags as tag}
          <span
            class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded"
            >{tag}</span
          >
        {/each}
      </div>
    </div>
  </div>
{:else}
  <p class="text-gray-500">Select a node to view details</p>
{/if}
