import {Controller, Req,Get, Post, Body, Param, Delete, Put, Query,HttpStatus, HttpCode } from '@nestjs/common';
import {AppointmentsService} from './appointments.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { Request } from 'express';

// Extend the Request interface to include user from JWT
interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        email: string;
        phone?: string;
    };
}

export class CreateAppointmentDto {
    patientId: number;
    doctorId: number;
    startTime: Date;
    endTime: Date;
    price: number;
    platformFee: number;
    patientEmail: string;
    patientPhone: string;
}
export class UpdateAppointmentDto {
    startTime?: Date;
    endTime?: Date;
    status?: string;
}
export class completeAppointementDto {
    diagnosis?: string;
    perscription?: string;
    followUp?: string;
    notes?: string;
}

export class CancelAppointmentDto {
    cancelReason: string;
}

export class PaymentWebhookDto {
    transactionId:string;
    paymentMethod:string;
    success:boolean;
    amount:number;
    currency:string;
    orderId:string;
    appointmentId?:number;
    metadata?:any;
}

interface RefundResponse {
    success:boolean;
    message:string;
    refundMethod:'wallet'| 'bank';
    refundAmount:number;
    refundId?:string;
}

@Controller('appointments')
export class AppointmentsController {
    //Inject TransactionService for payment status checks
    constructor(private readonly appointmentsService: AppointmentsService,private readonly transactionService:TransactionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED) 
    async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto,@Req() req:AuthenticatedRequest) {

    try{
        const user= req.user;
            if (!user) {
                return {
                    status: 'error',
                    message: 'User not authenticated'
                };
            }
        const appointmentData = {
                ...createAppointmentDto,
                patientId: user.id,
                patientEmail: user.email,
                patientPhone: user.phone || '', // Handle case where phone might not be in JWT
            };
        
        const result= await this.appointmentsService.createAppointmentWithPayment(appointmentData);
        if (result.success){
            return {
                status: 'success',
                message:result.message,
                data:{
                    appointmentId: result.appointmentId,
                    paymentUrl: result.paymentUrl,
                    paymentMethod: 'wallet'
                }
            };
        }else{
            return {
               status: 'payment_required',
               message:result.message,
               data: {
                    appointmentId: result.appointmentId,
                    paymentUrl: result.paymentUrl,
                    paymentMethod: 'paymob'
                }
            };
        }
       }catch (error) {
        return {
            status: 'error',
            message: error.message
        };
         }
    }

    //post-booking status insight
    @Get(':id/payment-status')
    async getPaymentStatus(@Param('id') id: string) {
        try {
            const appointment = await this.appointmentsService.getAppointmentById(+id);
            if (!appointment) {
                return {
                    status: 'error',
                    message: 'Appointment not found'
                };
            }
            // Check for pending payments
            const hasPendingPayment = await this.transactionService.hasPendingPayment(+id);
            const isPaymentCompleted = await this.transactionService.isPaymentCompleted(+id);

             // Get transaction history for this appointment
            const transactions = await this.transactionService.getTransactionsByAppointment(+id);
            
            return {
                status: 'success',
                data: {
                    appointmentId: appointment.id,
                    appointmentStatus: appointment.status,
                    isPaid: appointment.status === 'scheduled',
                    hasPendingPayment,
                    isPaymentCompleted,
                    paymentMethod: isPaymentCompleted ? 'paymob' : (appointment.status === 'scheduled' ? 'wallet' : 'none'),
                    transactions: transactions.map(tx => ({
                        id: tx.id,
                        type: tx.type,
                        status: tx.status,
                        amount: tx.amount,
                        createdAt: tx.createdAt,
                        description: tx.description
                    }))
                }
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }

    //  Check if appointment needs payment
    @Get(':id/payment-required')
    async checkPaymentRequired(@Param('id') id: string) {
        try {
            const appointment = await this.appointmentsService.getAppointmentById(+id);
            if (!appointment) {
                return {
                    status: 'error',
                    message: 'Appointment not found'
                };
            }

            const hasPendingPayment = await this.transactionService.hasPendingPayment(+id);
            const isPaymentCompleted = await this.transactionService.isPaymentCompleted(+id);

            return {
                status: 'success',
                data: {
                    appointmentId: appointment.id,
                    paymentRequired: appointment.status === 'pending' && !isPaymentCompleted,
                    hasPendingPayment,
                    isPaymentCompleted
                }
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }
     @Get('my-appointments')
    async getMyAppointments(@Query('role') role: string, @Req() req: AuthenticatedRequest) {
        try {
            const user = req.user;
            if (!user) {
                return {
                    status: 'error',
                    message: 'User not authenticated'
                };
            }

            const appointments = await this.appointmentsService.getUserAppointments(user.id, role);
            return {
                status: 'success',
                data: appointments
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }



    @Get('user/:userId')
    async getAppointmentsByUserId(@Param('userId') userId: string, @Query('role') role: string) {
        return this.appointmentsService.getUserAppointments(+userId, role);
    }

    @Get(':id')
    async getAppointmentById(@Param('id') id: string) {
        return this.appointmentsService.getAppointmentById(+id);
    }

    @Put(':id')
    async updateAppointment(@Param('id') id: string, @Body() data: { startTime?: Date; endTime?: Date; status?: string }) {
        const updateData={
            ...data,
            startTime: data.startTime ? new Date(data.startTime) : undefined,
            endTime: data.endTime ? new Date(data.endTime) : undefined,

        };
        return this.appointmentsService.updateAppointment(+id, updateData);
    }
    @Delete(':id')
    async cancelAppointment(@Param('id') id: string, @Body() data: { cancelReason: string }) {
        try {
            const result = await this.appointmentsService.cancelAppointment(+id, data.cancelReason);
            return {
                status: 'success',
                message: 'Appointment cancelled successfully',
                data: result
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }
    @Post(':id/refund')
    async processRefund(@Param('id') id: string) {
    try {
        const result = await this.appointmentsService.cancelAppointment(+id, 'Refund requested');
        return { 
            status: 'success', 
            message: 'Appointment cancelled and refund processed successfully', 
            data: result 
        };
    } catch (error) {
        return { 
            status: 'error', 
            message: error.message 
        };
    }
}

    @Put(':id/complete')
    async completeAppointment(@Param('id') id: string,@Body() data: {
        diagnosis?: string;
        perscription?: string;
        notes?: string;
    }) {
        return this.appointmentsService.completeAppointement(+id, data);
    }


}