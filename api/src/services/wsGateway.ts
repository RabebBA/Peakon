import { Service } from 'typedi';
import { ITask } from '@/interfaces/task.interface';
import { Transition } from '@/interfaces/transition.interface';
import { Server } from 'socket.io';

@Service()
export class WsGateway {
  private websocketServer: Server;

  public init(server: any): void {
    if (!server) {
      throw new Error('WebSocket server non initialisé : le serveur HTTP est requis pour démarrer le WebSocket');
    }

    this.websocketServer = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.websocketServer.on('connection', client => {
      console.log(`Client connecté [id=${client.id}]`);

      client.on('subscribeToProject', (payload: { projectId: string }) => {
        this.handleSubscribe(client, payload);
      });

      client.on('disconnect', () => {
        console.log(`Client déconnecté [id=${client.id}]`);
      });
    });
  }

  public broadcastTransition(task: ITask, transition: Transition): void {
    if (!this.websocketServer) return;

    const message = {
      taskId: task._id,
      status: transition.targetStatus,
      timestamp: new Date(),
    };

    this.websocketServer.to(`project-${task.projectId}`).emit('taskTransition', message);
  }

  public handleSubscribe(client: any, payload: { projectId: string }) {
    const room = `project-${payload.projectId}`;
    client.join(room);
    console.log(`Client ${client.id} a rejoint la room : ${room}`);
  }
}
