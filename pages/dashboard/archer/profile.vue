<template>
  <div class="flex flex-col gap-6">
    <!-- Header Section -->
    <DashboardHeader
      :title="isEn ? 'Archer Profile' : 'Profil Atlet'"
      :subtitle="isEn ? 'Manage your personal identity, club affiliation, archery specs, and public info.' : 'Kelola identitas diri, klub, spesifikasi memanah, dan profil publik Anda.'"
      icon="ph:user-circle-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/archer' },
        { label: isEn ? 'Archer Profile' : 'Profil Atlet' }
      ]"
    >
      <template #actions>
        <div class="flex items-center gap-2.5 shrink-0">
          <button
            v-if="accountForm.username || user?.username"
            @click="previewProfile"
            type="button"
            class="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-sm transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Icon icon="ph:eye-bold" class="text-sm text-primary" />
            <span>{{ isEn ? 'Preview Profile' : 'Lihat Profil Publik' }}</span>
          </button>
          <BaseButton
            type="button"
            @click="saveFullProfile"
            :disabled="isSaving"
            variant="primary"
            size="sm"
            class="h-10 px-5 text-xs font-black gap-2"
          >
            <Icon v-if="isSaving" icon="ph:spinner-gap-bold" class="text-base animate-spin" />
            <Icon v-else icon="ph:floppy-disk-bold" class="text-base" />
            <span>{{ isSaving ? (isEn ? 'Saving...' : 'Menyimpan...') : (isEn ? 'Save Changes' : 'Simpan Perubahan') }}</span>
          </BaseButton>
        </div>
      </template>
    </DashboardHeader>

    <!-- Segmented Tabs Navigation -->
    <div class="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar shadow-xs">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        type="button"
        :class="activeTab === tab.id ? 'bg-white shadow-xs text-navy font-black' : 'text-slate-600 hover:text-navy hover:bg-white/50 font-bold'"
        class="flex items-center justify-center gap-2 flex-1 min-w-[160px] px-5 py-3 rounded-xl text-sm whitespace-nowrap transition-all shrink-0 cursor-pointer">
        <Icon :icon="tab.icon" class="text-lg shrink-0" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="w-full space-y-6">
      
      <!-- TAB 1: INFORMASI PRIBADI, KONTAK & SOSIAL -->
      <div v-if="activeTab === 'information'" class="space-y-6">
        
        <!-- Media Section (Avatar & Banner) -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs">
                <Icon icon="ph:image-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
                  {{ isEn ? 'Profile Photo & Banner' : 'Foto Profil & Sampul Banner' }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {{ isEn ? 'Upload your official avatar and profile banner.' : 'Unggah foto profil resmi dan gambar banner profil Anda.' }}
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <!-- Avatar -->
            <div class="space-y-3">
              <label class="block text-sm font-bold text-navy">
                {{ isEn ? 'Profile Photo (Avatar)' : 'Foto Profil (Avatar)' }}
              </label>
              <div class="flex items-center gap-5">
                <div
                  class="size-24 rounded-full bg-slate-100 border-2 border-slate-200 shadow-xs overflow-hidden shrink-0 relative group cursor-pointer"
                  @click="openMediaLibrary('avatar')">
                  <img :src="useImageOrDefault(accountForm.avatar_url, accountForm.full_name)"
                    class="w-full h-full object-cover" />
                  <div
                    class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Icon icon="ph:camera-bold" class="text-white text-2xl" />
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="text-sm font-bold text-navy">
                    {{ isEn ? 'JPG, PNG or WEBP' : 'Format JPG, PNG atau WEBP' }}
                  </div>
                  <div class="text-xs text-slate-500 max-w-[200px] leading-relaxed">
                    {{ isEn ? 'Square image recommended, min. 300x300 px.' : 'Disarankan foto persegi, min. 300x300 px.' }}
                  </div>
                  <button
                    type="button"
                    @click="openMediaLibrary('avatar')"
                    class="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-navy text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer">
                    <Icon icon="ph:pencil-simple-bold" class="text-sm" />
                    <span>{{ isEn ? 'Change Photo' : 'Ganti Foto' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Banner -->
            <div class="space-y-3">
              <label class="block text-sm font-bold text-navy">
                {{ isEn ? 'Profile Banner' : 'Sampul Profil' }}
              </label>
              <div
                class="w-full aspect-[21/9] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden relative group cursor-pointer"
                @click="openMediaLibrary('banner')">
                <img v-if="accountForm.banner_url" :src="useImageOrDefault(accountForm.banner_url)"
                  class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                  <Icon icon="ph:image-square-bold" class="text-3xl text-slate-300" />
                  <span class="text-xs font-bold text-slate-400">{{ isEn ? 'Click to upload banner' : 'Klik untuk unggah banner' }}</span>
                </div>
                <div
                  class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Icon icon="ph:pencil-simple-bold" class="text-white text-2xl" />
                </div>
                <button v-if="accountForm.banner_url" @click.stop="accountForm.banner_url = ''"
                  type="button"
                  class="absolute top-2 right-2 size-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors cursor-pointer">
                  <Icon icon="ph:trash-bold" class="text-sm" />
                </button>
              </div>
              <div class="text-xs text-slate-500">
                {{ isEn ? 'Recommended size 1200x400 px, max 2MB.' : 'Rekomendasi ukuran 1200x400 px, maksimal 2MB.' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Identitas & Data Diri -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs">
                <Icon icon="ph:user-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
                  {{ isEn ? 'Identity & Personal Data' : 'Identitas & Data Pribadi' }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {{ isEn ? 'Official information used for tournament registration and verification.' : 'Data resmi yang digunakan untuk verifikasi dan pendaftaran turnamen.' }}
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            <BaseInput
              v-model="accountForm.full_name"
              :label="isEn ? 'Full Name' : 'Nama Lengkap'"
              :placeholder="isEn ? 'Enter your full name' : 'Nama lengkap sesuai identitas'"
              :error="errors.full_name"
              @blur="validateField('full_name')"
              required
              icon="ph:user-bold" />
            
            <BaseInput
              v-model="accountForm.username"
              :label="isEn ? 'Username' : 'Username Publik'"
              placeholder="username"
              :hint="isEn ? 'Used for your public profile link' : 'Digunakan untuk tautan publik profil Anda'"
              :error="errors.username || (isUsernameTaken ? (isEn ? 'Username is already taken' : 'Username sudah digunakan orang lain') : '')"
              @blur="validateField('username')"
              icon="ph:at-bold" />

            <BaseInput
              v-model="accountForm.nik"
              :label="isEn ? 'National ID / NIK' : 'NIK / Nomor Identitas'"
              :placeholder="isEn ? '16-digit ID number' : '16 digit nomor NIK'"
              :error="errors.nik"
              @blur="validateField('nik')"
              numberOnly
              icon="ph:identification-badge-bold" />

            <BaseDatePicker
              v-model="accountForm.date_of_birth"
              :label="isEn ? 'Date of Birth' : 'Tanggal Lahir'"
              :error="errors.date_of_birth"
              @blur="validateField('date_of_birth')" />

            <BaseSelect
              v-model="accountForm.gender"
              :label="isEn ? 'Gender' : 'Jenis Kelamin'"
              :items="genderOptions"
              required
              icon="ph:gender-intersex" />

            <BaseInput
              v-model.number="accountForm.height_cm"
              :label="isEn ? 'Height (cm)' : 'Tinggi Badan (cm)'"
              type="number"
              placeholder="170"
              :error="errors.height_cm"
              @blur="validateField('height_cm')"
              icon="ph:arrows-out-line-vertical-bold" />
            
            <BaseInput
              v-model.number="accountForm.weight_kg"
              :label="isEn ? 'Weight (kg)' : 'Berat Badan (kg)'"
              type="number"
              placeholder="65"
              :error="errors.weight_kg"
              @blur="validateField('weight_kg')"
              icon="ph:scales-bold" />
          </div>
        </div>

        <!-- Spesifikasi Atlet & Klub -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs">
                <Icon icon="ph:target-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
                  {{ isEn ? 'Archery Specifications & Club' : 'Klub & Spesifikasi Memanah' }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {{ isEn ? 'Your primary archery category, hand dominance, and club origin.' : 'Kategori divisi panahan utama, dominansi tangan, dan klub asal Anda.' }}
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <BaseSelect
              v-model="accountForm.bow_type"
              :label="isEn ? 'Primary Bow Division' : 'Divisi Busur Utama'"
              :items="bowTypeOptions"
              icon="ph:crosshair-bold" />

            <BaseSelect
              v-model="accountForm.hand_dominance"
              :label="isEn ? 'Hand Dominance' : 'Dominansi Tangan'"
              :items="handDominanceOptions"
              icon="ph:hand-pointing-bold" />

            <div class="md:col-span-2">
              <ClubSelector 
                v-model="accountForm.club_id"
                v-model:newClubName="accountForm.new_club_name"
                v-model:newClubAcronym="accountForm.new_club_acronym"
                :label="isEn ? 'Club / Contingent Affiliation' : 'Klub / Asal Kontingen'"
                :placeholder="isEn ? 'Search or select your archery club...' : 'Cari atau pilih klub panahan Anda...'" />
            </div>
          </div>
        </div>

        <!-- Kontak & Domisili -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs">
                <Icon icon="ph:map-pin-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
                  {{ isEn ? 'Contact & Residential Address' : 'Kontak & Alamat Domisili' }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {{ isEn ? 'Contact information and address for official communication.' : 'Informasi kontak darurat dan alamat domisili untuk surat-menyurat resmi.' }}
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            <BaseInput
              v-model="accountForm.email"
              :label="isEn ? 'Email' : 'Alamat Email'"
              type="email"
              placeholder="archer@example.com"
              :error="errors.email"
              @blur="validateField('email')"
              required
              icon="ph:envelope-bold" />

            <BaseInput
              v-model="accountForm.phone"
              :label="isEn ? 'Phone / WhatsApp' : 'Nomor Telepon / WhatsApp'"
              type="tel"
              placeholder="+62 812-3456-7890"
              :error="errors.phone"
              @blur="validateField('phone')"
              numberOnly
              icon="ph:phone-bold" />

            <BaseInput
              v-model="accountForm.emergency_contact_name"
              :label="isEn ? 'Emergency Contact Name' : 'Nama Kontak Darurat'"
              :placeholder="isEn ? 'Guardian / Family Name' : 'Nama Wali / Keluarga'"
              icon="ph:user-bold" />

            <BaseSelect
              v-model="accountForm.country"
              :label="isEn ? 'Country' : 'Negara Domisili'"
              :items="countryItems"
              :placeholder="isEn ? 'Select Country...' : 'Pilih Negara...'"
              icon="ph:globe-hemisphere-west-bold"
              searchable />

            <BaseInput
              v-model="accountForm.city"
              :label="isEn ? 'City / Regency' : 'Kota / Kabupaten'"
              :placeholder="isEn ? 'City name' : 'Kota / Kabupaten'"
              icon="ph:buildings-bold" />

            <div class="sm:col-span-2 lg:col-span-3">
              <BaseTextarea
                v-model="accountForm.address"
                :label="isEn ? 'Full Street Address' : 'Alamat Lengkap Domisili'"
                :placeholder="isEn ? 'Street name, building, RT/RW, district...' : 'Nama jalan, gedung, RT/RW, kelurahan, kecamatan...'"
                :rows="3"
                icon="ph:house-bold" />
            </div>
          </div>
        </div>

        <!-- Media Sosial & Tautan Publik -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs">
                <Icon icon="ph:share-network-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
                  {{ isEn ? 'Social Media & Public Links' : 'Media Sosial & Tautan Publik' }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {{ isEn ? 'Connect your social media profiles to showcase on your public page.' : 'Hubungkan akun media sosial Anda untuk ditampilkan di profil publik.' }}
                </div>
              </div>
            </div>

            <!-- Add Social Dropdown Button -->
            <div class="relative inline-block text-left" v-click-outside="() => showSocialDropdown = false">
              <button
                type="button"
                @click="showSocialDropdown = !showSocialDropdown"
                class="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-navy font-bold text-sm transition-colors flex items-center gap-2 shadow-2xs cursor-pointer">
                <Icon icon="ph:plus-bold" class="text-sm text-navy" />
                <span>{{ isEn ? 'Add Social Media' : 'Tambah Media Sosial' }}</span>
                <Icon icon="ph:caret-down-bold" class="text-xs text-slate-400 transition-transform" :class="showSocialDropdown ? 'rotate-180' : ''" />
              </button>

              <div
                v-if="showSocialDropdown"
                class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  v-for="plat in remainingPlatforms"
                  :key="plat.value"
                  type="button"
                  @click="addSocial(plat.value); showSocialDropdown = false"
                  class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-navy hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer">
                  <div class="size-7 rounded-lg flex items-center justify-center shrink-0" :class="getPlatformIconBagde(plat.value)">
                    <Icon :icon="plat.icon" class="text-base" />
                  </div>
                  <span class="truncate">{{ plat.title }}</span>
                </button>
                <div v-if="remainingPlatforms.length === 0" class="px-3 py-3 text-xs text-slate-400 text-center font-medium">
                  {{ isEn ? 'All platforms already added' : 'Semua platform sudah ditambahkan' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Active Socials List -->
          <div v-if="userSocials.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div
              v-for="(social, idx) in userSocials"
              :key="social.platform"
              class="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="size-8 rounded-xl flex items-center justify-center shrink-0"
                    :class="getPlatformIconBagde(social.platform)">
                    <Icon :icon="getPlatformInfo(social.platform).icon" class="text-lg" />
                  </div>
                  <span class="text-sm font-black text-navy">
                    {{ getPlatformInfo(social.platform).title }}
                  </span>
                </div>
                <button
                  type="button"
                  @click="removeSocial(idx)"
                  class="size-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 bg-white transition-colors flex items-center justify-center cursor-pointer">
                  <Icon icon="ph:trash-bold" class="text-sm" />
                </button>
              </div>
              <div>
                <input
                  v-model="social.handle"
                  type="text"
                  :placeholder="getPlatformInfo(social.platform).placeholder"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all placeholder:text-slate-400" />
              </div>
            </div>
          </div>

          <!-- Redesigned Empty State -->
          <div
            v-else
            class="py-10 px-6 text-center border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl space-y-4">
            <div class="size-14 rounded-2xl bg-primary/10 border border-primary/20 shadow-2xs flex items-center justify-center mx-auto text-navy">
              <Icon icon="ph:share-network-bold" class="text-2xl text-navy" />
            </div>
            <div class="space-y-1">
              <h4 class="text-base font-black text-navy">
                {{ isEn ? 'No social media accounts connected' : 'Belum Ada Akun Media Sosial' }}
              </h4>
              <div class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                {{ isEn ? 'Add your social media links so fellow archers and tournament organizers can connect with you.' : 'Tambahkan tautan media sosial agar pemanah lain dan panitia turnamen dapat terhubung dengan Anda.' }}
              </div>
            </div>
            
            <!-- Quick Add Chips -->
            <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                v-for="plat in popularPlatforms"
                :key="plat.value"
                type="button"
                @click="addSocial(plat.value)"
                class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-navy text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer">
                <Icon :icon="plat.icon" class="text-sm" :class="plat.iconColor" />
                <span>+ {{ plat.title }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: BIOGRAFI & PRESTASI -->
      <div v-if="activeTab === 'profile'" class="space-y-6">
        <!-- Bio Section -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs">
                <Icon icon="ph:identification-card-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
                  {{ isEn ? 'Archer Biography' : 'Biografi & Tentang Saya' }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {{ isEn ? 'Write a short story or bio about your archery journey.' : 'Tuliskan biografi singkat perjalanan memanah dan profil Anda.' }}
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-3 pt-2">
            <label class="block text-sm font-bold text-navy">
              {{ isEn ? 'Bio & Description' : 'Deskripsi Diri' }}
            </label>
            <ClientOnly>
              <TiptapEditor
                v-model="profile.bio"
                :placeholder="isEn ? 'Tell your archery background, target goals, and training routine...' : 'Ceritakan perjalanan memanah, target impian, dan rutinitas latihan Anda...'"
                minHeight="200px" />
            </ClientOnly>
          </div>
        </div>

        <!-- Achievements Section -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs">
                <Icon icon="ph:medal-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
                  {{ isEn ? 'Achievements & Accolades' : 'Daftar Prestasi & Penghargaan' }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {{ isEn ? 'Highlight up to 3 major achievements to appear on top of your public profile.' : 'Beri tanda bintang pada maksimal 3 prestasi utama untuk disorot di profil publik.' }}
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="achievementsList.push({ text: '', is_highlighted: false })"
              class="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-navy font-bold text-sm transition-colors flex items-center gap-2 shadow-2xs cursor-pointer shrink-0">
              <Icon icon="ph:plus-bold" class="text-sm text-navy" />
              <span>{{ isEn ? 'Add Achievement' : 'Tambah Prestasi' }}</span>
            </button>
          </div>

          <div class="space-y-3.5 pt-2">
            <div v-for="(ach, idx) in achievementsList" :key="idx" class="flex items-center gap-2.5">
              <!-- Highlight Star Toggle -->
              <button
                type="button"
                @click="toggleAchievementHighlight(idx)"
                :title="isEn ? 'Highlight on public profile (Max 3)' : 'Sorot di profil publik (Maks. 3)'"
                :class="ach.is_highlighted ? 'bg-amber-50 text-amber-600 border-amber-300 shadow-2xs' : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-500'"
                class="h-11 px-3.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer">
                <Icon :icon="ach.is_highlighted ? 'ph:star-fill' : 'ph:star-bold'" class="text-base text-amber-500" />
                <span v-if="ach.is_highlighted" class="hidden sm:inline font-black text-amber-700">
                  {{ isEn ? 'Featured' : 'Unggulan' }}
                </span>
              </button>

              <div class="flex-1">
                <BaseInput
                  v-model="ach.text"
                  :placeholder="isEn ? 'e.g. 1st Place National Archery Championship 2025' : 'Contoh: Juara 1 Kejuaraan Nasional Panahan 2025'"
                  icon="ph:medal-bold" />
              </div>

              <button
                type="button"
                @click="achievementsList.splice(idx, 1)"
                class="size-11 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition-colors shrink-0 cursor-pointer">
                <Icon icon="ph:trash-bold" class="text-base" />
              </button>
            </div>

            <!-- Empty State for Achievements -->
            <div
              v-if="achievementsList.length === 0"
              class="py-10 px-6 text-center border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl space-y-4">
              <div class="size-14 rounded-2xl bg-primary/10 border border-primary/20 shadow-2xs flex items-center justify-center mx-auto text-navy">
                <Icon icon="ph:trophy-bold" class="text-2xl text-navy" />
              </div>
              <div class="space-y-1">
                <h4 class="text-base font-black text-navy">
                  {{ isEn ? 'No achievements added yet' : 'Belum Ada Prestasi yang Ditambahkan' }}
                </h4>
                <div class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  {{ isEn ? 'Add medals, podium finishes, or official titles to build your archer portfolio.' : 'Tambahkan perolehan medali, juara turnamen, atau penghargaan resmi untuk melengkapi portofolio Anda.' }}
                </div>
              </div>
              <button
                type="button"
                @click="achievementsList.push({ text: '', is_highlighted: false })"
                class="px-4 py-2.5 rounded-xl bg-navy text-white hover:bg-navy/90 text-sm font-bold transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer">
                <Icon icon="ph:plus-bold" />
                <span>{{ isEn ? 'Add Your First Achievement' : 'Tambahkan Prestasi Pertama' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Event History Section -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs">
                <Icon icon="ph:calendar-check-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
                  {{ isEn ? 'Tournament Participation & Certificates' : 'Riwayat Kejuaraan & E-Sertifikat' }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {{ isEn ? 'Track your tournament history and download official event certificates.' : 'Pantau riwayat keikutsertaan turnamen dan unduh e-sertifikat resmi Anda.' }}
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4 pt-2">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <StatCard
                :title="isEn ? 'Total Tournaments' : 'Total Turnamen'"
                :value="userStats.totalEvents || 0"
                icon="ph:trophy-bold"
                color="primary"
                :description="isEn ? 'Verified tournaments participated' : 'Turnamen resmi diikuti'"
                description-icon="ph:flag-banner-bold"
              />
              <StatCard
                :title="isEn ? 'Total Achievements' : 'Total Prestasi'"
                :value="achievementsList.length"
                icon="ph:medal-bold"
                color="primary"
                :description="isEn ? 'Medals and titles recorded' : 'Medali & prestasi diraih'"
                description-icon="ph:seal-check-bold"
              />
              <StatCard
                :title="isEn ? 'Featured Highlights' : 'Prestasi Unggulan'"
                :value="achievementsList.filter(a => a.is_highlighted).length"
                icon="ph:star-bold"
                color="primary"
                :description="isEn ? 'Pinned to public profile' : 'Disorot di profil publik'"
                description-icon="ph:star-fill"
              />
            </div>

            <div class="flex justify-end pt-2">
              <NuxtLink
                to="/dashboard/archer/certificates"
                class="px-4 py-2.5 rounded-xl bg-navy text-white hover:bg-navy/90 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs">
                <span>{{ isEn ? 'View All Certificates' : 'Lihat Semua E-Sertifikat' }}</span>
                <Icon icon="ph:arrow-right-bold" />
              </NuxtLink>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Media Library Modal -->
    <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import DashboardHeader from '~/components/dashboard/DashboardHeader.vue'
import StatCard from '~/components/common/StatCard.vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import ClubSelector from '~/components/common/ClubSelector.vue'
import TiptapEditor from '~/components/common/TiptapEditor.client.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseDatePicker from '~/components/common/BaseDatePicker.vue'
import BaseTextarea from '~/components/common/BaseTextarea.vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
  layout: 'dashboard'
})

const { locale } = useI18n()
const isEn = computed(() => locale.value === 'en')

useHead({
  title: computed(() => `${isEn.value ? 'Archer Profile' : 'Profil Atlet'} - Archeris Dashboard`)
})

const { user, archerProfile } = useAuth()
const { get, put } = useApi()
const toast = useToast()

const isSaving = ref(false)
const showSocialDropdown = ref(false)

const profile = ref({
  bio: '',
  achievements: '',
  equipment: ''
})

const achievementsList = ref([])
const showMediaLibrary = ref(false)
const mediaTarget = ref('')

const openMediaLibrary = (target) => {
  mediaTarget.value = target
  showMediaLibrary.value = true
}

const handleMediaSelect = (media) => {
  if (mediaTarget.value === 'avatar') {
    accountForm.value.avatar_url = media.url
  } else if (mediaTarget.value === 'banner') {
    accountForm.value.banner_url = media.url
  }
}

const platformOptions = [
  { value: 'instagram', title: 'Instagram', icon: 'ph:instagram-logo-bold', iconColor: 'text-pink-600', placeholder: '@username_instagram' },
  { value: 'tiktok', title: 'TikTok', icon: 'ph:tiktok-logo-bold', iconColor: 'text-black', placeholder: '@username_tiktok' },
  { value: 'whatsapp', title: 'WhatsApp', icon: 'ph:whatsapp-logo-bold', iconColor: 'text-emerald-600', placeholder: '081234567890' },
  { value: 'facebook', title: 'Facebook', icon: 'ph:facebook-logo-bold', iconColor: 'text-blue-600', placeholder: 'username / link' },
  { value: 'twitter', title: 'Twitter / X', icon: 'ph:twitter-logo-bold', iconColor: 'text-slate-800', placeholder: '@username' },
  { value: 'youtube', title: 'YouTube', icon: 'ph:youtube-logo-bold', iconColor: 'text-rose-600', placeholder: 'channel / link' },
  { value: 'spotify', title: 'Spotify', icon: 'ph:spotify-logo-bold', iconColor: 'text-emerald-500', placeholder: 'username / link' },
  { value: 'website', title: 'Website', icon: 'ph:globe-bold', iconColor: 'text-blue-500', placeholder: 'https://example.com' },
  { value: 'pinterest', title: 'Pinterest', icon: 'ph:pinterest-logo-bold', iconColor: 'text-rose-700', placeholder: 'username / link' },
  { value: 'linkedin', title: 'LinkedIn', icon: 'ph:linkedin-logo-bold', iconColor: 'text-blue-700', placeholder: 'username / link' }
]

const popularPlatforms = computed(() => {
  return platformOptions.slice(0, 5).filter(p => !userSocials.value.some(s => s.platform === p.value))
})

const userSocials = ref([])

const remainingPlatforms = computed(() => {
  return platformOptions.filter(p => !userSocials.value.some(s => s.platform === p.value))
})

const addSocial = (platform) => {
  if (!userSocials.value.some(s => s.platform === platform)) {
    userSocials.value.push({ platform, handle: '' })
  }
}

const removeSocial = (index) => {
  userSocials.value.splice(index, 1)
}

const getPlatformInfo = (platform) => {
  return platformOptions.find(p => p.value === platform) || platformOptions[0]
}

const getPlatformIconBagde = (platform) => {
  if (platform === 'instagram') return 'bg-pink-50 text-pink-600 border border-pink-200'
  if (platform === 'tiktok') return 'bg-slate-900 text-white'
  if (platform === 'whatsapp') return 'bg-emerald-50 text-emerald-600 border border-emerald-200'
  if (platform === 'facebook') return 'bg-blue-50 text-blue-600 border border-blue-200'
  if (platform === 'twitter') return 'bg-slate-100 text-slate-800 border border-slate-200'
  if (platform === 'youtube') return 'bg-rose-50 text-rose-600 border border-rose-200'
  if (platform === 'spotify') return 'bg-emerald-50 text-emerald-600 border border-emerald-200'
  return 'bg-slate-100 text-slate-700 border border-slate-200'
}

// Comprehensive Countries List
const rawCountries = [
  'Indonesia',
  'Malaysia', 'Singapore', 'Thailand', 'Philippines', 'Vietnam', 'Brunei', 'Cambodia', 'Laos', 'Myanmar', 'Timor-Leste',
  'Australia', 'New Zealand', 'Japan', 'South Korea', 'China', 'Hong Kong', 'Taiwan', 'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal',
  'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru',
  'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Portugal', 'Greece', 'Turkey', 'Russia', 'Ukraine',
  'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Egypt', 'South Africa', 'Morocco', 'Nigeria', 'Kenya',
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Armenia', 'Azerbaijan', 'Bahamas', 'Barbados', 'Belarus', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bulgaria',
  'Cameroon', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Dominican Republic', 'Ecuador', 'El Salvador', 'Estonia', 'Ethiopia', 'Fiji', 'Georgia', 'Ghana', 'Guatemala', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Jamaica', 'Kazakhstan', 'Kyrgyzstan', 'Latvia', 'Lebanon', 'Libya', 'Lithuania', 'Luxembourg', 'Madagascar', 'Maldives', 'Mali', 'Malta', 'Mauritius', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Namibia', 'Nicaragua', 'North Korea', 'North Macedonia', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Romania', 'Rwanda', 'Senegal', 'Serbia', 'Seychelles', 'Slovakia', 'Slovenia', 'Somalia', 'Sudan', 'Suriname', 'Syria', 'Tajikistan', 'Tanzania', 'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkmenistan', 'Uganda', 'Uruguay', 'Uzbekistan', 'Vatican City', 'Venezuela', 'Yemen', 'Zambia', 'Zimbabwe'
]

const countryItems = computed(() => {
  return rawCountries.map(c => ({ title: c, value: c }))
})

const genderOptions = computed(() => [
  { title: isEn.value ? 'Male (Putra)' : 'Putra (Male)', value: 'male' },
  { title: isEn.value ? 'Female (Putri)' : 'Putri (Female)', value: 'female' }
])

const bowTypeOptions = computed(() => [
  { title: 'Recurve', value: 'recurve' },
  { title: 'Compound', value: 'compound' },
  { title: 'Barebow', value: 'barebow' },
  { title: 'Traditional', value: 'traditional' },
  { title: 'Horsebow', value: 'horsebow' },
  { title: 'Standard Bow', value: 'standard_bow' }
])

const handDominanceOptions = computed(() => [
  { title: isEn.value ? 'Right Handed' : 'Tangan Kanan (Right Handed)', value: 'right' },
  { title: isEn.value ? 'Left Handed' : 'Tangan Kiri (Left Handed)', value: 'left' }
])

const accountForm = ref({
  full_name: '',
  username: '',
  nik: '',
  date_of_birth: '',
  gender: 'male',
  hand_dominance: 'right',
  height_cm: null,
  weight_kg: null,
  phone: '',
  email: '',
  emergency_contact_name: '',
  city: '',
  country: 'Indonesia',
  bow_type: 'recurve',
  address: '',
  avatar_url: '',
  banner_url: '',
  club_id: '',
  new_club_name: '',
  new_club_acronym: ''
})

// Validation State & Rules
const errors = ref({
  full_name: '',
  username: '',
  email: '',
  phone: '',
  nik: '',
  date_of_birth: '',
  height_cm: '',
  weight_kg: ''
})

const validateField = (field) => {
  if (field === 'full_name') {
    const val = accountForm.value.full_name?.trim()
    if (!val) {
      errors.value.full_name = isEn.value ? 'Full name is required.' : 'Nama lengkap wajib diisi.'
    } else if (val.length < 3) {
      errors.value.full_name = isEn.value ? 'Full name must be at least 3 characters.' : 'Nama lengkap minimal 3 karakter.'
    } else {
      errors.value.full_name = ''
    }
  }

  if (field === 'email') {
    const val = accountForm.value.email?.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!val) {
      errors.value.email = isEn.value ? 'Email is required.' : 'Alamat email wajib diisi.'
    } else if (!emailRegex.test(val)) {
      errors.value.email = isEn.value ? 'Please enter a valid email address.' : 'Format alamat email tidak valid.'
    } else {
      errors.value.email = ''
    }
  }

  if (field === 'username') {
    const val = accountForm.value.username?.trim()
    if (val) {
      if (val.length < 3) {
        errors.value.username = isEn.value ? 'Username must be at least 3 characters.' : 'Username minimal 3 karakter.'
      } else if (!/^[a-zA-Z0-9_.]+$/.test(val)) {
        errors.value.username = isEn.value ? 'Only letters, numbers, dots, and underscores allowed.' : 'Hanya boleh menggunakan huruf, angka, titik, dan garis bawah.'
      } else {
        errors.value.username = ''
      }
    } else {
      errors.value.username = ''
    }
  }

  if (field === 'phone') {
    const val = accountForm.value.phone?.trim()
    if (val && !/^[0-9+\-\s]{8,20}$/.test(val)) {
      errors.value.phone = isEn.value ? 'Phone number must be at least 8 digits.' : 'Nomor telepon minimal 8 digit.'
    } else {
      errors.value.phone = ''
    }
  }

  if (field === 'nik') {
    const val = accountForm.value.nik?.trim()
    if (val && accountForm.value.country === 'Indonesia' && !/^\d{16}$/.test(val)) {
      errors.value.nik = isEn.value ? 'Indonesian NIK must be exactly 16 digits.' : 'NIK Indonesia harus terdiri dari 16 digit angka.'
    } else {
      errors.value.nik = ''
    }
  }

  if (field === 'height_cm') {
    const val = accountForm.value.height_cm
    if (val !== null && val !== '' && (Number(val) < 50 || Number(val) > 250)) {
      errors.value.height_cm = isEn.value ? 'Height must be between 50 - 250 cm.' : 'Tinggi badan harus antara 50 - 250 cm.'
    } else {
      errors.value.height_cm = ''
    }
  }

  if (field === 'weight_kg') {
    const val = accountForm.value.weight_kg
    if (val !== null && val !== '' && (Number(val) < 20 || Number(val) > 250)) {
      errors.value.weight_kg = isEn.value ? 'Weight must be between 20 - 250 kg.' : 'Berat badan harus antara 20 - 250 kg.'
    } else {
      errors.value.weight_kg = ''
    }
  }

  if (field === 'date_of_birth') {
    const val = accountForm.value.date_of_birth
    if (val && new Date(val) > new Date()) {
      errors.value.date_of_birth = isEn.value ? 'Date of birth cannot be in the future.' : 'Tanggal lahir tidak boleh di masa depan.'
    } else {
      errors.value.date_of_birth = ''
    }
  }
}

const isUsernameTaken = ref(false)
let usernameDebounceTimer = null

watch(() => accountForm.value.username, (newVal) => {
  isUsernameTaken.value = false
  if (usernameDebounceTimer) clearTimeout(usernameDebounceTimer)
  
  const cleaned = newVal ? newVal.trim().toLowerCase() : ''
  if (cleaned.length < 3) return
  
  usernameDebounceTimer = setTimeout(async () => {
    try {
      const excludeUuid = user.value?.uuid || ''
      const res = await get(`/auth/check-username?username=${encodeURIComponent(cleaned)}&exclude_uuid=${excludeUuid}`)
      isUsernameTaken.value = res.exists
    } catch (err) {
      console.error('Failed to check username:', err)
    }
  }, 500)
})

const userStats = ref({
  totalEvents: 0,
  bestScore: null
})

const activeTab = ref('information')
const tabs = computed(() => [
  { id: 'information', label: isEn.value ? 'Personal Info & Specs' : 'Informasi & Spesifikasi', icon: 'ph:user-circle-bold' },
  { id: 'profile', label: isEn.value ? 'Bio & Achievements' : 'Biografi & Prestasi', icon: 'ph:identification-card-bold' }
])

const toggleAchievementHighlight = (idx) => {
  const current = achievementsList.value[idx]
  if (!current) return
  if (!current.is_highlighted) {
    const totalHighlighted = achievementsList.value.filter(a => a.is_highlighted).length
    if (totalHighlighted >= 3) {
      toast.warning(isEn.value ? 'Maximum 3 highlighted achievements allowed.' : 'Maksimal 3 prestasi yang dapat disorot.')
      return
    }
    current.is_highlighted = true
  } else {
    current.is_highlighted = false
  }
}

const loadProfile = async () => {
  try {
    const response = await get('/archer/me')
    const data = response.data || response

    accountForm.value = {
      full_name: data.full_name || '',
      username: data.username || '',
      nik: data.nik || '',
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split('T')[0] : '',
      gender: data.gender || 'male',
      hand_dominance: data.hand_dominance || 'right',
      height_cm: data.height_cm || null,
      weight_kg: data.weight_kg || null,
      phone: data.phone || '',
      email: data.email || '',
      emergency_contact_name: data.emergency_contact_name || '',
      city: data.city || '',
      country: data.country || 'Indonesia',
      bow_type: data.bow_type || 'recurve',
      address: data.address || '',
      avatar_url: data.avatar_url || '',
      banner_url: data.banner_url || '',
      club_id: data.club_id || '',
      new_club_name: '',
      new_club_acronym: ''
    }

    profile.value = {
      bio: data.bio || '',
      achievements: data.achievements || '',
      equipment: data.equipment || ''
    }

    achievementsList.value = data.achievements ? data.achievements.split(/\r?\n/).filter(a => a.trim() !== '').map(a => {
      if (a.startsWith('[H] ')) return { text: a.replace('[H] ', ''), is_highlighted: true }
      return { text: a, is_highlighted: false }
    }) : []

    userSocials.value = []
    if (data.social_instagram) userSocials.value.push({ platform: 'instagram', handle: data.social_instagram })
    if (data.social_tiktok) userSocials.value.push({ platform: 'tiktok', handle: data.social_tiktok })
    if (data.social_whatsapp) userSocials.value.push({ platform: 'whatsapp', handle: data.social_whatsapp })
    if (data.social_facebook) userSocials.value.push({ platform: 'facebook', handle: data.social_facebook })
    if (data.social_twitter) userSocials.value.push({ platform: 'twitter', handle: data.social_twitter })
    if (data.social_youtube) userSocials.value.push({ platform: 'youtube', handle: data.social_youtube })
    if (data.social_spotify) userSocials.value.push({ platform: 'spotify', handle: data.social_spotify })
    if (data.social_website) userSocials.value.push({ platform: 'website', handle: data.social_website })
    if (data.social_pinterest) userSocials.value.push({ platform: 'pinterest', handle: data.social_pinterest })
    if (data.social_linkedin) userSocials.value.push({ platform: 'linkedin', handle: data.social_linkedin })

    try {
      const stats = await get('/archers/me/stats')
      if (stats) {
        userStats.value = {
          totalEvents: stats.total_events || 0,
          bestScore: stats.best_score || null
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }

  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}

const saveFullProfile = async () => {
  // Trigger full validation
  ['full_name', 'email', 'username', 'phone', 'nik', 'height_cm', 'weight_kg', 'date_of_birth'].forEach(validateField)

  const hasErrors = Object.values(errors.value).some(err => !!err)
  if (hasErrors) {
    toast.error(isEn.value ? 'Please fix the errors before saving.' : 'Mohon periksa dan perbaiki isian formulir.')
    return
  }

  if (isUsernameTaken.value) {
    toast.error(isEn.value ? 'Username is already taken!' : 'Username sudah digunakan orang lain!')
    return
  }

  isSaving.value = true
  try {
    const payload = {
      ...accountForm.value,
      bio: profile.value.bio,
      equipment: profile.value.equipment,
      achievements: achievementsList.value.filter(a => a.text.trim() !== '').map(a => a.is_highlighted ? `[H] ${a.text.trim()}` : a.text.trim()).join('\n'),
      social_instagram: userSocials.value.find(s => s.platform === 'instagram')?.handle || '',
      social_tiktok: userSocials.value.find(s => s.platform === 'tiktok')?.handle || '',
      social_whatsapp: userSocials.value.find(s => s.platform === 'whatsapp')?.handle || '',
      social_facebook: userSocials.value.find(s => s.platform === 'facebook')?.handle || '',
      social_twitter: userSocials.value.find(s => s.platform === 'twitter')?.handle || '',
      social_youtube: userSocials.value.find(s => s.platform === 'youtube')?.handle || '',
      social_spotify: userSocials.value.find(s => s.platform === 'spotify')?.handle || '',
      social_website: userSocials.value.find(s => s.platform === 'website')?.handle || '',
      social_pinterest: userSocials.value.find(s => s.platform === 'pinterest')?.handle || '',
      social_linkedin: userSocials.value.find(s => s.platform === 'linkedin')?.handle || ''
    }

    await put('/user/profile', payload)
    toast.success(isEn.value ? 'Profile updated successfully!' : 'Profil berhasil diperbarui!')
    await loadProfile()
  } catch (error) {
    console.error('Failed to save profile:', error)
    toast.error(error?.data?.error || (isEn.value ? 'Failed to save profile' : 'Gagal menyimpan profil'))
  } finally {
    isSaving.value = false
  }
}

const previewProfile = () => {
  const uname = accountForm.value.username || user.value?.username
  if (uname) {
    window.open(`/archers/${uname}`, '_blank')
  } else {
    toast.warning(isEn.value ? 'Please set a username first to preview public profile.' : 'Silakan atur username terlebih dahulu untuk melihat profil publik.')
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
