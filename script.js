// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Exploring Nature's Beauty",
    date: "August 22, 2024",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    content: "Discover the tranquility of mountain lakes and the serenity of untouched landscapes. Nature offers a peaceful escape from the hustle of daily life.",
    tags: ["Nature", "Travel", "Photography"],
    author: "You",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "City Lights and Urban Nights",
    date: "August 21, 2024",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    content: "The city comes alive at night with vibrant lights and endless energy. Explore the best spots for night photography and urban adventures.",
    tags: ["City", "Photography", "Travel"],
    author: "You",
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "Technology and Innovation",
    date: "August 20, 2024",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    content: "How technology is shaping our future and the innovations we should watch out for in the coming years.",
    tags: ["Technology", "Innovation", "Future"],
    author: "You",
    readTime: "6 min read"
  }
];

// Load and display posts
function loadPosts(posts = blogPosts) {
  const container = document.getElementById('postsContainer');
  container.innerHTML = '';

  if (posts.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#999;">No posts found.</p>';
    return;
  }

  posts.forEach(post => {
    const postEl = document.createElement('section');
    postEl.className = 'post';
    postEl.innerHTML = `
      <img src="${post.image}" alt="${post.title}" class="featured-img">
      <h2>${post.title}</h2>
      <p class="date">${post.date}</p>
      <div class="post-meta">
        <span>By ${post.author}</span>
        <span>${post.readTime}</span>
      </div>
      <p class="content">${post.content}</p>
      <div class="post-tags">
        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    `;
    container.appendChild(postEl);
  });
}

// Search functionality
document.getElementById('searchBtn').addEventListener('click', () => {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filtered = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
  loadPosts(filtered);
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('searchBtn').click();
  }
});

// Load tags
function loadTags() {
  const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];
  const tagsContainer = document.getElementById('tagsContainer');
  tagsContainer.innerHTML = allTags.map(tag =>
    `<span class="tag" onclick="filterByTag('${tag}')">${tag}</span>`
  ).join('');
}

function filterByTag(tag) {
  const filtered = blogPosts.filter(post => post.tags.includes(tag));
  loadPosts(filtered);
  document.getElementById('searchInput').value = tag;
}

// Contact form
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const messageEl = document.getElementById('contactMessage');

  if (!name || !email || !message) {
    messageEl.textContent = 'Please fill all fields.';
    messageEl.className = 'error';
    return;
  }

  // Simulate sending (replace with actual backend call)
  try {
    console.log('Message sent:', { name, email, message });
    messageEl.textContent = '✅ Message sent successfully!';
    messageEl.className = 'success';
    document.getElementById('contactForm').reset();
    setTimeout(() => messageEl.textContent = '', 3000);
  } catch (err) {
    messageEl.textContent = '❌ Error sending message.';
    messageEl.className = 'error';
  }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  loadPosts();
  loadTags();
});