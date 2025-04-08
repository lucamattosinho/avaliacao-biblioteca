import AutorForm from '@/pages/autores/AutorForm.vue'
import AutorView from '@/pages/autores/AutorView.vue'
import EditoraForm from '@/pages/editoras/EditoraForm.vue'
import EditoraView from '@/pages/editoras/EditoraView.vue'
import LivroForm from '@/pages/livros/LivroForm.vue'
import LivroList from '@/pages/livros/LivroList.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({

    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [

        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: () => import('../pages/404.vue'),
        },
        {
            path: '/',
            name: 'wrapper',
            component: () => import('../components/AppWrapper.vue'),
            children: [
              {
                path: '',
                redirect: 'livros'
              },
              // Caminhos até os livros e forms
              {
                path: 'livros', component: LivroList
              },
              {
                path: 'livros/:id(novo|[0-9]+)', component: LivroForm
              },

              // Caminhos até os autores e forms
              {
                path: 'autores/:id', component: AutorView
              },
              {
                path: 'autores/:id/editar', component: AutorForm
              },
              {
                path: 'autores/novo', component: AutorForm
              },

              // Caminhos até as editoras e forms
              {
                path: 'editoras/novo', component: EditoraForm
              },
              {
                path: 'editoras/:id/editar', component: EditoraForm
              },
              {
                path: 'editoras/:id', component: EditoraView
              },

            ]
        },
        
    ]
})

export default router
