const commits = [
  {
    sha: "7443395",
    author: "4gnusd3i",
    time: "2025-02-06T09:43:11+01:00",
    message: "Initial commit",
    summary: "The repo begins here with the very first snapshot."
  },
  {
    sha: "1e6764e",
    author: "4gnusd3i",
    time: "2025-02-06T10:03:07+01:00",
    message: "Added files for webpage and readme",
    summary: "The first real structure lands: webpage files and the README."
  },
  {
    sha: "61997e7",
    author: "4gnusd3i",
    time: "2025-02-06T10:16:53+01:00",
    message: "Updated ReadMe",
    summary: "The guide starts evolving through iterative documentation passes."
  },
  {
    sha: "a526fbe",
    author: "4gnusd3i",
    time: "2025-02-06T10:30:04+01:00",
    message: "Readme guide finished",
    summary: "A milestone commit where the guide first feels complete."
  },
  {
    sha: "879da65",
    author: "4gnusd3i",
    time: "2025-02-06T11:00:04+01:00",
    message: "Updated Readme",
    summary: "More cleanup and refinement in the written walkthrough."
  },
  {
    sha: "09eb4b0",
    author: "4gnusd3i",
    time: "2025-02-06T11:00:46+01:00",
    message: "Update readme formatting",
    summary: "Formatting work makes the teaching material easier to scan."
  },
  {
    sha: "37d2ff2",
    author: "4gnusd3i",
    time: "2025-02-06T11:02:20+01:00",
    message: "small changes to readme",
    summary: "Small edits that tighten the overall guide."
  },
  {
    sha: "23bfbcb",
    author: "4gnusd3i",
    time: "2025-02-06T11:04:01+01:00",
    message: "formatting",
    summary: "Another polish pass focused on readability."
  },
  {
    sha: "5499e23",
    author: "4gnusd3i",
    time: "2025-02-06T11:11:17+01:00",
    message: "hopefully final version of guide",
    summary: "The optimistic pre-finale commit that every project eventually has."
  },
  {
    sha: "2f1fcf4",
    author: "4gnusd3i",
    time: "2025-02-06T11:19:41+01:00",
    message: "Update README.md",
    summary: "The README keeps shifting as the teaching story becomes clearer."
  },
  {
    sha: "f7800e2",
    author: "4gnusd3i",
    time: "2026-04-09T14:24:01+02:00",
    message: "changed content of readme",
    summary: "A later revisit brings the old guide back into active motion."
  },
  {
    sha: "a285001",
    author: "4gnusd3i",
    time: "2026-04-09T14:27:10+02:00",
    message: "Enhance README with GitHub actions information",
    summary: "The repo broadens beyond basics and starts pointing at collaboration tools."
  },
  {
    sha: "53f232d",
    author: "Excellence308",
    time: "2026-04-10T00:16:49+02:00",
    message: "Changed README.md to explicitly mention the fork",
    summary: "The fork-based identity of the project becomes explicit."
  },
  {
    sha: "78054a8",
    author: "Excellence308",
    time: "2026-04-10T09:16:11+02:00",
    message: "Cleaned up comments for clarity",
    summary: "The project shifts from rough notes toward a sharper presentation."
  },
  {
    sha: "70d66ac",
    author: "Excellence308",
    time: "2026-04-10T09:35:00+02:00",
    message: "Cleaned up the graphic. Added personalized title.",
    summary: "The page becomes more expressive and visibly yours."
  },
  {
    sha: "fb1f35a",
    author: "Excellence308",
    time: "2026-04-10T09:40:14+02:00",
    message: "Simplified title",
    summary: "The latest visible commit trims the branding into its current form.",
    labels: ["HEAD"]
  }
];

const graph = document.getElementById("commit-graph");

if (graph) {
  const nodeLayer = document.getElementById("commit-nodes");
  const tooltip = document.getElementById("commit-tooltip");
  const tooltipAuthor = document.getElementById("tooltip-author");
  const tooltipTime = document.getElementById("tooltip-time");
  const path = document.getElementById("commit-path");

  const inspectorMessage = document.getElementById("inspector-message");
  const inspectorAuthor = document.getElementById("inspector-author");
  const inspectorTime = document.getElementById("inspector-time");
  const inspectorSha = document.getElementById("inspector-sha");

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

    if (Array.isArray(commit.labels)) {
      commit.labels.forEach((label) => {
        const pill = document.createElement("span");
        pill.className = "commit-node-label";
        pill.textContent = label;
        node.appendChild(pill);
      });
    }

    node.addEventListener("mouseenter", () => activateCommit(node, commit));
    node.addEventListener("focus", () => activateCommit(node, commit));

    nodeLayer.appendChild(node);

    if (index === points.length - 1) {
      activateCommit(node, commit, false);
    }
  });

  graph.addEventListener("pointermove", (event) => {
    const bounds = graph.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    graph.style.setProperty("--glow-x", `${x}px`);
    graph.style.setProperty("--glow-y", `${y}px`);
  });

  graph.addEventListener("pointerleave", () => {
    tooltip.classList.remove("is-visible");
    graph.style.setProperty("--glow-x", "50%");
    graph.style.setProperty("--glow-y", "50%");
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

    const left = clamp((commit.x / viewport.width) * 100, 14, 86);
    const top = clamp((commit.y / viewport.height) * 100 - 5, 18, 86);

    tooltip.style.left = `${left}%`;
    tooltip.style.top = `${top}%`;

    if (showTooltip) {
      tooltip.classList.add("is-visible");
    }
  }
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
