function toggleMenu() {
  let navLinks = document.getElementById("navLinks");

  if (navLinks.style.display === "flex") {
    navLinks.style.display = "none";
  } else {
    navLinks.style.display = "flex";
  }
  
}