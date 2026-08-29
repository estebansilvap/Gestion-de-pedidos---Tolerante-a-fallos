    const API = 'http://localhost:8000/api/productos'
    const tabla = document.getElementById('tablaPedidos')
    const formPanel = document.getElementById('formPanel')
    let editingId = null

    // ─── TOAST ───────────────────────────────────────────
    function showToast(msg, type = 'success') {
      const t = document.getElementById('toast')
      t.textContent = msg
      t.className = `toast ${type} show`
      setTimeout(() => t.className = 'toast', 3000)
    }

    // ─── ESTADO → CLASE ──────────────────────────────────
    function stateClass(state) {
      const map = {
        'Pendiente': 'state-pendiente',
        'En proceso': 'state-en-proceso',
        'Enviado': 'state-enviado',
        'Entregado': 'state-entregado'
      }
      return map[state] || ''
    }

    // ─── CARGAR PEDIDOS ───────────────────────────────────
    async function cargarPedidos() {
      try {
        const res = await fetch(API)
        const pedidos = await res.json()

        document.getElementById('countBadge').textContent =
          `${pedidos.length} pedido${pedidos.length !== 1 ? 's' : ''}`

        if (pedidos.length === 0) {
          tabla.innerHTML = `
            <tr><td colspan="7">
              <div class="empty">
                <span>📦</span>No hay pedidos registrados
              </div>
            </td></tr>`
          return
        }

        tabla.innerHTML = pedidos.map(p => `
          <tr id="row-${p.id}" ${editingId == p.id ? 'class="editing-row"' : ''}>
            <td class="td-id">#${p.id}</td>
            <td>${p.customer}</td>
            <td>${p.product}</td>
            <td>${p.amount}</td>
            <td><span class="state ${stateClass(p.state)}">${p.state}</span></td>
            <td>${p.start_date}</td>
            <td>
              <div class="td-actions">
                <button class="btn-icon btn-edit" onclick="editarPedido(${p.id},'${p.customer}','${p.product}',${p.amount},'${p.state}','${p.start_date}')">editar</button>
                <button class="btn-icon btn-delete" onclick="eliminarPedido(${p.id})">eliminar</button>
              </div>
            </td>
          </tr>
        `).join('')

      } catch (err) {
        console.error(err)
        showToast('Error al conectar con el servidor', 'error')
      }
    }

    // ─── SUBMIT (CREAR / ACTUALIZAR) ─────────────────────
    async function submitForm() {
      const customer  = document.getElementById('f-customer').value.trim()
      const product   = document.getElementById('f-product').value.trim()
      const amount    = document.getElementById('f-amount').value
      const state     = document.getElementById('f-state').value
      const start_date = document.getElementById('f-date').value

      if (!customer || !product || !amount || !start_date) {
        showToast('Completa todos los campos', 'error')
        return
      }

      const body = new FormData()
      body.append('customer', customer)
      body.append('product', product)
      body.append('amount', amount)
      body.append('state', state)
      body.append('start_date', start_date)

      try {
        const url    = editingId ? `${API}/${editingId}` : API
        const method = editingId ? 'PUT' : 'POST'

        const res  = await fetch(url, { method, body })
        const data = await res.json()

        showToast(data.msg || 'Operación exitosa', 'success')
        cancelEdit()
        cargarPedidos()

      } catch (err) {
        console.error(err)
        showToast('Error al guardar el pedido', 'error')
      }
    }

    // ─── EDITAR ───────────────────────────────────────────
    function editarPedido(id, customer, product, amount, state, date) {
      editingId = id
      document.getElementById('f-customer').value = customer
      document.getElementById('f-product').value  = product
      document.getElementById('f-amount').value   = amount
      document.getElementById('f-state').value    = state
      document.getElementById('f-date').value     = date

      document.getElementById('btnSubmit').textContent = 'Actualizar Pedido'
      document.getElementById('btnCancel').style.display = 'block'
      document.getElementById('formTitle').textContent = `Editando #${id}`
      formPanel.classList.add('edit-mode')

      cargarPedidos() // resalta la fila
      formPanel.scrollIntoView({ behavior: 'smooth' })
    }

    // ─── CANCELAR EDICIÓN ─────────────────────────────────
    function cancelEdit() {
      editingId = null
      document.getElementById('f-customer').value = ''
      document.getElementById('f-product').value  = ''
      document.getElementById('f-amount').value   = ''
      document.getElementById('f-state').value    = 'Pendiente'
      document.getElementById('f-date').value     = ''

      document.getElementById('btnSubmit').textContent = 'Guardar Pedido'
      document.getElementById('btnCancel').style.display = 'none'
      document.getElementById('formTitle').textContent = 'Nuevo Pedido'
      formPanel.classList.remove('edit-mode')
    }

    // ─── ELIMINAR ─────────────────────────────────────────
    async function eliminarPedido(id) {
      if (!confirm(`¿Eliminar pedido #${id}?`)) return
      try {
        const res  = await fetch(`${API}/${id}`, { method: 'DELETE' })
        const data = await res.json()
        showToast(data.msg || 'Pedido eliminado', 'success')
        cargarPedidos()
      } catch (err) {
        console.error(err)
        showToast('Error al eliminar', 'error')
      }
    }

    // ─── INIT ─────────────────────────────────────────────
    cargarPedidos()