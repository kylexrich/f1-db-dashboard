import { handleExecuteQueryButtonClick } from "../requestSender.js";
import { tables } from "../tables.js";

const joinResultDiv = document.getElementById("race-details-result");
const executeRaceDetailsButton = document.getElementById("execute-race-details-button");
const columnDropdown = document.getElementById("race-details-page-column-selection-dropdown");

executeRaceDetailsButton.addEventListener("click", () =>
  handleExecuteQueryButtonClick("POST", "/join", renderJoinResult, renderJoinError, buildJoinQueryObject()));
const filterDropdown = document.getElementById("race-details-page-filter-selection-dropdown");
initColumnOptions();

function buildJoinQueryObject() {
  const filterList = [];
  if (filterDropdown.value !== "noFilter" && filterItemsList.children.length > 0) {
    for (const filter of filterItemsList.children) {
      const table = filter.querySelector(".column-selector").value.split(".")[0];
      const col = filter.querySelector(".column-selector").value;
      const operator = filter.querySelector(".operator-selector").value;
      const input = filter.querySelector(".input").value;
      const typedInput = tables.get(table).find((item) => item.col === col.split(".")[1]).str && !input.includes(".") ? "'" + input + "'" : input;
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
      if(option.value === "driver.id") {
        selectedCols.push(option.value + " as DriverID");
      } else if(option.value === "race.id") {
        selectedCols.push(option.value +" as RaceID");
      } else {
        selectedCols.push(option.value);
      }
    }
  }

  return JSON.stringify(filterDropdown.value === "noFilter" ?
    {
      tableName1: "driver",
      tableName2: "race",
      tableName3: "raced", selectedColumns: selectedCols
    } :
    {
      tableName1: "driver",
      tableName2: "race",
      tableName3: "raced",
      selectedColumns: selectedCols,
      filter: {
        type: filterDropdown.value,
        filterItems: filterList
      }
    });
}

function renderJoinResult(data) {
  while (joinResultDiv.lastChild != null) {
    joinResultDiv.removeChild(joinResultDiv.lastChild);
  }
  if (typeof data.rows[0] === "undefined" || data.rows[0] === null) {
    renderJoinError({ error: "No Results Found" });
    return;
  }
  const resultTable = document.createElement("table");
  resultTable.classList.add("table", "sortable", "table-dark", "table-striped", "table-hover");
  const resultTableHead = document.createElement("thead");
  const resultTableHeadRow = document.createElement("tr");
  let count = 0;
  for (let colName of data.names) {
    const resultTableHeadItem = document.createElement("th");
    resultTableHeadItem.innerText = colName.charAt(0).toUpperCase() + colName.replaceAll("_", " ").slice(1);
    resultTableHeadRow.appendChild(resultTableHeadItem);
  }
  resultTableHead.appendChild(resultTableHeadRow);
  resultTable.appendChild(resultTableHead);

  const resultTableBody = document.createElement("tbody");
  for (const tuple of data.rows) {
    const row = document.createElement("tr");

    for (let val of tuple) {
      const tableData = document.createElement("td");
      tableData.innerText = val;
      row.appendChild(tableData);
    }
    resultTableBody.appendChild(row);
  }
  resultTable.appendChild(resultTableBody);
  joinResultDiv.appendChild(resultTable);
}

function renderJoinError(errMessage) {
  while (joinResultDiv.lastChild != null) {
    joinResultDiv.removeChild(joinResultDiv.lastChild);
  }
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-danger");
  alert.role = "alert";
  alert.innerText = errMessage;
  joinResultDiv.appendChild(alert);
}


function initColumnOptions() {
  const tableName1 = "driver";
  for (const { col } of tables.get(tableName1)) {
    const newOption = document.createElement("option");
    newOption.value = "driver" + "." + String(col);
    const prettyColumnName = col.charAt(0).toUpperCase() + col.replaceAll("_", " ").slice(1);
    newOption.innerText = "Driver " + prettyColumnName;
    newOption.selected = true;
    columnDropdown.appendChild(newOption);
  }
  const tableName2 = "race";
  for (const { col } of tables.get(tableName2)) {
    const newOption = document.createElement("option");
    newOption.value = "race" + "." + String(col);
    const prettyColumnName = col.charAt(0).toUpperCase() + col.replaceAll("_", " ").slice(1);
    newOption.innerText = "Race " + prettyColumnName;
    newOption.selected = true;
    columnDropdown.appendChild(newOption);
  }
  const tableName3 = "raced";
  for (const { col } of tables.get(tableName3)) {
    const newOption = document.createElement("option");
    newOption.value = "raced" + "." + String(col);
    const prettyColumnName = col.charAt(0).toUpperCase() + col.replaceAll("_", " ").slice(1);
    newOption.innerText = "Race " + prettyColumnName;
    newOption.selected = true;
    if (prettyColumnName !== "Race id" && prettyColumnName !== "Driver id") columnDropdown.appendChild(newOption);
  }
  columnDropdown.size = tables.get(tableName1).length + tables.get(tableName2).length + tables.get(tableName3).length;
}


const filterItemsList = document.getElementById("race-details-page-filter-items-list");
filterDropdown.addEventListener("change", changeFilterItemDisplay);
const filterItemsSection = document.getElementById("race-details-page-filter-items-section");

function changeFilterItemDisplay() {
  const filterType = filterDropdown.value;
  if (filterType === "noFilter") {
    filterItemsSection.style.display = "none";
  } else {
    filterItemsSection.style.display = "inherit";
  }
}

////**** Adding/Removing Filter Items ****////

const addValueFilterItemButton = document.getElementById("race-details-page-add-value-filter-button");
const addFieldFilterItemButton = document.getElementById("race-details-page-add-field-filter-button");
const removeFilterItemButton = document.getElementById("race-details-page-remove-filter-button");
addValueFilterItemButton.addEventListener("click", addValueFilterItem);
addFieldFilterItemButton.addEventListener("click", addFieldFilterItem);
removeFilterItemButton.addEventListener("click", removeFilterItem);

function validateValueFilterItemOperatorOptions(columnSelector, operatorSelector) {
  const tableName = columnSelector.value.includes("raced.") ? "raced" : (columnSelector.value.includes("race.") ? "race" : "driver");
  const colVal = String(columnSelector.value);

  if (tables.get(tableName).find((item) => item.col === colVal.split(".")[1]).str && !colVal.includes("date") && !colVal.includes("dob")) {
    if (operatorSelector.options.length !== 2) {
      for (let i = 0; i < 4; i++) operatorSelector.removeChild(operatorSelector.lastChild);
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

function addValueFilterItem() {
  const newItem = document.createElement("div");
  newItem.classList.add("race-details-page-filter-item");
  newItem.classList.add("row");

  const columnSelector = document.createElement("select");
  columnSelector.classList.add("form-select");
  columnSelector.classList.add("col");
  columnSelector.classList.add("column-selector");
  columnSelector.ariaLabel = "race-details-page-filter-item-column-selection";
  const tableNames = ["driver", "race", "raced"];
  for (const tableName of tableNames) {
    for (const { col } of tables.get(tableName)) {
      const newOption = document.createElement("option");
      newOption.value = tableName + "." + String(col);
      let prettyColumnName = col.charAt(0).toUpperCase() + col.replaceAll("_", " ").slice(1);
      prettyColumnName = tableName.charAt(0).toUpperCase() + tableName.slice(1) + " " + prettyColumnName;
      prettyColumnName.replace("Raced", "Race");
      newOption.innerText = prettyColumnName;
      if ((tableName === "raced" && prettyColumnName !== "Raced Race id" && prettyColumnName !== "Raced Driver id") || tableName !== "raced") columnSelector.appendChild(newOption);
    }
  }
  const operatorSelector = document.createElement("select");
  operatorSelector.classList.add("form-select");
  operatorSelector.classList.add("col");
  operatorSelector.classList.add("operator-selector");
  operatorSelector.ariaLabel = "race-details-page-filter-item-operator-selection";
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

  validateValueFilterItemOperatorOptions(columnSelector, operatorSelector);
  columnSelector.addEventListener("change", () => validateValueFilterItemOperatorOptions(columnSelector, operatorSelector));
  newItem.appendChild(columnSelector);
  newItem.appendChild(operatorSelector);
  newItem.appendChild(valueInput);
  filterItemsList.appendChild(newItem);
}

function addFieldFilterItem() {
  const newItem = document.createElement("div");
  newItem.classList.add("race-details-page-filter-item");
  newItem.classList.add("row");

  const column1Selector = document.createElement("select");
  column1Selector.classList.add("form-select");
  column1Selector.classList.add("col");
  column1Selector.classList.add("column-selector");
  column1Selector.ariaLabel = "race-details-page-filter-item-column-selection";
  const tableNames = ["driver", "race", "raced"];
  for (const tableName of tableNames) {
    for (const { col } of tables.get(tableName)) {
      const newOption = document.createElement("option");
      newOption.value = tableName + "." + String(col);
      let prettyColumnName = col.charAt(0).toUpperCase() + col.replaceAll("_", " ").slice(1);
      prettyColumnName = tableName.charAt(0).toUpperCase() + tableName.slice(1) + " " + prettyColumnName;
      newOption.innerText = prettyColumnName;
      if ((tableName === "raced" && prettyColumnName !== "Raced Race id" && prettyColumnName !== "Raced Driver id") || tableName !== "raced") column1Selector.appendChild(newOption);
    }
  }
  const operatorSelector = document.createElement("select");
  operatorSelector.classList.add("form-select");
  operatorSelector.classList.add("col");
  operatorSelector.classList.add("operator-selector");
  operatorSelector.ariaLabel = "race-details-page-filter-item-operator-selection";
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

  const column2Selector = document.createElement("select");
  column2Selector.classList.add("form-select");
  column2Selector.classList.add("col");
  column2Selector.classList.add("input");
  column2Selector.ariaLabel = "race-details-page-filter-item-value-selection";
  for (const tableName of tableNames) {
    for (const { col } of tables.get(tableName)) {
      const newOption = document.createElement("option");
      newOption.value = tableName + "." + String(col);
      let prettyColumnName = col.charAt(0).toUpperCase() + col.replaceAll("_", " ").slice(1);
      prettyColumnName = tableName.charAt(0).toUpperCase() + tableName.slice(1) + " " + prettyColumnName;
      newOption.innerText = prettyColumnName;
      if ((tableName === "raced" && prettyColumnName !== "Raced Race id" && prettyColumnName !== "Raced Driver id") || tableName !== "raced") column2Selector.appendChild(newOption);
    }
  }


  column1Selector.addEventListener("change", () => validateFieldFilterItemOperatorAndColumn2Options(column1Selector, operatorSelector, column2Selector));
  newItem.appendChild(column1Selector);
  newItem.appendChild(operatorSelector);
  newItem.appendChild(column2Selector);
  filterItemsList.appendChild(newItem);
  validateFieldFilterItemOperatorAndColumn2Options(column1Selector, operatorSelector, column2Selector);
}

function validateFieldFilterItemOperatorAndColumn2Options(column1Selector, operatorSelector, column2Selector) {
  const col1TableName = column1Selector.value.includes("raced.") ? "raced" : column1Selector.value.includes("race.") ? "race" : "driver";
  const selectedColIsStr = tables.get(col1TableName).find((item) => item.col === String(column1Selector.value).split(".")[1]).str;

  if (selectedColIsStr && !column1Selector.value.includes("date") && !column1Selector.value.includes("dob")) {
    if (operatorSelector.options.length !== 2) {
      for (let i = 0; i < 4; i++) operatorSelector.removeChild(operatorSelector.lastChild);
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
  const tableNames = ["driver", "race", "raced"];
  const len = column2Selector.options.length;

  for (let i = 0; i < len; i++) column2Selector.removeChild(column2Selector.lastChild);
  for (const tableName of tableNames) {
    for (const { col } of tables.get(tableName)) {
      const newOption = document.createElement("option");
      newOption.value = tableName + "." + String(col);
      const newOptionVal = tableName + "." + String(col);
      if (column1Selector.value.split(".")[1] === newOptionVal.split(".")[1]) continue;
      if ((selectedColIsStr !== tables.get(tableName).find((item) => item.col === col).str)) continue;
      if (column1Selector.value.includes("date") || column1Selector.value.includes("dob")) {
        if (!(col.includes("date") || col.includes("dob"))) {
          continue;
        }
      }
      let prettyColumnName = col.charAt(0).toUpperCase() + col.replaceAll("_", " ").slice(1);
      prettyColumnName = tableName.charAt(0).toUpperCase() + tableName.slice(1) + " " + prettyColumnName;
      newOption.innerText = prettyColumnName;
      if ((tableName === "raced" && prettyColumnName !== "Raced Race id" && prettyColumnName !== "Raced Driver id") || tableName !== "raced") column2Selector.appendChild(newOption);
    }
  }
}

function removeFilterItem() {
  if (filterItemsList.childElementCount > 0) {
    filterItemsList.removeChild(filterItemsList.lastChild);
  }
}
