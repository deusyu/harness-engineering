<template>
  <div class="ha-aside-mark" aria-hidden="true">
    <svg viewBox="0 0 120 44" fill="none">
      <circle cx="8" cy="36" r="3.5" fill="var(--he-ink)" />
      <path d="M8 36 C 40 30, 70 22, 102 12" stroke="var(--he-rein)" stroke-width="2" stroke-linecap="round" />
      <path d="M108 10 l-10 -0.5 M108 10 l-4 8" stroke="var(--he-rein)" stroke-width="2" stroke-linecap="round" />
    </svg>
    <span>Agent = Model + Harness</span>
  </div>
</template>

<style>
.ha-aside-mark {
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid var(--he-hairline-soft);
}

.ha-aside-mark svg {
  width: 104px;
  display: block;
}

.ha-aside-mark span {
  display: block;
  margin-top: 8px;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--he-ink-3);
}
</style>
