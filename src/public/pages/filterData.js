import { handleExecuteQueryButtonClick } from "../requestSender.js";
import { tables } from "../tables.js";

////**** Execute Filter Button ****////
const executeFilterButton = document.getElementById("execute-filter-button");
const filterResultDiv = document.getElementById("filter-result");
const columnDropdown = document.getElementById("filter-page-column-selection-dropdown");

executeFilterButton.addEventListener("click", () =>
  handleExecuteQueryButtonClick("POST", "/filter", renderFilterResult, renderFilterError, buildFilterQueryObject()));

function buildFilterQueryObject() {
  const table = tableDropdown.value;
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
  const selectedCols = [];
  for (const option of columnDropdown) {
    if (option.selected) {
      selectedCols.push(option.value);
    }
  }

  return JSON.stringify(filterDropdown.value === 'noFilter' ?
    { tableName: table, selectedColumns: selectedCols } :
    {
      tableName: table,
      selectedColumns: selectedCols,
      filter: {
        type: filterDropdown.value,
        filterItems: filterList
      }
    });
}

function renderFilterResult(data) {
  while (filterResultDiv.lastChild != null) {
    filterResultDiv.removeChild(filterResultDiv.lastChild);
  }
  if(typeof data.rows[0] === "undefined" || data.rows[0] === null) {
    renderFilterError({error: "No Results Found"});
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
  filterResultDiv.appendChild(resultTable);
}

function renderFilterError(errMessage) {
  while (filterResultDiv.lastChild != null) {
    filterResultDiv.removeChild(filterResultDiv.lastChild);
  }
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-danger");
  alert.role = "alert"
  alert.innerText = errMessage;
  filterResultDiv.appendChild(alert);
}

////**** Init Table Dropdown ****////

const tableDropdown = document.getElementById("filter-page-table-selection-dropdown");

function initTableDropdown() {
  for (const tableName of tables.keys()) {
    const newOption = document.createElement("option");
    newOption.value = String(tableName);
    const prettyTableName = tableName.charAt(0).toUpperCase() + tableName.replaceAll("_", " ").slice(1);
    newOption.innerText = prettyTableName;
    tableDropdown.appendChild(newOption);
  }
}
initTableDropdown();
resetColumnOptions();

////**** Table Dropdown Change Events ****////

tableDropdown.addEventListener("change", resetColumnOptions);
tableDropdown.addEventListener("change", resetFilters);

function resetColumnOptions() {
  columnDropdown.innerHTML = "";
  const tableName = tableDropdown.value;
  for (const { col } of tables.get(tableName)) {
    const newOption = document.createElement("option");
    newOption.value = String(col);
    const prettyColumnName = col.charAt(0).toUpperCase() + col.replaceAll("_", " ").slice(1);
    newOption.innerText = prettyColumnName;
    newOption.selected = true;
    columnDropdown.appendChild(newOption);
  }
  columnDropdown.size = tables.get(tableName).length;
}


const filterDropdown = document.getElementById("filter-page-filter-selection-dropdown");
const filterItemsList = document.getElementById("filter-page-filter-items-list");
filterDropdown.addEventListener("change", changeFilterItemDisplay);
const filterItemsSection = document.getElementById("filter-page-filter-items-section");

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

////**** Adding/Removing Filter Items ****////

const addFilterItemButton = document.getElementById("filter-page-add-filter-button");
const removeFilterItemButton = document.getElementById("filter-page-remove-filter-button");
addFilterItemButton.addEventListener("click", addFilterItem);
removeFilterItemButton.addEventListener("click", () => removeFilterItem(true));

function validateFilterItemOperatorOptions(columnSelector, operatorSelector) {
  if(tables.get(tableDropdown.value).find((item) => item.col === columnSelector.value).str && !columnSelector.value.includes("date") && !columnSelector.value.includes("dob") && !columnSelector.value.includes("entry")) {
    if(operatorSelector.options.length !== 2) {
      for(let i = 0; i < 4; i++) operatorSelector.removeChild(operatorSelector.lastChild);
    }
  } else if (operatorSelector.options.length !== 6) {
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
  }
}

function addFilterItem() {
  const newItem = document.createElement("div");
  newItem.classList.add("filter-page-filter-item");
  newItem.classList.add("row");

  const columnSelector = document.createElement("select");
  columnSelector.classList.add("form-select");
  columnSelector.classList.add("col");
  columnSelector.classList.add("column-selector");
  columnSelector.ariaLabel = "filter-page-filter-item-column-selection";
  const tableName = tableDropdown.value;
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
  operatorSelector.ariaLabel = "filter-page-filter-item-operator-selection";
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
  valueInput.type = "text";

  validateFilterItemOperatorOptions(columnSelector, operatorSelector, valueInput);
  columnSelector.addEventListener("change", () => validateFilterItemOperatorOptions(columnSelector, operatorSelector, valueInput));
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

function resetFilters() {
  while (filterItemsList.childElementCount > 0) {
    removeFilterItem();
  }
  filterDropdown.value = "noFilter";
  changeFilterItemDisplay();
}







