<script setup lang="ts">
import type { Company } from '~~/types/company';
import { useGenuka } from '~~/composables/useGenuka';

const { getCurrentCompany } = useGenuka();

const company = ref<Company | null>(null);
const loading = ref(true);

onMounted(async () => {
  company.value = await getCurrentCompany();
  loading.value = false;
});
</script>

<template>
  <div class="container">
    <NuxtRouteAnnouncer />

    <div class="header">
      <h1>Genuka Nuxt Boilerplate</h1>
    </div>

    <div class="content">
      <div v-if="loading" class="loading">
        Chargement...
      </div>

      <div v-else-if="company" class="company-info">
        <h2>Companie Actuelle</h2>

        <div class="company-card">
          <div v-if="company.logoUrl" class="company-logo">
            <img :src="company.logoUrl" :alt="company.name" />
          </div>

          <div class="company-details">
            <h3>{{ company.name }}</h3>
            <p v-if="company.handle" class="handle">@{{ company.handle }}</p>
            <p v-if="company.description" class="description">{{ company.description }}</p>
            <p v-if="company.phone" class="phone">📞 {{ company.phone }}</p>
            <p class="company-id">ID: {{ company.id }}</p>
          </div>
        </div>
      </div>

      <div v-else class="not-authenticated">
        <h2>Non authentifié</h2>
        <p>Aucune companie n'est actuellement connectée.</p>
        <p>Veuillez vous authentifier via OAuth pour continuer.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin: 0;
}

.content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.2rem;
}

.company-info h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.company-card {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.company-logo img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #dee2e6;
}

.company-details {
  flex: 1;
}

.company-details h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.handle {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.description {
  color: #495057;
  line-height: 1.6;
  margin: 1rem 0;
}

.phone {
  color: #495057;
  margin: 0.5rem 0;
}

.company-id {
  color: #6c757d;
  font-size: 0.9rem;
  font-family: monospace;
  margin-top: 1rem;
}

.not-authenticated {
  text-align: center;
  padding: 3rem;
}

.not-authenticated h2 {
  color: #dc3545;
  margin-bottom: 1rem;
}

.not-authenticated p {
  color: #6c757d;
  line-height: 1.6;
  margin: 0.5rem 0;
}
</style>
