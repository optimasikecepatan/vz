// --- KONFIGURASI ---
        const sheetDbUrl = "/db"; 
        const gid = "116701254"; 
        // State Global
        let allOrders = []; // Menyimpan semua data mentah
        let currentFilter = 'ALL';

        document.addEventListener('DOMContentLoaded', () => {
            initFilters();
            fetchOrders();
        });

        // Inisialisasi Filter berdasarkan Config Ongkir
        function initFilters() {
            if (Config.ongkir.status === 'on') {
                const procBtn = document.getElementById('filter-processed');
                const shipBtn = document.getElementById('filter-shipped');
                if(procBtn) procBtn.classList.remove('hidden');
                if(shipBtn) shipBtn.classList.remove('hidden');
            }
        }

        function setFilter(filterType) {
            currentFilter = filterType;
            
            // Update UI Button Active State
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.getElementById(`filter-${filterType.toLowerCase()}`);
            if(activeBtn) activeBtn.classList.add('active');

            // Render ulang list
            renderOrderList();
            
            // Scroll to top of list smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function fetchOrders() {
            // Query mengambil A-N
            // N (index 13) diasumsikan sebagai STATUS
            const query = `select A, B, C, D, E, F, G, H, I, J, K, L, M, N where B = '${uuid}' order by A desc`; 
            const url = `${sheetDbUrl}?&tq=${encodeURIComponent(query)}&gid=${gid}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                .then(data => {
                    const jsonString = data.substring(data.indexOf("{"), data.lastIndexOf("}") + 1);
                    const json = JSON.parse(jsonString);
                    
                    allOrders = json.table.rows || [];
                    
                    // Hitung jumlah untuk update badge
                    updateFilterCounts();
                    
                    renderOrderList();
                })
                .catch(error => {
                    console.error('Error fetching orders:', error);
                    document.getElementById('order-list-container').innerHTML = `
                        <div class="text-center py-10">
                            <i class="fas fa-exclamation-circle text-red-400 text-4xl mb-3"></i>
                            <p class="text-gray-600 font-medium">Gagal memuat pesanan.</p>
                            <p class="text-sm text-gray-400 mt-1">${error.message}</p>
                            <button onclick="fetchOrders()" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700">Coba Lagi</button>
                        </div>
                    `;
                });
        }

        // Helper untuk menentukan Group Status
        function getStatusGroup(statusUpper) {
            if (['SUKSES','DONE','SELESAI','LUNAS'].some(s => statusUpper.includes(s))) return 'SUCCESS';
            if (['CANCEL','GAGAL','BATAL','TOLAK','REFUND'].some(s => statusUpper.includes(s))) return 'CANCEL';
            if (['DIKIRIM','SENT','OTW'].some(s => statusUpper.includes(s))) return 'SHIPPED';
            if (['PROCES','KEMAS','DIKEMAS','DIPROSES'].some(s => statusUpper.includes(s))) return 'PROCESSED';
            return 'PENDING';
        }

        function updateFilterCounts() {
            const counts = { ALL: 0, PENDING: 0, PROCESSED: 0, SHIPPED: 0, SUCCESS: 0, CANCEL: 0 };

            allOrders.forEach(row => {
                counts.ALL++;
                const rawStatus = row.c[13]?.v || 'PENDING';
                const statusUpper = String(rawStatus).trim().toUpperCase();
                const group = getStatusGroup(statusUpper);
                
                // Increment counter berdasarkan group
                if(counts.hasOwnProperty(group)) {
                    counts[group]++;
                } else if(statusUpper === '' || statusUpper === 'PENDING') {
                    counts.PENDING++;
                }
            });

            // Update Badge Text and Visibility
            const updateBadge = (id, count) => {
                const badge = document.querySelector(`#${id} .badge`);
                if(badge) {
                    badge.textContent = count;
                    badge.classList.remove('hidden');
                    if(count === 0) badge.classList.add('hidden');
                }
            };

            updateBadge('filter-all', counts.ALL);
            updateBadge('filter-pending', counts.PENDING);
            updateBadge('filter-processed', counts.PROCESSED);
            updateBadge('filter-shipped', counts.SHIPPED);
            updateBadge('filter-success', counts.SUCCESS);
            updateBadge('filter-cancel', counts.CANCEL);
        }

        function renderOrderList() {
            const container = document.getElementById('order-list-container');
            container.innerHTML = '';

            // Filter Logic
            const filteredRows = allOrders.filter(row => {
                if (currentFilter === 'ALL') return true;
                
                const rawStatus = row.c[13]?.v || 'PENDING';
                const statusUpper = String(rawStatus).trim().toUpperCase();
                const group = getStatusGroup(statusUpper);

                return group === currentFilter;
            });

            if (filteredRows.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm mx-2">
                        <i class="fas fa-filter text-gray-300 text-5xl mb-4"></i>
                        <p class="text-gray-600 text-lg font-medium">Tidak ada pesanan.</p>
                        <p class="text-gray-400 text-sm">Coba ganti filter status lainnya.</p>
                        ${currentFilter !== 'ALL' ? '<button onclick="setFilter(\'ALL\')" class="text-blue-600 text-base font-medium mt-4 hover:underline">Lihat Semua Pesanan</button>' : ''}
                    </div>
                `;
                return;
            }

            filteredRows.forEach(row => {
                // Mapping Data
                const trxId = row.c[10]?.v || '-';     
                const rawStatus = row.c[13]?.v || 'PENDING'; 
                const status = String(rawStatus).trim(); 
                const total = row.c[9]?.v || 0;       
                const payTo = row.c[11]?.v || '-';
                const resiAkses = row.c[12]?.v || '#';      
                const itemsJson = row.c[6]?.v || '[]'; 

                // Info Pembeli
                const buyerName = row.c[2]?.v || 'Tamu';
                const buyerAddr = row.c[4]?.v || 'Alamat tidak tersedia';
                
                let items = [];
                try {
                    let parsed = null;
                    if (typeof itemsJson === 'string') parsed = JSON.parse(itemsJson);
                    else if (typeof itemsJson === 'object') parsed = itemsJson;
                    
                    if (Array.isArray(parsed)) items = parsed;
                    else if (parsed) items = [parsed];
                } catch (e) {
                    items = [{item: "Produk Error", qty: row.c[8]?.v || 1}]; 
                }

                // Status Grouping & Styling
                const statusUpper = status.toUpperCase();
                const group = getStatusGroup(statusUpper);
                
                let statusClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
                let iconClass = "fa-clock";

                if (group === 'SUCCESS') {
                    statusClass = "bg-green-100 text-green-700 border-green-200";
                    iconClass = "fa-check-circle";
                } else if (group === 'CANCEL') {
                    statusClass = "bg-red-100 text-red-700 border-red-200";
                    iconClass = "fa-times-circle";
                } else if (group === 'PROCESSED') {
                    statusClass = "bg-blue-100 text-blue-700 border-blue-200";
                    iconClass = "fa-box-open";
                } else if (group === 'SHIPPED') {
                    statusClass = "bg-indigo-100 text-indigo-700 border-indigo-200";
                    iconClass = "fa-truck-fast";
                }

                // Render Item List
                let itemsHtml = '';
                if (Array.isArray(items)) {
                    itemsHtml = items.map(i => {
                        const names = i.name || i.title || i.item || 'Produk Tanpa Nama';
                        const qty = i.qty || i.quantity || 1;
                        const img = i.image || 'https://via.placeholder.com/100?text=IMG';
                        const price = i.price ? parseInt(i.price) : 0;
                        const varian = i.varian ? `<span class="text-xs text-gray-500 block mt-0.5">Varian: ${i.varian}</span>` : '';
                        
                        return `
                        <div class="flex gap-4 items-start mt-4 first:mt-0 border-b border-dashed border-gray-200 pb-4 last:border-0 last:pb-0">
                            <div class="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img src="${img}" alt="${names}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/100?text=No+Img'">
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-base font-semibold text-gray-800 line-clamp-2 leading-snug">${names}</p>
                                ${varian}
                                <div class="flex justify-between items-end mt-2">
                                    <p class="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md font-medium">x${qty}</p>
                                    ${price > 0 ? `<p class="text-sm font-bold text-gray-700">Rp ${price.toLocaleString('id-ID')}</p>` : ''}
                                </div>
                            </div>
                        </div>
                        `;
                    }).join('');
                }

                const html = `
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 transition-all hover:shadow-md animate-fade-in">
                    <!-- Header Card -->
                    <div class="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                        <div class="flex flex-col">
                            <span class="text-xs text-gray-500 uppercase tracking-wide font-semibold">No. Pesanan</span>
                            <span class="text-sm font-bold text-gray-800">#${trxId}</span>
                        </div>
                        <div class="px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusClass}">
                            <i class="fas ${iconClass}"></i> ${statusUpper}
                        </div>
                    </div>

                    <!-- Items Container -->
                    <div class="mb-4">
                        ${itemsHtml}
                    </div>

                    <!-- Info Pembeli -->
                    <div class="mb-4 bg-gray-50 rounded-lg p-3 text-sm border border-gray-100">
                        <p class="text-xs text-gray-500 font-semibold uppercase mb-1">Info Pembeli</p>
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between">
                                <span class="text-gray-500">Penerima:</span>
                                <span class="font-medium text-gray-800 text-right line-clamp-1 pl-2">${buyerName}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500">Alamat:</span>
                                <span class="font-medium text-gray-800 text-right line-clamp-2 pl-2 text-xs">${buyerAddr}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Card -->
                    <div class="flex justify-between items-center pt-2">
                        <div>
                            <p class="text-xs text-gray-500 mb-0.5">Metode Bayar</p>
                            <p class="text-sm font-bold text-gray-700">${payTo}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-500 mb-0.5">Total Tagihan</p>
                            <p class="text-base font-bold text-blue-600">Rp ${parseInt(total).toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    
                    <!-- Action Buttons Container (UPDATED: Justify Center for PC) -->
                    <div class="mt-4 pt-4 border-t border-dashed border-gray-200 md:flex md:justify-center md:gap-3">
                        
                        <!-- PENDING -->
                        ${group === 'PENDING' ? `
                        <button onclick="window.location.href='/payment?trx=${trxId}'" class="w-full md:w-auto md:px-8 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95 flex justify-center items-center gap-2">
                            <span>Bayar Sekarang</span> <i class="fas fa-arrow-right text-xs"></i>
                        </button>
                        ` : ''}

                        <!-- PROCESSED -->
                        ${group === 'PROCESSED' ? `
                        <button onclick="contactAdmin('${Config.waMessages.process.replace('{{ID}}', trxId)}')" class="w-full md:w-auto md:px-8 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 flex justify-center items-center gap-2">
                            <i class="fab fa-whatsapp text-sm"></i> <span>Hubungi Admin</span>
                        </button>
                        ` : ''}

                        <!-- SHIPPED -->
                        ${group === 'SHIPPED' ? `
                        <button onclick="window.location.href='/cekresi?&resi=${resiAkses}'" class="w-full md:w-auto md:px-8 bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 flex justify-center items-center gap-2">
                            <i class="fas fa-search text-xs"></i> <span>CEK PENGIRIMAN</span>
                        </button>
                        ` : ''}

                        <!-- SUCCESS (2 Buttons) -->
                        ${group === 'SUCCESS' ? `
                        <div class="flex gap-2 w-full md:w-auto">
                            <button onclick="window.location.href='${resiAkses}'" class="flex-1 md:flex-none md:w-auto md:px-8 bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95 flex justify-center items-center gap-2">
                                <i class="fas fa-external-link-alt text-xs"></i> <span>Akses / Detail</span>
                            </button>
                            <button onclick="window.location.href='/'" class="flex-1 md:flex-none md:w-auto md:px-8 bg-white border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-all active:scale-95 flex justify-center items-center gap-2">
                                <i class="fas fa-shopping-bag text-xs"></i> <span>Belanja Lagi</span>
                            </button>
                        </div>
                        ` : ''}

                        <!-- CANCEL (Wrapped Flex) -->
                        ${group === 'CANCEL' ? `
                        <div class="flex gap-2 w-full md:w-auto">
                             <button onclick="window.location.href='/'" class="flex-1 md:flex-none md:w-auto md:px-8 bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 active:scale-95 flex justify-center items-center gap-2">
                                <i class="fas fa-shopping-cart text-xs"></i> <span>Beli Lagi</span>
                            </button>
                            <button onclick="contactAdmin('${Config.waMessages.cancel.replace('{{ID}}', trxId)}')" class="flex-1 md:flex-none md:w-auto md:px-8 bg-white border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-all active:scale-95 flex justify-center items-center gap-2">
                                <i class="fab fa-whatsapp text-xs"></i> <span>Hub Admin</span>
                            </button>
                        </div>
                        ` : ''}
                    </div>
                </div>
                `;
                
                container.innerHTML += html;
            });
        }

        // Fungsi contact admin untuk membuka WhatsApp
        function contactAdmin(message) {
            window.open(`https://wa.me/${Config.waAdmin.no}?text=${encodeURIComponent(message)}`, '_blank');
        }
