const dashboardLink = document.getElementById("dashboard-link");
const filterLink = document.getElementById("filter-link");
const raceDetailsLink = document.getElementById("race-details-link");
const newCircuitLink = document.getElementById("new-circuit-link")
const updateDriversLink = document.getElementById("update-drivers-link")
const deleteSeasonsLink = document.getElementById("delete-seasons-link")

dashboardLink.addEventListener("click", () => routeToPage("dashboard-page", dashboardLink))
filterLink.addEventListener("click", () => routeToPage("filter-page", filterLink))
raceDetailsLink.addEventListener("click", () => routeToPage("race-details-page", raceDetailsLink))
newCircuitLink.addEventListener("click", () => routeToPage("new-circuit-page", newCircuitLink))
updateDriversLink.addEventListener("click", () => routeToPage("update-drivers-page", updateDriversLink))
deleteSeasonsLink.addEventListener("click", () => routeToPage("delete-seasons-page", deleteSeasonsLink))

function routeToPage(pageID, pageLink) {
  const pages = document.getElementsByClassName("active-page");
  for(const page of pages) {
    page.className = "page"
  }
  document.getElementById(pageID).className = "active-page";

  const links = document.getElementsByClassName("active-link");
  for(const link of links) {
    link.className = "link"
  }
  pageLink.className = 'active-link'
}



