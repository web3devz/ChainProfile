module chain_profile::profile {
    use std::option::{Self, Option};
    use std::string::{Self, String};
    use std::vector;

    use sui::event;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    /// Stored profile data for a wallet address.
    public struct Profile has key, store {
        id: UID,
        owner: address,
        handle: String,
        display_name: String,
        bio: String,
        avatar_url: Option<String>,
        metadata: vector<u8>,
        last_updated_epoch: u64,
    }

    /// Event fired whenever a profile is created or updated.
    public struct ProfileEvent has copy, drop {
        owner: address,
        handle: String,
        timestamp_epoch: u64,
    }

    const E_NOT_OWNER: u64 = 0;
    const E_INVALID_HANDLE: u64 = 1;

    /// Creates a fresh on-chain profile for the sender.
    /// For now uniqueness enforcement happens off-chain. TODO: connect to UsernameRegistry once ready.
    public entry fun create_profile(
        handle: vector<u8>,
        display_name: vector<u8>,
        bio: vector<u8>,
        avatar_url: Option<vector<u8>>,
        metadata: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        let handle_str = validate_handle(handle);

        let profile = Profile {
            id: object::new(ctx),
            owner: sender,
            handle: handle_str,
            display_name: string::utf8(display_name),
            bio: string::utf8(bio),
            avatar_url: option_map_to_string(avatar_url),
            metadata,
            last_updated_epoch: tx_context::epoch(ctx),
        };

        emit_event(&profile);
        transfer::transfer(profile, sender);
    }

    /// Updates mutable metadata for an existing profile.
    public entry fun update_profile(
        profile: Profile,
        display_name: vector<u8>,
        bio: vector<u8>,
        avatar_url: Option<vector<u8>>,
        metadata: vector<u8>,
        ctx: &mut TxContext,
    ) {
        assert!(profile.owner == tx_context::sender(ctx), E_NOT_OWNER);

        let mut updated = profile;
        updated.display_name = string::utf8(display_name);
        updated.bio = string::utf8(bio);
        updated.avatar_url = option_map_to_string(avatar_url);
        updated.metadata = metadata;
        updated.last_updated_epoch = tx_context::epoch(ctx);

        emit_event(&updated);
        transfer::transfer(updated, updated.owner);
    }

    fun validate_handle(raw: vector<u8>): String {
        assert!(vector::length(&raw) > 2, E_INVALID_HANDLE);
        string::utf8(raw)
    }

    fun option_map_to_string(opt: Option<vector<u8>>): Option<String> {
        match opt {
            option::Some(bytes) => option::some(string::utf8(bytes)),
            option::None => option::none(),
        }
    }

    fun emit_event(profile: &Profile) {
        event::emit(ProfileEvent {
            owner: profile.owner,
            handle: string::clone(&profile.handle),
            timestamp_epoch: profile.last_updated_epoch,
        });
    }
}
