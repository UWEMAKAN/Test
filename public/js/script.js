window.onload=function() {
  const checkbox = document.getElementById('selectAll');
  const checkboxes = document.querySelectorAll('.select');
  const btnDelete = document.querySelector('.btn-outline-danger');
  const responseForm = document.querySelector('.responseForm');

  checkbox.addEventListener('change', (event) => {
    if (checkbox.checked) {
      checkboxes.forEach((element, index) => {
        element.checked = true;
      });
    } else {
      checkboxes.forEach((element, index) => {
        element.checked = false;
      });
    }
  });
  
  checkboxes.forEach((element) => {
    element.addEventListener('change', (event) => {
      const checking = Array.from(checkboxes).every(isChecked);
      if (checking) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
      if (element.checked) {
        element.value = true;
      } else {
        element.value = false;
      }
    });
  });

  // btnDelete.addEventListener('click', (event) => {    
  //   const selectedBoxes = Array.from(checkboxes).filter(check => check.checked);
  //   const formData = new FormData()
  //   selectedBoxes.forEach((box) => {
  //     formData.append(box.name, box.checked);
  //   });

  //   for (let key of formData.keys()) {
  //     console.log(key, formData.get(key)); 
  //   }
  //   async function postData(url = '', data = {}) {
  //     // Default options are marked with *
  //     const response = await fetch(url, {
  //       method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
  //       mode: 'same-origin', // no-cors, *cors, same-origin
  //       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //       credentials: 'same-origin', // include, *same-origin, omit
  //       headers: {
  //         'Content-Type': 'application/json'
  //         // 'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       redirect: 'follow', // manual, *follow, error
  //       referrerPolicy: 'no-referrer', // no-referrer, *client
  //       body: JSON.stringify(data) // body data type must match "Content-Type" header
  //     });
  //     return await response.json(); // parses JSON response into native JavaScript objects
  //   }

  //   postData(`http://localhost:4500/admin/${btnDelete.id}/${responseForm.id}`, formData)
  //     .then((data) => {
  //       console.log(data); // JSON data parsed by `response.json()` call
  //     });
  //   event.preventDefault();
  // });

  const isChecked = (current) => current.checked === true;
}