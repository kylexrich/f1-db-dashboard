
export function handleExecuteQueryButtonClick(methodType, url, renderResultFunction, renderErrorFunction, requestBody) {
  const xhr = new XMLHttpRequest();
  xhr.open(methodType, url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onload = () => {
    if (xhr.status === 200) {

      const result = JSON.parse(xhr.response).result;
      return renderResultFunction(result);
    } else {
      const err = JSON.parse(xhr.response).error;
      return renderErrorFunction(err);
    }
  };

  try {
    if(requestBody) {
      xhr.send(requestBody);
    } else {
      xhr.send();
    }
  } catch (e) {
    renderErrorFunction(e.message);
  }
}

export function handleRequest(methodType, url,requestBody, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open(methodType, url, false);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const result = JSON.parse(xhr.response).result;
      callback(result);
    } else {
      const err = JSON.parse(xhr.response).error;
      callback(err);
    }
  };

  try {
    if(requestBody) {
      xhr.send(requestBody);
    } else {
      xhr.send();
    }
  } catch (e) {
    return e.message;
  }
}
