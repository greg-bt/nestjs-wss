type Client = {
    name: string;
    room: string;
    position: [number, number,number];
    rotation: [number, number,number];
};

// eslint-disable-next-line prefer-const
let clients: { [key: string]: Client } = {};

export class MessageService {

    getClient(id: string) {
        return clients[id];
    }

    getAllClients() {
        return clients;
    }

    getClientsByRoom() {

    }

    newClient(id: string, auth:string, room: string) {

        // TODO: Use auth token to retrieve greenlnk display name
        const displayName = id;

        clients[id] = {
            name: displayName,
            room: room,
            position: [0,0,0],
            rotation: [0,0,0]
        }

    }

    updateClient(
        id: string,
        position: [number, number,number],
        rotation: [number, number,number]
    ) {
        clients[id].position = position;
        clients[id].rotation = rotation;
    }

    deleteClient(id:string) {
        delete clients[id];
    }

}