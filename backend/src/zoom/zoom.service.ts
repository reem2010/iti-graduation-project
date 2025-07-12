import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class ZoomService {
    private accessToken: string;
    private tokenExpiry:number;

    private generatePassword(): string{
        return Math.random().toString(36).substring(2,10);
    }

    async getToken(): Promise<string> {
        if (this.accessToken && this.tokenExpiry > Date.now()) {
            return this.accessToken;
        }
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;
    const auth=Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try{
        const response = await axios.post(url, null, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        this.accessToken = response.data.access_token;
        this.tokenExpiry = Date.now() + (response.data.expires_in * 1000); // Convert seconds to milliseconds
        return this.accessToken;
    } catch (error) {
        console.error("Error fetching Zoom access token:", error);
        throw new Error("Failed to fetch Zoom access token");
    }
}

async createMeeting(doctorEmail:string,meetingData:any){
    const token=await this.getToken();

    const meetingConfig={
        topic:meetingData.topic,
        type:2,
        start_time:meetingData.startTime,
        duration:meetingData.duration, // in minutes
        password: this.generatePassword(),
        settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            mute_upon_entry: false,
            waiting_room: true,
            auto_recording: 'none',
        },
    };

    try{
        const response = await axios.post(
            'https://api.zoom.us/v2/users/me/meetings',
            meetingConfig,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    }catch (error) {
        console.error("Error creating Zoom meeting:", error);
        throw new Error("Failed to create Zoom meeting");
    }
}

async updateMeeting(meetingId:string,meetingData:any){
    const token=await this.getToken();

    try{
        await axios.patch(`https://api.zoom.us/v2/meetings/${meetingId}`,meetingData,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return {success:true, message: "Meeting updated successfully"};

    }catch(error){
        console.error("Error updating Zoom meeting:", error);
        throw new Error("Failed to update Zoom meeting");
    }
}

// async deleteMeeting(meetingId:string){
//     const token=await this.getToken();

//     try{
//         await axios.delete(`https://api.zoom.us/v2/meetings/${meetingId}`,{
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//             }
//         });
//         return {success:true, message: "Meeting deleted successfully"};

//     }catch(error){
//         console.error("Error deleting Zoom meeting:", error);
//         throw new Error("Failed to delete Zoom meeting");
//     }
// }
async deleteMeeting(meetingId: string): Promise<void> {
    try {
      const accessToken = await this.getToken();
      
      console.log(`Attempting to delete Zoom meeting with ID: ${meetingId}`);

      const response = await axios.delete(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`Successfully deleted Zoom meeting: ${meetingId}`);
    } catch (error) {
      console.error(`Failed to delete Zoom meeting ${meetingId}:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      // Handle specific error cases
      if (error.response?.status === 404) {
        console.warn(`Meeting ${meetingId} not found - it may have been already deleted`);
        return; // Don't throw error if meeting doesn't exist
      }

      if (error.response?.status === 401) {
        throw new Error('Zoom API authentication failed. Please check your credentials.');
      }

      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions to delete Zoom meeting. Check your app scopes.');
      }

      throw new Error(`Failed to delete Zoom meeting: ${error.response?.data?.message || error.message}`);
    }
  }

}