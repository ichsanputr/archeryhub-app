import re

# Update modals isEn
modals = [
    r'c:\E\ichsan\startup\archeryhub.id\app\components\tournament\register\PartnerSelectorModal.vue',
    r'c:\E\ichsan\startup\archeryhub.id\app\components\tournament\register\BulkImportModal.vue',
    r'c:\E\ichsan\startup\archeryhub.id\app\components\tournament\register\AddAthleteModal.vue'
]

for m in modals:
    with open(m, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("const isEn = computed(() => true)", "const isEn = computed(() => locale.value !== 'id')")
    with open(m, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {m}')

print('Modals updated.')
