<template>
  <div class="theme-container min-h-screen bg-white" :class="pageClasses">
    <Navbar
      v-if="shouldShowNavbar"
      @toggle-sidebar="toggleSidebar"
      class="z-50 border-b bg-white"
    />
    <div class="sidebar-mask" @click="toggleSidebar(false)"></div>
    <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
      <slot name="sidebar-top" slot="top" />
      <slot name="sidebar-bottom" slot="bottom" />
    </Sidebar>

    <!-- Home -->
    <main v-if="isHome" class="page pt-14 md:pl-64 transition-all duration-300">
      <Home />
    </main>

    <!-- 일반 포스트 -->
    <main v-else class="page pt-14 md:pl-64 transition-all duration-300">
      <div class="max-w-3xl mx-auto px-6 py-6 md:py-10">
        <PostTitle />
        <article class="theme-default-content">
          <Content />
        </article>
        <PageEdit class="mt-20 border-t pt-8" />
        <PageNav class="mt-8" v-bind="{ sidebarItems }" />
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from "@theme/components/Navbar.vue";
import Sidebar from "@theme/components/Sidebar.vue";
import PageEdit from "@theme/components/PageEdit.vue";
import PageNav from "@theme/components/PageNav.vue";
import PostTitle from "../components/PostTitle.vue";
import Home from "../components/Home.vue";
import { resolveSidebarItems } from "@vuepress/theme-default/util/index.js";

export default {
  components: { Navbar, Sidebar, PageEdit, PageNav, PostTitle, Home },
  data() {
    return { isSidebarOpen: false };
  },
  computed: {
    isHome() {
      return this.$page.frontmatter.isHome === true;
    },
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      if (frontmatter.navbar === false || themeConfig.navbar === false)
        return false;
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      );
    },
    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      );
    },
    pageClasses() {
      return {
        "no-navbar": !this.shouldShowNavbar,
        "sidebar-open": this.isSidebarOpen,
        "no-sidebar": !this.sidebarItems.length,
      };
    },
  },
  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
    },
  },
};
</script>

<style>
.theme-default-content {
  line-height: 1.8;
  color: #1a1a1a;
}
.theme-default-content h1 {
  font-size: 2.2rem !important;
  font-weight: 800 !important;
  margin-top: 2rem !important;
  margin-bottom: 1rem !important;
  color: #1a1a1a !important;
  border-bottom: none !important;
}
.theme-default-content h2 {
  font-size: 1.6rem !important;
  font-weight: 700 !important;
  margin-top: 2.5rem !important;
  margin-bottom: 0.8rem !important;
  color: #1a1a1a !important;
  border-bottom: 1px solid #e8e8e8 !important;
  padding-bottom: 0.4rem !important;
}
.theme-default-content h3 {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  margin-top: 1.8rem !important;
  margin-bottom: 0.6rem !important;
  color: #1a1a1a !important;
}
.theme-default-content pre {
  border-radius: 12px;
  overflow-x: auto;
  background: #1e1e2e !important;
}
.theme-default-content code {
  background: #f3f4f6;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.9em;
  color: #d63384;
}
.theme-default-content a {
  color: #3b82f6 !important;
  text-decoration: none;
}
.theme-default-content a:hover {
  text-decoration: underline;
}
.theme-default-content ul {
  list-style-type: disc !important;
  padding-left: 1.8rem !important;
  margin: 0.8rem 0 !important;
}
.theme-default-content ol {
  list-style-type: decimal !important;
  padding-left: 1.8rem !important;
  margin: 0.8rem 0 !important;
}
.theme-default-content li {
  margin: 0.4rem 0 !important;
  line-height: 1.8 !important;
}
.theme-default-content ul ul,
.theme-default-content ol ol {
  padding-left: 1.5rem !important;
  margin: 0.2rem 0 !important;
}
</style>
