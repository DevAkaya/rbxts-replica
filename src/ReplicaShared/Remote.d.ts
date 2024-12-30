type Connection = {
    Disconnect: () => void;
    is_disconnected: boolean;
    real_connection?: RBXScriptConnection;
    fn: (...args: unknown[]) => void;
};

type RemoteEvent = {
    Name: string;
    Parent: Instance | undefined;
    FireServer: (...args: unknown[]) => void;
    OnClientEvent: RBXScriptSignal<(args: unknown[]) => void>;
    OnServerEvent: RBXScriptSignal<(player: Player, args: unknown[]) => void>;
};

export type Remote = {
    New: (name: string, is_unreliable?: boolean) => RemoteEvent | Remote;
    FireServer: (...args: unknown[]) => void;
    FireClient: (player: Player, ...args: unknown[]) => void;
    FireAllClients: (...args: unknown[]) => void;
    RemoteEvent?: RemoteEvent;
    OnClientEvent: {
        Connect: (listener: (...args: unknown[]) => void) => Connection;
    };
    OnServerEvent: {
        Connect: (listener: (...args: unknown[]) => void) => void;
    };
};
