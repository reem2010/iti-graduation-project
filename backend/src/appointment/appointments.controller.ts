import {Controller, Get, Post, Body, Param, Delete, Put, Query} from '@nestjs/common';
import {AppointmentsService} from './appointments.service';
import { start } from 'repl';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}

    @Post()
    async createAppointment(@Body() data: {
        patientId: number;
        doctorId: number;
        startTime: Date;
        endTime: Date;
        price: number;
        platformFee: number;
    }) {
        return this.appointmentsService.createAppointment( {...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
    });
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
    async cancelAppointment(@Param('id') id: string,@Body() data: { cancelReason: string }) {
        return this.appointmentsService.cancelAppointment(+id, data.cancelReason);
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