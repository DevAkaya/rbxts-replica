# @rbxts/replica

[![NPM](https://nodei.co/npm/@rbxts/replica.png)](https://npmjs.org/package/@rbxts/replica)

## Installation:

`npm i @rbxts/replica`

## Example Usage

See [MadStudioRoblox/Replica](https://madstudioroblox.github.io/Replica/)

### Server-side

```ts
import { ReplicaServer } from "@rbxts/replica";


let replica = ReplicaServer.New({
    Token: ReplicaServer.Token("GlobalData"),
    Data: {
        Score: 0,
        Nested: {
            Value: false,
        },
    },
});

replica.Replicate();

task.spawn(function() {
    while (true) {
        replica.Set(["Score"], replica.Data.Score + 100);
        task.wait(1);
    }
});

replica.Set(["Nested", "Value"], true);
```

### Client-side

```ts
import { ReplicaClient } from "@rbxts/replica";


ReplicaClient.OnNew("GlobalData", function(replica) {
    print(`Replica received client-side! Data:`, replica.Data)

    replica.OnSet(["Score"], function(new_value, old_value) {
        print(`Score has changed from {old_value} to {new_value}`)
    })
})

ReplicaClient.RequestData() // Must be called once anywhere in game code client-side



