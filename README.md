# ChainProfile

ChainProfile is a decentralized identity layer built on OneChain that enables users to create and own their on-chain profiles without relying on centralized platforms.

Traditional digital identities are fragmented across multiple services and controlled by third parties. ChainProfile solves this by storing identity metadata — name, bio, avatar, website — directly on-chain, making it immutable, verifiable, and portable across Web3 ecosystems.

## Features

- Create a permanent on-chain profile linked to your wallet
- Update profile metadata anytime (display name, bio, avatar, website)
- Profiles are owned NFT-like objects — fully transferable
- Built on OneChain using the Move programming language
- React + TypeScript frontend with OneChain wallet integration

## Project Structure

```
ChainProfile/
├── contracts/
│   ├── Move.toml
│   └── sources/
│       └── profile.move
├── src/
│   ├── components/
│   │   ├── CreateProfile.tsx
│   │   └── MyProfile.tsx
│   ├── config/network.ts
│   ├── App.tsx
│   └── main.tsx
├── scripts/
│   ├── build.sh
│   ├── deploy.sh
│   └── test.sh
├── .env.example
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+
- OneChain CLI (`one`)
- OneChain Wallet browser extension

### Install OneChain CLI

```bash
cargo install --locked --git https://github.com/one-chain-labs/onechain.git one_chain --features tracing
mv ~/.cargo/bin/one_chain ~/.cargo/bin/one
```

### Setup

```bash
npm install
cp .env.example .env
```

### Build & Deploy Contract

```bash
./scripts/build.sh
./scripts/deploy.sh
# Copy the Package ID output into your .env as VITE_PACKAGE_ID
```

### Run Frontend

```bash
npm run dev
# Open http://localhost:3000
```

## Deployment

- Network: OneChain Testnet
- RPC: `https://rpc-testnet.onelabs.cc:443`
- Explorer: `https://explorer.onelabs.cc`
- Package ID: `0xb430d36e5a41efb283d4c700903bafcf1877ee0647e5b76484bf019272ccaa05`
- Tx Digest: `3PhcC5kk3bSJtZSFAUrQveYtAT9cGHcZ2ogQ3DGjqddf`

## Progress Checklist

- [x] Move smart contract — `create_profile` and `update_profile` entry functions
- [x] OneChain testnet deployment scripts (`build.sh`, `deploy.sh`, `test.sh`)
- [x] React + TypeScript frontend with `@mysten/dapp-kit` wallet integration
- [x] Create Profile UI — form to mint on-chain identity
- [x] My Profile UI — fetch and display owned profile objects
- [x] Network config pointing to OneChain testnet RPC
- [x] Live contract deployed on OneChain testnet — Package ID: `0xb430d36e5a41efb283d4c700903bafcf1877ee0647e5b76484bf019272ccaa05`
