// Advanced Blog App with Full CRUD Operations

// Sample blog posts data (initial)
const defaultPosts = [
  {
    id: 1,
    title: "Exploring Nature's Beauty",
    date: "August 22, 2024",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    content:
      "Discover the tranquility of mountain lakes and the serenity of untouched landscapes. Nature offers a peaceful escape from the hustle of daily life.",
    tags: ["Nature", "Travel", "Photography"],
    author: "You",
    category: "Travel",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "City Lights and Urban Nights",
    date: "August 21, 2024",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    content:
      "The city comes alive at night with vibrant lights and endless energy. Explore the best spots for night photography and urban adventures.",
    tags: ["City", "Photography", "Travel"],
    author: "You",
    category: "Travel",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "Technology and Innovation",
    date: "August 20, 2024",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    content:
      "How technology is shaping our future and the innovations we should watch out for in the coming years.",
    tags: ["Technology", "Innovation", "Future"],
    author: "You",
    category: "Technology",
    readTime: "6 min read",
  },
];

// Local Storage Management
let blogPosts = [];

function initializeApp() {
  const stored = localStorage.getItem("blogPosts");
  blogPosts = stored ? JSON.parse(stored) : defaultPosts;
  loadPosts();
  loadTags();
  loadCategories();
  updatePostCount();
}

function saveToLocalStorage() {
  localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
  updatePostCount();
}

// Load and display posts
function loadPosts(posts = blogPosts) {
  const container = document.getElementById("postsContainer");
  container.innerHTML = "";

  if (posts.length === 0) {
    container.innerHTML =
      '<div class="no-posts"><p>📭 No posts found. Create your first post!</p></div>';
    return;
  }

  posts.forEach((post, index) => {
    const postEl = document.createElement("article");
    postEl.className = "post";
    postEl.style.animationDelay = `${index * 0.1}s`;
    postEl.innerHTML = `
      <img src="${post.image}" alt="${post.title}" class="featured-img">
      <div class="post-overlay">
        <button class="btn-edit" onclick="editPost(${post.id})" title="Edit">✏️</button>
        <button class="btn-delete" onclick="confirmDelete(${post.id})" title="Delete">🗑️</button>
      </div>
      <h2>${post.title}</h2>
      <p class="category-badge">${post.category || "General"}</p>
      <p class="date">${new Date(post.date).toLocaleDateString()}</p>
      <div class="post-meta">
        <span>By ${post.author}</span>
        <span>${post.readTime || "5 min read"}</span>
      </div>
      <p class="content">${post.content}</p>
      <div class="post-tags">
        ${(post.tags || []).map((tag) => `<span class="tag" onclick="filterByTag('${tag}')">${tag}</span>`).join("")}
      </div>
    `;
    container.appendChild(postEl);
  });
}

// Search functionality
document.getElementById("searchBtn").addEventListener("click", performSearch);
document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch();
});

function performSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const categoryFilter = document.getElementById("categoryFilter").value;

  let filtered = blogPosts.filter((post) => {
    const matchesSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      (post.tags &&
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)));

    const matchesCategory = !categoryFilter || post.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  loadPosts(filtered);
}

// Category Filter
document
  .getElementById("categoryFilter")
  .addEventListener("change", performSearch);

// Load categories
function loadCategories() {
  const categories = [
    ...new Set(blogPosts.map((post) => post.category).filter(Boolean)),
  ];

  const select = document.getElementById("categoryFilter");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  const container = document.getElementById("categoriesContainer");
  container.innerHTML = categories
    .map(
      (cat) =>
        `<div class="category-item" onclick="filterByCategory('${cat}')">${cat}</div>`,
    )
    .join("");
}

function filterByCategory(category) {
  const filtered = blogPosts.filter((post) => post.category === category);
  loadPosts(filtered);
}

// Load tags
function loadTags() {
  const allTags = [...new Set(blogPosts.flatMap((post) => post.tags || []))];
  const tagsContainer = document.getElementById("tagsContainer");
  tagsContainer.innerHTML = allTags
    .map(
      (tag) =>
        `<span class="tag" onclick="filterByTag('${tag}')">${tag}</span>`,
    )
    .join("");
}

function filterByTag(tag) {
  const filtered = blogPosts.filter((post) => (post.tags || []).includes(tag));
  loadPosts(filtered);
  document.getElementById("searchInput").value = tag;
}

// Post Count Update
function updatePostCount() {
  document.getElementById("postCount").textContent = blogPosts.length;
}

// Modal Management
let currentEditingId = null;

document
  .getElementById("createPostBtn")
  .addEventListener("click", openCreateModal);
document.querySelector(".close-modal").addEventListener("click", closeModal);
document.getElementById("postForm").addEventListener("submit", savePost);

function openCreateModal() {
  currentEditingId = null;
  document.getElementById("modalTitle").textContent = "Create New Post";
  document.getElementById("postForm").reset();
  document.getElementById("deletePostBtn").style.display = "none";
  document.getElementById("postModal").classList.add("active");
}

function editPost(id) {
  const post = blogPosts.find((p) => p.id === id);
  if (!post) return;

  currentEditingId = id;
  document.getElementById("modalTitle").textContent = "Edit Post";
  document.getElementById("postTitle").value = post.title;
  document.getElementById("postCategory").value = post.category || "";
  document.getElementById("postImage").value = post.image;
  document.getElementById("postContent").value = post.content;
  document.getElementById("postTags").value = (post.tags || []).join(", ");
  document.getElementById("postAuthor").value = post.author;
  document.getElementById("deletePostBtn").style.display = "block";
  document.getElementById("postModal").classList.add("active");
}

function closeModal() {
  document.getElementById("postModal").classList.remove("active");
  currentEditingId = null;
}

function savePost(e) {
  e.preventDefault();

  const title = document.getElementById("postTitle").value;
  const category = document.getElementById("postCategory").value;
  const image = document.getElementById("postImage").value;
  const content = document.getElementById("postContent").value;
  const tags = document
    .getElementById("postTags")
    .value.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);
  const author = document.getElementById("postAuthor").value || "Anonymous";

  if (currentEditingId) {
    // Update existing post
    const post = blogPosts.find((p) => p.id === currentEditingId);
    if (post) {
      post.title = title;
      post.category = category;
      post.image = image;
      post.content = content;
      post.tags = tags;
      post.author = author;
      post.date = new Date().toISOString();
    }
  } else {
    // Create new post
    const newPost = {
      id: Date.now(),
      title,
      category,
      image,
      content,
      tags,
      author,
      date: new Date().toISOString(),
      readTime: `${Math.ceil(content.length / 200)} min read`,
    };
    blogPosts.unshift(newPost);
  }

  saveToLocalStorage();
  loadPosts();
  loadTags();
  loadCategories();
  closeModal();

  // Show success message
  const msgEl = document.getElementById("contactMessage");
  msgEl.textContent = "✅ Post saved successfully!";
  msgEl.className = "success";
  setTimeout(() => (msgEl.textContent = ""), 3000);
}

// Delete functionality
let deleteTargetId = null;

document.getElementById("deletePostBtn").addEventListener("click", () => {
  deleteTargetId = currentEditingId;
  document.getElementById("confirmModal").classList.add("active");
});

document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
  if (deleteTargetId) {
    blogPosts = blogPosts.filter((p) => p.id !== deleteTargetId);
    saveToLocalStorage();
    loadPosts();
    loadTags();
    loadCategories();
    closeModal();
    closeConfirmModal();
    deleteTargetId = null;

    const msgEl = document.getElementById("contactMessage");
    msgEl.textContent = "🗑️ Post deleted successfully!";
    msgEl.className = "success";
    setTimeout(() => (msgEl.textContent = ""), 3000);
  }
});

function confirmDelete(id) {
  deleteTargetId = id;
  document.getElementById("confirmModal").classList.add("active");
}

function closeConfirmModal() {
  document.getElementById("confirmModal").classList.remove("active");
  deleteTargetId = null;
}

// Contact form (existing functionality)
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  const messageEl = document.getElementById("contactMessage");

  if (!name || !email || !message) {
    messageEl.textContent = "Please fill all fields.";
    messageEl.className = "error";
    return;
  }

  try {
    console.log("Message sent:", { name, email, message });
    messageEl.textContent = "✅ Message sent successfully!";
    messageEl.className = "success";
    document.getElementById("contactForm").reset();
    setTimeout(() => (messageEl.textContent = ""), 3000);
  } catch (err) {
    messageEl.textContent = "❌ Error sending message.";
    messageEl.className = "error";
  }
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  const modal = document.getElementById("postModal");
  if (e.target === modal) closeModal();

  const confirmModal = document.getElementById("confirmModal");
  if (e.target === confirmModal) closeConfirmModal();
});

// Initialize app on page load
window.addEventListener("DOMContentLoaded", initializeApp);
