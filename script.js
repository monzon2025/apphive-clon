let selectedElement = null;

document.querySelectorAll('.draggable').forEach(elem => {
  elem.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData("component", e.target.dataset.type);
  });
});

function drop(e) {
  e.preventDefault();
  const type = e.dataTransfer.getData("component");

  let newElem;

  switch(type) {
    case 'text':
      newElem = document.createElement('p');
      newElem.textContent = 'Texto de ejemplo';
      break;
    case 'button':
      newElem = document.createElement('button');
      newElem.textContent = 'Botón';
      break;
    case 'image':
      newElem = document.createElement('img');
      newElem.src = 'https://via.placeholder.com/100';
      newElem.style.width = '100px';
      break;
    case 'input':
      newElem = document.createElement('input');
      newElem.placeholder = 'Ingrese texto';
      break;
    case 'container':
      newElem = document.createElement('div');
      newElem.style.border = '1px dashed gray';
      newElem.style.padding = '10px';
      newElem.textContent = 'Contenedor';
      break;
  }

  newElem.classList.add('element');
  newElem.addEventListener('click', () => selectElement(newElem));
  document.getElementById('canvas').appendChild(newElem);
}

function selectElement(elem) {
  if (selectedElement) selectedElement.classList.remove('selected');
  selectedElement = elem;
  elem.classList.add('selected');
  showProperties(elem);
}

function showProperties(elem) {
  const props = document.getElementById('propsContainer');
  props.innerHTML = '';

  if (elem.tagName === 'P' || elem.tagName === 'BUTTON' || elem.tagName === 'DIV') {
    props.innerHTML += \`
      <label>Texto:</label>
      <input type="text" value="\${elem.textContent}" oninput="selectedElement.textContent = this.value">
    \`;
  }
  if (elem.tagName === 'IMG') {
    props.innerHTML += \`
      <label>URL de imagen:</label>
      <input type="text" value="\${elem.src}" oninput="selectedElement.src = this.value">
    \`;
  }
  if (elem.tagName === 'INPUT') {
    props.innerHTML += \`
      <label>Placeholder:</label>
      <input type="text" value="\${elem.placeholder}" oninput="selectedElement.placeholder = this.value">
    \`;
  }
}

function saveProject() {
  const elements = [];
  document.querySelectorAll('#canvas .element').forEach(el => {
    const data = {
      tag: el.tagName,
      text: el.textContent,
      src: el.src || null,
      placeholder: el.placeholder || null,
      style: el.getAttribute('style')
    };
    elements.push(data);
  });

  const blob = new Blob([JSON.stringify(elements, null, 2)], {type : 'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'proyecto_apphive.json';
  a.click();
}

document.getElementById('loadFile').addEventListener('change', function() {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const elements = JSON.parse(e.target.result);
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
    elements.forEach(data => {
      const el = document.createElement(data.tag);
      if (data.text) el.textContent = data.text;
      if (data.src) el.src = data.src;
      if (data.placeholder) el.placeholder = data.placeholder;
      if (data.style) el.setAttribute('style', data.style);
      el.classList.add('element');
      el.addEventListener('click', () => selectElement(el));
      canvas.appendChild(el);
    });
  };
  reader.readAsText(file);
});
