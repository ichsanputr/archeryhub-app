<script setup>
import '~/assets/css/downbadu.css'

defineOptions({
    name: 'DownbaduLayout'
})
</script>

<template>
    <div class="downbadu-page">
        <DownbaduTopBar />
        <DownbaduNavbar />

        <slot />

        <DownbaduFooter />

        <!-- Modal for turbo-frame -->
        <turbo-frame id="modal" target="_top">
            <div class="modal" data-controller="modal" data-modal-name-value="modal"
                data-modal-placeholder-value="Loading...">
                <div class="modal-background" data-action="click->modal#close"></div>
                <div class="modal-content">
                    <div class="boxed boxed--extra-space" data-modal-target="box">
                        Loading...
                    </div>
                    <button aria-label="close" class="modal-close" data-action="modal#close">
                        <svg class="bicon" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path
                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>
        </turbo-frame>
    </div>
</template>

<style scoped>
.downbadu-page {
    background-color: #fff;
    min-height: 100vh;
}
</style>
