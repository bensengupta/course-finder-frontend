import * as d3 from "d3";
import "./tree.css";

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

  const tree = d3.tree<TreeNode>().size([height, width]);

  const hierarchy = d3.hierarchy(treeData);
  tree(hierarchy);
  const root = hierarchy as d3.HierarchyPointNode<TreeNode>;

  const svg = d3
    .create("svg")
    .attr("viewBox", [
      0,
      0,
      width + margin.left + margin.right,
      height + margin.top + margin.bottom,
    ])
    .attr("class", "tree");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const link = d3
    .linkHorizontal<
      d3.HierarchyPointLink<TreeNode>,
      d3.HierarchyPointNode<TreeNode>
    >()
    .x((d) => d.y)
    .y((d) => d.x);

  // Draw links between nodes
  const links = g
    .selectAll(".link")
    .data(root.links())
    .join("path")
    .attr("class", "link")
    .attr("d", link);

  // Draw nodes
  const node = g
    .selectAll<SVGGElement, d3.HierarchyPointNode<TreeNode>>(".node")
    .data(root.descendants())
    .join("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.y}, ${d.x})`);

  const rectWidth = 100;
  const rectHeight = 35;
  node
    .append("rect")
    .attr("x", -rectWidth / 2)
    .attr("y", -rectHeight / 2)
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .attr("fill", "lightblue");

  // Add text labels
  node
    .append("text")
    .attr("dy", ".35em")
    .attr("dx", "-3em")
    .text((d) => d.data.name);

  const zoom = d3
    .zoom<SVGSVGElement, undefined>()
    .extent([
      [0, 0],
      [width, height],
    ])
    .scaleExtent([0.5, 3])
    .on("zoom", zoomed);

  function zoomed({ transform }: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
    node.attr(
      "transform",
      (d) => `translate(${transform.apply([d.y, d.x]).toString()})`,
    );
    links.attr("transform", transform.toString());
  }

  return svg.call(zoom).node();
}
