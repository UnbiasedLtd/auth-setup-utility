const npmrc = `@unbiased:registry=https://europe-west2-npm.pkg.dev/unbiased-shared/unbiased-npm/
//europe-west2-npm.pkg.dev/unbiased-shared/unbiased-npm/:always-auth=true`;

const yarnrc = `defaultSemverRangePrefix: ""

  nodeLinker: node-modules

  npmScopes:
    unbiased:
      npmAlwaysAuth: true
      npmAuthToken: TOKEN
      npmRegistryServer: "https://europe-west2-npm.pkg.dev/unbiased-shared/unbiased-npm/"

  plugins:
    - path: .yarn/plugins/@yarnpkg/plugin-interactive-tools.cjs
  spec: "@yarnpkg/plugin-interactive-tools"`;

export {
  npmrc,
  yarnrc
};
