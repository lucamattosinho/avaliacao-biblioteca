<script setup>
    import { RouterView } from 'vue-router';
    import Toast from 'primevue/toast';
    import { isArray } from '@/utils/utils.js';

    // Rotas possíveis na sidebar
    const menus = [
        {
            label: 'Livros',
            icon: 'pi pi-book',
            path: '/livros'
        },
        {
            label: 'Novo Livro',
            icon: 'pi pi-plus',
            path: '/livros/novo'
        },
        {
            label: 'Novo Autor',
            icon: 'pi pi-user-edit',
            path: '/autores/novo'
        },
        {
            label: 'Nova Editora',
            icon: 'pi pi-building',
            path: '/editoras/novo'
        },
    ];

</script>
<template>
    <div class="flex flex-col w-full h-screen">
        <div class="w-full p-8 text-3xl border-b-2 h-16 pt-10 pl-10 pb-10 flex items-center bg-black text-orange-500 font-medium min-w-[500px]">
            Biblioteca - Manager
        </div>
        <div class="flex h-full">
            <div class="w-48 border-r-2 h-full px-3 py-4">
                <ul class="menu space-y-2">
                    <RouterLink
                        :to="menu.path"
                        v-for="menu of menus"
                    >
                        <li class="menu-item">
                            <i :class="menu.icon" />
                            <span>{{ menu.label }}</span>
                        </li>
                    </RouterLink>
                </ul>
            </div>
            <div class="p-5 w-full h-full">
                <RouterView />
            </div>
        </div>
    </div>

    <Toast position="bottom-center">
        <template #message="{ message }">
            <span :class="[
                'p-toast-message-icon',
                'pi',
                {
                    'pi-check': message.severity === 'success',
                },
                {
                    'pi-exclamation-triangle':
                        message.severity === 'warning',
                },
                { 'pi-times': message.severity === 'error' },
                {
                    'pi-info-circle': message.severity === 'info',
                },
            ]"></span>
            <div class="p-toast-message-text">
                <span class="p-toast-summary">{{ message.summary }}</span>
                <div class="p-toast-detail">
                    <template v-if="!isArray(message.detail)">
                        <span class="text-black">{{ message.detail }}</span>
                    </template>
                    <p
                        v-else
                        class="m-0"
                        v-for="(item, index) in message.detail"
                        :key="index"
                    >
                        {{ item }}
                    </p>
                </div>
            </div>
        </template>
    </Toast>
</template>
<style scoped lang="less">

.menu {

    &-item {

        display: flex;
        align-items: baseline;
        cursor: pointer;
        user-select: none;
        border-radius: .3rem;
        padding: 8px 2px 0 6px;
        padding-bottom: 6px;
        transition-duration: 200ms;
        

        span {

            margin-left: 3px;
        }

        &:hover {

            background-color: var(--color-background-inverted);
            color: var(--color-text-inverted);
        }
    }


}

</style>