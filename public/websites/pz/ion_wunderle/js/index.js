

document.querySelector(".letsgo").addEventListener("click", () => {
  const filters = {};
  document.querySelectorAll(".selection select").forEach(select => {
    filters[select.id] = select.value;
  });
  localStorage.setItem("filters", JSON.stringify(filters));
  window.location.href = "main.html";
});
