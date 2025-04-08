<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAutorStore } from '@/store/useAutorStore'
import { useLivroStore } from '@/store/useLivroStore'
import { onMounted, ref, computed } from 'vue'
import { useEditoraStore } from '@/store/useEditoraStore'

const route = useRoute()
const router = useRouter()
const { getAutorById } = useAutorStore()
const { getLivros } = useLivroStore()
const { getEditoraById } = useEditoraStore()

const autor = ref(null)
const id = ref(null)

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
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div v-if="autor" class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Autor: {{ autor.name }}</h1>
      <button @click="irParaEdicao" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Editar Autor
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
            <img :src="livro.cover" alt="Capa" class="w-16 h-24 object-cover rounded" />
            <div>
              <h3 class="font-bold">{{ livro.title }}</h3>
              <p class="text-sm text-gray-600">Ano: {{ livro.year }}</p>
              <p class="text-sm text-gray-600">Editora: {{ getEditoraById(livro.publisherId).name }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>