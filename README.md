# Dokkan Battle Summon Extension

## Description

**Dokkan Battle Summon Extension** is a Chrome extension that adds the ability to simulate summons on the Japanese version of the Dokkan Battle site.

> **Note:** As of the latest version, only the Japanese (JP) version is supported. The Global version has moved to server-side rendering (SSR), which breaks the API access used by the extension.

## Download

The extension can be downloaded from the following platforms:
- [Chrome Web Store - Dokkan Battle Summon Extension](https://chromewebstore.google.com/detail/dokkan-battle-summon-exte/nfbeiohjkojffmlcaidmjjnokhbpkphn)
- [Firefox Add-ons - Dokkan Battle Summon Extension](https://addons.mozilla.org/fr/firefox/addon/dokkan-battle-summon-extension/)

## Features

- Add the summon buttons, multi or single
- Display a counter for the Dragon Stones used
- Show the list of SSRs summoned, featured and non-featured
- Japanese (JP) version only support

## Screenshots

![Summon](public/assets/readme/Dokkan-Summon-Simulator-2.webp)

![Summon pages](public/assets/readme/Dokkan-Summon-Simulator-1.webp)

## Installation

1. Clone this repository to your local machine:
   ```sh
   git clone https://github.com/nvigneux/Dokkan-Battle-Summon-Extension.git
   ```
2. Install the necessary dependencies:
   ```sh
   cd Dokkan-Battle-Summon-Extension
   npm install
   ```
3. Start the application in development mode:
   ```sh
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
5. Load the extension in Chrome:
   - Build `npm build`
   - Open `chrome://extensions/`.
   - Enable `Developer mode`.
   - Click `Load unpacked` and select the `build` folder of your project.

## Commit Convention

Each commit message should be prefixed with these annotations:

- **New feature**: [+]
- **Refactoring, WIP, working on code**: [*]
- **Fix**: [#]
- **Code or assets deletion**: [-]

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm eject`

**Note:** This is a one-way operation. Once you `eject`, you can't go back!

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Contribution

Contributions are welcome! Please submit a pull request or open an issue to discuss the changes you want to make.

# Support me
### If you find these resources helpful for your projects or simply enjoy the project, consider supporting.
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png)](https://www.buymeacoffee.com/nvigneux?path=readme)
