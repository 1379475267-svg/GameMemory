<template>
  <div class="app-shell">
    <aside class="sidebar">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">GM</span>
        <span>
          <strong>GameMemory</strong>
          <small>个人游戏档案馆</small>
        </span>
      </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/">游戏库</RouterLink>
        <RouterLink to="/search">搜索导入</RouterLink>
        <RouterLink to="/stats">统计</RouterLink>
      </nav>
    </aside>

    <main class="main-panel">
      <RouterView />
    </main>
  </div>
</template>
