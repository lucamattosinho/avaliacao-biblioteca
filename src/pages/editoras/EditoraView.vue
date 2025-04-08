<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useEditoraStore } from '@/store/useEditoraStore'
import { useLivroStore } from '@/store/useLivroStore'
import { onMounted, ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import { useAutorStore } from '@/store/useAutorStore'

const route = useRoute()
const router = useRouter()
const { getEditoraById } = useEditoraStore()
const { getLivros } = useLivroStore()
const { getAutorById } = useAutorStore()

const publisher = ref(null)
const id = ref(null)

const livroSelecionado = ref(null)
const showModal = ref(false)

onMounted(() => {
  id.value = Number(route.params.id)
  publisher.value = getEditoraById(id.value)
})

const livrosDaEditora = computed(() =>
  getLivros.value.filter(livro => livro.publisherId === id.value)
)

const irParaEdicao = () => {
  router.push(`/editoras/${id.value}/editar`)
}

function abrirModal(livro) {
  livroSelecionado.value = livro
  showModal.value = true
}

</script>

<template>
  <div class="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl text-3xl font-semibold text-gray-800 mb-6">
    <div v-if="publisher" class="flex items-center justify-between mb-4">
      <h1 class="text-4xl font-bold">Editora: {{ publisher.name }}</h1>
      <button @click="irParaEdicao" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-2xl">
        Editar
      </button>
    </div>
    <div v-else>
        Carregando editora...
    </div>

    <div class="mb-6" v-if="publisher">
      <p><strong>ID:</strong> {{ publisher.id }}</p>
    </div>

    <div>
      <h2 class="text-xl font-semibold mb-2">Livros da Editora</h2>
      <div v-if="livrosDaEditora.length === 0" class="text-gray-500">
        Nenhum livro cadastrado para esta editora.
      </div>
      <ul v-else class="space-y-2">
        <li v-for="livro in livrosDaEditora" :key="livro.id" class="border p-2 rounded shadow-sm">
          <div class="flex items-center gap-4">
            <img :src="livro.cover" alt="Capa" class="w-24 h-32 object-cover rounded shadow cursor-pointer transition-transform hover:scale-105 text-center" @click="abrirModal(livro)" />
            <div>
              <h3 class="font-normal">{{ livro.title }}</h3>
              <p class="text-sm text-gray-600">Ano: {{ livro.year }}</p>
              <p class="text-sm text-gray-600">Autora: {{ getAutorById(livro.authorId).name }}</p>
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