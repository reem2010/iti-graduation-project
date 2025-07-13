import { PrismaClient, Role, VerificationStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const PASSWORD = 'password123';

async function main() {
  const doctorCount = 10;
  const patientCount = 5;
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  const doctorUsers = [];

  // 👨‍⚕️ Seed doctors
  for (let i = 0; i < doctorCount; i++) {
    const user = await prisma.user.create({
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
        bio: faker.lorem.paragraph(),
        preferredLanguage: 'en',
        doctorProfile: {
          create: {
            title: 'Dr.',
            specialization: faker.person.jobType(),
            yearsOfExperience: faker.number.int({ min: 1, max: 25 }),
            consultationFee: faker.number.float({
              min: 20,
              max: 200,
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
            graduationYear: faker.date.past({ years: 15 }).getFullYear(),
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

    doctorUsers.push(user);
  }

  // 🧑‍🤝‍🧑 Seed patients
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

    // ✍️ Add reviews from this patient to 2 random doctors
    const reviewedDoctors = faker.helpers.shuffle(doctorUsers).slice(0, 2);
    for (const doctor of reviewedDoctors) {
      await prisma.review.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.lorem.sentence(),
          isAnonymous: faker.datatype.boolean(),
        },
      });
    }
  }

  // 🕓 Add availability for doctors
  for (const doctor of doctorUsers) {
    for (let day = 1; day <= 5; day++) {
      const now = new Date();
      const start = new Date(now);
      start.setHours(9 + day, 0, 0, 0);

      const end = new Date(now);
      end.setHours(10 + day, 0, 0, 0);

      await prisma.doctorAvailability.create({
        data: {
          doctorId: doctor.id,
          dayOfWeek: day,
          startTime: start,
          endTime: end,
          isRecurring: true,
          validFrom: now,
        },
      });
    }
  }

  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
