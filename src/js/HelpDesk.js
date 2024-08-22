
export default class HelpDesk {
  constructor() {
    this.addForm = document.querySelector('.add-form');

    this.list = document.querySelector('.list');
    this.modalAdd = document.querySelector('.modal_add');
    this.modalDelete = document.querySelector('.modal_delete');
    this.modalEdit = document.querySelector('.modal_edit');

    this.changeStat = false;
    this.edit_id = '';
  }

  init() {

    const closeBtn = this.modalEdit.querySelector('.canсel');
    closeBtn.addEventListener('click', () => {
      this.modalEdit.style.display = 'none';
    });

    const closeBtnModalAdd = document.querySelector('.close');
    closeBtnModalAdd.addEventListener('click', () => {
      this.modalAdd.style.display = 'none';
    });

    const updateForm = document.querySelector('.update-form');
    updateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const body = new FormData(updateForm);
      const name = body.get('name');
      const description = body.get('description');

      this.updateTicket(this.edit_id, name, description, this.changeStat);

      this.modalEdit.style.display = 'none';
      body.delete('name');
      body.delete('description');
      this.id_edit = 0;
    });

    const addBtn = document.querySelector('.add_button');
    addBtn.addEventListener('click', () => {
      this.modalAdd.style.display = 'flex';
    });

    this.addForm.addEventListener('submit', (e) => {
      e.preventDefault();

      this.modalAdd.style.display = 'none';
      const body = new FormData(this.addForm);
      const name = body.get('name');
      const description = body.get('description');
      const sendObject = 'name=' + name + '&description=' + description + '&status=' + false;

      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return null;
      };

      xhr.open('POST', 'http://localhost:7070?method=createTicket');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send(sendObject);
      body.delete('name');
      body.delete('description');
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) this.getTasks();
      }
    });

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      if (xhr.status === 200 ) {
          const data = JSON.parse(xhr.responseText);
      }
    });

    this.getTasks();
  }

  addItemFunctionality() {
    const items = Array.from(document.querySelectorAll('.item'));

    for (let i = 0; i < items.length; i++) {
      const element = items[i];
      const id = element.getAttribute('id');
      const btnEdit = element.querySelector('.edit');
      const btnCheckbox = element.querySelector('.checkbox');

      const btnDelete = element.querySelector('.delete');
     
      const description = element.querySelector('.description');

      btnCheckbox.addEventListener('click', (e) => {
        let btnCheck1 = e.currentTarget;
        if (btnCheck1.classList.contains('false')) {
          btnCheck1.classList.add('true');
          btnCheck1.classList.remove('false');
        } else {
          btnCheck1.classList.add('false');
          btnCheck1.classList.remove('true');
        }
        let curCheck = btnCheck1.classList.contains('true');
        let id = e.currentTarget.parentNode.parentNode.id;
        this.changeStatus(id, curCheck);
      });

      btnDelete.addEventListener('click', () => {
        this.deleteTask(id);
      });

      btnEdit.addEventListener('click', (e) => {
        e.preventDefault();
        let check1 =
          e.currentTarget.parentNode.parentNode.querySelector('.checkbox');
        check1 = check1.classList.contains('true');
        let id = e.currentTarget.parentNode.parentNode.parentNode.id
        this.editTask(id);
      });

      element.addEventListener('click', (event) => {
        if ((event.target.localName === "button") || ( (event.target.closest('.item').querySelector('.description').style.display != ""))) {
          description.style.display = '';
          description.textContent = '';
          
        } else {
            description.style.display = 'flex';
            this.addDescription(description, id);
          }
      });
    }
  }

  addDescription(element, id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:7070?method=ticketById&id=' + id);
    xhr.send();
    xhr.addEventListener('load', () => {
        if (xhr.status === 200 ) {
          const data = JSON.parse(xhr.responseText);
          element.textContent = data.ticket.description;
      }
    });
  }

  updateTicket(id, name, description, stat) {
    const sendObject = 'name=' + name + '&description=' + description + '&status=' + stat;

    const xhr_edit = new XMLHttpRequest();
    xhr_edit.open('PATCH', 'http://localhost:7070?method=editTicket&id=' + id);
    xhr_edit.setRequestHeader(
      'Content-type',
      'application/x-www-form-urlencoded'
    );
    xhr_edit.send(sendObject);
    xhr_edit.onreadystatechange = () => {
      if (xhr_edit.readyState === 4) this.getTasks();
    }
  }

  changeStatus(id, stat) {
    this.changeStat = stat;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:7070?method=ticketById&id=' + id);
    xhr.send();
    xhr.addEventListener('load', () => {
     if (xhr.status === 200 ) {
          const data = JSON.parse(xhr.responseText);
          this.updateTicket(id, data.ticket.name, data.ticket.description, this.changeStat);
      }
    });
  }

  getTasks() {
    const list = document.querySelector('.list');
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:7070?method=allTickets');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
    xhr.addEventListener('load', () => {
        if (xhr.status === 200 ) {
          const data = JSON.parse(xhr.responseText);
          this.dataOutput(data);
      }
    });
  }

  deleteTask(id) {
    this.modalDelete.style.display = 'flex';
    this.modalDelete.addEventListener('click', (e) => {
      if (e.target.className.includes('no')) {
        this.modalDelete.style.display = 'none';
      } else {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState !== 4);
          return null;
        };
        xhr.open('DELETE', 'http://localhost:7070?method=deleteTicketById&id=' + id);
        xhr.send();
        this.modalDelete.style.display = 'none';
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) this.getTasks();
        }
      }
    });
  }

  editTask(id) {
    this.modalEdit.style.display = 'flex';
    const inputName = this.modalEdit.querySelector('.name');
    const inputDescription = this.modalEdit.querySelector('.text');
    const editBtn = this.modalEdit.querySelector('.save');
    let id_edit = id;
    const xhr_edit = new XMLHttpRequest();
    xhr_edit.open('GET', 'http://localhost:7070?method=ticketById&id=' + id_edit);
    xhr_edit.send();
    xhr_edit.addEventListener('load', () => {
      if (xhr_edit.status === 200 ) {
          const data = JSON.parse(xhr_edit.responseText);
          inputName.value = data.ticket.name;
          inputDescription.value = data.ticket.description;
          this.changeStat = data.ticket.status;
          this.edit_id = data.ticket.id;
      }
    });
  }

  dataOutput(data) {
    data.forEach((item) => {
      this.pushItem(item);
    });

    this.addItemFunctionality();
  }

  pushItem(item) {
    const newElement = document.createElement('div');
    newElement.classList.add('item');
    newElement.setAttribute('id', item.id);
    const container = document.createElement('div');
    container.classList.add('container');
    const checkbox = document.createElement('button');
    checkbox.classList.add(`${item.status}`, 'checkbox');
    container.append(checkbox);

    const nameText = document.createElement('p');
    nameText.textContent = item.name;
    container.append(nameText);

    const dateText = document.createElement('p');
    const newDate = new Date(item.created);
    dateText.textContent = newDate.getDate() + '.' + (newDate.getMonth() + 1) + '.' + newDate.getFullYear() + ':' + newDate.getHours() + ':' + newDate.getMinutes();
    container.append(dateText);

    const buttonBox = document.createElement('div');
    buttonBox.classList.add('buttons');
    const buttonEdit = document.createElement('button');
    buttonEdit.classList.add('edit', 'btn');
    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('delete', 'btn');
    buttonBox.append(buttonEdit);
    buttonBox.append(buttonDelete);
    container.append(buttonBox);
    newElement.append(container);

    const description = document.createElement('div');
    description.classList.add('description');
    newElement.append(description);

    this.list.append(newElement);
  }
}
