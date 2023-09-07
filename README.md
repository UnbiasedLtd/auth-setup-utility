# auth-setup-utility

`auth-setup-utility` is an npm package that assists in setting up authentication configurations for the Unbiased NPM registry. It streamlines the process by performing Google authentication, and setting up your project's configuration files.

## Prerequisites

- [Node.js](https://nodejs.org/) > v.12
- [npm](https://www.npmjs.com/)

## Installation

You can install `auth-setup-utility` globally from the GitHub repository using the following command:

```bash
npm install -g git+ssh://git@github.com:UnbiasedLtd/auth-setup-utility.git
```

## Usage

Once installed globally, you can execute the utility from any directory in your terminal:

```bash
auth-setup-utility [options]
```

### Options:
--skip-gcloud: Skip GCloud authentication

## Functions

- `performGoogleAuth`: Authenticates with GCloud and Google Artifacts.
- `setupProjectConfigurations`: Saves CI npm configuration to root .npmrc, authenticates with required services, saves root .npmrc content to project .npmrc, and creates project yarn configuration.

## Contributing

Contributions are welcome. Please submit a PR or open an issue if you encounter any problems or have suggestions.

## Support

For support or any questions, please open an issue on our GitHub repository.
