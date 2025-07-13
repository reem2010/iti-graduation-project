import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ZoomService } from "src/zoom/zoom.service";
import { AppointmentStatus } from '@prisma/client';
import { WalletService } from "src/wallet/wallet.service";
import { TransactionService } from "src/transaction/transaction.service";

interface paymentResult {
    success: boolean;
    appointmentId?:number;
    paymentUrl?: string;
    message?:string;
}

@Injectable()
export class AppointmentsService {
    constructor(
        private prisma: PrismaService,
        private zoomService: ZoomService,
        private walletService: WalletService,
        @Inject(forwardRef(() => TransactionService))
        private transactionService: TransactionService
    ) {}


async createAppointmentWithPayment(data:{
        patientId: number;
        doctorId: number;
        startTime: Date;
        endTime: Date;
        price: number;
        platformFee: number;
        patientEmail:string;
        patientPhone:string;
    }): Promise<paymentResult> {
        try{
        const totalAmount = data.price + data.platformFee;
        const hasEnoughBalanace = await this.walletService.pay(totalAmount,data.patientId);
        if(hasEnoughBalanace){
            const appointment= await this.createAppointment({
                patientId: data.patientId,
                doctorId: data.doctorId,
                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),
                price: data.price,
                platformFee: data.platformFee,
            });
    
        return {
            success: true,
            appointmentId: appointment.id,
            message:"Appointment created successfully using wallet balance", // No payment URL needed for wallet transactions
        };
    }else {
        const pendingAppointment = await this.createPendingAppointment(data);
        const  payementUrl = await this.transactionService.bookSession(pendingAppointment.id,data.patientId,totalAmount,data.patientEmail,data.patientPhone);
        return {
            success:false,
            appointmentId: pendingAppointment.id,
            paymentUrl: payementUrl,
            message:"Payment required to complete the booking"
      }
    }
    } catch (error) {
        console.error("Error creating appointment:", error);
        throw new Error("Failed to create appointment");
    }
}

private async createPendingAppointment(data: {
    patientId: number;
    doctorId: number;
    startTime: Date;
    endTime: Date;
    price: number;
    platformFee: number;
}){
    const doctor = await this.prisma.user.findUnique({
        where: { id: data.doctorId },
        include: { doctorProfile: true },
    });

    const patient = await this.prisma.user.findUnique({
        where: { id: data.patientId },
        include: { patientProfile: true },
    });

    const duration = (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60); // duration in minutes
    const zoomMeeting = await this.zoomService.createMeeting(doctor.email, {
        topic: `Therapy Session - Dr. ${doctor.firstName} ${doctor.lastName}`,
        startTime: data.startTime.toISOString(),
        duration: duration,
    });

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
                status: AppointmentStatus.pending,
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
}

async confirmAppointmentPayment(appointmentId:number): Promise<void> {
    try {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.status === AppointmentStatus.pending) {
            // If the appointment is pending, update appointment status to scheduled
            await this.prisma.appointment.update({
                where: { id: appointmentId },
                data: { status: 'scheduled' },
            });
        }
    } catch (error) {
        console.error("Error confirming appointment payment:", error);
        throw new Error("Failed to confirm appointment payment");
    }
}

// handle failed payment
async handleFailedPayment(appointmentId:number):Promise<void>{
    try {
        const appointment= await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new Error("Appointment not found");
        }
        if (appointment.status === AppointmentStatus.pending) {
            // If the appointment is pending, update appointment status to canceled
            if (appointment.meetingId) {
                    await this.zoomService.deleteMeeting(appointment.meetingId);
            }
            await this.prisma.appointment.update({
                where: { id: appointmentId },
                data: { status: AppointmentStatus.canceled, cancelReason: 'Payment failed', meetingUrl: null,
                        meetingId: null,
                        meetingPassword: null },
            });
        }
    }catch (error) {
        console.error("Error handling failed payment:", error);
        throw new Error("Failed to handle failed payment");
    }
}

async createAppointment(data: {
    patientId: number;
    doctorId: number;
    startTime: Date;
    endTime: Date;
    price: number;
    platformFee: number;
}){
    try{
    const doctor = await this.prisma.user.findUnique({
        where: { id: data.doctorId },
        include: { doctorProfile: true },
    });

    const patient = await this.prisma.user.findUnique({
        where: { id: data.patientId },
        include: { patientProfile: true },
    });

    const duration = (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60); // duration in minutes
    const zoomMeeting = await this.zoomService.createMeeting(doctor.email, {
        topic: `Therapy Session - Dr. ${doctor.firstName} ${doctor.lastName}`,
        startTime: data.startTime.toISOString(),
        duration: duration,
    });

    const appointment = await this.prisma.appointment.create({
        data:{
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
        if( appointment.status === 'scheduled'){
            await this.handleRefund(appointmentId);
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

private async handleRefund(appointmentId: number): Promise<void> {

    //refund based on 24 hrs 
    try{
    const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
    });


    if (!appointment) {
        throw new Error("Appointment not found");
    }
    const totalAmount = appointment.price.plus(appointment.platformFee);
    const appointmentTime = appointment.startTime;
    const currentTime = new Date();
    const timeDifference = appointmentTime.getTime() - currentTime.getTime();
    const hoursUntilAppointment = timeDifference / (1000 * 60 * 60);

    if (hoursUntilAppointment > 24) {
        // Process refund to bank
        await this.transactionService.refundToBank(appointmentId);
    } else {
        // refund to wallet
        await this.walletService.refund(totalAmount.toNumber()
        , appointment.patientId);
    }

    }catch (error) {
        console.error("Error handling refund:", error);
        throw new Error("Failed to handle refund");
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