export default {
  layout: "layouts/blog-post.njk",
  tags: ["blog"],
  nav: "blog",
  author: "RelyPro Cleaning Services",
  ogType: "article",
  bodyClass: "blog-page article-page",
  eleventyComputed: {
    permalink: (data) =>
      data.draft
        ? false
        : `/blog/${data.slug || data.page.fileSlug}/index.html`,
    eleventyExcludeFromCollections: (data) => Boolean(data.draft)
  }
};
