 // Global variables
        let isLoggedIn = false;
        let currentEditId = null;
        let currentDeleteId = null;
        let allOrders = [];

        // Service prices and names
        const servicePrices = {
            'peinture': 120000,
            'wrap': 180000,
            'bodykit': 90000,
            'jantes': 20000,
            'vitre': 15000,
            'phares': 10000,
            'decals': 13000,
            'ceramique': 40000,
            'ppf': 55000
        };

        const serviceNames = {
            'peinture': 'Peinture Auto',
            'wrap': 'Vinyl Wrap (complet)',
            'bodykit': 'Installation Body Kit',
            'jantes': 'Personnalisation Jantes',
            'vitre': 'Teinte Vitres',
            'phares': 'Teinte Phares',
            'decals': 'Décals & Graphiques',
            'ceramique': 'Revêtement Céramique',
            'ppf': 'PPF (pare-chocs avant)'
        };

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            checkLoginStatus();
            initializeEventListeners();
        });

        function checkLoginStatus() {
            const isAdmin = sessionStorage.getItem('adminLoggedIn');
            if (isAdmin === 'true') {
                isLoggedIn = true;
                showDashboard();
            } else {
                showLogin();
            }
        }

        function initializeEventListeners() {
            // Login form
            document.getElementById('loginForm').addEventListener('submit', handleLogin);
            
            // Order form
            document.getElementById('orderForm').addEventListener('submit', handleOrderSave);
            
            // Delete confirmation
            document.getElementById('confirmDelete').addEventListener('click', handleDelete);
            
            // Modal close on outside click
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            });
            
            // Escape key to close modals
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.style.display = 'none';
                    });
                }
            });
        }

        function handleLogin(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'admin' && password === 'admin123') {
                sessionStorage.setItem('adminLoggedIn', 'true');
                isLoggedIn = true;
                showDashboard();
                showMessage('Connexion réussie !', 'success', 'loginError');
            } else {
                showMessage('Nom d\'utilisateur ou mot de passe incorrect.', 'error', 'loginError');
            }
        }

        function logout() {
            sessionStorage.removeItem('adminLoggedIn');
            isLoggedIn = false;
            showLogin();
        }

        function showLogin() {
            document.getElementById('loginSection').style.display = 'flex';
            document.getElementById('dashboardSection').classList.remove('active');
        }

        function showDashboard() {
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('dashboardSection').classList.add('active');
            loadOrders();
            updateStatistics();
        }

        function loadOrders() {
            allOrders = JSON.parse(localStorage.getItem('autoCustomOrders') || '[]');
            displayOrders(allOrders);
        }

        function displayOrders(orders) {
            const tbody = document.getElementById('ordersTableBody');
            const emptyState = document.getElementById('emptyState');
            
            if (orders.length === 0) {
                tbody.innerHTML = '';
                emptyState.style.display = 'block';
                return;
            }
            
            emptyState.style.display = 'none';
            
            tbody.innerHTML = orders.map(order => `
                <tr class="${order.discountApplied ? 'highlighted-row' : ''}" data-order-id="${order.id}">
                    <td>#${order.id.slice(-6)}</td>
                    <td>${order.name}</td>
                    <td>${order.phone}</td>
                    <td>${order.serviceName}</td>
                    <td>${formatPrice(order.basePrice)}</td>
                    <td>
                        ${order.discountApplied ? 
                            '<span class="discount-badge">CLIENT FIDÈLE -20%</span>' : 
                            '<span style="color: var(--silver);">Aucune</span>'
                        }
                    </td>
                    <td><strong>${formatPrice(order.finalPrice)}</strong></td>
                    <td>${order.message || '<em style="color: var(--silver);">Aucun message</em>'}</td>
                    <td>${order.date}</td>
                    <td>
                        <div class="action-buttons">
                            <button onclick="openEditModal('${order.id}')" class="btn btn-small">✏️ Modifier</button>
                            <button onclick="openDeleteModal('${order.id}')" class="btn btn-danger btn-small">🗑️ Supprimer</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        function filterOrders() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const serviceFilter = document.getElementById('serviceFilter').value;
            const discountFilter = document.getElementById('discountFilter').value;
            
            let filtered = allOrders.filter(order => {
                const matchesSearch = order.name.toLowerCase().includes(searchTerm) ||
                                    order.phone.includes(searchTerm) ||
                                    order.serviceName.toLowerCase().includes(searchTerm);
                
                const matchesService = !serviceFilter || order.service === serviceFilter;
                
                const matchesDiscount = !discountFilter || 
                                      (discountFilter === 'true' && order.discountApplied) ||
                                      (discountFilter === 'false' && !order.discountApplied);
                
                return matchesSearch && matchesService && matchesDiscount;
            });
            
            displayOrders(filtered);
        }

        function updateStatistics() {
            const orders = allOrders;
            const totalOrders = orders.length;
            const returningCustomers = orders.filter(order => order.discountApplied).length;
            const totalRevenue = orders.reduce((sum, order) => sum + order.finalPrice, 0);
            const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
            
            document.getElementById('totalOrders').textContent = totalOrders;
            document.getElementById('returningCustomers').textContent = returningCustomers;
            document.getElementById('totalRevenue').textContent = formatPrice(totalRevenue);
            document.getElementById('averageOrder').textContent = formatPrice(averageOrder);
        }

        function openAddModal() {
            document.getElementById('modalTitle').textContent = 'Nouvelle Commande';
            document.getElementById('orderForm').reset();
            document.getElementById('editOrderId').value = '';
            currentEditId = null;
            document.getElementById('orderModal').style.display = 'block';
        }

        function openEditModal(orderId) {
            const order = allOrders.find(o => o.id === orderId);
            if (!order) return;
            
            document.getElementById('modalTitle').textContent = 'Modifier la Commande';
            document.getElementById('editOrderId').value = orderId;
            document.getElementById('editName').value = order.name;
            document.getElementById('editPhone').value = order.phone;
            document.getElementById('editService').value = order.service;
            document.getElementById('editMessage').value = order.message || '';
            
            currentEditId = orderId;
            document.getElementById('orderModal').style.display = 'block';
        }

        function openDeleteModal(orderId) {
            currentDeleteId = orderId;
            document.getElementById('deleteModal').style.display = 'block';
        }

        function handleOrderSave(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const name = formData.get('name').trim();
            const phone = formData.get('phone').trim();
            const service = formData.get('service');
            const message = formData.get('message').trim();
            
            if (!name || !phone || !service) {
                showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }
            
            // Check for returning customer (excluding current order if editing)
            const existingOrders = allOrders.filter(order => 
                order.phone === phone && order.id !== currentEditId
            );
            const isReturning = existingOrders.length > 0;
            
            const basePrice = servicePrices[service];
            const discount = isReturning ? 0.2 : 0;
            const finalPrice = basePrice * (1 - discount);
            
            const orderData = {
                id: currentEditId || Date.now().toString(),
                name,
                phone,
                service,
                serviceName: serviceNames[service],
                basePrice,
                discountApplied: isReturning,
                finalPrice,
                message,
                date: currentEditId ? 
                    allOrders.find(o => o.id === currentEditId).date : 
                    new Date().toLocaleString('fr-FR')
            };
            
            if (currentEditId) {
                // Update existing order
                const index = allOrders.findIndex(o => o.id === currentEditId);
                allOrders[index] = orderData;
                showMessage('Commande modifiée avec succès !', 'success');
            } else {
                // Add new order
                allOrders.push(orderData);
                showMessage('Commande ajoutée avec succès !', 'success');
            }
            
            // Save to localStorage
            localStorage.setItem('autoCustomOrders', JSON.stringify(allOrders));
            
            // Refresh display
            displayOrders(allOrders);
            updateStatistics();
            closeModal('orderModal');
        }

        function handleDelete() {
            if (!currentDeleteId) return;
            
            allOrders = allOrders.filter(order => order.id !== currentDeleteId);
            localStorage.setItem('autoCustomOrders', JSON.stringify(allOrders));
            
            displayOrders(allOrders);
            updateStatistics();
            closeModal('deleteModal');
            showMessage('Commande supprimée avec succès !', 'success');
            
            currentDeleteId = null;
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        function formatPrice(price) {
            return new Intl.NumberFormat('fr-DZ', {
                style: 'currency',
                currency: 'DZD',
                minimumFractionDigits: 0
            }).format(price).replace('DZD', 'DZD');
        }

        function showMessage(text, type, containerId = null) {
            // Remove existing messages
            document.querySelectorAll('.message').forEach(msg => msg.remove());
            
            const message = document.createElement('div');
            message.className = `message ${type}`;
            message.textContent = text;
            
            if (containerId) {
                const container = document.getElementById(containerId);
                container.appendChild(message);
            } else {
                const dashboard = document.querySelector('.commands-section');
                dashboard.insertBefore(message, dashboard.firstChild);
            }
            
            setTimeout(() => {
                message.remove();
            }, 5000);
        }

        // Auto-refresh orders every 30 seconds
        setInterval(() => {
            if (isLoggedIn) {
                loadOrders();
                updateStatistics();
            }
        }, 30000);

        // Export functionality (bonus feature)
        function exportOrders() {
            const csvContent = "data:text/csv;charset=utf-8," 
                + "ID,Nom,Téléphone,Service,Prix Base,Remise,Prix Final,Message,Date\n"
                + allOrders.map(order => 
                    `${order.id},"${order.name}","${order.phone}","${order.serviceName}",${order.basePrice},${order.discountApplied ? '20%' : '0%'},${order.finalPrice},"${order.message || ''}","${order.date}"`
                ).join('\n');
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `commandes_customcars_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Add export button to the header (optional)
        document.addEventListener('DOMContentLoaded', () => {
            if (window.location.search.includes('export=true')) {
                const exportBtn = document.createElement('button');
                exportBtn.textContent = '📊 Exporter CSV';
                exportBtn.className = 'btn btn-secondary btn-small';
                exportBtn.onclick = exportOrders;
                
                const userInfo = document.querySelector('.user-info');
                userInfo.insertBefore(exportBtn, userInfo.firstChild);
            }
        });