// Sample articles data for blog page
// This file provides a static list of articles used by the blog index page.
// Each article object contains the minimal fields required by the component.

export const articles = [
  {
    slug: "welcome-to-archeris",
    title: "Welcome to Archeris Blog",
    excerpt: "Discover the latest archery tips, tutorials, and performance insights.",
    category: "Tips & Tutorials",
    date: "2024-01-01",
    image: "/images/blog/welcome.jpg",
    author: {
      name: "Admin",
      avatar: "/images/authors/admin.png"
    }
  },
  {
    slug: "mastering-bow-stance",
    title: "Mastering Bow Stance",
    excerpt: "Learn the perfect stance to improve accuracy and consistency.",
    category: "Performance",
    date: "2024-02-15",
    image: "/images/blog/stance.jpg",
    author: {
      name: "John Doe",
      avatar: "/images/authors/john.png"
    }
  },
  {
    slug: "archery-gear-maintenance",
    title: "Archery Gear Maintenance",
    excerpt: "Essential maintenance tips to keep your equipment in top condition.",
    category: "Health",
    date: "2024-03-10",
    image: "/images/blog/maintenance.jpg",
    author: {
      name: "Jane Smith",
      avatar: "/images/authors/jane.png"
    }
  }
];
