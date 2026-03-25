import { useState } from 'react'
import { useSuiClient } from '@mysten/dapp-kit'
import { PACKAGE_ID, EXPLORER_URL } from '../config/network'

interface ProfileFields {
  handle: string
  display_name: string
  bio: string
  avatar_url: string
  website: string
  owner: string
}

export default function ExploreProfiles() {
  const client = useSuiClient()
  const [address, setAddress] = useState('')
  const [profile, setProfile] = useState<ProfileFields | null>(null)
  const [objectId, setObjectId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const lookup = async () => {
    if (!address.trim()) return
    setLoading(true)
    setError('')
    setProfile(null)

    try {
      const res = await client.getOwnedObjects({
        owner: address.trim(),
        filter: { StructType: `${PACKAGE_ID}::profile::Profile` },
        options: { showContent: true },
      })

      const obj = res.data?.[0]
      if (!obj) { setError('No profile found for this address.'); return }

      const content = obj.data?.content
      if (content?.dataType !== 'moveObject') { setError('Invalid profile object.'); return }

      setProfile(content.fields as unknown as ProfileFields)
      setObjectId(obj.data?.objectId ?? '')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lookup failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Explore Profiles</h2>
        <p className="card-desc">Look up any on-chain profile by wallet address.</p>
      </div>

      <div className="search-row">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x wallet address..."
          onKeyDown={(e) => e.key === 'Enter' && lookup()}
        />
        <button className="btn-primary" onClick={lookup} disabled={loading}>
          {loading ? 'Looking up...' : 'Look Up'}
        </button>
      </div>

      {error && <p className="error">⚠ {error}</p>}

      {profile && (
        <div className="profile-card" style={{ marginTop: '1.5rem' }}>
          <div className="profile-header">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="avatar" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }} />
            ) : (
              <div className="avatar-placeholder">
                {(profile.display_name || profile.handle)[0]?.toUpperCase()}
              </div>
            )}
            <div className="profile-identity">
              <h2>{profile.display_name || profile.handle}</h2>
              <span className="handle">@{profile.handle}</span>
            </div>
          </div>

          {profile.bio && <p className="bio">{profile.bio}</p>}

          {profile.website && (
            <div className="profile-links">
              <a href={profile.website} target="_blank" rel="noreferrer" className="link-pill">
                🌐 {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          <div className="profile-meta">
            <div className="meta-item">
              <span className="meta-label">Object ID</span>
              <a
                href={`${EXPLORER_URL}/object/${objectId}`}
                target="_blank"
                rel="noreferrer"
                className="meta-value mono link"
              >
                {objectId.slice(0, 10)}...{objectId.slice(-8)} ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
