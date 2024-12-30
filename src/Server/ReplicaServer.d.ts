import { MaidReplica, Path } from "../utils";

type Connection = {
	Disconnect: (self: Connection) => void;
};

export type ReplicaToken = {
	TokenString: string;
};

type ReplicaServer = {
	/**
	 * A custom static Replica identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the Replica's lifespan.
	 */
	Tags: Record<any, any>;

	/**
	 * Table representing the state wrapped by the Replica. Note that after wrapping a table with a Replica you may no longer write directly to that table (doing so would potentially desynchronize state among clients and in some cases even break code) - all changes must be applied through mutators.
	 */
	Data: Record<any, any>;

	/**
	 * An identifier that is unique for every Replica within a Roblox game session.
	 */
	Id: number;

	/**
	 * Table representing the state wrapped by the Replica. Note that after wrapping a table with a Replica you may no longer write directly to that table (doing so would potentially desynchronize state among clients and in some cases even break code) - all changes must be applied through mutators.
	 */
	Token: string;

	/**
	 * Reference to the parent Replica. All nested replicas will have a parent. All top level replicas will have their Parent property set to nil. nested replicas will never become top level replicas and vice versa.
	 */
	Parent?: ReplicaServer;

	/**
	 * Table representing the state wrapped by the Replica. Note that after wrapping a table with a Replica you may no longer write directly to that table (doing so would potentially desynchronize state among clients and in some cases even break code) - all changes must be applied through mutators.
	 */
	Children: Map<ReplicaServer, boolean | undefined>;

	/**
	 * An array of replicas parented to this Replica.
	 */
	BoundInstance?: Instance;

	/**
	 * Simulates the behaviour of RemoteEvent.OnClientEvent.
	 */
	OnServerEvent: {
		Connect: (listener: (...args: any[]) => void) => {
			Disconnect: () => void;
		};
	};

	/**
	 * A custom Maid Object.
	 */
	Maid: typeof MaidReplica;

	/**
	 * A reference of players that have received initial data - having received initial data means having access to all replicas that are selectively replicated to that player.
	 */
	readonly ActivePlayers: ReadonlyMap<Player, true>;

	/**
	 * A signal for new Replica.ActivePlayers entries.
	 */
	NewReadyPlayer: RBXScriptSignal<(player: Player) => void>;

	/**
	 * A signal for removed Replica.ActivePlayers entries.
	 */
	RemovingReadyPlayer: RBXScriptSignal<(player: Player) => void>;

	/**
	 * Sets any individual value within Replica.Data to value. Parameter value can be nil and will set the value located in path to nil.
	 */
	Set: (path: Path, value: any) => void;

	/**
	 * Sets multiple keys located in path to specified values
	 */
	SetValues: (self: ReplicaServer, path: Path, values: Record<any, any>) => void;

	/**
	 * Performs table.insert(t, value) where t is a numeric sequential array table located in path.
	 */
	TableInsert: (path: Path, value: any, index?: number) => number;

	/**
	 * Performs table.remove(t, index) where t is a numeric sequential array table located in path.
	 */
	TableRemove: (path: Path, index: number) => any;

	/**
	 * Run WriteLib function with given parameters
	 */
	Write: (functionName: string, ...args: Path) => Path;

	/**
	 * Will not replicate to unsubscribed players
	 */
	FireClient: (player: Player, ...args: Path) => void;

	/**
	 * Will not replicate to unsubscribed players
	 */
	FireAllClients: (...args: Path) => void;

	/**
	 * Same as "Replica:FireClient()", but using UnreliableRemoteEvent
	 */
	UFireClient: (player: Player, ...args: Path) => void;

	/**
	 * Same as "Replica:FireAllClients()", but using UnreliableRemoteEvent
	 */
	UFireAllClients: (...args: Path) => void;

	/**
	 * A custom static Replica identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the Replica's lifespan.
	 */
	SetParent: (replica: ReplicaServer) => void;

	/**
	 * Players who observe the instance stream in
			-- will be subscribed to this component; Observing the instance stream out
			-- will destroy the component for the observing player; Replicas should be bound
			-- to instances first and then ":Replicate()" or ":Subscribe()" should be called
			-- after. A replica can only be bound once.
	 */
	BindToInstance: (instance: Instance) => void;

	/**
	 * Subscribes all existing and future players; ":Subscribe()" and ":Unsubscribe()" will become locked
	 */
	Replicate: () => void;

	/**
	 * Resets all previous subscription settings;
	 */
	DontReplicate: () => void;

	/**
	 * Replicates to player; WILL NOT subscribe to players that are not ready & will throw a warning for trying to do so.
	 */
	Subscribe: (player: Player) => void;

	/**
	 * Destroys Replica for player
	 */
	Unsubscribe: (player: Player) => void;

	/**
	 * Creates a brief string description of a Replica, excluding Replica.Data contents. Used for debug purposes.
	 */
	Identify: () => string;

	/**
	 * Returns false if the Replica was destroyed.
	 */
	IsActive: () => boolean;

	/**
	 * Destroys replica and all of its descendants (Depth-first).
	 */
	Destroy: () => void;
};

export type ReplicaParams = {
	/**
	 * A custom static Replica identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the Replica's lifespan.
	 */
	Token: ReplicaToken;

	/**
	 * A custom static Replica identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the Replica's lifespan.
	 */
	Tags?: Record<string, any>;

	/**
	 * Table representing the state wrapped by the Replica. Note that after wrapping a table with a Replica you may no longer write directly to that table (doing so would potentially desynchronize state among clients and in some cases even break code) - all changes must be applied through mutators.
	 */
	Data?: Record<any, any>;

	/**
	 * A WriteLib is a ModuleScript containing a dictionary of mutator functions. When these functions are triggered using Replica:Write(), they will be called on both the server and all clients that have this Replica replicated to them. ReplicaService serializes all WriteLib functions to numbers, so only a small number is replicated as a reference to that function.
	 */
	WriteLib?: ModuleScript;
};

export type ServerType = {
	/**
	 * A custom static Replica identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the Replica's lifespan.
	 */
	ReadyPlayers: ReadonlyMap<Player, true>;

	/**
	 * A custom static Replica identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the Replica's lifespan.
	 */
	NewReadyPlayer: RBXScriptSignal<(player: Player) => void>;

	/**
	 * A custom static Replica identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the Replica's lifespan.
	 */
	RemovingReadyPlayer: RBXScriptSignal<(player: Player) => void>;

	/**
	 * A custom static Replica identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the Replica's lifespan.
	 */
	Token: (tokenString: string) => ReplicaToken;

	/**
	 * A custom static Replica identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the Replica's lifespan.
	 */
	New: (params: ReplicaParams) => ReplicaServer;

	/**
	 * A custom static Replica identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the Replica's lifespan.
	 */
	FromId: (id: number) => ReplicaServer | undefined;
};
