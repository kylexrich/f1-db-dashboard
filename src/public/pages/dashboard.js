import { handleExecuteQueryButtonClick } from "../requestSender.js";
const dashboardResultDiv = document.getElementById("dashboard-result");
const aggGroupByButton = document.getElementById("execute-agg-w-group-by-button");
const aggHavingButton = document.getElementById("execute-agg-w-having-button");
const nestedAggGroupByButton = document.getElementById("execute-nested-agg-w-group-by-button");
const divisionButton = document.getElementById("execute-division-button");


// For each team, get the maxium podiums the youngest driver has won in 2020
aggGroupByButton.addEventListener("click", () =>
  handleExecuteQueryButtonClick("GET", "/hardcoded/agg/groupby", renderHardcodedResult, renderHardcodedError));

// Which teams have won the most world championships with less than 3 investores
aggHavingButton.addEventListener("click", () =>
  handleExecuteQueryButtonClick("GET", "/hardcoded/agg/having", renderHardcodedResult, renderHardcodedError));


// Team whos podiums are greater than the leauge average number of podiums
nestedAggGroupByButton.addEventListener("click", () =>
  handleExecuteQueryButtonClick("GET", "/hardcoded/agg/nestedgroupby", renderHardcodedResult, renderHardcodedError));


// drivers that have raced on all circuits
divisionButton.addEventListener("click", () =>
  handleExecuteQueryButtonClick("GET", "/hardcoded/division", renderHardcodedResult, renderHardcodedError));


function renderHardcodedResult(data) {
  while (dashboardResultDiv.lastChild != null) {
    dashboardResultDiv.removeChild(dashboardResultDiv.lastChild);
  }
  if(typeof data.rows[0] === "undefined" || data.rows[0] === null) {
    renderHardcodedError( "No Results Found");
    return;
  }
  const resultTable = document.createElement("table");
  resultTable.classList.add("table", "sortable", "table-dark", "table-striped", "table-hover");
  const resultTableHead = document.createElement("thead");
  const resultTableHeadRow = document.createElement("tr");
  for (const colName of data.names) {
    const resultTableHeadItem = document.createElement("th");
    resultTableHeadItem.innerText = colName.charAt(0).toUpperCase() + colName.replaceAll("_", " ").slice(1);
    resultTableHeadRow.appendChild(resultTableHeadItem);
  }
  resultTableHead.appendChild(resultTableHeadRow);
  resultTable.appendChild(resultTableHead);

  const resultTableBody = document.createElement("tbody");
  for (const tuple of data.rows) {
    const row = document.createElement("tr");
    for(const val of tuple) {
      const tableData = document.createElement("td");
      tableData.innerText = val;
      row.appendChild(tableData);
    }
    resultTableBody.appendChild(row);
  }
  resultTable.appendChild(resultTableBody);
  dashboardResultDiv.appendChild(resultTable);
}

function renderHardcodedError(errMessage) {
  while (dashboardResultDiv.lastChild != null) {
    dashboardResultDiv.removeChild(dashboardResultDiv.lastChild);
  }
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-danger");
  alert.role = "alert"
  alert.innerText = errMessage;
  dashboardResultDiv.appendChild(alert);
}
