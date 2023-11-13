// type BaseMonitor = {
//   id: string;
//   name?: string;
//   network: keyof typeof Network;
//   intervalMs: number;
//   owner: string;
// };

// type FromOnlyMonitor = BaseMonitor & {
//   from: string;
//   to?: null;
// };

// type ToOnlyMonitor = BaseMonitor & {
//   from?: null;
//   to: string;
// };

// export type FromToMonitor = BaseMonitor & {
//   from: string;
//   to: string;
// };

// export type Monitor = FromOnlyMonitor | ToOnlyMonitor | FromToMonitor;

// type Notification = {
//   id: number;
//   timestamp: number;
//   monitorId: number;
//   userId: string;
// };

// type User = {
//   id: string;
//   followersNum: number;
// };

// type UserMonitor = {
//   id: number;
//   userId: number;
//   monitorId: number;
// };

// enum Network {
//   Mainnet = 'mainnet',
//   Testnet = 'testnet',
// }

// Endopoints:

//  - follow
//      params
//      followerId: userId

//  - unfollow
//      params
//      followerId: userId

//  - trackMonitor
//      params
//      monitor: monitorId

//  - untrackMonitor
//      params
//      monitor: monitorId

//  - createMonitor
//      params
//      monitor: monitor

//  - updateMonitor
//      params
//      monitor: monitor

//  - deleteMonitor
//      params
//      monitor: monitorId

//  - getNotifications
//      returns
//      notifications: Notification[]

//  - getMonitors
//      params
//      user?: userId
//      returns
//      monitors: Monitor[]
