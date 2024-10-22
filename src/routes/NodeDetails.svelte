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
      <ul class="list-disc list-inside">
        {#each node.tags as tag}
          <li>{tag}</li>
        {/each}
      </ul>
    </div>
  </div>
{:else}
  <p class="text-gray-500">Select a node to view details</p>
{/if}
