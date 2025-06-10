/**
 * Type representing the formdata for moving to a region.
 */
export type MoveRegionFormData = {
	region_name: string;
	password?: string;
	move_region: "1";
};

/**
 * Type representing the formdata for applying to the World Assembly.
 */
export type ApplyToWorldAssemblyFormData =
	| {
			action: "join_UN";
			submit: "1";
	  }
	| {
			action: "join_UN";
			resend: "1";
	  };

export type ValidRegionTag =
	| "anarchist"
	| "anime"
	| "anti-capitalist"
	| "anti-communist"
	| "anti-fascist"
	| "anti-general_assembly"
	| "anti-security_council"
	| "anti-world_assembly"
	| "capitalist"
	| "casual"
	| "colony"
	| "communist"
	| "conservative"
	| "cyberpunk"
	| "defender"
	| "democratic"
	| "eco-friendly"
	| "egalitarian"
	| "embassy_collector"
	| "f7er"
	| "ft_ftl"
	| "ft_ftli"
	| "ft_stl"
	| "fandom"
	| "fantasy_tech"
	| "fascist"
	| "feminist"
	| "free_trade"
	| "future_tech"
	| "game_player"
	| "general_assembly"
	| "generalite"
	| "human-only"
	| "imperialist"
	| "independent"
	| "industrial"
	| "international_federalist"
	| "invader"
	| "isolationist"
	| "issues_player"
	| "jump_point"
	| "lgbt"
	| "liberal"
	| "libertarian"
	| "magical"
	| "map"
	| "mercenary"
	| "modern_tech"
	| "monarchist"
	| "multi-species"
	| "multilingual"
	| "national_sovereigntist"
	| "neutral"
	| "non-english"
	| "offsite_chat"
	| "offsite_forums"
	| "outer_space"
	| "p2tm"
	| "pacifist"
	| "parody"
	| "past_tech"
	| "patriarchal"
	| "post_apocalyptic"
	| "post-modern_tech"
	| "puppet_storage"
	| "regional_government"
	| "religious"
	| "role_player"
	| "security_council"
	| "serious"
	| "silly"
	| "snarky"
	| "social"
	| "socialist"
	| "sports"
	| "steampunk"
	| "surreal"
	| "theocratic"
	| "totalitarian"
	| "trading_cards"
	| "video_game"
	| "world_assembly";
