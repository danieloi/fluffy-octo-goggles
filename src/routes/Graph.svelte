<script lang="ts">
  import * as d3 from "d3";
  import type { Node, Edge, D3Node } from "$lib/mockBackend";

  let {
    data,
    onNodeClick,
  }: {
    data: { nodes: D3Node[]; edges: Edge[] };
    onNodeClick?: (node: D3Node) => void;
  } = $props();

  let width = $state(800);
  let height = $state(600);
  let svg = $state<d3.Selection<
    SVGSVGElement,
    unknown,
    null,
    undefined
  > | null>(null);

  let container: HTMLDivElement;

  $effect(() => {
    svg = d3.select(container).append("svg");
    updateGraph();
  });

  $effect(() => {
    updateGraph();
  });

  function updateGraph() {
    if (!svg) return;

    svg.attr("width", width).attr("height", height);

    const simulation = d3
      .forceSimulation(data.nodes.map((node) => ({ ...node, x: 0, y: 0 })))
      .force(
        "link",
        d3
          .forceLink(
            data.edges.map((edge) => ({
              ...edge,
              source: edge.from,
              target: edge.to,
            }))
          )
          .id((d: any) => d.node_name)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .selectAll(".link")
      .data(data.edges)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    const node = svg
      .selectAll(".node")
      .data(data.nodes)
      .join("g")
      .attr("class", "node")
      .call(
        d3
          .drag<any, any>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d: Node) => getColorByType(d.node_type));

    node
      .append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text((d: Node) => d.node_name);

    node.on("click", (event: MouseEvent, d: D3Node) => {
      onNodeClick?.(d);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }

  function getColorByType(type: string): string {
    const colors: { [key: string]: string } = {
      TYPE_1: "#ff7f0e",
      TYPE_2: "#2ca02c",
      TYPE_3: "#d62728",
      TYPE_4: "#9467bd",
    };
    return colors[type] || "#1f77b4";
  }
</script>

<div bind:this={container} class="w-full h-full"></div>

<style>
  :global(.node text) {
    font-size: 12px;
  }
  :global(.node:hover) {
    cursor: pointer;
  }
</style>
