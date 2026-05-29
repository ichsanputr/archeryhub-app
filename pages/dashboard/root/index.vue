<template>
    <div class="flex flex-col gap-8 relative">
        <!-- Success Toast -->
        <Transition enter-active-class="transform transition ease-out duration-300"
            enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
            leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-if="showSuccessToast"
                class="fixed top-8 right-8 z-[70] bg-navy text-primary px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-primary/20">
                <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon icon="ph:check-circle-bold" class="text-2xl text-primary" />
                </div>
                <div>
                    <h4 class="text-[10px] font-black tracking-widest text-white">{{ t('root.index.title') }}</h4>
                    <div class="text-xs font-bold text-primary/80">{{ successMessage }}</div>
                </div>
                <button @click="showSuccessToast = false"
                    class="ml-4 text-white/40 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg">
                    <Icon icon="ph:x-bold" />
                </button>
            </div>
        </Transition>

        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="space-y-4">
                    <div
                        class="flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-widest text-primary/80">
                        <span class="text-white">{{ t('root.index.root_terminal') }}</span>
                        <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
                        <span class="text-primary">{{ t('root.index.title') }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                            <Icon icon="ph:buildings-bold" class="text-primary text-2xl sm:text-3xl" />
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ t('root.index.title') }}</h1>
                            <div class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">
                                {{ t('root.subscriptions.subtitle') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs & Add Button -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 gap-4">
            <div class="flex">
                <button @click="currentTab = 'organizer'"
                    class="px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2"
                    :class="currentTab === 'organizer' ? 'border-navy text-navy font-black' : 'border-transparent text-gray-400 hover:text-gray-600'">
                    <Icon icon="ph:buildings-bold" />
                    <span>Organizers</span>
                </button>
                <button @click="currentTab = 'club'"
                    class="px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2"
                    :class="currentTab === 'club' ? 'border-navy text-navy font-black' : 'border-transparent text-gray-400 hover:text-gray-600'">
                    <Icon icon="ph:shield-bold" />
                    <span>Clubs</span>
                </button>
            </div>
            <div class="flex items-center gap-2 sm:pb-2">
                <button v-if="currentTab === 'club'" @click="openAddClub"
                    class="h-10 px-4 rounded-xl bg-primary text-navy font-bold text-xs hover:bg-primary-hover shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2">
                    <Icon icon="ph:plus-bold" />
                    <span>Add Club</span>
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider ">{{ t('root.index.search_label') }}</label>
                <div class="relative">
                    <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchQuery" type="text" :placeholder="t('root.index.search_placeholder')"
                        class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all" />
                </div>
            </div>
            <div class="w-full md:w-56">
                <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider ">{{ t('root.subscriptions.status_filter') }}</label>
                <select v-model="statusFilter"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                    <option value="">{{ t('root.subscriptions.status_all') }}</option>
                    <option value="active">{{ t('root.subscriptions.status_active') }}</option>
                    <option value="expired">{{ t('root.subscriptions.status_expired') }}</option>
                    <option value="canceled">{{ t('root.subscriptions.status_canceled') }}</option>
                </select>
            </div>
            <button @click="searchQuery = ''; statusFilter = ''"
                class="h-11 px-6 font-semibold text-sm text-navy bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shrink-0">
                {{ t('root.index.reset') }}
            </button>
        </div>

        <!-- Table -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[850px]">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest ">
                                {{ t('root.subscriptions.table_header_account') }}</th>
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest text-center">
                                {{ currentTab === 'club' ? 'City' : t('root.subscriptions.table_header_plan') }}
                            </th>
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest text-center">
                                {{ t('root.subscriptions.table_header_status') }}</th>
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest ">
                                {{ currentTab === 'club' ? 'Last Updated' : t('root.subscriptions.table_header_expires') }}</th>
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest ">
                                {{ t('root.index.table_header_registered') }}</th>
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest text-right">
                                {{ t('root.index.table_header_actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="user in paginatedUsers" :key="user.uuid"
                            class="hover:bg-primary/5 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="h-10 w-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                        <img :src="useImageOrDefault(user.avatar_url || user.logo_url, user.name)"
                                            class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <div
                                            class="font-bold text-navy group-hover:text-primary transition-colors line-clamp-1 truncate max-w-[220px]">
                                            {{ user.name || '—' }}
                                        </div>
                                        <div class="text-xs text-gray-400 line-clamp-1 truncate max-w-[220px]">
                                            {{ currentTab === 'club' ? (user.abbreviation ? `(${user.abbreviation})` : '—') : (user.email || '—') }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center text-sm font-semibold text-navy">
                                {{ currentTab === 'club' ? (user.city || '—') : (user.plan_name || '—') }}
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span class="px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest border"
                                    :class="getStatusBadgeClass(user.subscription_status || user.status)">
                                    {{ (user.subscription_status || user.status || 'active').charAt(0).toUpperCase() + (user.subscription_status || user.status || 'active').slice(1) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-xs font-semibold"
                                :class="isExpiredSoon(user.expires_at) ? 'text-red-500 font-bold' : 'text-navy'">
                                {{ currentTab === 'club' ? formatDate(user.updated_at) : (user.expires_at ? formatDate(user.expires_at) : '—') }}
                            </td>
                            <td class="px-6 py-4 text-xs font-semibold text-gray-400">{{ formatDate(user.created_at) }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <!-- Edit Club or Edit Package -->
                                    <button v-if="currentTab === 'club'" @click="openEditClub(user)"
                                        class="p-2 text-navy hover:bg-gray-100 hover:text-navy-dark rounded-xl transition-all"
                                        title="Edit Club">
                                        <Icon icon="ph:pencil-simple-bold" class="text-xl" />
                                    </button>
                                    <button v-else @click="openEditSubscription(user)"
                                        class="p-2 text-navy hover:bg-gray-100 hover:text-navy-dark rounded-xl transition-all"
                                        :title="t('root.subscriptions.edit_modal_title')">
                                        <Icon icon="ph:pencil-simple-bold" class="text-xl" />
                                    </button>
                                    
                                    <!-- Delete Club -->
                                    <button v-if="currentTab === 'club'" @click="deleteClub(user)"
                                        class="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                                        title="Delete Club">
                                        <Icon icon="ph:trash-bold" class="text-xl" />
                                    </button>

                                    <!-- Change Password -->
                                    <template v-if="currentTab !== 'club'">
                                        <button @click="openChangePassword(user)"
                                            class="p-2 text-navy hover:bg-gray-100 hover:text-navy-dark rounded-xl transition-all"
                                            :title="t('root.index.change_password_title')">
                                            <Icon icon="ph:key-bold" class="text-xl" />
                                        </button>
                                        <!-- Suspend/Activate -->
                                        <button v-if="user.subscription_status !== 'suspended'"
                                            @click="confirmAction(user, 'suspend')"
                                            class="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                                            :title="t('root.index.suspend_account_title')">
                                            <Icon icon="ph:prohibit-bold" class="text-xl" />
                                        </button>
                                        <button v-else
                                            @click="confirmAction(user, 'activate')"
                                            class="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all"
                                            :title="t('root.index.activate_account_title')">
                                            <Icon icon="ph:check-circle-bold" class="text-xl" />
                                        </button>
                                    </template>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!filteredUsers.length">
                            <td colspan="6" class="px-6 py-24 text-center">
                                <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                    <div
                                        class="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                                        <Icon icon="ph:building-office-bold" class="text-3xl" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-gray-400 tracking-tight">{{ t('root.index.no_users') }}</div>
                                        <div class="text-xs text-gray-300 mt-1">{{ t('common.no_results_desc') }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="filteredUsers.length > 0"
                class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-xs font-bold text-gray-400 tracking-widest">
                    {{ t('root.subscriptions.pagination_showing', { from: subStartIndex + 1, to: Math.min(subEndIndex, filteredUsers.length), total: filteredUsers.length }) }}
                </div>
                <div class="flex items-center gap-2">
                    <button @click="currentPage--" :disabled="currentPage === 1"
                        class="size-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm">
                        <Icon icon="ph:caret-left-bold" />
                    </button>
                    <div class="flex items-center gap-1 px-3">
                        <span class="text-xs font-black text-navy">{{ currentPage }}</span>
                        <span class="text-[10px] font-bold text-gray-300">/</span>
                        <span class="text-[10px] font-bold text-gray-400">{{ totalPages }}</span>
                    </div>
                    <button @click="currentPage++" :disabled="currentPage === totalPages"
                        class="size-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm">
                        <Icon icon="ph:caret-right-bold" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Suspend/Activate Confirmation Modal -->
        <div v-if="showConfirmModal"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            @click.self="showConfirmModal = false">
            <div
                class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 animate-in zoom-in-95 duration-200">
                <div class="flex flex-col items-center text-center gap-4">
                    <div class="size-16 rounded-3xl flex items-center justify-center"
                        :class="pendingAction === 'suspend' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-500 border border-green-100'">
                        <Icon :icon="pendingAction === 'suspend' ? 'ph:warning-circle-bold' : 'ph:check-circle-bold'"
                            class="text-4xl" />
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-navy">{{ pendingAction === 'suspend' ? t('root.index.suspend_title', 'Suspend Account?') :
                            t('root.index.activate_title', 'Activate Account?') }}</h3>
                        <div class="text-gray-400 text-xs mt-2 leading-relaxed">
                            {{ pendingAction === 'suspend' ? t('root.index.suspend_desc', 'Are you sure you want to deactivate access for') : t('root.index.activate_desc', 'Are you sure you want to activate access for') }}
                            <span class="font-bold text-navy">{{ selectedUser?.name }}</span>?
                        </div>
                    </div>
                </div>

                <div class="flex gap-3">
                    <button @click="showConfirmModal = false"
                        class="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-black text-gray-500 hover:bg-gray-50 transition-all tracking-widest">
                        {{ t('root.create_account.cancel') }}
                    </button>
                    <button @click="executeAction" :disabled="actionLoading"
                        class="flex-1 py-3 rounded-xl text-xs font-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 tracking-widest shadow-lg"
                        :class="pendingAction === 'suspend' ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200' : 'bg-navy text-primary hover:bg-navy/90 shadow-navy/20'">
                        <Icon v-if="actionLoading" icon="ph:spinner-bold" class="animate-spin" />
                        {{ pendingAction === 'suspend' ? t('root.index.confirm_suspend', 'Yes, Suspend') : t('root.index.confirm_activate', 'Yes, Activate') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Change Password Modal -->
        <div v-if="showPasswordModal"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            @click.self="showPasswordModal = false">
            <div
                class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 animate-in zoom-in-95 duration-200">
                <div class="flex flex-col items-center text-center gap-4">
                    <div class="size-16 rounded-3xl flex items-center justify-center bg-primary/10 text-navy border border-primary/20">
                        <Icon icon="ph:lock-key-bold" class="text-4xl text-navy" />
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-navy">{{ t('root.index.change_password_title') }}</h3>
                        <div class="text-gray-400 text-xs mt-2 leading-relaxed">
                            {{ t('root.index.change_password_desc') }}
                            <span class="font-bold text-navy">{{ selectedUser?.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black text-gray-500 tracking-widest ml-1">{{ t('root.index.new_password_label') }}</label>
                        <input v-model="newPassword" type="password" placeholder="••••••••"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                    </div>
                </div>

                <div class="flex gap-3">
                    <button @click="showPasswordModal = false"
                        class="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-black text-gray-500 hover:bg-gray-50 transition-all tracking-widest">
                        {{ t('root.create_account.cancel') }}
                    </button>
                    <button @click="executeChangePassword" :disabled="passwordLoading || newPassword.length < 5"
                        class="flex-1 py-3 rounded-xl text-xs font-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 tracking-widest shadow-lg bg-navy text-primary hover:bg-navy/90 shadow-navy/20">
                        <Icon v-if="passwordLoading" icon="ph:spinner-bold" class="animate-spin" />
                        {{ t('root.index.save_password') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Edit Subscription Modal -->
        <div v-if="showEditSubModal"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            @click.self="showEditSubModal = false">
            <div
                class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 animate-in zoom-in-95 duration-200">
                <div class="flex items-center gap-4">
                    <div
                        class="size-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <Icon icon="ph:pencil-simple-line-bold" class="text-navy text-2xl" />
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-navy tracking-tight">{{ t('root.subscriptions.edit_modal_title') }}</h3>
                        <div class="text-[10px] font-bold text-gray-400 mt-0.5">{{ selectedUser?.name }}</div>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black text-gray-500 tracking-widest ml-1">{{ t('root.subscriptions.edit_plan_label') }}</label>
                        <select v-model="editPlanId"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-4 focus:ring-primary/10 transition-all">
                            <option :value="null">Free</option>
                            <option v-for="p in availablePlansForEdit" :key="p.id" :value="p.id">
                                {{ p.name }} ({{ formatCurrency(p.price) }})
                            </option>
                        </select>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black text-gray-500 tracking-widest ml-1">{{ t('root.subscriptions.edit_expires_label') }}</label>
                        <input v-model="editExpiresAt" type="date" :disabled="editPlanId === null"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed" />
                    </div>
                </div>

                <div class="flex gap-3">
                    <button @click="showEditSubModal = false"
                        class="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-black text-gray-500 hover:bg-gray-50 transition-all tracking-widest">
                        {{ t('root.subscriptions.edit_cancel') }}
                    </button>
                    <button @click="submitEditSubscription" :disabled="editLoading"
                        class="flex-1 py-3 bg-navy text-primary rounded-xl text-xs font-black hover:bg-navy/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 tracking-widest shadow-lg shadow-navy/20">
                        <Icon v-if="editLoading" icon="ph:spinner-bold" class="animate-spin" />
                        {{ t('root.subscriptions.edit_save') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Add Club Modal -->
        <div v-if="showAddClubModal"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            @click.self="showAddClubModal = false">
            <div
                class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                <div class="flex items-center gap-4">
                    <div
                        class="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:shield-bold" class="text-navy text-xl" />
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-navy tracking-tight">{{ isEditingClub ? 'Edit Club' : 'Add New Club' }}</h3>
                        <div class="text-[10px] font-bold text-gray-400 mt-0.5">{{ isEditingClub ? 'Update club details' : 'Register a new club data master' }}</div>
                    </div>
                </div>

                <form @submit.prevent="submitAddClub" class="space-y-4">
                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-gray-500 tracking-widest ml-1">Club Name</label>
                        <input v-model="clubForm.name" type="text" required placeholder="e.g. Archery Club Elite"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-gray-500 tracking-widest ml-1">Abbreviation / Acronym</label>
                        <input v-model="clubForm.acronym" type="text" placeholder="e.g. ACE"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-gray-500 tracking-widest ml-1">City</label>
                        <input v-model="clubForm.city" type="text" placeholder="e.g. Sleman"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-gray-500 tracking-widest ml-1">Logo URL</label>
                        <input v-model="clubForm.logo_url" type="text" placeholder="e.g. /media/logo.png"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button type="button" @click="showAddClubModal = false"
                            class="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-black text-gray-500 hover:bg-gray-50 transition-all tracking-widest">
                            Cancel
                        </button>
                        <button type="submit" :disabled="addClubLoading || !clubForm.name"
                            class="flex-1 py-3 bg-navy text-primary rounded-xl text-xs font-black hover:bg-navy/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 tracking-widest shadow-lg shadow-navy/20">
                            <Icon v-if="addClubLoading" icon="ph:spinner-bold" class="animate-spin" />
                            {{ isEditingClub ? 'Save Changes' : 'Save Club' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useImageOrDefault } from '~/composables/useImageHelper'

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const route = useRoute()
const { t } = useI18n()

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })
useHead({ title: t('root.index.title') + ' — Root Terminal' })

// ── Data ──────────────────────────────────────────────────────────────
const searchQuery = ref('')
const statusFilter = ref('')
const showSuccessToast = ref(false)
const successMessage = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 8

// Reset to page 1 when filters change
watch([searchQuery, statusFilter], () => {
    currentPage.value = 1
})

const currentTab = ref('organizer')
const showAddClubModal = ref(false)
const addClubLoading = ref(false)
const clubForm = ref({
    name: '',
    acronym: '',
    city: '',
    logo_url: ''
})
const isEditingClub = ref(false)
const editingClubId = ref('')

const openAddClub = () => {
    clubForm.value = {
        name: '',
        acronym: '',
        city: '',
        logo_url: ''
    }
    isEditingClub.value = false
    editingClubId.value = ''
    showAddClubModal.value = true
}

const openEditClub = (club) => {
    clubForm.value = {
        name: club.name || '',
        acronym: club.abbreviation || '',
        city: club.city || '',
        logo_url: club.logo_url || ''
    }
    isEditingClub.value = true
    editingClubId.value = club.uuid
    showAddClubModal.value = true
}

const submitAddClub = async () => {
    addClubLoading.value = true
    try {
        const url = isEditingClub.value 
            ? `${apiBaseUrl}/root/dashboard/clubs/${editingClubId.value}`
            : `${apiBaseUrl}/root/dashboard/clubs`
        const method = isEditingClub.value ? 'PUT' : 'POST'

        await $fetch(url, {
            method: method,
            body: {
                name: clubForm.value.name,
                acronym: clubForm.value.acronym,
                city: clubForm.value.city,
                logo_url: clubForm.value.logo_url
            },
            credentials: 'include'
        })
        showAddClubModal.value = false
        successMessage.value = isEditingClub.value ? 'Club updated successfully' : 'Club added successfully'
        showSuccessToast.value = true
        setTimeout(() => { showSuccessToast.value = false }, 5000)
        await refreshSubs()
    } catch (err) {
        alert(err.data?.error || 'Failed to save club')
    } finally {
        addClubLoading.value = false
    }
}

const deleteClub = async (club) => {
    if (!confirm(`Are you sure you want to delete the club: ${club.name}?`)) return
    try {
        await $fetch(`${apiBaseUrl}/root/dashboard/clubs/${club.uuid}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        successMessage.value = 'Club deleted successfully'
        showSuccessToast.value = true
        setTimeout(() => { showSuccessToast.value = false }, 5000)
        await refreshSubs()
    } catch (err) {
        alert(err.data?.error || 'Failed to delete club')
    }
}

// Fetch Subscriptions (dependent on currentTab)
const { data: subData, refresh: refreshSubs } = await useFetch(
    () => {
        if (currentTab.value === 'club') {
            return `${apiBaseUrl}/root/dashboard/clubs`
        }
        return `${apiBaseUrl}/root/dashboard/subscriptions?type=${currentTab.value}`
    },
    {
        key: 'root-subscriptions-dynamic',
        credentials: 'include',
        watch: [currentTab]
    }
)

// Fetch Plans (target_type is handled by backend)
const { data: plansData } = await useFetch(
    `${apiBaseUrl}/root/dashboard/plans`,
    {
        key: 'root-subscription-plans',
        credentials: 'include'
    }
)

const users = computed(() => {
    if (currentTab.value === 'club') {
        const list = subData.value?.data || []
        return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
    const list = subData.value?.subscriptions || []
    return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})
const plans = computed(() => plansData.value?.plans || [])

const filteredUsers = computed(() => {
    const q = searchQuery.value.toLowerCase()
    return users.value.filter(s => {
        const mQ = !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
        const mS = !statusFilter.value || s.subscription_status === statusFilter.value
        return mQ && mS
    })
})

// Pagination Calculation
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage) || 1)
const subStartIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const subEndIndex = computed(() => subStartIndex.value + itemsPerPage)
const paginatedUsers = computed(() => filteredUsers.value.slice(subStartIndex.value, subEndIndex.value))

onMounted(() => {
    refreshSubs()
})

// ── Actions (Suspend/Activate) ─────────────────────────────────────────
const showConfirmModal = ref(false)
const selectedUser = ref(null)
const pendingAction = ref('') // 'suspend' or 'activate'
const actionLoading = ref(false)

const confirmAction = (user, action) => {
    selectedUser.value = user
    pendingAction.value = action
    showConfirmModal.value = true
}

const executeAction = async () => {
    if (!selectedUser.value) return
    actionLoading.value = true
    try {
        await $fetch(`${apiBaseUrl}/root/dashboard/users/${selectedUser.value.user_type}/${selectedUser.value.uuid}/terminate`, {
            method: 'PATCH',
            body: { action: pendingAction.value },
            credentials: 'include'
        })
        showConfirmModal.value = false
        successMessage.value = t('root.index.success_message')
        showSuccessToast.value = true
        setTimeout(() => { showSuccessToast.value = false }, 5000)
        await refreshSubs()
    } catch (err) {
        alert(err.data?.error || t('root.index.error_message', 'Failed to change account status'))
    } finally {
        actionLoading.value = false
    }
}

// ── Password Reset Actions ──────────────────────────────────────────────
const showPasswordModal = ref(false)
const newPassword = ref('')
const passwordLoading = ref(false)

const openChangePassword = (user) => {
    selectedUser.value = user
    newPassword.value = ''
    showPasswordModal.value = true
}

const executeChangePassword = async () => {
    if (!selectedUser.value || newPassword.value.length < 5) return
    passwordLoading.value = true
    try {
        await $fetch(`${apiBaseUrl}/root/dashboard/users/${selectedUser.value.user_type}/${selectedUser.value.uuid}/password`, {
            method: 'PUT',
            body: { password: newPassword.value },
            credentials: 'include'
        })
        showPasswordModal.value = false
        successMessage.value = t('root.index.change_password_success')
        showSuccessToast.value = true
        setTimeout(() => { showSuccessToast.value = false }, 5000)
    } catch (err) {
        alert(err.data?.error || t('root.index.change_password_error'))
    } finally {
        passwordLoading.value = false
    }
}

// ── Edit Subscription Actions ──────────────────────────────────────────
const showEditSubModal = ref(false)
const editStatus = ref('')
const editPlanId = ref(null)
const editExpiresAt = ref('')
const editExtendDays = ref(0)
const editLoading = ref(false)

const availablePlansForEdit = computed(() => {
    if (!selectedUser.value) return []
    return plans.value.filter(p => p.user_type === selectedUser.value.user_type)
})

const openEditSubscription = (sub) => {
    selectedUser.value = sub
    editStatus.value = sub.subscription_status
    editPlanId.value = sub.plan_id
    editExpiresAt.value = sub.expires_at ? sub.expires_at.slice(0, 10) : ''
    editExtendDays.value = 0
    showEditSubModal.value = true
}

const submitEditSubscription = async () => {
    editLoading.value = true
    try {
        const body = {
            plan_id: editPlanId.value,
            expires_at: editPlanId.value === null ? null : (editExpiresAt.value || null)
        }

        await $fetch(
            `${apiBaseUrl}/root/dashboard/subscriptions/${selectedUser.value.user_type}/${selectedUser.value.uuid}`,
            { method: 'PUT', body, credentials: 'include' }
        )
        showEditSubModal.value = false
        successMessage.value = t('root.subscriptions.edit_success', 'Subscription updated successfully')
        showSuccessToast.value = true
        setTimeout(() => { showSuccessToast.value = false }, 5000)
        await refreshSubs()
    } catch (err) {
        alert(err.data?.error || t('root.subscriptions.error_message', 'Failed to update subscription'))
    } finally {
        editLoading.value = false
    }
}

watch(editPlanId, (newPlanId) => {
    if (newPlanId === null) {
        editExpiresAt.value = ''
    }
})

// ── Helpers ────────────────────────────────────────────────────────────
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'active': return 'bg-green-50 text-green-600 border-green-100'
        case 'trial': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'suspended': return 'bg-red-50 text-red-500 border-red-100'
        case 'expired': return 'bg-orange-50 text-orange-600 border-orange-100'
        case 'canceled': return 'bg-gray-50 text-gray-400 border-gray-200'
        default: return 'bg-gray-50 text-gray-400 border-gray-200'
    }
}

const isExpiredSoon = (exp) => {
    if (!exp) return false
    const d = new Date(exp)
    if (isNaN(d.getTime())) return false
    return (d - new Date()) < 7 * 86400000
}

const formatDate = (d) => {
    if (!d || d.startsWith('1970')) return '—'
    try {
        return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d))
    } catch (e) {
        return '—'
    }
}

const formatCurrency = (v) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
</script>
