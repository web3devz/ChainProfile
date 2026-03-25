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

  if (isPending) return <p className="status">Loading your profile...</p>
  if (error) return <p className="error">Error: {error.message}</p>

  const profiles = data?.data ?? []

  if (profiles.length === 0) {
    return (
      <div className="card">
        <p>No on-chain profile found for this wallet.</p>
        <p>Head to <strong>Create / Update</strong> to mint your identity.</p>
      </div>
    )
  }

  return (
    <div>
      {profiles.map((obj) => {
        const content = obj.data?.content
        if (content?.dataType !== 'moveObject') return null
        const fields = content.fields as unknown as ProfileFields
        const objId = obj.data?.objectId ?? ''

        return (
          <div key={objId} className="card profile-card">
            {fields.avatar_url && (
              <img src={fields.avatar_url} alt="avatar" className="avatar" />
            )}
            <h2>{fields.display_name || fields.handle}</h2>
            <p className="handle">@{fields.handle}</p>
            {fields.bio && <p className="bio">{fields.bio}</p>}
            {fields.website && (
              <a href={fields.website} target="_blank" rel="noreferrer" className="website">
                {fields.website}
              </a>
            )}
            <div className="meta">
              <a href={`${EXPLORER_URL}/object/${objId}`} target="_blank" rel="noreferrer">
                View Object on Explorer ↗
              </a>
            </div>
          </div>
        )
      })}
      <button onClick={() => refetch()} className="refresh-btn">Refresh</button>
    </div>
  )
}
