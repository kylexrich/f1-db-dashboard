import { handleExecuteQueryButtonClick } from "../requestSender.js";
import { handleRequest } from "../requestSender.js";
const newCircuitResultDiv = document.getElementById("new-circuit-result");
const executeNewCircuitButton = document.getElementById("execute-new-circuit-button");
// Kyle
executeNewCircuitButton.addEventListener("click", () =>
  handleExecuteQueryButtonClick("PUT", "/insert", renderInsertResult, renderInsertError, buildInsertQueryObject()));
const grandPrixDropdown = document.getElementById("newCircuitGrandPrixTitleNameInput");

function buildInsertQueryObject() {
  const name = document.getElementById("newCircuitNameInput").value;
  const grandPrix = grandPrixDropdown.value;
  const mapurl = document.getElementById("newCircuitMapURLInput").value;
  const lastlen = document.getElementById("newCircuitLastLengthUsedInput").value;
  const dir = document.getElementById("newCircuitDirectionInput").value;
  const changeInElevation = document.getElementById("newCircuitElevationChangeInput").value;
  const type = document.getElementById("newCircuitRaceType").value;
  const newCircuit = {
    tableName: "circuit",
    columnValues: {
      name: name,
      grand_prix_title: grandPrix,
    }
  }
  if(mapurl) newCircuit.columnValues.map_url = mapurl;
  if(lastlen) newCircuit.columnValues.last_length_used = lastlen;
  if(dir) newCircuit.columnValues.direction = dir;
  if(changeInElevation) newCircuit.columnValues.change_in_elevation = changeInElevation;
  if(type) newCircuit.columnValues.type = type;
  return JSON.stringify(newCircuit);
}

function renderInsertResult(data) {
  while (newCircuitResultDiv.lastChild != null) {
    newCircuitResultDiv.removeChild(newCircuitResultDiv.lastChild);
  }
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-success");
  alert.role = "alert"
  alert.innerText = "Circuit successfully added below!";
  newCircuitResultDiv.appendChild(alert);
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
  newCircuitResultDiv.appendChild(resultTable);
}

function renderInsertError(errMessage) {
  while (newCircuitResultDiv.lastChild != null) {
    newCircuitResultDiv.removeChild(newCircuitResultDiv.lastChild);
  }
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-danger");
  alert.role = "alert"
  alert.innerText = errMessage;
  newCircuitResultDiv.appendChild(alert);
}




initGrandPrixDropdown();
function initGrandPrixDropdown() {
  let data
  handleRequest(
    "POST", "/filter", JSON.stringify({
      tableName: "grand_prix",
      selectedColumns:["title"]
    }), (result) => data = result
  )

  const names = []
  for (const tuple of data.rows) {
    for(const val of tuple) {
      names.push(val)
    }
  }
  for (const tableName of names) {
    const newOption = document.createElement("option");
    newOption.value = String(tableName);
    const prettyTableName = tableName.charAt(0).toUpperCase() + tableName.replaceAll("_", " ").slice(1);
    newOption.innerText = prettyTableName;
    grandPrixDropdown.appendChild(newOption);
  }
}
