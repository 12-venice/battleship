interface ServerToClientEvents {
    'userOnline:add': (data: any) => void;
    'userOnline:remove': (data: any) => void;
    'userOnline:set': (data: any) => void;
    'invite:sent': (data: any) => void;
    'invite:accept': (data: any) => void;
    'invite:cancel': (data: any) => void;
    'invite:recive': (data: any) => void;
    'moves:sent': (data: any) => void;
    'moves:recive': (data: any) => void;
    'messages:sent': (data: any) => void;
    'messages:recive': (data: any) => void;
}

interface ClientToServerEvents {
    'userOnline:add': (data: any) => void;
    'userOnline:remove': () => void;
    'userOnline:set': (data: any) => void;
    'invite:sent': (data: any) => void;
    'invite:accept': (data: any) => void;
    'invite:cancel': (data: any) => void;
    'invite:recive': (data: any) => void;
    'moves:sent': (data: any) => void;
    'moves:recive': (data: any) => void;
    'messages:sent': (data: any) => void;
    'messages:recive': (data: any) => void;
}
