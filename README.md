# ChainProfile 👤

**Decentralized Identity Layer on OneChain — Own Your On-Chain Presence**

ChainProfile enables users to create and manage self-sovereign digital identities directly on the blockchain. No centralized control, no censorship, and no data exploitation — your identity is fully owned by your wallet.

## 🌐 Overview

Digital identity today is fragmented, platform-dependent, and controlled by centralized entities. Users lack ownership, portability, and trustless verification across platforms.

ChainProfile solves this by introducing a **fully on-chain identity system** built on OneChain. Each profile is a Move object stored on-chain, making it:

* **Permanent** → cannot be deleted by any third party
* **Verifiable** → accessible and readable by any dApp
* **Portable** → usable across the entire ecosystem
* **User-Owned** → controlled entirely by your wallet

This creates a foundational identity layer for Web3 applications.

## ❗ The Problem

* Identity is scattered across multiple platforms
* Users don’t truly own their profiles
* Platforms can censor, delete, or monetize user data
* No unified identity layer for Web3
* Difficult to verify authenticity across applications

## 💡 The Solution

ChainProfile stores identity metadata (handle, display name, bio, avatar, website) as an **owned on-chain object**.

Once created, your profile becomes a **permanent digital identity primitive** that any application can integrate with — without relying on centralized APIs.

## ✨ Key Features

* **On-Chain Identity Creation**
  Mint a permanent profile directly tied to your wallet address

* **Editable Metadata**
  Update display name, bio, avatar, and website anytime

* **Ownership by Design**
  Profiles are Move objects — fully owned and transferable

* **Event-Based Indexing**
  Emits events on create/update for efficient off-chain indexing

* **Composable Identity Layer**
  Can be integrated into any dApp for authentication and reputation

* **Seamless Frontend Experience**
  Built with React + TypeScript and OneChain wallet integration

## ⚙️ How It Works

1. User connects wallet via frontend
2. User submits profile details (handle, bio, etc.)
3. Smart contract mints a profile object on-chain
4. Profile is stored under user ownership
5. Updates are performed via authenticated transactions
6. Events are emitted for indexing and UI updates

## 📦 Deployed Contract

* **Network:** OneChain Testnet
* **Package ID:**
  `0xb430d36e5a41efb283d4c700903bafcf1877ee0647e5b76484bf019272ccaa05`
* **Module:** `chain_profile::profile`
* **Transaction Digest:**
  `3PhcC5kk3bSJtZSFAUrQveYtAT9cGHcZ2ogQ3DGjqddf`
* **RPC Endpoint:**
  [https://rpc-testnet.onelabs.cc:443](https://rpc-testnet.onelabs.cc:443)
* **Explorer:**
  [https://onescan.cc/testnet/packageDetail?packageId=0xb430d36e5a41efb283d4c700903bafcf1877ee0647e5b76484bf019272ccaa05](https://onescan.cc/testnet/packageDetail?packageId=0xb430d36e5a41efb283d4c700903bafcf1877ee0647e5b76484bf019272ccaa05)

## 🛠 Tech Stack

**Smart Contract**

* Move (OneChain)

**Frontend**

* React 18
* TypeScript
* Vite

**Wallet Integration**

* @mysten/dapp-kit

**Data Layer**

* @tanstack/react-query

**Network**

* OneChain Testnet

## 🔍 Use Cases

* **Decentralized Social Profiles**
  Replace centralized usernames and accounts

* **Web3 Authentication Layer**
  Use profiles instead of email/password systems

* **Reputation Systems**
  Attach credibility, achievements, and activity to identity

* **DAO Membership Identity**
  Represent roles and participation on-chain

* **Cross-dApp Identity**
  One identity usable across multiple applications

## 🚀 Why ChainProfile Stands Out

* **Self-Sovereign Identity** — no platform dependency
* **Fully On-Chain** — no backend required
* **Composable & Extensible** — plug into any Web3 app
* **Censorship Resistant** — no central authority
* **Developer-Friendly** — simple integration via Move + events
* **Hackathon-Ready Impact** — foundational Web3 primitive

## 🔮 Future Improvements

* Profile verification badges
* Social graph integration (followers, connections)
* Cross-chain identity support
* ENS-like human-readable naming system
* Privacy layers for selective data visibility
* Rich metadata extensions (skills, NFTs, credentials)

## 📄 License

MIT License
