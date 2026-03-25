module chain_profile::profile {
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use one::object::{Self, UID};
    use one::tx_context::{Self, TxContext};
    use one::transfer;
    use one::event;

    /// On-chain profile owned by a wallet address
    public struct Profile has key, store {
        id: UID,
        owner: address,
        handle: String,
        display_name: String,
        bio: String,
        avatar_url: String,
        website: String,
    }

    /// Emitted on create and update
    public struct ProfileCreated has copy, drop {
        owner: address,
        handle: String,
    }

    public struct ProfileUpdated has copy, drop {
        owner: address,
        display_name: String,
    }

    const E_NOT_OWNER: u64 = 0;
    const E_HANDLE_TOO_SHORT: u64 = 1;

    /// Create a new on-chain profile
    public entry fun create_profile(
        handle: vector<u8>,
        display_name: vector<u8>,
        bio: vector<u8>,
        avatar_url: vector<u8>,
        website: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let handle_str = string::utf8(handle);
        assert!(string::length(&handle_str) >= 3, E_HANDLE_TOO_SHORT);

        let sender = tx_context::sender(ctx);
        let profile = Profile {
            id: object::new(ctx),
            owner: sender,
            handle: handle_str,
            display_name: string::utf8(display_name),
            bio: string::utf8(bio),
            avatar_url: string::utf8(avatar_url),
            website: string::utf8(website),
        };

        event::emit(ProfileCreated { owner: sender, handle: profile.handle });
        transfer::transfer(profile, sender);
    }

    /// Update mutable fields of an existing profile
    public entry fun update_profile(
        profile: &mut Profile,
        display_name: vector<u8>,
        bio: vector<u8>,
        avatar_url: vector<u8>,
        website: vector<u8>,
        ctx: &mut TxContext,
    ) {
        assert!(profile.owner == tx_context::sender(ctx), E_NOT_OWNER);
        profile.display_name = string::utf8(display_name);
        profile.bio = string::utf8(bio);
        profile.avatar_url = string::utf8(avatar_url);
        profile.website = string::utf8(website);

        event::emit(ProfileUpdated {
            owner: profile.owner,
            display_name: profile.display_name,
        });
    }

    // --- Getters ---
    public fun owner(p: &Profile): address { p.owner }
    public fun handle(p: &Profile): &String { &p.handle }
    public fun display_name(p: &Profile): &String { &p.display_name }
    public fun bio(p: &Profile): &String { &p.bio }
    public fun avatar_url(p: &Profile): &String { &p.avatar_url }
    public fun website(p: &Profile): &String { &p.website }
}
