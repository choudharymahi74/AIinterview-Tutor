import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

const apiKey = process.env.LIVEKIT_API_KEY || '';
const apiSecret = process.env.LIVEKIT_API_SECRET || '';
const wsUrl = process.env.LIVEKIT_URL || 'wss://your-livekit-instance.livekit.cloud';

export class LiveKitService {
  private roomService: RoomServiceClient;

  constructor() {
    this.roomService = new RoomServiceClient(wsUrl, apiKey, apiSecret);
  }

  async createInterviewRoom(interviewId: string): Promise<string> {
    try {
      const roomName = `interview-${interviewId}`;
      
      // Create room if it doesn't exist
      await this.roomService.createRoom({
        name: roomName,
        emptyTimeout: 300, // 5 minutes
        maxParticipants: 2, // User + AI
      });

      return roomName;
    } catch (error) {
      console.error('Error creating interview room:', error);
      throw new Error(`Failed to create interview room: ${error}`);
    }
  }

  async generateAccessToken(roomName: string, participantName: string, userId: string): Promise<string> {
    try {
      const at = new AccessToken(apiKey, apiSecret, {
        identity: userId,
        name: participantName,
      });

      at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      return await at.toJwt();
    } catch (error) {
      console.error('Error generating access token:', error);
      throw new Error(`Failed to generate access token: ${error}`);
    }
  }

  async endInterviewRoom(roomName: string): Promise<void> {
    try {
      await this.roomService.deleteRoom(roomName);
    } catch (error) {
      console.error('Error ending interview room:', error);
      // Don't throw here as the interview might still be valid
    }
  }

  async getRoomInfo(roomName: string) {
    try {
      return await this.roomService.listRooms([roomName]);
    } catch (error) {
      console.error('Error getting room info:', error);
      return null;
    }
  }
}

export const liveKitService = new LiveKitService();
