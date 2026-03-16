# Canvas draw.io Format Specifications Reference

Complete specifications for generating draw.io XML diagrams.

## Basic Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="Canvas Agent" version="1.0">
  <diagram name="Page-1" id="unique-id">
    <mxGraphModel dx="800" dy="600" grid="1" gridSize="10"
                  guides="1" tooltips="1" connect="1" arrows="1"
                  page="1" pageScale="1" pageWidth="1100" pageHeight="850">
      <root>
        <mxCell id="0"/>                    <!-- Base layer -->
        <mxCell id="1" parent="0"/>         <!-- Drawing layer -->
        <!-- Place nodes and edges here -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Vertex (Node) Syntax

```xml
<mxCell id="node-1" value="Label"
        style="rounded=1;fillColor=#dae8fc;strokeColor=#6c8ebf;whiteSpace=wrap;html=1;"
        vertex="1" parent="1">
  <mxGeometry x="100" y="50" width="120" height="60" as="geometry"/>
</mxCell>
```

## Edge Syntax

```xml
<mxCell id="edge-1" value=""
        style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=classic;"
        edge="1" parent="1" source="node-1" target="node-2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

---

## Style Quick Reference

### Shapes
| Shape | style attribute |
|-------|-----------------|
| Rounded Rectangle | `rounded=1;whiteSpace=wrap;html=1;` |
| Rectangle | `rounded=0;whiteSpace=wrap;html=1;` |
| Ellipse | `ellipse;whiteSpace=wrap;html=1;` |
| Diamond (Decision) | `rhombus;whiteSpace=wrap;html=1;` |
| Cylinder (DB) | `shape=cylinder3;whiteSpace=wrap;html=1;` |
| Parallelogram (I/O) | `shape=parallelogram;whiteSpace=wrap;html=1;` |
| UML Lifeline | `shape=umlLifeline;perimeter=lifelinePerimeter;` |
| UML Class | `swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=26;` |
| UML Actor | `shape=umlActor;` |
| Note | `shape=note;whiteSpace=wrap;html=1;` |

### Color Palette (Recommended)
| Purpose | fillColor | strokeColor |
|---------|-----------|-------------|
| Process | #dae8fc | #6c8ebf |
| Decision | #fff2cc | #d6b656 |
| Start | #d5e8d4 | #82b366 |
| End | #f8cecc | #b85450 |
| Data | #e1d5e7 | #9673a6 |
| External | #f5f5f5 | #666666 |
| Highlight | #ffe6cc | #d79b00 |

### Edge Styles
| Style | style attribute |
|-------|-----------------|
| Orthogonal | `edgeStyle=orthogonalEdgeStyle;` |
| Curved | `curved=1;` |
| Dashed | `dashed=1;` |
| Arrow (classic) | `endArrow=classic;` |
| No Arrow | `endArrow=none;` |
| Inheritance (UML) | `endArrow=block;endFill=0;` |
| Implementation | `endArrow=block;endFill=0;dashed=1;` |
| Aggregation | `endArrow=diamond;endFill=0;` |
| Composition | `endArrow=diamond;endFill=1;` |
| ER One | `startArrow=ERone;` |
| ER Many | `endArrow=ERmany;` |

---

## ID Generation Rules

- Use meaningful prefixes: `node-`, `edge-`, `start-`, `end-`, `proc-`, `cond-`
- Ensure uniqueness within the diagram
- Examples: `node-user`, `edge-login-to-dashboard`, `cond-is-valid`

---

## Layout Algorithms

### Algorithm Selection by Diagram Type

| Diagram Type | Algorithm | Coordinate Calculation Rules |
|--------------|-----------|------------------------------|
| Flowchart | Sugiyama Hierarchical | Layer spacing 100px, node spacing 150px |
| Sequence | Temporal Vertical | Participant spacing 180px, message spacing 50px |
| State | Force-directed approximation | Initial state top, final state bottom |
| Class | Hierarchical + Grouping | Parent class top, child class bottom |
| ER | Hierarchical + Clustering | "One" side on left/top |
| Gantt | Time-axis Horizontal | Row height 30px, day width 20px |
| Mind Map | Radial Tree | 360° equal distribution from center |
| Git Graph | Lane-based | Lane per branch |
| Journey | Horizontal Temporal | Section width 180px |

### Sugiyama Hierarchical Layout Procedure

```
Phase 1: Layer Assignment
- Place nodes with in-degree 0 in layer 0
- Each node is placed in a layer below all its parents
- Insert dummy nodes for long edges

Phase 2: Crossing Minimization (Barycenter Method)
- Process each layer from top to bottom
- Node position = average of adjacent node positions (center of mass)
- 2-3 up-down sweeps for convergence

Phase 3: Coordinate Assignment
- Layer spacing: 100px
- Node spacing: 150px (adjust for crossing avoidance)
- Ensure left/right margins for edges
```

### Coordinate Calculation Rules

```
Grid Snap:
- Snap all coordinates to 10px units (gridSize=10)
- x = round(x / 10) * 10
- y = round(y / 10) * 10

Margin:
- Canvas top margin: 40px
- Canvas left margin: 40px
- Minimum node spacing: 40px

Standard Sizes:
- Standard node: 120x60px
- Decision diamond: 80x80px
- Start/End ellipse: 80x40px

Japanese Character Width:
- Estimate: 1 character ≈ 12px
- Adjust node width accordingly
```

---

## Quality Checklist

```
[ ] XML is well-formed (valid XML)
[ ] All nodes have unique IDs
[ ] No coordinate overlap (no node overlapping)
[ ] Edge source/target reference existing nodes
[ ] Style attributes are semicolon-separated and properly terminated
[ ] Grid snap (10px units) is applied
[ ] Node count ≤ 20 (consider splitting if exceeded)
```
