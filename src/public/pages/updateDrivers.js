import { handleExecuteQueryButtonClick } from "../requestSender.js";
import { tables } from "../tables.js";
const updateDriversResultDiv = document.getElementById("update-drivers-result");
const executeUpdateDriversButton = document.getElementById("execute-update-drivers-button");

executeUpdateDriversButton.addEventListener("click", () =>
  handleExecuteQueryButtonClick("POST", "/update", renderUpdateResult, renderUpdateError, buildUpdateQueryObject()));

function buildUpdateQueryObject() {
  const table = 'driver';
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

  const name = document.getElementById("newNameInput").value;
  const nationality = document.getElementById("newNationalityInput").value;
  const dob = document.getElementById("newDobInput").value;
  const placeOfBirth = document.getElementById("newPlaceOfBirthInput").value;
  const worldChamps = document.getElementById("newWorldChampionsInput").value;
  const fastestLaps = document.getElementById("newFastestLapsInput").value;
  const racesWon = document.getElementById("newRacesWonInput").value;
  const podiums = document.getElementById("newPodiumsInput").value;


  const newValues = {};

  if(name)          newValues["name"] = name;
  if(nationality)   newValues["nationality"] = nationality;
  if(dob)           newValues["dob"] = dob;
  if(placeOfBirth)  newValues["place_of_birth"] = placeOfBirth;
  if(worldChamps)   newValues["world_championships"] = worldChamps;
  if(fastestLaps)   newValues["fastest_laps"] = fastestLaps;
  if(racesWon)      newValues["races_won"] = racesWon;
  if(podiums)       newValues["podiums"] = podiums;

  return JSON.stringify(filterDropdown.value === 'noFilter' ?
      { tableName: table, newColumnValues: newValues } :
      {
        tableName: table,
        filter: {
          type: filterDropdown.value,
          filterItems: filterList
        },
        newColumnValues: newValues
     });
}

function renderUpdateResult(data) {
  while (updateDriversResultDiv.lastChild != null) {
    updateDriversResultDiv.removeChild(updateDriversResultDiv.lastChild);
  }
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-success");
  alert.role = "alert"
  alert.innerText = "If any drivers matched your filters: Drivers successfully updated! Please see updated table below";
  updateDriversResultDiv.appendChild(alert);
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
  updateDriversResultDiv.appendChild(resultTable);
}

function renderUpdateError(errMessage) {
  while (updateDriversResultDiv.lastChild != null) {
    updateDriversResultDiv.removeChild(updateDriversResultDiv.lastChild);
  }
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-danger");
  alert.role = "alert"
  alert.innerText = errMessage;
  updateDriversResultDiv.appendChild(alert);
}


const filterDropdown = document.getElementById("update-page-filter-selection-dropdown");
const filterItemsList = document.getElementById("update-page-filter-items-list");
filterDropdown.addEventListener("change", changeFilterItemDisplay);
const filterItemsSection = document.getElementById("update-page-filter-items-section");

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

const addFilterItemButton = document.getElementById("update-page-add-filter-button");
const removeFilterItemButton = document.getElementById("update-page-remove-filter-button");
addFilterItemButton.addEventListener("click", addFilterItem);
removeFilterItemButton.addEventListener("click", () => removeFilterItem(true));

function validateFilterItemOperatorOptions(columnSelector, operatorSelector, valueInput) {
  if((tables.get("driver").find((item) => item.col === columnSelector.value).str) && !columnSelector.value.includes("date") && !columnSelector.value.includes("dob")) {
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
  newItem.classList.add("update-page-filter-item");
  newItem.classList.add("row");

  const columnSelector = document.createElement("select");
  columnSelector.classList.add("form-select");
  columnSelector.classList.add("col");
  columnSelector.classList.add("column-selector");
  columnSelector.ariaLabel = "update-page-filter-item-column-selection";
  const tableName = "driver";
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
  operatorSelector.ariaLabel = "update-page-filter-item-operator-selection";
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
