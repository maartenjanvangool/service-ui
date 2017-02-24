/*
Language: Dockerfile
Requires: bash.js
Author: Alexis Hénaut <alexis@henaut.net>
Description: language definition for Dockerfile files
Category: config
*/

function hljs_dockerfile(hljs) {
  return {
    aliases: ['docker'],
    case_insensitive: true,
    keywords: 'from maintainer expose env user onbuild',
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE,
      {
        beginKeywords: 'run cmd entrypoint volume add copy workdir label healthcheck',
        starts: {
          end: /[^\\]\n/,
          subLanguage: 'bash'
        }
      }
    ],
    illegal: '</'
  }
}
