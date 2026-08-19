(() => {
    'use strict'

    document.addEventListener('DOMContentLoaded', function() {
        const cfg = window.VIBES_CONFIG
        if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
            console.error('VIBES_CONFIG غير معرف')
            return
        }

        const supabase = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)
        const $ = s => document.querySelector(s)
        const $$ = s => document.querySelectorAll(s)

        const esc = (v = '') => String(v).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]))
        const money = v => `${Number(v || 0).toFixed(2)} ر.س`

        let products = []
        let stories = []
        let currentUserRole = ''
        let selectedProductFile = null
        let selectedLogoFile = null
        let selectedStoryFile = null

        function toast(t) {
            const e = $('#toast')
            e.textContent = t
            e.classList.add('show')
            setTimeout(() => e.classList.remove('show'), 3000)
        }

        async function boot() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return showLogin()
            await enter(session.user)
        }

        function showLogin() {
            $('#loginView').classList.remove('hidden')
            $('#dashboardView').classList.add('hidden')
        }

        async function enter(user) {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (error || !profile) {
                await supabase.auth.signOut()
                $('#loginError').textContent = 'حسابك غير مسجل في النظام'
                showLogin()
                return
            }
            currentUserRole = profile.role
            if (currentUserRole !== 'admin' && currentUserRole !== 'manager') {
                await supabase.auth.signOut()
                $('#loginError').textContent = 'ليس لديك صلاحية للدخول'
                showLogin()
                return
            }

            $('#loginView').classList.add('hidden')
            $('#dashboardView').classList.remove('hidden')
            $('#adminEmail').textContent = user.email
            $('#adminRole').textContent = `الصلاحية: ${currentUserRole === 'admin' ? 'أدمن كامل' : 'مشرف'}`

            if (currentUserRole !== 'admin') {
                $('#usersTab').style.display = 'none'
            }

            await Promise.all([loadProducts(), loadStories(), loadOrders(), loadSettings()])
            if (currentUserRole === 'admin') loadUsers()
        }

        // رفع الملفات
        async function uploadFile(file) {
            try {
                const bucketName = cfg.storageBucket || 'products'
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`
                
                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .upload(fileName, file, { 
                        cacheControl: '3600', 
                        upsert: true 
                    })

                if (error) {
                    console.error('Storage Upload Error:', error)
                    toast(`خطأ رفع الصورة: ${error.message}`)
                    return null
                }

                const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName)
                return urlData.publicUrl
            } catch (err) {
                console.error('Upload catch error:', err)
                toast(`تعذر رفع الصورة: ${err.message}`)
                return null
            }
        }

        // حذف الملفات
        async function deleteStorageFile(fileUrl) {
            if (!fileUrl) return
            try {
                const bucketName = cfg.storageBucket || 'products'
                const fileName = fileUrl.split('/').pop()
                if (!fileName) return
                await supabase.storage.from(bucketName).remove([fileName])
            } catch(e) {
                console.warn('فشل حذف الصورة:', e)
            }
        }

        // تحميل المنتجات
        async function loadProducts() {
            const { data, error } = await supabase.from('products').select('*').order('sort_order').order('created_at')
            if (error) return toast(error.message)
            products = data || []
            $('#productStat').textContent = products.length
            $('#productsTable').innerHTML = `<table><thead><tr><th>الصورة</th><th>المنتج</th><th>السعر</th><th>التصنيف</th><th>الحالة</th><th></th></tr></thead><tbody>${products.map(p => `<tr><td>${p.image_url ? `<img src="${esc(p.image_url)}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:8px">` : '-'}</td><td><b>${esc(p.name)}</b><div class="muted">${esc(p.description || '')}</div></td><td>${money(p.price)}</td><td>${esc(p.category)}</td><td>${p.active ? 'ظاهر' : 'مخفي'}</td><td><button class="secondary" data-edit="${p.id}">تعديل</button> <button class="danger" data-delete="${p.id}">حذف</button></td></tr>`).join('')}</tbody></table>`
        }

        // تحميل القصص
        async function loadStories() {
            const { data, error } = await supabase.from('stories').select('*').order('created_at', { ascending: false })
            if (error) return toast(error.message)
            stories = data || []
            $('#storyStat').textContent = stories.length
            $('#storiesTable').innerHTML = `<table><thead><tr><th>القصة</th><th>العنوان</th><th>الوسم</th><th>تاريخ النشر</th><th></th></tr></thead><tbody>${stories.map(s => `<tr><td><img src="${esc(s.image_url)}" alt="" style="width:40px;height:60px;object-fit:cover;border-radius:6px"></td><td><b>${esc(s.title)}</b></td><td>${esc(s.tag || '')}</td><td>${new Date(s.created_at).toLocaleDateString('ar-SA')}</td><td><button class="danger" data-delete-story="${s.id}">حذف</button></td></tr>`).join('')}</tbody></table>`
        }

        // تحميل الطلبات
        async function loadOrders() {
            const { data, error } = await supabase.from('orders')
                .select('id,order_number,customer_name,customer_phone,notes,total,status,created_at,order_items(quantity,unit_price,product_name)')
                .order('created_at', { ascending: false })
                .limit(100)
            if (error) return toast(error.message)
            const orders = data || []
            const today = new Date().toDateString()
            const todays = orders.filter(o => new Date(o.created_at).toDateString() === today)
            $('#orderStat').textContent = todays.length
            $('#salesStat').textContent = money(todays.reduce((n, o) => n + Number(o.total), 0))
            $('#ordersTable').innerHTML = `<table><thead><tr><th>الطلب</th><th>العميل</th><th>التفاصيل</th><th>الإجمالي</th><th>الحالة</th><th>الوقت</th></tr></thead><tbody>${orders.map(o => `<tr><td>#${o.order_number}</td><td>${esc(o.customer_name)}<div class="muted">${esc(o.customer_phone)}</div></td><td class="order-items">${(o.order_items || []).map(i => `${esc(i.product_name)} × ${i.quantity}`).join('<br>')}${o.notes ? `<br>ملاحظة: ${esc(o.notes)}` : ''}</td><td>${money(o.total)}</td><td><select class="status-select" data-order="${o.id}">${[['new','جديد'],['accepted','مقبول'],['preparing','قيد التحضير'],['ready','جاهز'],['completed','مكتمل'],['cancelled','ملغي']].map(([v,l]) => `<option value="${v}" ${o.status === v ? 'selected' : ''}>${l}</option>`).join('')}</select></td><td>${new Date(o.created_at).toLocaleString('ar-SA')}</td></tr>`).join('')}</tbody></table>`
        }

        // تحميل الإعدادات
        async function loadSettings() {
            const { data } = await supabase.from('store_settings').select('*').eq('id', 1).maybeSingle()
            if (!data) return
            const f = $('#settingsForm')
            ;['whatsapp_number', 'store_name', 'instagram_username', 'tiktok_username', 'google_maps_url', 'delivery_fee', 'open_hour', 'close_hour'].forEach(k => {
                if (f.elements[k]) f.elements[k].value = data[k] ?? ''
            })
            f.elements.is_open.checked = data.is_open
            if (data.logo_url) {
                $('#logoPreview').src = data.logo_url
                $('#logoPreview').style.display = 'block'
                $('#logoUrlInput').value = data.logo_url
            }
        }

        // تحميل المستخدمين
        async function loadUsers() {
            if (currentUserRole !== 'admin') return
            const { data, error } = await supabase.from('profiles').select('id, role, created_at').order('created_at')
            if (error) return toast(error.message)
            const users = data || []
            $('#usersTable').innerHTML = `<table><thead><tr><th>المعرف</th><th>الصلاحية</th><th>تاريخ التسجيل</th><th>تغيير الصلاحية</th></tr></thead><tbody>${users.map(u => `<tr><td>${u.id.substring(0,8)}...</td><td>${u.role === 'admin' ? 'أدمن' : u.role === 'manager' ? 'مشرف' : 'عميل'}</td><td>${new Date(u.created_at).toLocaleDateString('ar-SA')}</td><td><select class="user-role-select" data-user="${u.id}"><option value="customer" ${u.role === 'customer' ? 'selected' : ''}>عميل</option><option value="manager" ${u.role === 'manager' ? 'selected' : ''}>مشرف</option><option value="admin" ${u.role === 'admin' ? 'selected' : ''}>أدمن</option></select></td></tr>`).join('')}</tbody></table>`
        }

        // تسجيل الدخول
        $('#loginForm').addEventListener('submit', async e => {
            e.preventDefault()
            $('#loginError').textContent = ''
            const f = e.currentTarget
            const fd = new FormData(f)
            const { data, error } = await supabase.auth.signInWithPassword({
                email: fd.get('email'),
                password: fd.get('password')
            })
            if (error) return $('#loginError').textContent = 'بيانات الدخول غير صحيحة'
            await enter(data.user)
        })

        // تسجيل الخروج
        $('#logout').addEventListener('click', async () => {
            await supabase.auth.signOut()
            showLogin()
        })

        // تبديل التبويبات
        document.querySelector('.admin-tabs').addEventListener('click', e => {
            const b = e.target.closest('[data-tab]')
            if (!b) return
            $$('.pane').forEach(p => p.classList.add('hidden'))
            $$('.admin-tabs button').forEach(x => x.classList.remove('active'))
            $('#' + b.dataset.tab).classList.remove('hidden')
            b.classList.add('active')
            if (b.dataset.tab === 'usersPane' && currentUserRole === 'admin') loadUsers()
            if (b.dataset.tab === 'storiesPane') loadStories()
        })

        // إضافة منتج
        $('#newProduct').addEventListener('click', () => {
            const f = $('#productForm')
            f.reset()
            f.elements.active.checked = true
            $('#editorTitle').textContent = 'منتج جديد'
            $('#imagePreview').style.display = 'none'
            $('#imagePreview').src = ''
            $('#imageUrlInput').value = ''
            selectedProductFile = null
            $('#productEditor').showModal()
        })

        // اختيار صورة المنتج
        $('#productImage').addEventListener('change', function(e) {
            const file = e.target.files[0]
            if (!file) return
            selectedProductFile = file
            const reader = new FileReader()
            reader.onload = ev => {
                $('#imagePreview').src = ev.target.result
                $('#imagePreview').style.display = 'block'
            }
            reader.readAsDataURL(file)
        })

        // تعديل أو حذف منتج
        $('#productsTable').addEventListener('click', async e => {
            const edit = e.target.closest('[data-edit]')
            const del = e.target.closest('[data-delete]')
            if (edit) {
                const p = products.find(x => x.id === edit.dataset.edit)
                if (!p) return toast('المنتج غير موجود')
                const f = $('#productForm')
                f.elements.id.value = p.id
                f.elements.name.value = p.name || ''
                f.elements.description.value = p.description || ''
                f.elements.price.value = p.price || ''
                f.elements.category.value = p.category || 'other'
                f.elements.popular.checked = !!p.popular
                f.elements.active.checked = !!p.active
                if (p.image_url) {
                    $('#imagePreview').src = p.image_url
                    $('#imagePreview').style.display = 'block'
                    $('#imageUrlInput').value = p.image_url
                } else {
                    $('#imagePreview').style.display = 'none'
                    $('#imageUrlInput').value = ''
                }
                selectedProductFile = null
                $('#editorTitle').textContent = 'تعديل المنتج'
                $('#productEditor').showModal()
            }
            if (del && confirm('حذف المنتج نهائياً؟')) {
                const p = products.find(x => x.id === del.dataset.delete)
                if (p && p.image_url) await deleteStorageFile(p.image_url)
                const { error } = await supabase.from('products').delete().eq('id', del.dataset.delete)
                if (error) toast(error.message)
                else { toast('تم الحذف'); loadProducts(); }
            }
        })

        // حفظ المنتج بعد تصحيح المتغيرات
        $('#productForm').addEventListener('submit', async e => {
            e.preventDefault()
            const form = e.currentTarget
            const btn = form.querySelector('button[type="submit"]')
            btn.disabled = true
            btn.textContent = 'جاري الحفظ...'

            try {
                const fd = new FormData(form)
                const id = fd.get('id')
                const isPopular = form.elements.popular.checked
                const isActive = form.elements.active.checked
                let imageUrl = $('#imageUrlInput').value || null

                if (selectedProductFile) {
                    const uploaded = await uploadFile(selectedProductFile)
                    if (uploaded) {
                        if (id && imageUrl && imageUrl !== uploaded) await deleteStorageFile(imageUrl)
                        imageUrl = uploaded
                    } else {
                        btn.disabled = false
                        btn.textContent = 'حفظ المنتج'
                        return
                    }
                }

                const row = {
                    name: fd.get('name').trim(),
                    description: fd.get('description').trim() || null,
                    price: Number(fd.get('price')),
                    category: fd.get('category'),
                    image_url: imageUrl,
                    popular: isPopular,
                    active: isActive
                }

                const q = id ? supabase.from('products').update(row).eq('id', id) : supabase.from('products').insert(row)
                const { error } = await q
                if (error) {
                    toast(`خطأ قاعدة البيانات: ${error.message}`)
                } else {
                    $('#productEditor').close()
                    toast('تم حفظ المنتج بنجاح')
                    loadProducts()
                }
            } catch (err) {
                toast(`حدث خطأ: ${err.message}`)
            } finally {
                btn.disabled = false
                btn.textContent = 'حفظ المنتج'
            }
        })

        // إضافة قصة
        $('#newStory').addEventListener('click', () => {
            $('#storyForm').reset()
            $('#storyPreview').style.display = 'none'
            selectedStoryFile = null
            $('#storyEditor').showModal()
        })

        // اختيار صورة القصة
        $('#storyImageFile').addEventListener('change', function(e) {
            const file = e.target.files[0]
            if (!file) return
            selectedStoryFile = file
            const reader = new FileReader()
            reader.onload = ev => {
                $('#storyPreview').src = ev.target.result
                $('#storyPreview').style.display = 'block'
            }
            reader.readAsDataURL(file)
        })

        // نشر الستوري
        $('#storyForm').addEventListener('submit', async e => {
            e.preventDefault()
            const form = e.currentTarget
            if (!selectedStoryFile) return toast('يرجى اختيار صورة للستوري')
            const btn = form.querySelector('button[type="submit"]')
            btn.disabled = true
            btn.textContent = 'جاري النشر...'

            try {
                const fd = new FormData(form)
                const uploadedUrl = await uploadFile(selectedStoryFile)
                if (!uploadedUrl) {
                    btn.disabled = false
                    btn.textContent = 'نشر الستوري'
                    return
                }

                const row = {
                    title: fd.get('title').trim(),
                    tag: fd.get('tag').trim() || 'جديد Vibes',
                    image_url: uploadedUrl,
                    active: true
                }

                const { error } = await supabase.from('stories').insert(row)
                if (error) {
                    toast(error.message)
                } else {
                    $('#storyEditor').close()
                    toast('تم نشر القصة بنجاح')
                    loadStories()
                }
            } catch (err) {
                toast(`حدث خطأ: ${err.message}`)
            } finally {
                btn.disabled = false
                btn.textContent = 'نشر الستوري'
            }
        })

        // حذف الستوري
        $('#storiesTable').addEventListener('click', async e => {
            const del = e.target.closest('[data-delete-story]')
            if (del && confirm('حذف هذه القصة؟')) {
                const s = stories.find(x => x.id === del.dataset.deleteStory)
                if (s && s.image_url) await deleteStorageFile(s.image_url)
                const { error } = await supabase.from('stories').delete().eq('id', del.dataset.deleteStory)
                if (error) toast(error.message)
                else { toast('تم حذف القصة'); loadStories(); }
            }
        })

        // اختيار الشعار
        $('#logoImageFile').addEventListener('change', function(e) {
            const file = e.target.files[0]
            if (!file) return
            selectedLogoFile = file
            const reader = new FileReader()
            reader.onload = ev => {
                $('#logoPreview').src = ev.target.result
                $('#logoPreview').style.display = 'block'
            }
            reader.readAsDataURL(file)
        })

        // حفظ الإعدادات
        $('#settingsForm').addEventListener('submit', async e => {
            e.preventDefault()
            const form = e.currentTarget
            const btn = form.querySelector('button[type="submit"]')
            btn.disabled = true
            btn.textContent = 'جاري الحفظ...'

            try {
                const fd = new FormData(form)
                let logoUrl = $('#logoUrlInput').value || null

                if (selectedLogoFile) {
                    const uploadedLogo = await uploadFile(selectedLogoFile)
                    if (uploadedLogo) logoUrl = uploadedLogo
                }

                const row = {
                    id: 1,
                    store_name: fd.get('store_name').trim(),
                    whatsapp_number: fd.get('whatsapp_number').trim(),
                    instagram_username: fd.get('instagram_username').trim() || 'vibes.espresso',
                    tiktok_username: fd.get('tiktok_username').trim() || 'vibes.espresso',
                    google_maps_url: fd.get('google_maps_url').trim() || null,
                    delivery_fee: Number(fd.get('delivery_fee')) || 15.00,
                    open_hour: Number(fd.get('open_hour')),
                    close_hour: Number(fd.get('close_hour')),
                    is_open: form.elements.is_open.checked,
                    logo_url: logoUrl
                }

                const { error } = await supabase.from('store_settings').upsert(row)
                if (error) toast(error.message)
                else toast('تم حفظ الإعدادات بنجاح')
            } catch (err) {
                toast(`حدث خطأ: ${err.message}`)
            } finally {
                btn.disabled = false
                btn.textContent = 'حفظ الإعدادات'
            }
        })

        // تحديث حالة الطلب
        $('#ordersTable').addEventListener('change', async e => {
            if (!e.target.matches('[data-order]')) return
            const { error } = await supabase.from('orders').update({ status: e.target.value }).eq('id', e.target.dataset.order)
            if (error) toast(error.message)
            else toast('تم تحديث حالة الطلب')
        })

        // تعديل الصلاحية
        $('#usersTable').addEventListener('change', async e => {
            if (!e.target.matches('.user-role-select')) return
            if (currentUserRole !== 'admin') return toast('لا تملك صلاحية')
            const { error } = await supabase.from('profiles').update({ role: e.target.value }).eq('id', e.target.dataset.user)
            if (error) toast(error.message)
            else toast('تم تحديث الصلاحية')
        })

        // أزرار التحديث
        $('#refreshUsers').addEventListener('click', loadUsers)
        $('#refreshOrders').addEventListener('click', loadOrders)

        // إغلاق المودال
        document.addEventListener('click', e => {
            const b = e.target.closest('[data-close]')
            if (b) document.getElementById(b.dataset.close).close()
        })

        boot()
    })
})()
