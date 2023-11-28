import * as d3 from "d3";
import { onMount } from "solid-js";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

// Sample hierarchical data
const treeData: TreeNode = {
  name: "Root",
  children: [
    {
      name: "Node 1",
      children: [{ name: "Leaf 1.1" }, { name: "Leaf 1.2" }],
    },
    {
      name: "Node 2",
      children: [
        {
          name: "Node 2.1",
          children: [{ name: "Leaf 2.1.1" }, { name: "Leaf 2.1.2" }],
        },
        { name: "Leaf 2.2" },
      ],
    },
  ],
};

export function Tree() {
  // Set up the tree layout
  const margin = { top: 20, right: 90, bottom: 30, left: 90 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  let ref: SVGGElement | undefined;

  onMount(() => {
    const tree = d3.tree<TreeNode>().size([height, width]);

    const hierarchy = d3.hierarchy(treeData);
    tree(hierarchy);
    const root = hierarchy as d3.HierarchyPointNode<TreeNode>;

    const svg = d3.select(ref!);

    const link = d3
      .linkHorizontal<
        d3.HierarchyPointLink<TreeNode>,
        d3.HierarchyPointNode<TreeNode>
      >()
      .x((d) => d.y)
      .y((d) => d.x);

    // Draw links between nodes
    svg
      .selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("d", link);

    // Draw nodes
    const node = svg
      .selectAll(".node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Add circles to represent nodes
    node.append("circle").attr("r", 5);

    // Add text labels
    node
      .append("text")
      .attr("dy", ".35em")
      .attr("x", function (d) {
        return d.children ? -13 : 13;
      })
      .style("text-anchor", function (d) {
        return d.children ? "end" : "start";
      })
      .text(function (d) {
        return d.data.name;
      });
  });

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g ref={ref} transform={`translate(${margin.left}, ${margin.top})`} />
    </svg>
  );
}
