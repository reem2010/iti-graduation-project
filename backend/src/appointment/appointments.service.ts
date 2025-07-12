import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ZoomService } from "src/zoom/zoom.service";
import { AppointmentStatus } from '@prisma/client';


@Injectable()
export class AppointmentsService {
    constructor(
        private prisma: PrismaService,
        private zoomService: ZoomService,
    ) {}

    async createAppointment(data:{
        patientId: number;
        doctorId: number;
        startTime: Date;
        endTime: Date;
        price: number;
        platformFee: number;
    }) {
        try{
        const doctor =await this.prisma.user.findUnique({ where: {id:data.doctorId}, include:{doctorProfile:true}});
         
        const patient= await this.prisma.user.findUnique({ where:{id:data.patientId}, include:{patientProfile:true}});
        // duration in minutes
        const duration=(data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60);
        const zoomMeeting= await this.zoomService.createMeeting(doctor.email,{topic: `Therapy Session - Dr. ${doctor.firstName} ${doctor.lastName}`,
        startTime: data.startTime.toISOString(),
        duration: duration,});

        // save the appointment in the database
        const appointment = await this.prisma.appointment.create({
            data: {
                patientId: data.patientId,
                doctorId: data.doctorId,
                startTime: data.startTime,
                endTime: data.endTime,
                price: data.price,
                platformFee: data.platformFee,
                meetingUrl: zoomMeeting.join_url,
                meetingId: zoomMeeting.id.toString(),
                meetingPassword: zoomMeeting.password,
                status:'scheduled',
            },
            include: {
                patient: {
                    include: {
                        user: true,
                    },
                },
                doctorProfile: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        return appointment;
    } catch (error) {
        console.error("Error creating appointment:", error);
        throw new Error("Failed to create appointment");
    }
}
//get all appointments for a user (doctor or patient)
async getUserAppointments(userId: number, userRole: string) {
    const whereCondition =userRole === 'doctor'
        ? { doctorId: userId }
        : { patientId: userId };
    return this.prisma.appointment.findMany({
        where: whereCondition,
        include: {
            patient: {
                include: {
                    user: true,
                },
            },
            doctorProfile: {
                include: {
                    user: true,
                },
            },
        }, orderBy: {
            startTime: 'desc',
        }
    });
}

//get appointment by id
async getAppointmentById(appointmentId:number){
    return this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            patient: {
                include: {
                    user: true,
                },
            },
            doctorProfile: {
                include: {
                    user: true,
                },
            },
        },
    });
}

async updateAppointment(appointmentId: number, data: {startTime?: Date; endTime?: Date; status?: string}) {
   try { 
    const appointment= await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
    });
    if (!appointment) {
        throw new Error("Appointment not found");
    }

    if (data.startTime && data.endTime && appointment.meetingId) {
        const duration = Math.ceil((data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60));

        await this.zoomService.updateMeeting(appointment.meetingId, {
            start_time: data.startTime.toISOString(),
            duration: duration,
        });
    }
    return  this.prisma.appointment.update({
        where: { id: appointmentId },
        data:{
        ...(data.startTime && { startTime: data.startTime }),
        ...(data.endTime && { endTime: data.endTime }),
        ...(data.status && { status: { set: data.status as AppointmentStatus } }),
      },
        include: {
            patient: {
                include: {
                    user: true,
                },
            },
            doctorProfile: {
                include: {
                    user: true,
                },
            },
        },
    });
   }catch (error) {
       console.error("Error updating appointment:", error);
       throw new Error("Failed to update appointment");
   }
}
async cancelAppointment(appointmentId: number,cancelReason:string) {
    try{
        const appointment= await this.prisma.appointment.findUnique({ where:{ id: appointmentId },});
        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.meetingId) {
            await this.zoomService.deleteMeeting(appointment.meetingId);
        }

        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'canceled', cancelReason: cancelReason , meetingUrl:null, meetingId:null,meetingPassword:null},
            include: {
                patient: {
                    include: {
                        user: true,
                    },
                },
                doctorProfile: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }catch (error) {
        console.error("Error cancelling appointment:", error);
        throw new Error("Failed to cancel appointment");
    }
}

//mark appointment as completed
async completeAppointement(appointmentId: number,data:{
    diagnosis?: string;
    perscription?: string;
    followUp?: string;
    notes?: string;
}) {
    return this.prisma.appointment.update({
        where: { id: appointmentId },
        data: {
            ...(data.diagnosis && { diagnosis: data.diagnosis }),
            ...(data.perscription && { perscription: data.perscription }),
            ...(data.followUp && { followUp: data.followUp }),
            ...(data.notes && { notes: data.notes }),
        },
        include: {
            patient: {
                include: {
                    user: true,
                },
            },
            doctorProfile: {
                include: {
                    user: true,
                },
            },
        },
    });
}
}