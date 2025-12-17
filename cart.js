// Config Sheet Ongkir
        const sheetId = "1lVvUN2axxdTWfNsBEkY5olYrb4InpbbGIcEyUBP3Bso";
        const GID_PROVINSI = 1700169868;
        const GID_KABUPATEN = 97709750;
        const GID_KECAMATAN = 1580800762;
        const GID_ONGKIR_PROVINSI = 1980904687;

        // --- 2. GLOBAL STATE ---
        let cartData = [];
        let buyerData = {};
        let selectedShippingCost = 0;
        let selectedCourierName = ""; 
        let selectedPayment = "";
        
        let discountRate = 0; 
        let discountAmount = 0;
        let appliedPromoCode = "";

        // Cache Data Ongkir
        let ongkirProvinsiData = [];
        let globalBaseRates = null;
        let globalTotalWeight = 0;
        let simulationTimer = null;
        
        // --- NEW: FETCH CACHE ---
        const FETCH_CACHE = {}; 

        // --- HELPER FUNCTIONS ---
        function formatPrice(amount) {
            return new Intl.NumberFormat(Config.currency.locale, {
                style: 'currency', currency: Config.currency.code,
                minimumFractionDigits: Config.currency.digits, maximumFractionDigits: Config.currency.digits
            }).format(amount);
        }

        function normalizeText(text) {
            return text ? text.toString().toLowerCase().trim().replace(/\s+/g, ' ') : '';
        }

        // --- UPDATED: FETCH DATA WITH CACHE & PROMISE SHARING ---
        function fetchData(gid, callback, selectColumns = '*') {
            const cacheKey = `${gid}_${selectColumns}`;

            // 1. Jika data sudah ada di memori
            if (FETCH_CACHE[cacheKey] && FETCH_CACHE[cacheKey].data) {
                callback(FETCH_CACHE[cacheKey].data);
                return;
            }

            // 2. Jika request sedang berjalan, ikut antri (Promise Sharing)
            if (FETCH_CACHE[cacheKey] && FETCH_CACHE[cacheKey].promise) {
                FETCH_CACHE[cacheKey].promise.then(data => callback(data));
                return;
            }

            // 3. Buat request baru
            const query = `select ${selectColumns}`;
            const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq=${encodeURIComponent(query)}&gid=${gid}`;
            
            const fetchPromise = fetch(url)
                .then(r => r.text())
                .then(data => {
                    try {
                        const jsonStr = data.substring(47).slice(0, -2);
                        const json = JSON.parse(jsonStr);
                        const rows = json.table.rows || [];
                        
                        // Simpan data ke cache
                        FETCH_CACHE[cacheKey] = { data: rows, promise: null }; 
                        return rows;
                    } catch (e) {
                        console.error("JSON Parse Error:", e);
                        return [];
                    }
                })
                .catch(e => {
                    console.error("Fetch Error:", e);
                    return [];
                });

            // Simpan promise agar request lain bisa menunggu
            FETCH_CACHE[cacheKey] = { data: null, promise: fetchPromise };

            // Jalankan callback saat selesai
            fetchPromise.then(rows => callback(rows));
        }

        // --- 3. INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            initData();
            setupLocationEvents();
        });

        function initData() {
            renderPaymentMethods();

            const getcart = `${appscript}?&aksi=shop&id=${uuid}`;
            const getinfobuyer = `${appscript}?&aksi=infobuyer&id=${uuid}`;

            Promise.all([
                fetch(getcart).then(res => res.json()),
                fetch(getinfobuyer).then(res => res.json())
            ])
            .then(([cartRes, buyerRes]) => {
                cartData = cartRes || []; 
                renderCart();

                if(buyerRes && buyerRes.length > 0) {
                    buyerData = buyerRes[0];
                    renderBuyer();
                }

                // Init Ongkir System if ON
                if (Config.ongkir.status === 'on') {
                    // Load Provinsi Awal
                    fetchData(GID_PROVINSI, (rows) => {
                        if(!rows) return;
                        rows.sort((a,b) => (a.c[2]?.v || 0) - (b.c[2]?.v || 0));
                        const provSelect = document.getElementById('province');
                        if (provSelect) {
                            rows.forEach(r => {
                                const opt = document.createElement('option');
                                opt.value = r.c[0].v;
                                opt.text = r.c[1].v;
                                opt.dataset.nama = r.c[1].v;
                                provSelect.appendChild(opt);
                            });
                        }
                    }, 'A, B, C');
                    
                    // Pre-load Ongkir Antar Provinsi
                    getOngkirPropinsi(); 
                } else {
                    const shipSec = document.getElementById('shipping-options');
                    if (shipSec) {
                        shipSec.innerHTML = `<div class="flex items-center gap-2 text-gray-500"><i class="fas fa-info-circle"></i><span class="text-sm">Produk Digital</span></div>`;
                    }
                    selectedShippingCost = 0;
                    selectedCourierName = "Manual/Digital";
                    calculateTotal();
                }

                document.getElementById('page-loader').classList.add('hidden');
                
                // --- NEW LOGIC: Only show wrapper if cart is NOT empty ---
                if (cartData && cartData.length > 0) {
                     document.getElementById('checkout-details-wrapper').classList.remove('hidden');
                }
                
                validateCheckoutButton();
            })
            .catch(error => {
                console.error('Error init:', error);
                cartData = []; calculateTotal();
                document.getElementById('page-loader').innerHTML = '<p class="text-red-500">Gagal memuat data.</p>';
            });
        }

        // --- 4. LOCATION & ONGKIR LOGIC ---

        function setupLocationEvents() {
            const elProv = document.getElementById('province');
            if (elProv) {
                elProv.addEventListener('change', function() {
                    const pid = this.value;
                    const citySelect = document.getElementById('city');
                    const kecSelect = document.getElementById('kecamatan');
                    citySelect.innerHTML = '<option value="">Pilih Kota/Kabupaten</option>'; citySelect.disabled = true;
                    kecSelect.innerHTML = '<option value="">Pilih Kecamatan</option>'; kecSelect.disabled = true;
                    resetShipping();
                    if(pid) {
                        citySelect.parentNode.classList.add('animate-pulse');
                        fetchData(GID_KABUPATEN, (rows) => {
                            citySelect.parentNode.classList.remove('animate-pulse');
                            rows.filter(r => r.c[1] && r.c[1].v == pid).forEach(r => {
                                const opt = document.createElement('option');
                                opt.value = r.c[0].v;
                                opt.text = r.c[2].v;
                                citySelect.appendChild(opt);
                            });
                            citySelect.disabled = false;
                        }, 'A, B, C');
                    }
                });
            }

            const elCity = document.getElementById('city');
            if (elCity) {
                elCity.addEventListener('change', function() {
                    const cid = this.value;
                    const kecSelect = document.getElementById('kecamatan');
                    kecSelect.innerHTML = '<option value="">Pilih Kecamatan</option>'; kecSelect.disabled = true;
                    resetShipping();
                    if(cid) {
                        kecSelect.parentNode.classList.add('animate-pulse');
                        fetchData(GID_KECAMATAN, (rows) => {
                            kecSelect.parentNode.classList.remove('animate-pulse');
                            rows.filter(r => r.c[1] && r.c[1].v == cid).forEach(r => {
                                const opt = document.createElement('option');
                                opt.value = r.c[0].v;
                                opt.text = r.c[2].v;
                                kecSelect.appendChild(opt);
                            });
                            kecSelect.disabled = false;
                        }, 'A, B, C');
                    }
                });
            }

            const elKec = document.getElementById('kecamatan');
            if (elKec) {
                elKec.addEventListener('change', function() {
                    calculateFinalShipping();
                });
            }
        }

        function resetShipping() {
            selectedShippingCost = 0; selectedCourierName = "";
            globalBaseRates = null;
            const shipOpt = document.getElementById('shipping-options');
            if(shipOpt) {
                shipOpt.innerHTML = '<p class="text-sm text-gray-400">Lengkapi alamat untuk cek ongkir...</p>';
            }
            calculateTotal();
            validateCheckoutButton();
        }

        function getOngkirPropinsi() {
            return new Promise(resolve => {
                // If cache handled in fetchData, we just call it
                fetchData(GID_ONGKIR_PROVINSI, (rows) => {
                    ongkirProvinsiData = rows.map(r => ({
                        propinsi1: r.c[0]?.v, propinsi2: r.c[1]?.v,
                        ongkir_jne: r.c[2]?.v || 0, ongkir_pos: r.c[3]?.v || 0, ongkir_tiki: r.c[4]?.v || 0
                    }));
                    resolve(ongkirProvinsiData);
                }, 'B, C, D, E, F');
            });
        }

        function getOngkirLocation(id, gid, type) {
            return new Promise(resolve => {
                if (!id) return resolve({ found: false, jne_yes: 0, jne_reg: 0 });
                let selectColumns = (type === 'kabupaten') ? 'A, E, F, G, H, I, J' : 'A, B, E, F, G, H, I, J';
                let idIdx = 0; 
                let startIdx = (type === 'kabupaten') ? 1 : 2;
                fetchData(gid, (rows) => {
                    const row = rows.find(r => r.c[idIdx] && r.c[idIdx].v == id);
                    if (row) {
                        resolve({
                            found: true,
                            jne_yes: row.c[startIdx] ? parseFloat(row.c[startIdx].v) : 0,
                            jne_reg: row.c[startIdx + 1] ? parseFloat(row.c[startIdx + 1].v) : 0,
                        });
                    } else {
                        resolve({ found: false, jne_yes:0, jne_reg:0 });
                    }
                }, selectColumns);
            });
        }

        function calculateShippingCostsInternal(data, beratGram) {
            const { asalProvinsiNama, tujuanProvinsiNama, asalKabupaten, asalKecamatan, tujuanKabupaten, tujuanKecamatan, ongkirPropinsiList } = data;
            const beratKg = Math.ceil(beratGram / 1000); 
            let ongkirProp = { jne: 0 };
            const norm = (t) => t ? t.toString().toLowerCase().trim() : '';
            if (norm(asalProvinsiNama) !== norm(tujuanProvinsiNama)) {
                const match = ongkirPropinsiList.find(op => {
                    const p1 = norm(op.propinsi1); const p2 = norm(op.propinsi2);
                    const a = norm(asalProvinsiNama); const t = norm(tujuanProvinsiNama);
                    return (p1 === a && p2 === t) || (p1 === t && p2 === a);
                });
                if (match) ongkirProp.jne = match.ongkir_jne;
            }
            const val = (n) => n || 0;
            const jne_reg = (val(asalKabupaten.jne_reg) + val(asalKecamatan.jne_reg) + val(tujuanKabupaten.jne_reg) + val(tujuanKecamatan.jne_reg) + val(ongkirProp.jne));
            const jne_yes = (val(asalKabupaten.jne_yes) + val(asalKecamatan.jne_yes) + val(tujuanKabupaten.jne_yes) + val(tujuanKecamatan.jne_yes) + val(ongkirProp.jne));
            return { jne_reg, jne_yes };
        }

        async function calculateFinalShipping() {
            const destProvId = document.getElementById('province').value;
            const destCityId = document.getElementById('city').value;
            const destKecId = document.getElementById('kecamatan').value;
            const destProvName = document.getElementById('province').options[document.getElementById('province').selectedIndex].text;

            if(!destCityId || !destKecId) return;

            globalTotalWeight = cartData.reduce((acc, item) => {
                const w = parseInt(item.weight || item.berat || 0);
                const q = parseInt(item.quantity || item.qty || 1);
                return acc + (w * q);
            }, 0);

            if(globalTotalWeight <= 0) {
                 document.getElementById('shipping-options').innerHTML = '<small class="text-red-500">Berat 0, free ongkir / digital.</small>';
                 return;
            }

            document.getElementById('loading-ongkir').classList.remove('hidden');
            document.getElementById('loading-ongkir').innerText = 'Menghitung...';

            try {
                const [asalKab, asalKec, tujKab, tujKec, propList] = await Promise.all([
                    getOngkirLocation(Config.sellerOngkir.kabupatenId, GID_KABUPATEN, 'kabupaten'),      
                    getOngkirLocation(Config.sellerOngkir.kecamatanId, GID_KECAMATAN, 'kecamatan'),      
                    getOngkirLocation(destCityId, GID_KABUPATEN, 'kabupaten'), 
                    getOngkirLocation(destKecId, GID_KECAMATAN, 'kecamatan'), 
                    getOngkirPropinsi()
                ]);

                const calcData = {
                    asalProvinsiNama: Config.sellerOngkir.provinsi, tujuanProvinsiNama: destProvName,
                    asalKabupaten: asalKab, asalKecamatan: asalKec,
                    tujuanKabupaten: tujKab, tujuanKecamatan: tujKec,
                    ongkirPropinsiList: propList
                };

                globalBaseRates = calculateShippingCostsInternal(calcData, 1000);
                renderShippingOptionsHTML(globalBaseRates, globalTotalWeight);

            } catch(e) {
                console.error(e);
                document.getElementById('shipping-options').innerHTML = '<span class="text-red-500 text-xs">Gagal hitung ongkir. Coba lagi.</span>';
            }
            document.getElementById('loading-ongkir').classList.add('hidden');
        }

        function renderShippingOptionsHTML(rates, weightGram) {
            const weightKg = Math.ceil(weightGram / 1000);
            const w = (weightKg < 1) ? 1 : weightKg;
            
            const costReg = rates.jne_reg * w;
            const costYes = rates.jne_yes * w;
            
            const options = [
                { id:'reg', name: 'REG', cost: costReg, etd: '5-7 Hari' },
                { id:'yes', name: 'EXPRESS', cost: costYes, etd: '2-3 Hari' },
                { id:'sameday', name: 'SameDays', cost: "Not available", etd: '1 Hari Sampai' }
            ];

            let html = '';
            let hasOption = false;

            options.forEach((opt, idx) => {
                if(opt.cost > 0) {
                    hasOption = true;
                    const isChecked = (idx === 0) ? 'checked' : '';
                    if(idx === 0) {
                        selectedShippingCost = opt.cost;
                        selectedCourierName = opt.name;
                    }

                    html += `
                    <label class="cursor-pointer relative block">
                        <input type="radio" name="shipping" value="${opt.cost}" data-name="${opt.name}" class="radio-card hidden" ${isChecked} onchange="updateShipping(this)">
                        <div class="border border-gray-200 rounded-lg p-3 flex items-center justify-between transition-all hover:bg-gray-50">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><i class="fas fa-truck text-sm"></i></div>
                                <div>
                                    <p class="text-sm font-semibold text-gray-800">${opt.name}</p>
                                    <p class="text-xs text-gray-500">Estimasi ${opt.etd}</p>
                                </div>
                            </div>
                            <span class="text-sm font-bold text-gray-700">${formatPrice(opt.cost)}</span>
                        </div>
                    </label>`;
                }
            });

            if(!hasOption) {
                html = '<div class="text-red-500 text-sm">Rute belum didukung atau data tidak lengkap.</div>';
                selectedShippingCost = 0;
            }
            
            document.getElementById('shipping-options').innerHTML = html;
            calculateTotal();
            validateCheckoutButton();
        }

        // --- Recalc on Qty Change ---
        function recalcShippingOnly() {
            if(!globalBaseRates || Config.ongkir.status === 'off') return;
            
            globalTotalWeight = cartData.reduce((acc, item) => {
                const w = parseInt(item.weight || item.berat || 0);
                const q = parseInt(item.quantity || item.qty || 1);
                return acc + (w * q);
            }, 0);

            if(simulationTimer) clearTimeout(simulationTimer);
            document.getElementById('shipping-options').style.opacity = '0.5';
            
            simulationTimer = setTimeout(() => {
                renderShippingOptionsHTML(globalBaseRates, globalTotalWeight);
                document.getElementById('shipping-options').style.opacity = '1';
            }, 500);
        }

        // --- VALIDATION ---
        function validateCheckoutButton() {
            const btn = document.getElementById('btn-checkout');
            const warn = document.getElementById('address-warning');
            if (!btn) return;

            const isCartEmpty = !cartData || cartData.length === 0;
            const nameEl = document.getElementById('input-name');
            const phoneEl = document.getElementById('input-phone');
            const addrEl = document.getElementById('input-address');

            const name = nameEl ? nameEl.value.trim() : '';
            const contact = phoneEl ? phoneEl.value.trim() : '';
            const address = addrEl ? addrEl.value.trim() : '';
            
            const isShippingSelected = (Config.ongkir.status === 'off') || (selectedShippingCost > 0);
            const isContactValid = contact !== '' && /^\d+$/.test(contact);
            const isNameValid = name !== '';
            const isAddressValid = address !== '';

            if (!isCartEmpty && isNameValid && isContactValid && isAddressValid && isShippingSelected) {
                btn.disabled = false;
                btn.classList.remove('disabled:bg-gray-300', 'cursor-not-allowed', 'opacity-50');
                if(warn) warn.classList.add('hidden');
            } else {
                btn.disabled = true;
                btn.classList.add('disabled:bg-gray-300', 'cursor-not-allowed', 'opacity-50');
                if(!isCartEmpty && warn) {
                    warn.classList.remove('hidden');
                    const warnSpan = warn.querySelector('span');
                    if(!isNameValid) warnSpan.textContent = 'Recipient name is required.';
                    else if(!isContactValid) warnSpan.textContent = 'Contact field is required (Numbers Only).';
                    else if(!isAddressValid) warnSpan.textContent = 'Shipping address is required.';
                }
            }
        }

         // --- RENDER PAYMENT METHODS (UPDATED) ---
        function renderPaymentMethods() {
            const container = document.getElementById('payment-methods-container');
            container.innerHTML = '';
            let firstActive = null;
            for (const [key, data] of Object.entries(Config.methods)) {
                if (data.status !== 'on') continue;
                if (!firstActive) firstActive = key;
                
                let displayContent = '';
                if (data.logo) {
                    displayContent = `<img src="${data.logo}" class="h-6 object-contain mb-1" alt="${data.name}">`;
                } else if (data.icon) {
                    displayContent = `<i class="fas ${data.icon} text-green-600 text-xl mb-1"></i>`;
                } else {
                     displayContent = `<span class="font-bold text-gray-700">${data.name}</span>`;
                }

                let subText = 'Transfer';
                if(data.type === 'VA') subText = 'Virtual Account';
                else if(data.type === 'EWALLET') subText = 'E-Wallet';
                else if(data.type === 'COD') subText = 'Bayar Ditempat (COD)';
                else if(data.type === 'QRIS') subText = 'Scan QR';

                container.innerHTML += `
                <label class="cursor-pointer relative">
                    <input type="radio" name="payment" value="${key}" class="radio-card hidden" onchange="updatePayment(this)">
                    <div class="border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center h-20 transition-all hover:border-blue-300 text-center">
                        ${displayContent}
                        <span class="text-xs text-gray-500 font-medium mt-1">${subText}</span>
                    </div>
                </label>`;
            }
            if (firstActive) {
                setTimeout(() => { 
                   const rad = document.querySelector(`input[name="payment"][value="${firstActive}"]`);
                   if(rad) { rad.checked = true; selectedPayment = firstActive; }
                }, 100);
            }
        }

        function renderCart() {
            const container = document.getElementById('cart-items-container');
            const countEl = document.querySelector('.cart-count');
            const wrapper = document.getElementById('checkout-details-wrapper');
            const bar = document.querySelector('.fixed.bottom-0');
            container.innerHTML = '';
            
            if (!cartData || cartData.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                        <i class="fas fa-shopping-cart text-gray-300 text-4xl mb-3"></i>
                        <p class="text-gray-500 mb-4">Your cart is empty</p>
                        <a href="/" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Shop Now</a>
                    </div>`;
                localStorage.setItem('cart', "[]");
                countEl.textContent = '0 Item';
                if(wrapper) wrapper.classList.add('hidden');
                if(bar) bar.classList.add('hidden');
                return;
            }

            // Show sections if cart not empty
            if(wrapper) wrapper.classList.remove('hidden');
            if(bar) bar.classList.remove('hidden');

            localStorage.setItem('cart', JSON.stringify(cartData));
            countEl.textContent = `${cartData.length} Item`;

            cartData.forEach((item, index) => {
                const names = item.name || item.title || item.item || 'Product';
                const image = item.image || 'https://via.placeholder.com/80';
                const price = parseInt(item.price) || 0;
                const qty = parseInt(item.quantity || item.qty || 1);
                const weight = parseInt(item.weight || item.berat || 0);
                const varian = item.varian ? `<p class="text-[10px] text-gray-500 mt-0.5">Varian: ${item.varian}</p>` : '';

                container.innerHTML += `
                <div class="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex gap-4 relative transition-all duration-300">
                    <div class="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden"><img src="${image}" alt="${names}" class="w-full h-full object-cover"></div>
                    <div class="flex-1 flex flex-col justify-between">
                        <div><h3 class="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">${names}</h3>${varian}<p class="text-xs text-gray-500 mt-1">Berat: ${weight}gr</p></div>
                        <div class="flex items-center justify-between mt-2">
                            <span class="font-bold text-blue-600 text-sm">${formatPrice(price)}</span>
                            <div class="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-8">
                                <button onclick="updateQty(${index}, -1)" class="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-l-lg">-</button>
                                <span class="w-8 text-center text-xs font-semibold text-gray-700">${qty}</span>
                                <button onclick="updateQty(${index}, 1)" class="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-r-lg">+</button>
                            </div>
                        </div>
                    </div>
                    <button onclick="deleteItem('${item.id}', ${index})" class="absolute top-3 right-3 text-gray-300 hover:text-red-500 p-1"><i class="fas fa-trash-alt"></i></button>
                </div>`;
            });
            calculateTotal();
            validateCheckoutButton();
        }

        // --- View & Logic Helpers ---
        function renderBuyer() {
            // Updated with safety checks
            const fields = ['name', 'phone', 'email', 'address', 'postal', 'notes'];
            fields.forEach(f => {
                const val = buyerData[f === 'phone' ? 'contact' : (f === 'postal' ? 'postalcode' : f)] || '';
                const viewEl = document.getElementById(`view-${f}`);
                const inputEl = document.getElementById(`input-${f}`);
                if(viewEl) viewEl.textContent = val || '-';
                if(inputEl) inputEl.value = val;
            });
            validateCheckoutButton();
        }

        function updateQty(index, change) {
            let item = cartData[index];
            let currentQty = parseInt(item.quantity || item.qty || 1);
            let newQty = currentQty + change;
            if (newQty < 1) return;
            if (item.quantity !== undefined) item.quantity = newQty; else item.qty = newQty;
            item.total = (parseInt(item.price)||0) * newQty;
            renderCart(); recalcShippingOnly(); 
        }

        function deleteItem(id, index) {
            if (confirm('Delete item?')) {
                cartData.splice(index, 1);
                renderCart();
                recalcShippingOnly();
            }
        }

        function updateShipping(el) {
            selectedShippingCost = parseInt(el.value) || 0;
            selectedCourierName = el.getAttribute('data-name');
            calculateTotal();
            validateCheckoutButton();
        }

        function updatePayment(el) { selectedPayment = el.value; }

        function calculateTotal() {
            let subtotal = cartData.reduce((acc, item) => acc + (parseInt(item.price||0) * parseInt(item.quantity||item.qty||1)), 0);
            discountAmount = Math.floor(subtotal * discountRate);
            let total = subtotal + parseInt(selectedShippingCost) - discountAmount;
            if(total < 0) total = 0;
            document.getElementById('grand-total').textContent = formatPrice(total);
            const discEl = document.getElementById('discount-display');
            if(discountAmount > 0) { discEl.textContent = `Saving ${formatPrice(discountAmount)}`; discEl.classList.remove('hidden'); }
            else discEl.classList.add('hidden');
            return total;
        }

                // --- FIXED: toggleEditAddress Logic ---
        function toggleEditAddress() {
            const view = document.getElementById('address-view');
            const edit = document.getElementById('address-edit');
            const btn = document.getElementById('btn-edit-address');
            
            if (edit.classList.contains('hidden')) {
                view.classList.add('hidden');
                edit.classList.remove('hidden');
                btn.classList.add('hidden'); 
            } else {
                view.classList.remove('hidden');
                edit.classList.add('hidden');
                btn.classList.remove('hidden'); 
            }
        }

        // --- FIXED: saveAddress Logic ---
        function saveAddress() {
            const name = document.getElementById('input-name');
            const phone = document.getElementById('input-phone');
            const email = document.getElementById('input-email');
            const address = document.getElementById('input-address');
            const postal = document.getElementById('input-postal');
            const notes = document.getElementById('input-notes');

            if(name) buyerData.name = name.value;
            if(phone) buyerData.contact = phone.value;
            if(email) buyerData.email = email.value;
            if(address) buyerData.address = address.value;
            if(postal) buyerData.postalcode = postal.value;
            if(notes) buyerData.notes = notes.value;
            
            renderBuyer();
            toggleEditAddress();
            
            if(Config.ongkir.status === 'on') calculateFinalShipping(); 
        }

        function applyPromo() {
            const input = document.getElementById('promo-input');
            const messageEl = document.getElementById('promo-message');
            const btn = document.getElementById('btn-apply-promo');
            const code = input.value.trim().toUpperCase();
            discountRate = 0; appliedPromoCode = "";
            messageEl.classList.add('hidden'); messageEl.classList.remove('text-green-600', 'text-red-500');

            if (!code) return;
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalBtnText; btn.disabled = false;
                if (code === Config.discount.code) { discountRate = 0.30; messageEl.textContent = `Saving ${Config.discount.percent}%!`; messageEl.classList.add('text-green-600'); }
                else { messageEl.textContent = "Invalid code"; messageEl.classList.add('text-red-500'); }
                messageEl.classList.remove('hidden'); calculateTotal();
            }, 800);
        }

        function processCheckout() { document.getElementById('confirm-modal').classList.remove('hidden'); }
        function closeModal() { document.getElementById('confirm-modal').classList.add('hidden'); }
        
        function finalSubmit() {
            const btn = document.querySelector('#confirm-modal button:last-child');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Process...'; btn.disabled = true;

            const baseAddr = document.getElementById('input-address').value;
            const shipInfo = Config.ongkir.status === 'on' ? `[${selectedCourierName} - ${formatPrice(selectedShippingCost)}]` : '';
            
            // Build full address
            let fullAddr = baseAddr + " " + shipInfo;
            if (Config.ongkir.status === 'on') {
               // Fix: Replace jQuery with Vanilla JS
               const provSelect = document.getElementById('province');
               const citySelect = document.getElementById('city');
               const kecSelect = document.getElementById('kecamatan');
               
               const prov = provSelect.options[provSelect.selectedIndex].text;
               const city = citySelect.options[citySelect.selectedIndex].text;
               const kec = kecSelect.options[kecSelect.selectedIndex].text;
               
               fullAddr += ` (Province: ${prov}, City: ${city}, Subdistrict: ${kec})`;
            }

            const getnama = encodeURIComponent(document.getElementById('input-name').value);
            const getkontak = encodeURIComponent(document.getElementById('input-phone').value);
            const getemail = encodeURIComponent(document.getElementById('input-email').value);
            const getpos = encodeURIComponent(document.getElementById('input-postal').value);
            
            const itemString = JSON.stringify(cartData);
            const linkArray = cartData.map(i => i.permalink || i.item || 'unknown');
            const totalOrder = cartData.reduce((acc, i) => acc + parseInt(i.quantity||i.qty||1), 0);
            const grandTotal = calculateTotal();
            const trxran = Math.floor(Math.random()*900000)+100000;
            const gettrx = "TRX" + trxran;
            
            const payConfig = Config.methods[selectedPayment];
            const payName = payConfig ? payConfig.name : selectedPayment;

            const url = `${appscript}?&aksi=buy&id=${uuid}&name=${getnama}&email=${getemail}&address=${encodeURIComponent(fullAddr)} Postal code: ${getpos}&contact=${getkontak}&item=${encodeURIComponent(itemString)}&link=${encodeURIComponent(linkArray.join(','))}&qty=${totalOrder}&total=${grandTotal}&trx=${gettrx}&payto=${encodeURIComponent(payName)}&norek=0`;

            fetch(url).then(r=>r.json()).then(d => {
                localStorage.removeItem('cart');
                window.location.href = `/payment?trx=${gettrx}&rek=${selectedPayment}`;
            }).catch(e => {
                console.error(e); alert('Error checkout'); btn.innerHTML = 'OK'; btn.disabled = false;
            });
        }
