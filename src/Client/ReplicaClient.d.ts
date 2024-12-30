import { MaidReplica, Path } from "../utils";

type Connection = {
	Disconnect: () => void;
};

type ReplicaClient = {
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
	Parent?: ReplicaClient;

	/**
	 * Table representing the state wrapped by the Replica. Note that after wrapping a table with a Replica you may no longer write directly to that table (doing so would potentially desynchronize state among clients and in some cases even break code) - all changes must be applied through mutators.
	 */
	Children: Map<ReplicaClient, boolean | undefined>;

	/**
	 * An array of replicas parented to this Replica.
	 */
	BoundInstance?: Instance;

	/**
	 * Simulates the behaviour of RemoteEvent.OnClientEvent.
	 */
	OnClientEvent: {
		Connect: (listener: (...args: any[]) => void) => {
			Disconnect: () => void;
		};
	};

	/**
	 * Table representing the state wrapped by the Replica. Note that after wrapping a table with a Replica you may no longer write directly to that table (doing so would potentially desynchronize state among clients and in some cases even break code) - all changes must be applied through mutators.
	 */
	Maid: typeof MaidReplica;

	/**
	 * Creates a listener which gets triggered by Replica:Set() calls. -- (Only for :Set(); For :SetValues() you can use :OnChange())
	 */
	OnSet: (path: Path, listener: (newValue: any, oldValue: any) => void) => Connection;

	/**
	 * Listens to WriteLib mutator functions being triggered. See WriteLib section for examples.
	 */
	OnWrite: (functionName: string, listener: (...args: any[]) => void) => Connection;

	/**
	 * Creates a listener which gets triggered by Replica:SetValues() calls.
	 */
	OnChange: (
		listener: (
			action: "Set" | "SetValues" | "TableInsert" | "TableRemove",
			path: Path,
			param1: any,
			param2?: any,
		) => void,
	) => Connection;

	/**
	 * Searches for a child replica with given token name.
	 */
	GetChild: (token: string) => ReplicaClient | undefined;

	/**
	 * Fire a signal to server-side listeners for this specific Replica; Must be subscribed
	 */
	FireServer: (...args: any[]) => void;

	/**
	 * Same as "Replica:FireServer()", but using UnreliableRemoteEvent.
	 */
	UFireServer: (...args: any[]) => void;

	/**
	 * Debug
	 */
	Identify: () => string;

	/**
	 * Returns false if the Replica was destroyed.
	 */
	IsActive: () => boolean;
};

export type ClientType = {
	/**
	 * Listens to creation of replicas client-side of a particular class.
	 */
	OnNew: (token: string, listener: (replica: ReplicaClient) => void) => Connection;

	/**
	 * Requests the server to start sending replica data.
	 */
	RequestData: () => void;

	/**
	 * Returns a Replica that is loaded client-side with a Replica.Id that matches replica_id.
	 */
	FromId: (id: number) => ReplicaClient | undefined;
};
