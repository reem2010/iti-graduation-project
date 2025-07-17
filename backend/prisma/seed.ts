import {
  PrismaClient,
  Role,
  VerificationStatus,
  NotificationType,
  AppointmentStatus,
  PaymentStatus,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const PASSWORD = 'password123';

async function main() {
  const doctorCount = 5;
  const patientCount = 5;
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  const doctorUsers = [];
  const patientUsers = [];

  // Seed doctors
  for (let i = 0; i < doctorCount; i++) {
    const doctor = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        passwordHash: hashedPassword,
        role: Role.doctor,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        gender: faker.helpers.arrayElement(['male', 'female']),
        isVerified: true,
        isActive: true,
        preferredLanguage: 'en',
        bio: faker.lorem.sentence(),
        doctorProfile: {
          create: {
            title: 'Dr.',
            specialization: faker.person.jobType(),
            yearsOfExperience: faker.number.int({ min: 1, max: 25 }),
            consultationFee: faker.number.float({
              min: 30,
              max: 150,
              fractionDigits: 2,
            }),
            languages: ['en', 'ar'],
          },
        },
        wallet: {
          create: {
            balance: 100,
            currency: 'USD',
          },
        },
        doctorVerificationsRequested: {
          create: {
            licenseNumber: faker.string.alphanumeric(8),
            licensePhotoUrl: faker.image.avatar(),
            degree: 'MBBS',
            university: faker.company.name(),
            graduationYear: faker.date.past({ years: 10 }).getFullYear(),
            specialization: faker.person.jobType(),
            idProofUrl: faker.image.avatar(),
            cvUrl: faker.internet.url(),
            additionalCertificates: {},
            status: VerificationStatus.approved,
          },
        },
      },
      include: { doctorProfile: true },
    });

    // Articles and availability
    await prisma.article.create({
      data: {
        doctorId: doctor.id,
        content: faker.lorem.paragraph(),
        media: faker.image.url(),
      },
    });

    await prisma.doctorAvailability.create({
      data: {
        doctorId: doctor.id,
        dayOfWeek: faker.number.int({ min: 1, max: 7 }),
        startTime: faker.date.future(),
        endTime: faker.date.future(),
      },
    });

    doctorUsers.push(doctor);
  }

  // Seed patients
  for (let i = 0; i < patientCount; i++) {
    const patient = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        passwordHash: hashedPassword,
        role: Role.patient,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        gender: faker.helpers.arrayElement(['male', 'female']),
        isVerified: true,
        isActive: true,
        preferredLanguage: 'en',
        patientProfile: {
          create: {
            emergencyContactName: faker.person.fullName(),
            emergencyContactPhone: faker.phone.number(),
            insuranceProvider: faker.company.name(),
            insurancePolicyNumber: faker.string.alphanumeric(10),
          },
        },
        wallet: {
          create: {
            balance: 50,
            currency: 'USD',
          },
        },
      },
    });

    patientUsers.push(patient);

    const selectedDoctors = faker.helpers.shuffle(doctorUsers).slice(0, 2);
    for (const doctor of selectedDoctors) {
      await prisma.review.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.lorem.sentence(),
        },
      });

      const appointment = await prisma.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          startTime: faker.date.future(),
          endTime: faker.date.future(),
          status: AppointmentStatus.scheduled,
          price: 75.5,
          platformFee: 5.5,
          paymentStatus: PaymentStatus.paid,
        },
      });

      await prisma.transaction.create({
        data: {
          userId: patient.id,
          appointmentId: appointment.id,
          amount: 75.5,
          type: TransactionType.payment,
          status: TransactionStatus.completed,
        },
      });
    }
  }

  // Seed messages and notifications
  for (const patient of patientUsers) {
    const doctor = faker.helpers.arrayElement(doctorUsers);
    await prisma.message.create({
      data: {
        senderId: patient.id,
        recipientId: doctor.id,
        content: faker.lorem.sentence(),
      },
    });

    await prisma.notification.create({
      data: {
        userId: patient.id,
        title: 'Welcome!',
        message: 'Thanks for joining the platform!',
        type: NotificationType.SYSTEM,
      },
    });
  }

  console.log('🌱 Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
