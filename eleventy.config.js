const staticFiles = [
  "index.html",
  "about.html",
  "services.html",
  "contact.html",
  "get-quote.html",
  "careers.html",
  "areas.html",
  "airbnb-turnover-cleaning-derby.html",
  "deep-cleaning-derby.html",
  "end-of-tenancy-cleaning-derby.html",
  "office-cleaning-derby.html",
  "carpet-cleaning-derby.html",
  "privacy.html",
  "cookies.html",
  "terms.html",
  "robots.txt",
  "CNAME",
  "_headers"
];

const toDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date supplied to Eleventy: ${value}`);
  }
  return date;
};

const xmlEntities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;"
};

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  staticFiles.forEach((file) => {
    eleventyConfig.addPassthroughCopy({ [file]: file });
  });

  eleventyConfig.addWatchTarget("assets/css/style.css");
  eleventyConfig.addWatchTarget("assets/js/main.js");

  eleventyConfig.addFilter("readableDate", (value) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/London"
    }).format(toDate(value))
  );

  eleventyConfig.addFilter("isoDate", (value) =>
    toDate(value).toISOString()
  );

  eleventyConfig.addFilter("shortIsoDate", (value) =>
    toDate(value).toISOString().slice(0, 10)
  );

  eleventyConfig.addFilter("rfc822Date", (value) =>
    toDate(value).toUTCString()
  );

  eleventyConfig.addFilter("absoluteUrl", (value) =>
    new URL(value || "/", "https://relypro.co.uk").href
  );

  eleventyConfig.addFilter("json", (value) =>
    JSON.stringify(value).replace(/</g, "\\u003c")
  );

  eleventyConfig.addFilter("xmlEscape", (value = "") =>
    String(value).replace(/[&<>"']/g, (character) => xmlEntities[character])
  );

  eleventyConfig.addCollection("publishedPosts", (collectionApi) =>
    collectionApi
      .getFilteredByTag("blog")
      .filter((item) => !item.data.draft)
      .sort((left, right) => right.date - left.date)
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
