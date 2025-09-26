<script setup>
import { RouterLink } from 'vue-router'
const emit = defineEmits(['open'])
const nav = [
  { label: 'О компании', href: '/about' },
  { label: 'Резиденты', href: '/residents' },
  { label: 'Экосистема', href: '/ecosystem' },
  { label: 'Пресс-центр', href: '/press' },
  { label: 'Контакты', href: '/contacts' }
]
</script>

<template>
  <header class="site-header">
    <div class="container">
      <div class="row top">
        <RouterLink class="brand" to="/" aria-label="КИП Мастер">
          <img src="../assets/images/svg/logo.svg" alt="КИП Мастер" class="brand-logo" />
        </RouterLink>
        <nav class="abbr">
          <RouterLink to="/kip">КИП</RouterLink>
          <RouterLink to="/dip">ДИП</RouterLink>
          <RouterLink to="/skip">СКИП</RouterLink>
          <RouterLink to="/tpt">ТПТ</RouterLink>
        </nav>
        <div class="spacer" />
        <div class="phone">
          <span class="dot" />
          <a href="tel:+78552534520">+7 (8552) 53-45-20</a>
        </div>
        <button class="btn cta" @click="emit('open')">Стать резидентом</button>
        <RouterLink to="/account" class="account">Личный кабинет</RouterLink>
        <button class="lang" aria-label="Язык">RU</button>
        <button class="burger" aria-label="Меню">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="row bottom">
        <ul class="nav">
          <li v-for="item in nav" :key="item.label">
            <RouterLink :to="item.href">{{ item.label }}</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: #2f3f4b;
  color: #e9f0f6;
}
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 14px 24px;
}
.row {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: nowrap;
}
.row.top {
}
.row.bottom {
  padding-top: 12px;
}
.brand {
  display: inline-grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
}
.brand-logo {
  font-size: 14px;
}
.abbr {
  display: inline-grid;
  grid-auto-flow: column;
  gap: 18px;
}
.abbr a {
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0.6px;
  font-size: 12px;
}
.spacer {
  flex: 1 1 auto;
}
.phone {
  display: inline-grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #d7e4f0;
}
.phone .dot {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid #c9d6e3;
}
.btn {
  height: 40px;
  padding: 0 18px;
  border-radius: 999px;
  cursor: pointer;
}
.btn.cta {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
}
.account {
  color: #e6f0f8;
  text-decoration: none;
  position: relative;
  padding-left: 18px;
}
.account::before {
  content: '➔';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.7;
}
.lang {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
}
.circle {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: transparent;
  border: 2px solid #fff;
  opacity: 0.7;
}
.search {
  position: relative;
}
.search::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 2px;
  background: #fff;
  right: 6px;
  bottom: 8px;
  transform: rotate(45deg);
  border-radius: 2px;
  opacity: 0.8;
}
.nav {
  width: 100%;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 40px;
  margin: 0;
  padding: 0;
}
.nav a {
  color: #e9f0f6;
  text-decoration: none;
  font-weight: 700;
  position: relative;
  display: inline-block;
}
.nav ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  width: 100%;
}
.nav li {
  flex: 1;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  text-align: left;
}
.burger {
  display: none;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.35);
}
.burger span {
  width: 18px;
  height: 2px;
  background: #fff;
  display: block;
  border-radius: 2px;
}
.burger span + span {
  margin-top: 4px;
}
a:hover {
  color: #ffffff60;
}

@media (max-width: 996px) {
  .abbr,
  .phone,
  .search,
  .row.bottom {
    display: none;
  }
  .burger {
    display: grid;
    place-items: center;
    justify-content: center;
    align-items: center;
  }
}
</style>
