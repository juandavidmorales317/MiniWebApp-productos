function getProductos() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            var body = document.querySelector('#producto-list tbody');
            body.innerHTML = '';
            data.forEach(p => {
                var row = document.createElement('tr');
                [p.nombre, p.descripcion, p.precio, p.stock].forEach(valor => {
                    var cell = document.createElement('td');
                    cell.textContent = valor;
                    row.appendChild(cell);
                });

                var actions = document.createElement('td');

                var editLink = document.createElement('a');
                editLink.href = `/productos/edit/${p.id}`;
                editLink.textContent = 'Edit';
                editLink.className = 'btn btn-primary mr-2';
                actions.appendChild(editLink);

                var deleteLink = document.createElement('a');
                deleteLink.href = '#';
                deleteLink.textContent = 'Delete';
                deleteLink.className = 'btn btn-danger';
                deleteLink.addEventListener('click', function() {
                    deleteProducto(p.id);
                });
                actions.appendChild(deleteLink);

                row.appendChild(actions);
                body.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function createProducto() {
    var data = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: Number(document.getElementById('precio').value),
        stock: Number(document.getElementById('stock').value)
    };
    fetch('/api/productos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) { throw new Error('Network response was not ok'); }
        return response.json();
    })
    .then(data => {
        console.log(data);
        document.getElementById('add-producto-form').reset();
        getProductos();
    })
    .catch(error => console.error('Error:', error));
}

function updateProducto() {
    var id = document.getElementById('producto-id').value;
    var data = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: Number(document.getElementById('precio').value),
        stock: Number(document.getElementById('stock').value)
    };
    fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) { throw new Error('Network response was not ok'); }
        return response.json();
    })
    .then(data => {
        console.log(data);
        window.location.href = '/productos';
    })
    .catch(error => console.error('Error:', error));
}

function deleteProducto(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`/api/productos/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) { throw new Error('Network response was not ok'); }
            return response.json();
        })
        .then(data => {
            console.log(data);
            getProductos();
        })
        .catch(error => console.error('Error:', error));
    }
}

// Cargar la lista automáticamente en la página de productos
if (document.querySelector('#producto-list')) {
    getProductos();
}
