<template>
  <div class="home-wrap">
    <div class="home-inner">
      <div class="home-title">Soyoung's TIL</div>
      <div class="home-line"></div>
      <div class="home-bottom">
        <div class="home-right">
          <p class="home-desc-ko">공부한 내용을 정리하는 공간입니다.</p>
          <p class="home-desc-jp">勉強した内容を整理するスペースです。</p>
          <ul class="home-links">
            <li>
              <a href="https://github.com/SoYoungLEE-me" target="_blank"
                >GitHub</a
              >
            </li>
            <li>
              <a
                href="https://wandering-scorpio-360.notion.site/Soyoung-Lee-s-Portfolio-2b070362ec3e80b99823cb3734cf731e"
                target="_blank"
                >Portfolio</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.home-wrap {
  height: calc(100vh - 9rem);
  display: flex;
  align-items: center;
  padding: 0;
}

.home-inner {
  width: 100%;
  margin: 0 8rem;
}

.home-title {
  font-size: clamp(2rem, 4vw, 3.8rem);
  font-weight: 900;
  color: #1a1a2e;
  line-height: 1.1;
  white-space: nowrap;
}

.home-line {
  width: 100%;
  height: 5px;
  background: #f97316;
  border-radius: 3px;
  margin: 1.2rem 0;
  display: block;
}

.home-bottom {
  display: flex;
  justify-content: flex-end;
}

.home-right {
  text-align: right;
}

.home-desc-ko {
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 0.4rem;
  line-height: 1.7;
}

.home-desc-jp {
  font-size: 0.85rem;
  color: #9ca3af;
  line-height: 1.7;
  margin-bottom: 1.2rem;
}

.home-links {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.home-links li {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.home-links a {
  font-size: 0.95rem;
  font-weight: 600;
  color: #f97316 !important;
  text-decoration: none;
}

.home-links a:hover {
  text-decoration: underline;
}

/* 태블릿 */
@media (max-width: 768px) {
  .home-inner {
    margin: 0 3rem;
  }
  .home-title {
    white-space: normal;
    word-break: keep-all;
  }
}

/* 모바일 */
@media (max-width: 480px) {
  .home-inner {
    margin: 0 1.5rem;
  }
  .home-title {
    white-space: normal;
    word-break: keep-all;
  }
}
</style>
