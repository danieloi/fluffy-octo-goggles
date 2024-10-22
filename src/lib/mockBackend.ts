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
  const queue: { name: string; currentDepth: number }[] = [
    { name: nodeName, currentDepth: 0 },
  ];
  const visited = new Set<string>();

  // Pre-compute a map of incoming edges for faster lookup
  const incomingEdgesMap = new Map<string, Edge[]>();
  for (const edge of edges) {
    if (!incomingEdgesMap.has(edge.to)) {
      incomingEdgesMap.set(edge.to, []);
    }
    incomingEdgesMap.get(edge.to)!.push(edge);
  }

  while (queue.length > 0) {
    const { name, currentDepth } = queue.shift()!;
    if (visited.has(name) || currentDepth >= depth) continue;
    visited.add(name);

    const node = getNodeByName(name);
    if (node) result.nodes.push(node);

    // Use the pre-computed map for faster edge lookup
    const incomingEdges = incomingEdgesMap.get(name) || [];
    result.edges.push(...incomingEdges);

    if (currentDepth + 1 < depth) {
      for (const edge of incomingEdges) {
        queue.push({ name: edge.from, currentDepth: currentDepth + 1 });
      }
    }
  }

  // Handle the special case for depth 0
  if (depth === 0) {
    result.nodes = [getNodeByName(nodeName)!];
    result.edges = [];
  }

  return result;
}

export function generateMermaidGraph(nodes: Node[], edges: Edge[]): string {
  let mermaidCode = "graph LR\n";

  if (edges.length === 0) {
    nodes.forEach((node) => {
      mermaidCode += `    ${node.node_name}[${node.node_name}]\n`;
    });
  } else {
    edges.forEach((edge) => {
      mermaidCode += `    ${edge.from}[${edge.from}] --> ${edge.to}[${edge.to}]\n`;
    });
  }

  return mermaidCode;
}
