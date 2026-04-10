const FALLBACK_SITE_DATA = window.SITE_DATA_FALLBACK ?? {
  branch: "main",
  commits: [],
  visitors: []
};

const graph = document.getElementById("commit-graph");
const visitorMap = document.getElementById("visitor-map");
const siteDataPromise = loadSiteData();

async function loadSiteData() {
  try {
    const response = await fetch("data/site-data.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      return FALLBACK_SITE_DATA;
    }

    return response.json();
  } catch {
    return FALLBACK_SITE_DATA;
  }
}

if (graph) {
  initCommitGraph(graph);
}

if (visitorMap) {
  initVisitorMap(visitorMap);
}

async function initCommitGraph(graphElement) {
  const nodeLayer = document.getElementById("commit-nodes");
  const glowLayer = document.getElementById("commit-glow");
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
    const commits = siteData.commits;

    renderCommitGraph(
      commits,
      graphElement,
      nodeLayer,
      glowLayer,
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

  try {
    const siteData = await siteDataPromise;
    renderVisitorMap(siteData.visitors, visitorElement, nodeLayer);
  } catch {
    nodeLayer.replaceChildren();
  }
}

function renderCommitGraph(
  commits,
  graphElement,
  nodeLayer,
  glowLayer,
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
  const canvasWidth = Math.max(graphElement.clientWidth, commits.length * 120 + viewport.padding * 2);
  const span = canvasWidth - viewport.padding * 2;

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

  path.parentElement.setAttribute("viewBox", `0 0 ${canvasWidth} ${viewport.height}`);
  path.parentElement.style.width = `${canvasWidth}px`;
  path.parentElement.style.height = `${viewport.height}px`;
  nodeLayer.style.width = `${canvasWidth}px`;
  nodeLayer.style.height = `${viewport.height}px`;
  path.setAttribute("d", buildPath(points));

  let activeNode = null;
  let activeCommit = null;
  let hoverX = null;
  let hoverY = null;

  points.forEach((commit, index) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "commit-node";
    node.style.left = `${commit.x}px`;
    node.style.top = `${commit.y}px`;
    node.dataset.author = commit.author;
    applyCommitNodeStyle(node, commit.author);
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
    hoverX = event.clientX - bounds.left;
    hoverY = event.clientY - bounds.top;
    glowLayer.style.setProperty("--graph-glow-opacity", "1");
    updateGraphGlow();
  });

  graphElement.addEventListener("pointerleave", () => {
    hoverX = null;
    hoverY = null;
    tooltip.classList.remove("is-visible");
    glowLayer.style.setProperty("--graph-glow-opacity", "0");
  });

  graphElement.addEventListener("scroll", () => {
    if (activeCommit) {
      positionCommitTooltip(activeCommit);
    }
    updateGraphGlow();
  });

  graphElement.scrollLeft = Math.max(graphElement.scrollWidth - graphElement.clientWidth, 0);

  function activateCommit(node, commit, showTooltip = true) {
    if (activeNode) {
      activeNode.classList.remove("is-active");
    }

    activeNode = node;
    activeCommit = commit;
    activeNode.classList.add("is-active");

    inspectorMessage.textContent = commit.message;
    inspectorAuthor.textContent = commit.author;
    inspectorTime.textContent = formatLongDate(commit.time);
    inspectorSha.textContent = commit.sha;

    tooltipAuthor.textContent = commit.author;
    tooltipTime.textContent = formatShortDate(commit.time);

    positionCommitTooltip(commit);

    if (showTooltip) {
      tooltip.classList.add("is-visible");
    }
  }

  function positionCommitTooltip(commit) {
    const visibleX = commit.x - graphElement.scrollLeft;
    tooltip.style.left = `${clamp(visibleX, 110, graphElement.clientWidth - 110)}px`;
    tooltip.style.top = `${clamp(commit.y - 18, 86, viewport.height - 30)}px`;
  }

  function updateGraphGlow() {
    if (hoverX === null || hoverY === null) {
      return;
    }

    glowLayer.style.setProperty("--glow-x", `${hoverX}px`);
    glowLayer.style.setProperty("--glow-y", `${hoverY}px`);
  }
}

function renderVisitorMap(visitors, visitorElement, nodeLayer) {
  nodeLayer.replaceChildren();

  if (visitors.length === 0) {
    return;
  }

  const points = createVisitorLayout(visitors.length);
  let activeNode = null;
  let activeMode = "";
  const starNodes = [];

  visitors.forEach((visitor, index) => {
    const point = points[index];
    const node = document.createElement("button");
    node.type = "button";
    node.className = `visitor-node${visitor.verified ? " is-verified" : ""}`;
    node.style.left = `${point.x}%`;
    node.style.top = `${point.y}%`;
    node.setAttribute("aria-label", `${visitor.name}. Visitor star.`);
    applyVisitorStarStyle(node, index, visitor.verified);

    const label = document.createElement("span");
    label.className = "visitor-node-label";
    label.textContent = visitor.name;
    node.appendChild(label);

    node.addEventListener("mouseenter", () => activateVisitor(node, "hover"));
    node.addEventListener("mouseleave", () => {
      if (activeNode === node && activeMode === "hover") {
        clearActiveVisitor();
      }
    });
    node.addEventListener("focus", () => activateVisitor(node, "focus"));
    node.addEventListener("blur", () => {
      if (activeNode === node && activeMode === "focus") {
        clearActiveVisitor();
      }
    });
    node.addEventListener("click", () => activateVisitor(node, "click"));

    nodeLayer.appendChild(node);
    starNodes.push({ node, point });
  });

  visitorElement.addEventListener("pointermove", (event) => {
    const bounds = visitorElement.getBoundingClientRect();
    const mouseX = event.clientX - bounds.left;
    const mouseY = event.clientY - bounds.top;
    visitorElement.style.setProperty("--visitor-glow-x", `${mouseX}px`);
    visitorElement.style.setProperty("--visitor-glow-y", `${mouseY}px`);
    visitorElement.style.setProperty("--visitor-glow-opacity", "1");
    displaceVisitorStars(starNodes, mouseX, mouseY, bounds.width, bounds.height);
  });

  visitorElement.addEventListener("pointerleave", () => {
    visitorElement.style.setProperty("--visitor-glow-opacity", "0");
    displaceVisitorStars(starNodes, null, null, 1, 1);

    if (activeMode === "hover") {
      clearActiveVisitor();
    }
  });

  function clearActiveVisitor() {
    if (activeNode) {
      activeNode.classList.remove("is-active");
    }

    activeNode = null;
    activeMode = "";
  }

  function activateVisitor(node, mode = "click") {
    if (activeNode && activeNode !== node) {
      activeNode.classList.remove("is-active");
    }

    activeNode = node;
    activeMode = mode;
    activeNode.classList.add("is-active");
  }
}

function showGraphError(message, detail, inspectorMessage, inspectorAuthor, inspectorTime, inspectorSha) {
  inspectorMessage.textContent = message;
  inspectorAuthor.textContent = "Unavailable";
  inspectorTime.textContent = detail;
  inspectorSha.textContent = "-";
}

function applyCommitNodeStyle(node, author) {
  const normalizedAuthor = author.trim().toLowerCase();
  let hash = 0;

  for (let index = 0; index < normalizedAuthor.length; index += 1) {
    hash = ((hash << 5) - hash + normalizedAuthor.charCodeAt(index)) | 0;
  }

  const hue = Math.abs(hash) % 360;
  const core = `hsl(${hue} 95% 82%)`;
  const edge = `hsl(${(hue + 24) % 360} 88% 64%)`;
  const glow = `hsla(${hue} 90% 68% / 0.42)`;
  const ring = `hsla(${hue} 85% 76% / 0.18)`;

  node.style.setProperty("--commit-core", core);
  node.style.setProperty("--commit-edge", edge);
  node.style.setProperty("--commit-glow", glow);
  node.style.setProperty("--commit-ring", ring);
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

function applyVisitorStarStyle(node, index, verified) {
  const brightPalette = [
    { core: "#ffffff", edge: "#fdf9ef", glow: "rgba(255, 250, 234, 0.96)" },
    { core: "#ffffff", edge: "#f4f9ff", glow: "rgba(235, 246, 255, 0.9)" },
    { core: "#ffffff", edge: "#fff7f1", glow: "rgba(255, 244, 233, 0.92)" }
  ];
  const quietPalette = [
    { core: "#edf2fb", edge: "#bbc7d8", glow: "rgba(187, 199, 216, 0.13)" },
    { core: "#eef4ff", edge: "#b8c4d8", glow: "rgba(184, 196, 216, 0.12)" },
    { core: "#f1eef4", edge: "#c8c0cc", glow: "rgba(200, 192, 204, 0.11)" }
  ];

  const palette = (verified ? brightPalette : quietPalette)[index % 3];
  const size = verified ? 0.98 + (index % 3) * 0.12 : 0.34 + (index % 3) * 0.06;
  const duration = verified ? 4.6 + (index % 4) * 0.9 : 6.8 + (index % 4) * 1.05;
  const haloDuration = duration * (verified ? 1.18 : 1.32);
  const flickerDuration = duration * (verified ? 0.76 : 0.92);
  const delay = (index % 5) * -0.83;
  const opacityLow = verified ? 0.84 : 0.44;
  const opacityMid = verified ? 0.93 : 0.58;
  const opacityHigh = verified ? 1 : 0.72;
  const haloMin = verified ? 0.28 : 0.08;
  const haloMax = verified ? 0.92 : 0.22;
  const pushMax = verified ? 7.5 : 4.5;
  const hoverScale = verified ? 1.18 : 1.12;

  node.style.setProperty("--star-size", `${size}rem`);
  node.style.setProperty("--star-core", palette.core);
  node.style.setProperty("--star-edge", palette.edge);
  node.style.setProperty("--star-glow", palette.glow);
  node.style.setProperty("--star-duration", `${duration}s`);
  node.style.setProperty("--star-halo-duration", `${haloDuration}s`);
  node.style.setProperty("--star-flicker-duration", `${flickerDuration}s`);
  node.style.setProperty("--star-delay", `${delay}s`);
  node.style.setProperty("--star-opacity-low", String(opacityLow));
  node.style.setProperty("--star-opacity-mid", String(opacityMid));
  node.style.setProperty("--star-opacity-high", String(opacityHigh));
  node.style.setProperty("--star-halo-min", String(haloMin));
  node.style.setProperty("--star-halo-max", String(haloMax));
  node.style.setProperty("--star-hover-scale", String(hoverScale));
  node.dataset.pushMax = String(pushMax);
}

function displaceVisitorStars(stars, mouseX, mouseY, width, height) {
  if (mouseX === null || mouseY === null) {
    stars.forEach(({ node }) => {
      node.style.setProperty("--star-offset-x", "0px");
      node.style.setProperty("--star-offset-y", "0px");
    });
    return;
  }

  stars.forEach(({ node, point }) => {
    if (node.classList.contains("is-active")) {
      node.style.setProperty("--star-offset-x", "0px");
      node.style.setProperty("--star-offset-y", "0px");
      return;
    }

    const starX = (point.x / 100) * width;
    const starY = (point.y / 100) * height;
    const dx = starX - mouseX;
    const dy = starY - mouseY;
    const distance = Math.hypot(dx, dy);
    const influence = Math.max(0, 1 - distance / 130);
    const push = influence * influence * Number.parseFloat(node.dataset.pushMax || "5");
    const angle = Math.atan2(dy, dx);

    node.style.setProperty("--star-offset-x", `${Math.cos(angle) * push}px`);
    node.style.setProperty("--star-offset-y", `${Math.sin(angle) * push}px`);
  });
}
