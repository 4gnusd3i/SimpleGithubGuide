const graph = document.getElementById("commit-graph");
const visitorMap = document.getElementById("visitor-map");
const siteDataPromise = loadSiteData();

if (graph) {
  initCommitGraph(graph);
}

if (visitorMap) {
  initVisitorMap(visitorMap);
}

async function loadSiteData() {
  const response = await fetch("data/site-data.json", {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Site data could not be loaded (${response.status}).`);
  }

  return response.json();
}

async function initCommitGraph(graphElement) {
  const nodeLayer = document.getElementById("commit-nodes");
  const tooltip = document.getElementById("commit-tooltip");
  const tooltipAuthor = document.getElementById("tooltip-author");
  const tooltipTime = document.getElementById("tooltip-time");
  const path = document.getElementById("commit-path");

  const inspectorMessage = document.getElementById("inspector-message");
  const inspectorAuthor = document.getElementById("inspector-author");
  const inspectorTime = document.getElementById("inspector-time");
  const inspectorSha = document.getElementById("inspector-sha");

  try {
    const siteData = await siteDataPromise;
    const limit = Number.parseInt(graphElement.dataset.commitLimit || String(siteData.commits.length), 10);
    const commits = siteData.commits.slice(-limit);

    renderCommitGraph(
      commits,
      graphElement,
      nodeLayer,
      tooltip,
      tooltipAuthor,
      tooltipTime,
      path,
      inspectorMessage,
      inspectorAuthor,
      inspectorTime,
      inspectorSha
    );
  } catch (error) {
    showGraphError(
      "Commit history could not be loaded.",
      error instanceof Error ? error.message : "The local site data is unavailable.",
      inspectorMessage,
      inspectorAuthor,
      inspectorTime,
      inspectorSha
    );
  }
}

async function initVisitorMap(visitorElement) {
  const nodeLayer = document.getElementById("visitor-nodes");
  const tooltip = document.getElementById("visitor-tooltip");
  const tooltipName = document.getElementById("visitor-tooltip-name");
  const tooltipStatus = document.getElementById("visitor-tooltip-status");

  const title = document.getElementById("visitor-title");
  const summary = document.getElementById("visitor-summary");
  const count = document.getElementById("visitor-count");
  const brightCount = document.getElementById("visitor-verified-count");
  const quietCount = document.getElementById("visitor-neutral-count");

  try {
    const siteData = await siteDataPromise;
    renderVisitorMap(
      siteData.visitors,
      visitorElement,
      nodeLayer,
      tooltip,
      tooltipName,
      tooltipStatus,
      title,
      summary,
      count,
      brightCount,
      quietCount
    );
  } catch (error) {
    title.textContent = "Visitors could not be loaded.";
    summary.textContent = error instanceof Error ? error.message : "The local site data is unavailable.";
    count.textContent = "-";
    brightCount.textContent = "-";
    quietCount.textContent = "-";
  }
}

function renderCommitGraph(
  commits,
  graphElement,
  nodeLayer,
  tooltip,
  tooltipAuthor,
  tooltipTime,
  path,
  inspectorMessage,
  inspectorAuthor,
  inspectorTime,
  inspectorSha
) {
  nodeLayer.replaceChildren();

  const viewport = { width: 1000, height: 420, padding: 72 };
  const span = viewport.width - viewport.padding * 2;

  const points = commits.map((commit, index) => {
    const progress = commits.length === 1 ? 0.5 : index / (commits.length - 1);
    const x = viewport.padding + span * progress;
    const y =
      210 +
      Math.sin(index * 0.85) * 76 +
      Math.cos(index * 0.46) * 28;

    return {
      ...commit,
      x,
      y
    };
  });

  path.setAttribute("d", buildPath(points));

  let activeNode = null;

  points.forEach((commit, index) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "commit-node";
    node.style.left = `${(commit.x / viewport.width) * 100}%`;
    node.style.top = `${(commit.y / viewport.height) * 100}%`;
    node.dataset.author = commit.author;
    node.setAttribute(
      "aria-label",
      `${commit.message} by ${commit.author} on ${formatLongDate(commit.time)}`
    );

    if (Array.isArray(commit.labels) && commit.labels.length > 0) {
      const badges = document.createElement("span");
      badges.className = "commit-node-badges";

      commit.labels.forEach((label) => {
        const pill = document.createElement("span");
        pill.className = "commit-node-label";
        pill.textContent = label;
        badges.appendChild(pill);
      });

      node.appendChild(badges);
    }

    node.addEventListener("mouseenter", () => activateCommit(node, commit));
    node.addEventListener("focus", () => activateCommit(node, commit));
    node.addEventListener("click", () => activateCommit(node, commit));

    nodeLayer.appendChild(node);

    if (index === points.length - 1) {
      activateCommit(node, commit, false);
    }
  });

  graphElement.addEventListener("pointermove", (event) => {
    const bounds = graphElement.getBoundingClientRect();
    graphElement.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
    graphElement.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
  });

  graphElement.addEventListener("pointerleave", () => {
    tooltip.classList.remove("is-visible");
    graphElement.style.setProperty("--glow-x", "50%");
    graphElement.style.setProperty("--glow-y", "50%");
  });

  function activateCommit(node, commit, showTooltip = true) {
    if (activeNode) {
      activeNode.classList.remove("is-active");
    }

    activeNode = node;
    activeNode.classList.add("is-active");

    inspectorMessage.textContent = commit.message;
    inspectorAuthor.textContent = commit.author;
    inspectorTime.textContent = formatLongDate(commit.time);
    inspectorSha.textContent = commit.sha;

    tooltipAuthor.textContent = commit.author;
    tooltipTime.textContent = formatShortDate(commit.time);

    tooltip.style.left = `${clamp((commit.x / viewport.width) * 100, 14, 86)}%`;
    tooltip.style.top = `${clamp((commit.y / viewport.height) * 100 - 5, 18, 86)}%`;

    if (showTooltip) {
      tooltip.classList.add("is-visible");
    }
  }
}

function renderVisitorMap(
  visitors,
  visitorElement,
  nodeLayer,
  tooltip,
  tooltipName,
  tooltipStatus,
  title,
  summary,
  count,
  brightCount,
  quietCount
) {
  nodeLayer.replaceChildren();

  const brightVisitors = visitors.filter((visitor) => visitor.verified).length;
  const quietVisitors = visitors.length - brightVisitors;

  count.textContent = String(visitors.length);
  brightCount.textContent = String(brightVisitors);
  quietCount.textContent = String(quietVisitors);

  if (visitors.length === 0) {
    title.textContent = "No visitors yet.";
    summary.textContent = "Once the class starts adding files to the Visitors folder, stars will appear here.";
    return;
  }

  title.textContent = `${visitors.length} visitors in orbit`;
  summary.textContent = "Each file in the Visitors folder becomes a star in the constellation.";

  const points = createVisitorLayout(visitors.length);
  let activeNode = null;

  visitors.forEach((visitor, index) => {
    const point = points[index];
    const node = document.createElement("button");
    node.type = "button";
    node.className = `visitor-node${visitor.verified ? " is-verified" : ""}`;
    node.style.left = `${point.x}%`;
    node.style.top = `${point.y}%`;
    node.setAttribute("aria-label", `${visitor.name}. Visitor star.`);

    const label = document.createElement("span");
    label.className = "visitor-node-label";
    label.textContent = visitor.name;
    node.appendChild(label);

    node.addEventListener("mouseenter", () => activateVisitor(node, visitor, point));
    node.addEventListener("focus", () => activateVisitor(node, visitor, point));
    node.addEventListener("click", () => activateVisitor(node, visitor, point));

    nodeLayer.appendChild(node);

    if (index === 0) {
      activateVisitor(node, visitor, point, false);
    }
  });

  visitorElement.addEventListener("pointermove", (event) => {
    const bounds = visitorElement.getBoundingClientRect();
    visitorElement.style.setProperty("--visitor-glow-x", `${event.clientX - bounds.left}px`);
    visitorElement.style.setProperty("--visitor-glow-y", `${event.clientY - bounds.top}px`);
  });

  visitorElement.addEventListener("pointerleave", () => {
    tooltip.classList.remove("is-visible");
    visitorElement.style.setProperty("--visitor-glow-x", "50%");
    visitorElement.style.setProperty("--visitor-glow-y", "50%");
  });

  function activateVisitor(node, visitor, point, showTooltip = true) {
    if (activeNode) {
      activeNode.classList.remove("is-active");
    }

    activeNode = node;
    activeNode.classList.add("is-active");

    title.textContent = visitor.name;
    summary.textContent = visitor.verified
      ? "A bright star in the constellation."
      : "A quiet star in the constellation.";

    tooltipName.textContent = visitor.name;
    tooltipStatus.textContent = visitor.verified ? "Bright star" : "Quiet star";
    tooltip.style.left = `${clamp(point.x, 14, 86)}%`;
    tooltip.style.top = `${clamp(point.y - 4, 18, 84)}%`;

    if (showTooltip) {
      tooltip.classList.add("is-visible");
    }
  }
}

function showGraphError(message, detail, inspectorMessage, inspectorAuthor, inspectorTime, inspectorSha) {
  inspectorMessage.textContent = message;
  inspectorAuthor.textContent = "Unavailable";
  inspectorTime.textContent = detail;
  inspectorSha.textContent = "-";
}

function buildPath(points) {
  if (points.length === 0) {
    return "";
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const delta = current.x - previous.x;
    const controlOneX = previous.x + delta * 0.42;
    const controlTwoX = previous.x + delta * 0.58;

    d += ` C ${controlOneX} ${previous.y}, ${controlTwoX} ${current.y}, ${current.x} ${current.y}`;
  }

  return d;
}

function formatLongDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createVisitorLayout(count) {
  const points = [];
  const centerX = 50;
  const centerY = 58;
  const maxRadius = 33;
  const goldenAngle = 2.399963229728653;

  for (let index = 0; index < count; index += 1) {
    const ratio = count === 1 ? 0.25 : (index + 1) / (count + 1);
    const radius = 8 + maxRadius * Math.sqrt(ratio);
    const angle = index * goldenAngle - Math.PI / 2;

    points.push({
      x: clamp(centerX + Math.cos(angle) * radius, 10, 90),
      y: clamp(centerY + Math.sin(angle) * radius * 0.88, 18, 88)
    });
  }

  return points;
}
