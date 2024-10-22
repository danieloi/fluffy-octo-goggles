export interface Node {
  node_name: string;
  node_type: "TYPE_1" | "TYPE_2" | "TYPE_3" | "TYPE_4";
  tags: string[];
}

export interface Edge {
  from: string;
  to: string;
}

const nodes: Node[] = [
  { node_name: "A", node_type: "TYPE_1", tags: ["tag1", "tag2"] },
  { node_name: "B", node_type: "TYPE_2", tags: ["tag2", "tag3"] },
  { node_name: "C", node_type: "TYPE_3", tags: ["tag1", "tag3"] },
  { node_name: "D", node_type: "TYPE_4", tags: ["tag4"] },
  { node_name: "E", node_type: "TYPE_1", tags: ["tag2", "tag4"] },
  { node_name: "F", node_type: "TYPE_2", tags: ["tag1"] },
  { node_name: "G", node_type: "TYPE_3", tags: ["tag3"] },
  { node_name: "H", node_type: "TYPE_4", tags: ["tag2", "tag4"] },
  { node_name: "I", node_type: "TYPE_1", tags: ["tag1", "tag3"] },
];

const edges: Edge[] = [
  { from: "A", to: "B" },
  { from: "C", to: "B" },
  { from: "B", to: "E" },
  { from: "B", to: "F" },
  { from: "D", to: "E" },
  { from: "D", to: "F" },
  { from: "E", to: "H" },
  { from: "G", to: "H" },
  { from: "H", to: "I" },
];

export function getNodes(): Node[] {
  return nodes;
}

export function getEdges(): Edge[] {
  return edges;
}

export function getNodeByName(name: string): Node | undefined {
  return nodes.find((node) => node.node_name === name);
}

export function getUpstreamDependencies(
  nodeName: string,
  depth: number = Infinity
): { nodes: Node[]; edges: Edge[] } {
  const result: { nodes: Node[]; edges: Edge[] } = { nodes: [], edges: [] };
  const queue: { name: string; depth: number }[] = [{ name: nodeName, depth }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { name, depth } = queue.shift()!;
    if (visited.has(name) || depth < 0) continue;
    visited.add(name);

    const node = getNodeByName(name);
    if (node) result.nodes.push(node);

    const incomingEdges = edges.filter((edge) => edge.to === name);
    result.edges.push(...incomingEdges);

    for (const edge of incomingEdges) {
      queue.push({ name: edge.from, depth: depth - 1 });
    }
  }

  return result;
}

export function generateMermaidGraph(nodes: Node[], edges: Edge[]): string {
  let mermaidCode = "graph LR\n";
  edges.forEach((edge) => {
    mermaidCode += `    ${edge.from} --> ${edge.to}\n`;
  });
  return mermaidCode;
}
