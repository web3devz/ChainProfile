import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { PACKAGE_ID, EXPLORER_URL } from '../config/network'

interface ProfileFields {
  handle: string
  display_name: string
  bio: string
  avatar_url: string
  website: string
  owner: string
}

export default function MyProfile() {
  const account = useCurrentAccount()

  const { data, isPending, error, refetch } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address ?? '',
    filter: { StructType: `${PACKAGE_ID}::profile::Profile` },
    options: { showContent: true },
  })

  if (isPending) return <div className="status-box">Loading your profile...</div>
  if (error) return <div className="status-box error">Error: {error.message}</div>

  const profiles = data?.data ?? []

  if (profiles.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👤</div>
        <h3>No profile found</h3>
        <p>You don't have an on-chain profile yet. Head to <strong>Create / Update</strong> to mint your identity.</p>
      </div>
    )
  }

  return (
    <div>
      {profiles.map((obj) => {
        const content = obj.data?.content
        if (content?.dataType !== 'moveObject') return null
        const f = content.fields as unknown as ProfileFields
        const objId = obj.data?.objectId ?? ''

        return (
          <div key={objId} className="profile-card">
            <div className="profile-header">
              {f.avatar_url ? (
                <img src={f.avatar_url} alt="avatar" className="avatar" onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }} />
              ) : (
                <div className="avatar-placeholder">{(f.display_name || f.handle)[0]?.toUpperCase()}</div>
              )}
              <div className="profile-identity">
                <h2>{f.display_name || f.handle}</h2>
                <span className="handle">@{f.handle}</span>
              </div>
            </div>

            {f.bio && <p className="bio">{f.bio}</p>}

            <div className="profile-links">
              {f.website && (
                <a href={f.website} target="_blank" rel="noreferrer" className="link-pill">
                  🌐 {f.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>

            <div className="profile-meta">
              <div className="meta-item">
                <span className="meta-label">Owner</span>
                <span className="meta-value mono">{f.owner.slice(0, 8)}...{f.owner.slice(-6)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Object ID</span>
                <a
                  href={`${EXPLORER_URL}/object/${objId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="meta-value mono link"
                >
                  {objId.slice(0, 8)}...{objId.slice(-6)} ↗
                </a>
              </div>
            </div>
          </div>
        )
      })}

      <button onClick={() => refetch()} className="btn-ghost">↻ Refresh</button>
    </div>
  )
}
