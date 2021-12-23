# WebRTC Backend Typescript

This repo contains the backend part of the [webrt-fron-ts](https://github.com/radandevist/webrtc-front-ts) repo. This server fulfill the signaling purposes of our simple WebRTC chat app.

For each branches, the corresponding frontend could be found on the branch of the same name in webrtc-front-ts [here](https://github.com/radandevist/webrtc-front-ts).

The branch "https-local-fullstack" contains a self-hosted frontend and ssl certifificate and key to enable https for  local testing. WebRTC wont'work if it ain't https.

This repo uses the [api-express-ts](https://github.com/radandevist/api-express-ts) template.

## Requirements

You need node v14+ and yarn in order to run this project.

## Installation

### Clone or download a copy of this repo under the current branch

```bash
git clone https://github.com/radandevist/webrtc-back-ts

// or cloning a specific branch
git clone -b <branch_name> https://github.com/radandevist/webrtc-back-ts
```
### Install the dependencies

```bash
cd webrtc-back-ts
yarn install
```

### Run for development

```bash
yarn dev
```

### Build for deployment

Generate a production bundle under the `/dist` directory.

```bash
yarn build
```

### clean dist folder

```bash
yarn clean
```

### Run for development

```bash
yarn start
```

