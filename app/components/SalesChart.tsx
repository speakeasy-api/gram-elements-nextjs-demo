"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { MonthlySales } from "../data/sales";

interface SalesChartProps {
  data: MonthlySales[];
}

export function SalesChart({ data }: SalesChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Format month labels
    const formatMonth = (monthStr: string) => {
      const [year, month] = monthStr.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString("en-US", { month: "short" });
    };

    // Scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.revenue) || 0])
      .nice()
      .range([height, 0]);

    // Gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "barGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#facc15");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#eab308");

    // Bars
    g.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.month) || 0)
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "url(#barGradient)")
      .attr("rx", 4)
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr("y", (d) => y(d.revenue))
      .attr("height", (d) => height - y(d.revenue));

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat((d) => formatMonth(d)))
      .selectAll("text")
      .attr("fill", "#6b7280")
      .attr("font-size", "12px");

    // Y axis
    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `$${d3.format(",.0f")(d)}`)
      )
      .selectAll("text")
      .attr("fill", "#6b7280")
      .attr("font-size", "12px");

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => "")
      )
      .selectAll("line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-dasharray", "3,3");

    g.select(".grid").select(".domain").remove();

    // Value labels on bars
    g.selectAll(".label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => (x(d.month) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.revenue) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#374151")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("opacity", 0)
      .text((d) => `$${d3.format(",.0f")(d.revenue)}`)
      .transition()
      .duration(800)
      .delay((_, i) => i * 100 + 400)
      .attr("opacity", 1);
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
      <svg ref={svgRef} className="w-full" height={300} />
    </div>
  );
}
