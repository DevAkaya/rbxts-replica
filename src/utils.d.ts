export type Path = any[];


export namespace MaidReplica {

    export interface MaidReplicaToken {
  
        Destroy(): void;

  
        Cleanup(...args: unknown[]): void;
    }

    /**
     * Represents a maid object that manages cleanup of various resources.
     */
    export interface MaidReplicaObject {
 
        IsActive(): boolean;


        Add(object: unknown): MaidReplicaToken;


        Cleanup(...args: unknown[]): void;

     
        Unlock(key: unknown): void;
    }

 
    export function New(key?: unknown): MaidReplicaObject;
}