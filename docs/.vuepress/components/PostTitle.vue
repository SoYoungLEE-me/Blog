<template>
  <header v-if="$frontmatter.title && !$frontmatter.home" class="mb-1">
    <div
      class="text-orange-500 font-bold text-xs uppercase tracking-widest mb-3"
    >
      {{ category }}
    </div>

    <h1
      class="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tight"
    >
      {{ $frontmatter.title }}
    </h1>

    <div
      class="flex flex-wrap items-center gap-4 text-slate-500 text-sm border-b border-slate-100 pb-8"
    >
      <div class="flex items-center gap-2">
        <span class="opacity-60">Posted on</span>
        <time class="font-medium text-slate-800">{{ formattedDate }}</time>
      </div>

      <span class="hidden md:block w-px h-3 bg-slate-300"></span>

      <div v-if="$frontmatter.tags" class="flex flex-wrap gap-2">
        <span
          v-for="tag in $frontmatter.tags"
          :key="tag"
          class="bg-orange-50 text-orange-500 px-2.5 py-1 rounded-md font-semibold text-xs"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- 번역 버튼 -->
    <div class="flex items-center justify-end gap-2 mt-4 mb-2">
      <span class="text-slate-400 text-xs">🌐</span>
      <a
        :href="`https://translate.google.com/translate?sl=ko&tl=ja&u=${currentUrl}`"
        target="_blank"
        class="text-xs text-slate-400 hover:text-orange-500 transition-colors"
      >
        日本語
      </a>
      <span class="text-slate-200">|</span>
      <a
        :href="`https://translate.google.com/translate?sl=ko&tl=en&u=${currentUrl}`"
        target="_blank"
        class="text-xs text-slate-400 hover:text-orange-500 transition-colors"
      >
        English
      </a>
    </div>
  </header>
</template>

<script>
export default {
  name: "PostTitle",
  computed: {
    category() {
      return this.$page.path.split("/")[1] || "ETC";
    },
    formattedDate() {
      const raw = this.$frontmatter.date;
      if (!raw) return "";
      const date = new Date(raw);
      if (isNaN(date)) return raw;
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    currentUrl() {
      if (typeof window === "undefined") return "";
      return encodeURIComponent(window.location.href);
    },
  },
};
</script>
