import { useState } from 'react'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import CreateProfile from './components/CreateProfile'
import MyProfile from './components/MyProfile'
import ExploreProfiles from './components/ExploreProfiles'
import './App.css'

type Tab = 'my-profile' | 'create' | 'explore'

export default function App() {
  const account = useCurrentAccount()
  const [tab, setTab] = useState<Tab>('my-profile')

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="logo">⛓</span>
          <div>
            <div className="brand-name">ChainProfile</div>
            <div className="brand-sub">Decentralized Identity on OneChain</div>
          </div>
        </div>
        <ConnectButton />
      </header>

      {!account ? (
        <div className="hero">
          <div className="hero-badge">Built on OneChain</div>
          <h1>Own Your Digital Identity</h1>
          <p>
            Create a permanent, verifiable on-chain profile. No centralized platform.
            No middleman. Just your wallet and the blockchain.
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Immutable</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✅</span>
              <span>Verifiable</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌐</span>
              <span>Portable</span>
            </div>
            <div className="feature">
              <span className="feature-icon">👤</span>
              <span>Self-Sovereign</span>
            </div>
          </div>
          <p className="hero-cta">Connect your wallet to get started →</p>
        </div>
      ) : (
        <>
          <nav className="tabs">
            {(['my-profile', 'create', 'explore'] as Tab[]).map((t) => (
              <button
                key={t}
                className={tab === t ? 'active' : ''}
                onClick={() => setTab(t)}
              >
                {t === 'my-profile' && '👤 My Profile'}
                {t === 'create' && '✏️ Create / Update'}
                {t === 'explore' && '🔍 Explore'}
              </button>
            ))}
          </nav>
          <main className="content">
            {tab === 'my-profile' && <MyProfile />}
            {tab === 'create' && <CreateProfile onSuccess={() => setTab('my-profile')} />}
            {tab === 'explore' && <ExploreProfiles />}
          </main>
        </>
      )}

      <footer className="footer">
        <span>ChainProfile · OneChain Testnet</span>
        <a
          href="https://explorer.onelabs.cc"
          target="_blank"
          rel="noreferrer"
        >
          Explorer ↗
        </a>
      </footer>
    </div>
  )
}
