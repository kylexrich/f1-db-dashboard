import { handleExecuteQueryButtonClick } from "../requestSender.js";
import { tables } from "../tables.js";

const deleteSeasonsResultDiv = document.getElementById("delete-seasons-result");
const executeDeleteSeasonsButton = document.getElementById("execute-delete-seasons-button");

executeDeleteSeasonsButton.addEventListener("click", () =>
  handleExecuteQueryButtonClick("DELETE", "/delete", renderDeleteResult, renderDeleteError, buildDeleteQueryObject()));


function buildDeleteQueryObject() {
  const table = 'season';
  const filterList = [];
  if (filterDropdown.value !== "noFilter" && filterItemsList.children.length > 0) {
    for (const filter of filterItemsList.children) {
      const col = filter.querySelector(".column-selector").value;
      const operator = filter.querySelector(".operator-selector").value;
      const input = filter.querySelector(".input").value;
      const typedInput = tables.get(table).find((item) => item.col === col).str ? "'" + input + "'" : input;
      filterList.push({
        column: col,
        compareOperator: operator,
        value: typedInput
      });
    }
  }
  return JSON.stringify(filterDropdown.value === 'noFilter' ?
    { tableName: table } :
    {
      tableName: table,
      filter: {
        type: filterDropdown.value,
        filterItems: filterList
      }
    });
}

function renderDeleteResult(data) {
  while (deleteSeasonsResultDiv.lastChild != null) {
    deleteSeasonsResultDiv.removeChild(deleteSeasonsResultDiv.lastChild);
  }
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-success");
  alert.role = "alert"
  alert.innerText = "Seasons successfully deleted! Please see updated table below";
  deleteSeasonsResultDiv.appendChild(alert);
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
  deleteSeasonsResultDiv.appendChild(resultTable);
}

function renderDeleteError(errMessage) {
  while (deleteSeasonsResultDiv.lastChild != null) {
    deleteSeasonsResultDiv.removeChild(deleteSeasonsResultDiv.lastChild);
  }
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-danger");
  alert.role = "alert"
  alert.innerText = errMessage;
  deleteSeasonsResultDiv.appendChild(alert);
}

const filterDropdown = document.getElementById("delete-page-filter-selection-dropdown");
const filterItemsList = document.getElementById("delete-page-filter-items-list");
filterDropdown.addEventListener("change", changeFilterItemDisplay);
const filterItemsSection = document.getElementById("delete-page-filter-items-section");

function changeFilterItemDisplay() {
  const filterType = filterDropdown.value;
  if (filterType === "noFilter") {
    filterItemsSection.style.display = "none";
  } else {
    if (filterItemsList.childElementCount === 0) {
      addFilterItem();
    }
    filterItemsSection.style.display = "inherit";
  }
}

const addFilterItemButton = document.getElementById("delete-page-add-filter-button");
const removeFilterItemButton = document.getElementById("delete-page-remove-filter-button");
addFilterItemButton.addEventListener("click", addFilterItem);
removeFilterItemButton.addEventListener("click", () => removeFilterItem(true));

function addFilterItem() {
  const newItem = document.createElement("div");
  newItem.classList.add("delete-page-filter-item");
  newItem.classList.add("row");

  const columnSelector = document.createElement("select");
  columnSelector.classList.add("form-select");
  columnSelector.classList.add("col");
  columnSelector.classList.add("column-selector");
  columnSelector.ariaLabel = "delete-page-filter-item-column-selection";
  const tableName = 'season';
  for (const { col } of tables.get(tableName)) {
    const newOption = document.createElement("option");
    newOption.value = String(col);
    const prettyColumnName = col.charAt(0).toUpperCase() + col.replaceAll("_", " ").slice(1);
    newOption.innerText = prettyColumnName;
    columnSelector.appendChild(newOption);
  }

  const operatorSelector = document.createElement("select");
  operatorSelector.classList.add("form-select");
  operatorSelector.classList.add("col");
  operatorSelector.classList.add("operator-selector");
  operatorSelector.ariaLabel = "delete-page-filter-item-operator-selection";
  const e = document.createElement("option");
  e.value = "=";
  e.innerText = "=";
  operatorSelector.appendChild(e);
  const ne = document.createElement("option");
  ne.value = "!=";
  ne.innerText = "!=";
  operatorSelector.appendChild(ne);
  const g = document.createElement("option");
  g.value = ">";
  g.innerText = ">";
  operatorSelector.appendChild(g);
  const l = document.createElement("option");
  l.value = "<";
  l.innerText = "<";
  operatorSelector.appendChild(l);
  const ge = document.createElement("option");
  ge.value = ">=";
  ge.innerText = ">=";
  operatorSelector.appendChild(ge);
  const le = document.createElement("option");
  le.value = "<=";
  le.innerText = "<=";
  operatorSelector.appendChild(le);

  const valueInput = document.createElement("input");
  valueInput.classList.add("form-control");
  valueInput.classList.add("input");
  valueInput.classList.add("col");
  valueInput.type = "number";

  newItem.appendChild(columnSelector);
  newItem.appendChild(operatorSelector);
  newItem.appendChild(valueInput);
  filterItemsList.appendChild(newItem);
}

function removeFilterItem(keepOneFilter) {
  if((keepOneFilter && filterItemsList.childElementCount > 1) || !keepOneFilter) {
    filterItemsList.removeChild(filterItemsList.lastChild);
  }
}
