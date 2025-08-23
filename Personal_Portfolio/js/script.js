// ===== Scroll Reveal Animation =====
function revealOnScroll() {
  const reveals = document.querySelectorAll("section");
  reveals.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (sectionTop < windowHeight - 100) {
      section.classList.add("reveal");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// ===== Navbar Active Link Highlight =====
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveLink() {
  let currentSectionId = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveLink);
document.addEventListener("DOMContentLoaded", function () {
  const quotes = [
    { text: "As long as I live, there are infinite chances.", author: "Monkey D. Luffy" },
    { text: "In society, those who don’t have many abilities, tend to complain more.", author: "Kakashi Hatake" },
    { text: "A lesson without pain is meaningless. That’s the truth of training.", author: "Jiraiya" },
    { text: "If you don’t like the hand that fate’s dealt you, fight for a new one.", author: "Naruto Uzumaki" },
    { text: "I don’t care what the world thinks. I just know what I want to protect.", author: "Sanji" }
  ];

  // Pick random quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Split words
  let words = randomQuote.text.split(" ");

  // Pick random index for highlight
  let highlightIndex = Math.floor(Math.random() * words.length);

  // Wrap chosen word in span
  words[highlightIndex] = `<span>${words[highlightIndex]}</span>`;

  // Update HTML
  document.getElementById("anime-quote").innerHTML = `"${words.join(" ")}"`;
  document.querySelector(".quote-author").textContent = `— ${randomQuote.author}`;
});

