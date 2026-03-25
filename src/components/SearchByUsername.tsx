import { useState } from 'react'
import { useSuiClient } from '@mysten/dapp-kit'
import type { EventId } from '@mysten/sui/client'
import { PACKAGE_ID, objectUrl } from '../config/network'

interface ProfileFields {
  handle: string
  display_name: string
  bio: string
  avatar_url: string
  website: string
  owner: string
}

interface ProfileResult {
  fields: ProfileFields
  objectId: string
}

export default function SearchByUsername() {
  const client = useSuiClient()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProfileResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const search = async () => {
    const q = query.trim().toLowerCase().replace(/^@/, '')
    if (!q) return
    setLoading(true)
    setError('')
    setResults([])
    setSearched(false)

    try {
      // Query all Profile objects by struct type, paginate up to 5 pages
      const found: ProfileResult[] = []
      let cursor: EventId | null | undefined = undefined

      for (let page = 0; page < 5; page++) {
        const res = await client.queryEvents({
          query: { MoveEventType: `${PACKAGE_ID}::profile::ProfileCreated` },
          cursor: cursor ?? undefined,
          limit: 50,
        })

        for (const ev of res.data) {
          const parsed = ev.parsedJson as { handle?: string; owner?: string } | undefined
          if (!parsed?.handle || !parsed?.owner) continue
          if (!parsed.handle.toLowerCase().includes(q)) continue

          // Fetch the actual profile object for this owner
          const owned = await client.getOwnedObjects({
            owner: parsed.owner,
            filter: { StructType: `${PACKAGE_ID}::profile::Profile` },
            options: { showContent: true },
          })
          const obj = owned.data?.[0]
          if (!obj?.data) continue
          const content = obj.data.content
          if (content?.dataType !== 'moveObject') continue
          const fields = content.fields as unknown as ProfileFields
          if (fields.handle.toLowerCase().includes(q)) {
            found.push({ fields, objectId: obj.data.objectId ?? '' })
          }
        }

        if (!res.hasNextPage) break
        cursor = res.nextCursor ?? undefined
      }

      setResults(found)
    } catch (e: unknown) {
      // Fallback: events may not be indexed — show helpful message
      setError(
        e instanceof Error
          ? e.message
          : 'Search failed. The node may not support event queries.'
      )
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Search by Username</h2>
        <p className="card-desc">Find profiles by their on-chain handle.</p>
      </div>

      <div className="search-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="@handle or partial name..."
          onKeyDown={(e) => e.key === 'Enter' && search()}
        />
        <button className="btn-primary" onClick={search} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="error">⚠ {error}</p>}

      {searched && !loading && results.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No profiles found</h3>
          <p>No on-chain profiles match "{query}". Try a different handle.</p>
        </div>
      )}

      {results.map(({ fields: f, objectId }) => (
        <div key={objectId} className="profile-card" style={{ marginTop: '1rem' }}>
          <div className="profile-header">
            {f.avatar_url ? (
              <img
                src={f.avatar_url}
                alt="avatar"
                className="avatar"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <div className="avatar-placeholder">
                {(f.display_name || f.handle)[0]?.toUpperCase()}
              </div>
            )}
            <div className="profile-identity">
              <h2>{f.display_name || f.handle}</h2>
              <span className="handle">@{f.handle}</span>
            </div>
          </div>

          {f.bio && <p className="bio">{f.bio}</p>}

          {f.website && (
            <div className="profile-links">
              <a href={f.website} target="_blank" rel="noreferrer" className="link-pill">
                🌐 {f.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          <div className="profile-meta">
            <div className="meta-item">
              <span className="meta-label">Owner</span>
              <span className="meta-value mono">{f.owner.slice(0, 8)}...{f.owner.slice(-6)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Object ID</span>
              <a
                href={objectUrl(objectId)}
                target="_blank"
                rel="noreferrer"
                className="meta-value mono link"
              >
                {objectId.slice(0, 10)}...{objectId.slice(-8)} ↗
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
