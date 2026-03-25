import { useState } from 'react'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import CreateProfile from './components/CreateProfile'
import MyProfile from './components/MyProfile'
import ExploreProfiles from './components/ExploreProfiles'
import SearchByUsername from './components/SearchByUsername'
import './App.css'

type Tab = 'my-profile' | 'create' | 'explore' | 'search'

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
        <>
          {/* Hero */}
          <section className="hero">
            <div className="hero-badge">Built on OneChain</div>
            <h1>Your Identity,<br />On-Chain Forever</h1>
            <p className="hero-sub">
              Create a permanent, verifiable on-chain profile. No centralized platform,
              no middleman — just your wallet and the blockchain.
            </p>
            <div className="hero-features">
              <div className="feature"><span className="feature-icon">🔒</span><span>Immutable</span></div>
              <div className="feature"><span className="feature-icon">✅</span><span>Verifiable</span></div>
              <div className="feature"><span className="feature-icon">🌐</span><span>Portable</span></div>
              <div className="feature"><span className="feature-icon">👤</span><span>Self-Sovereign</span></div>
              <div className="feature"><span className="feature-icon">⚡</span><span>Instant</span></div>
              <div className="feature"><span className="feature-icon">🆓</span><span>Permissionless</span></div>
            </div>
            <div className="hero-cta-group">
              <p className="hero-cta-secondary">Connect your wallet above to get started →</p>
            </div>
          </section>

          {/* Stats */}
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-value">∞</div>
              <div className="stat-label">Profiles Possible</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Middlemen</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">100%</div>
              <div className="stat-label">Self-Owned</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">&lt;1s</div>
              <div className="stat-label">Finality</div>
            </div>
          </div>

          {/* How it works */}
          <section className="how-section">
            <div className="section-title">How It Works</div>
            <p className="section-sub">Three steps to own your on-chain identity</p>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-num">Step 01</div>
                <div className="step-icon">🔗</div>
                <h3>Connect Wallet</h3>
                <p>Use any OneChain-compatible wallet. Your address is your login — no passwords, no email.</p>
              </div>
              <div className="step-card">
                <div className="step-num">Step 02</div>
                <div className="step-icon">✏️</div>
                <h3>Mint Your Profile</h3>
                <p>Choose a unique handle, add your display name, bio, avatar, and links. One transaction mints it forever.</p>
              </div>
              <div className="step-card">
                <div className="step-num">Step 03</div>
                <div className="step-icon">🌍</div>
                <h3>Share & Discover</h3>
                <p>Your profile lives in your wallet as an owned object. Anyone can look it up by address or username.</p>
              </div>
              <div className="step-card">
                <div className="step-num">Step 04</div>
                <div className="step-icon">🔄</div>
                <h3>Update Anytime</h3>
                <p>Bio, avatar, website — update them whenever you want. Your handle stays permanent, everything else is flexible.</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="dashboard">
          <div className="dashboard-inner">
            <nav className="tabs">
              {(['my-profile', 'create', 'explore', 'search'] as Tab[]).map((t) => (
                <button
                  key={t}
                  className={tab === t ? 'active' : ''}
                  onClick={() => setTab(t)}
                >
                  {t === 'my-profile' && '👤 My Profile'}
                  {t === 'create' && '✏️ Create / Update'}
                  {t === 'explore' && '🔍 Explore by Address'}
                  {t === 'search' && '🏷️ Search by Username'}
                </button>
              ))}
            </nav>
            <main>
              {tab === 'my-profile' && <MyProfile />}
              {tab === 'create' && <CreateProfile onSuccess={() => setTab('my-profile')} />}
              {tab === 'explore' && <ExploreProfiles />}
              {tab === 'search' && <SearchByUsername />}
            </main>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>ChainProfile · OneChain Testnet</span>
        <a href="https://onescan.cc/testnet" target="_blank" rel="noreferrer">
          Explorer ↗
        </a>
      </footer>
    </div>
  )
}
