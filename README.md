# ChainProfile

> Decentralized identity layer built on OneChain — own your on-chain presence.

ChainProfile lets users create and manage self-sovereign digital identities stored directly on the OneChain blockchain. No centralized platform, no third-party control. Your profile is a permanent, verifiable on-chain object owned by your wallet.

---

## The Problem

Traditional digital identities are fragmented across dozens of platforms — each controlled by a corporation that can delete, censor, or monetize your data. There's no portability, no true ownership, and no verifiability across Web3 applications.

## The Solution

ChainProfile stores identity metadata (handle, display name, bio, avatar, website) as an owned object on OneChain. Once minted, your profile is:

- **Permanent** — stored on-chain, not on a server
- **Verifiable** — publicly readable by any dApp
- **Portable** — usable across the entire OneChain ecosystem
- **Owned** — lives in your wallet, not a database

---

## Live Deployment

| | |
|---|---|
| Network | OneChain Testnet |
| Package ID | `0xb430d36e5a41efb283d4c700903bafcf1877ee0647e5b76484bf019272ccaa05` |
| Module | `chain_profile::profile` |
| Tx Digest | `3PhcC5kk3bSJtZSFAUrQveYtAT9cGHcZ2ogQ3DGjqddf` |
| RPC | `https://rpc-testnet.onelabs.cc:443` |
| Explorer | [View on OneChain Explorer](https://onescan.cc/testnet/packageDetail?packageId=0xb430d36e5a41efb283d4c700903bafcf1877ee0647e5b76484bf019272ccaa05) |

---

## Features

- Create a permanent on-chain profile linked to your wallet address
- Update profile metadata anytime — display name, bio, avatar URL, website
- Profiles are owned Move objects — transferable like any asset
- Event emission on create and update for off-chain indexing
- React + TypeScript frontend with OneChain wallet integration via `@mysten/dapp-kit`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Move (OneChain) |
| Frontend | React 18 + TypeScript |
| Wallet | `@mysten/dapp-kit` |
| Data Fetching | `@tanstack/react-query` |
| Build Tool | Vite |
| Network | OneChain Testnet |

---

## Project Structure

```
ChainProfile/
├── contracts/
│   ├── Move.toml               # Package config with OneChain dependencies
│   └── sources/
│       └── profile.move        # Core identity contract
├── src/
│   ├── components/
│   │   ├── CreateProfile.tsx   # Mint a new on-chain profile
│   │   └── MyProfile.tsx       # View owned profile objects
│   ├── config/
│   │   └── network.ts          # RPC + package ID config
│   ├── App.tsx
│   └── main.tsx
├── scripts/
│   ├── build.sh                # Build Move package
│   ├── deploy.sh               # Deploy to OneChain testnet
│   └── test.sh                 # Run Move tests
├── .env.example
└── package.json
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- [OneChain Wallet](https://chromewebstore.google.com) browser extension
- OneChain CLI (`one`) — see install steps below

### Install OneChain CLI

```bash
# Download pre-built binary (macOS arm64)
curl -L https://github.com/one-chain-labs/onechain/releases/download/v1.1.1/one-mainnet-v1.1.1-macos-arm64.tgz -o one.tgz
tar -xzf one.tgz && mv one ~/.cargo/bin/one

# Configure testnet
one client new-env --alias testnet --rpc https://rpc-testnet.onelabs.cc:443
one client switch --env testnet
```

### Run the Frontend

```bash
npm install
cp .env.example .env
npm run dev
# Open http://localhost:3000
```

### Deploy Your Own Contract

```bash
./scripts/build.sh
./scripts/deploy.sh
# Copy the Package ID into .env as VITE_PACKAGE_ID
```

---

## Smart Contract

The `profile` module exposes two entry functions:

```move
// Create a new on-chain profile
public entry fun create_profile(
    handle: vector<u8>,
    display_name: vector<u8>,
    bio: vector<u8>,
    avatar_url: vector<u8>,
    website: vector<u8>,
    ctx: &mut TxContext,
)

// Update an existing profile (owner only)
public entry fun update_profile(
    profile: &mut Profile,
    display_name: vector<u8>,
    bio: vector<u8>,
    avatar_url: vector<u8>,
    website: vector<u8>,
    ctx: &mut TxContext,
)
```

---

## Progress Checklist

- [x] Move smart contract with `create_profile` and `update_profile`
- [x] Ownership validation — only profile owner can update
- [x] Event emission on create and update for indexing
- [x] OneChain testnet deployment scripts
- [x] React + TypeScript frontend with wallet integration
- [x] Create Profile UI and My Profile viewer
- [x] Live contract deployed on OneChain testnet

---

## License

MIT
