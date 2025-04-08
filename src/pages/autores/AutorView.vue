<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAutorStore } from '@/store/useAutorStore'
import { useLivroStore } from '@/store/useLivroStore'
import { onMounted, ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import { useEditoraStore } from '@/store/useEditoraStore'

const route = useRoute()
const router = useRouter()
const { getAutorById } = useAutorStore()
const { getLivros } = useLivroStore()
const { getEditoraById } = useEditoraStore()

const autor = ref(null)
const id = ref(null)

const livroSelecionado = ref(null)
const showModal = ref(false)

onMounted(() => {
  id.value = Number(route.params.id)
  autor.value = getAutorById(id.value)
})

const livrosDoAutor = computed(() =>
  getLivros.value.filter(livro => livro.authorId === id.value)
)

const irParaEdicao = () => {
  router.push(`/autores/${id.value}/editar`)
}

function abrirModal(livro) {
  livroSelecionado.value = livro
  showModal.value = true
}

</script>

<template>
  <div class="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-xl text-3xl font-semibold text-gray-800 mb-6">
    <div v-if="autor" class="flex items-center justify-between mb-4">
      <h1 class="text-4xl font-bold">Autor: {{ autor.name }}</h1>
      <button @click="irParaEdicao" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-2xl">
        Editar
      </button>
    </div>
    <div v-else>
        Carregando autor...
    </div>

    <div class="mb-6" v-if="autor">
      <p><strong>ID:</strong> {{ autor.id }}</p>
    </div>

    <div>
      <h2 class="text-xl font-semibold mb-2">Livros do Autor</h2>
      <div v-if="livrosDoAutor.length === 0" class="text-gray-500">
        Nenhum livro cadastrado para este autor.
      </div>
      <ul v-else class="space-y-2">
        <li v-for="livro in livrosDoAutor" :key="livro.id" class="border p-2 rounded shadow-sm">
          <div class="flex items-center gap-4">
            <img :src="livro.cover" alt="Capa" class="w-24 h-32 object-cover rounded shadow cursor-pointer transition-transform hover:scale-105 text-center" @click="abrirModal(livro)"/>
            <div>
              <h3 class="font-bold">{{ livro.title }}</h3>
              <p class="text-sm text-gray-600">Ano: {{ livro.year }}</p>
              <p class="text-sm text-gray-600">Editora: {{ getEditoraById(livro.publisherId).name }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <Dialog v-model:visible="showModal" modal :header="livroSelecionado?.title" :style="{ width: '400px' }">
      <div v-if="livroSelecionado" class="space-y-3">
        <img :src="livroSelecionado.cover" alt="Capa" class="w-full h-auto mb-2 rounded shadow-md" />
        <p><span class="font-medium">Autor:</span> {{ getAutorById(livroSelecionado.authorId).name }}</p>
        <p><span class="font-medium">Editora:</span> {{ getEditoraById(livroSelecionado.publisherId).name }}</p>
        <p><span class="font-medium">Ano:</span> {{ livroSelecionado.year }}</p>
        <p class="text-gray-700 text-sm mt-2">{{ livroSelecionado.sinopsis }}</p>
      </div>
    </Dialog>
  </div>
</template>