import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, objectUrl, txUrl } from '../config/network'

interface ProfileFields {
  handle: string
  display_name: string
  bio: string
  avatar_url: string
  website: string
  owner: string
}

interface Props {
  onSuccess?: () => void
}

const enc = (s: string) => Array.from(new TextEncoder().encode(s))

export default function CreateProfile({ onSuccess }: Props) {
  const account = useCurrentAccount()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()

  // Check if user already has a profile
  const { data: existingData } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address ?? '',
    filter: { StructType: `${PACKAGE_ID}::profile::Profile` },
    options: { showContent: true },
  })

  const existing = existingData?.data?.[0]
  const existingFields = existing?.data?.content?.dataType === 'moveObject'
    ? (existing.data.content.fields as unknown as ProfileFields)
    : null
  const existingObjectId = existing?.data?.objectId

  const [form, setForm] = useState({
    handle: existingFields?.handle ?? '',
    display_name: existingFields?.display_name ?? '',
    bio: existingFields?.bio ?? '',
    avatar_url: existingFields?.avatar_url ?? '',
    website: existingFields?.website ?? '',
  })
  const [txDigest, setTxDigest] = useState('')
  const [error, setError] = useState('')

  const isUpdate = !!existingObjectId

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setTxDigest('')
    if (!account) return
    if (form.handle.length < 3) { setError('Handle must be at least 3 characters.'); return }

    const tx = new Transaction()

    if (isUpdate && existingObjectId) {
      tx.moveCall({
        target: `${PACKAGE_ID}::profile::update_profile`,
        arguments: [
          tx.object(existingObjectId),
          tx.pure.vector('u8', enc(form.display_name)),
          tx.pure.vector('u8', enc(form.bio)),
          tx.pure.vector('u8', enc(form.avatar_url)),
          tx.pure.vector('u8', enc(form.website)),
        ],
      })
    } else {
      tx.moveCall({
        target: `${PACKAGE_ID}::profile::create_profile`,
        arguments: [
          tx.pure.vector('u8', enc(form.handle)),
          tx.pure.vector('u8', enc(form.display_name)),
          tx.pure.vector('u8', enc(form.bio)),
          tx.pure.vector('u8', enc(form.avatar_url)),
          tx.pure.vector('u8', enc(form.website)),
        ],
      })
    }

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          setTxDigest(result.digest)
          onSuccess?.()
        },
        onError: (err) => setError(err.message),
      }
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{isUpdate ? 'Update Profile' : 'Create On-Chain Profile'}</h2>
        <p className="card-desc">
          {isUpdate
            ? 'Update your on-chain identity. Handle cannot be changed.'
            : 'Mint your permanent identity on OneChain. This creates an owned object in your wallet.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <label>
            Handle *
            <input
              name="handle"
              value={form.handle}
              onChange={handleChange}
              placeholder="e.g. web3devz"
              required
              minLength={3}
              disabled={isUpdate}
            />
            {isUpdate && <span className="field-note">Handle is permanent and cannot be changed.</span>}
          </label>
          <label>
            Display Name
            <input
              name="display_name"
              value={form.display_name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </label>
        </div>

        <label>
          Bio
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell the world about yourself..."
            rows={3}
          />
        </label>

        <div className="form-row">
          <label>
            Avatar URL
            <input
              name="avatar_url"
              value={form.avatar_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>
          <label>
            Website
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>
        </div>

        {error && <p className="error">⚠ {error}</p>}

        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending
            ? (isUpdate ? 'Updating...' : 'Minting Profile...')
            : (isUpdate ? 'Update Profile' : 'Create Profile')}
        </button>
      </form>

      {txDigest && (
        <div className="tx-success">
          <span>✅ {isUpdate ? 'Profile updated' : 'Profile created'} on-chain</span>
          <a href={txUrl(txDigest)} target="_blank" rel="noreferrer">
            View transaction ↗
          </a>
        </div>
      )}
    </div>
  )
}
