<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useEditoraStore } from '@/store/useEditoraStore'
import { useLivroStore } from '@/store/useLivroStore'
import { onMounted, ref, computed } from 'vue'
import { useAutorStore } from '@/store/useAutorStore'

const route = useRoute()
const router = useRouter()
const { getEditoraById } = useEditoraStore()
const { getLivros } = useLivroStore()
const { getAutorById } = useAutorStore()

const publisher = ref(null)
const id = ref(null)

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
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div v-if="publisher" class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Editora: {{ publisher.name }}</h1>
      <button @click="irParaEdicao" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Editar Editora
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
            <img :src="livro.cover" alt="Capa" class="w-16 h-24 object-cover rounded" />
            <div>
              <h3 class="font-bold">{{ livro.title }}</h3>
              <p class="text-sm text-gray-600">Ano: {{ livro.year }}</p>
              <p class="text-sm text-gray-600">Autora: {{ getAutorById(livro.authorId).name }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>