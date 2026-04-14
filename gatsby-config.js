/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Decision Labs`,
    siteUrl: `https://decision-labs.com`,
    description: `Decision Labs is a consultancy specializing in Decision Science. We build AI-driven products, train custom models, and create intelligent systems.`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/blog`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [],
      },
    },
  ],
}
