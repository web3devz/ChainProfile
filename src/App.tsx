import { useState } from 'react'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import CreateProfile from './components/CreateProfile'
import MyProfile from './components/MyProfile'
import './App.css'

export default function App() {
  const account = useCurrentAccount()
  const [tab, setTab] = useState<'profile' | 'create'>('profile')

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">⛓ ChainProfile</span>
          <span className="tagline">Decentralized Identity on OneChain</span>
        </div>
        <ConnectButton />
      </header>

      {account ? (
        <>
          <nav className="tabs">
            <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>
              My Profile
            </button>
            <button className={tab === 'create' ? 'active' : ''} onClick={() => setTab('create')}>
              Create / Update
            </button>
          </nav>
          <main className="content">
            {tab === 'profile' ? <MyProfile /> : <CreateProfile />}
          </main>
        </>
      ) : (
        <div className="hero">
          <h1>Own Your Identity On-Chain</h1>
          <p>Create a permanent, verifiable profile stored directly on OneChain. No centralized platform. No middleman.</p>
          <p className="hint">Connect your wallet to get started.</p>
        </div>
      )}
    </div>
  )
}
