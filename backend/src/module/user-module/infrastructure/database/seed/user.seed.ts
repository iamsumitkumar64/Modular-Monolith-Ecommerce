import { faker } from '@faker-js/faker';
import { userDataSource, options } from '../data-source';
import { BcryptService } from '../../../../common/infrastruture/services/bcrypt.service';
import { UserEntity } from '../../../domain/user/user.entity';

// hardcoded users for all microservices
const users = [
    {
        id: 1,
        uuid: 'c0a80101-7b1d-4a9f-8c1a-123456789001',
        email: 'user1@gmail.com',
        name: 'user 1',
    },
    {
        id: 2,
        uuid: 'c0a80102-7b1d-4a9f-8c1a-123456789002',
        email: 'user2@gmail.com',
        name: 'user 2',
    },
    {
        id: 3,
        uuid: 'c0a80103-7b1d-4a9f-8c1a-123456789003',
        email: 'user3@gmail.com',
        name: 'user 3',
    },
    {
        id: 4,
        uuid: 'c0a80104-7b1d-4a9f-8c1a-123456789004',
        email: 'user4@gmail.com',
        name: 'user 4',
    },
    {
        id: 5,
        uuid: 'c0a80105-7b1d-4a9f-8c1a-123456789005',
        email: 'user5@gmail.com',
        name: 'user 5',
    },
    {
        id: 6,
        uuid: 'c0a80106-7b1d-4a9f-8c1a-123456789006',
        email: 'user6@gmail.com',
        name: 'user 6',
    },
    {
        id: 7,
        uuid: 'c0a80107-7b1d-4a9f-8c1a-123456789007',
        email: 'user7@gmail.com',
        name: 'user 7',
    },
    {
        id: 8,
        uuid: 'c0a80108-7b1d-4a9f-8c1a-123456789008',
        email: 'user8@gmail.com',
        name: 'user 8',
    },
    {
        id: 9,
        uuid: 'c0a80109-7b1d-4a9f-8c1a-123456789009',
        email: 'user9@gmail.com',
        name: 'user 9',
    },
    {
        id: 10,
        uuid: 'c0a80110-7b1d-4a9f-8c1a-123456789010',
        email: 'user10@gmail.com',
        name: 'user 10',
    },
    {
        id: 11,
        uuid: 'c0a80111-7b1d-4a9f-8c1a-123456789011',
        email: 'user11@gmail.com',
        name: 'user 11',
    },
    {
        id: 12,
        uuid: 'c0a80112-7b1d-4a9f-8c1a-123456789012',
        email: 'user12@gmail.com',
        name: 'user 12',
    },
    {
        id: 13,
        uuid: 'c0a80113-7b1d-4a9f-8c1a-123456789013',
        email: 'user13@gmail.com',
        name: 'user 13',
    },
    {
        id: 14,
        uuid: 'c0a80114-7b1d-4a9f-8c1a-123456789014',
        email: 'user14@gmail.com',
        name: 'user 14',
    },
    {
        id: 15,
        uuid: 'c0a80115-7b1d-4a9f-8c1a-123456789015',
        email: 'user15@gmail.com',
        name: 'user 15',
    },
];

async function create() {
    userDataSource.setOptions({
        ...options,
    });

    await userDataSource.initialize();

    const bcryptService = new BcryptService();
    const hashedPassword = await bcryptService.hashPassword("123");

    const queryRunner = userDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        // use same users across all services
        for (const user of users) {
            const created_user = await queryRunner.manager.save(UserEntity, {
                id: user.id,
                uuid: user.uuid,
                email: user.email,// faker.internet.email(),
                password: hashedPassword,
                name: user.name,// faker.person.fullName(),
            });

            console.log(created_user);
        }

        await queryRunner.commitTransaction();
        console.info('✅ Seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Something went wrong:', error);
    } finally {
        await queryRunner.release();
    }
}

void create();