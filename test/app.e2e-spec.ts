import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import { AuthUserDto, CreateUserDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateCounterDto, EditCounterDto } from '../src/counter/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let database: DatabaseService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(4001);

    database = app.get(DatabaseService);

    await database.clean();
    pactum.request.setBaseUrl('http://localhost:4001');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      const dto: CreateUserDto = {
        firstName: 'James',
        lastName: 'Mackay',
        email: 'online@notexpectedyet.com',
        username: 'theUser',
        password: 'testPassword',
        password2: 'testPassword',
        admin: true,
      };
      it('should throw if body empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        const missingPassword = Object.assign({}, dto);
        delete missingPassword.password;
        delete missingPassword.password2;
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ missingPassword })
          .expectStatus(400);
      });
      it('should throw if username empty', () => {
        const missingUsername = Object.assign({}, dto);
        delete missingUsername.username;
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ missingUsername })
          .expectStatus(400);
      });
      it('should throw if email empty', () => {
        const missingEmail = Object.assign({}, dto);
        delete missingEmail.email;
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ missingEmail })
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Login', () => {
      const dto: AuthUserDto = {
        username: 'theUser',
        password: 'testPassword',
      };
      it('should throw if username empty', () => {
        const missingUsername = Object.assign({}, dto);
        delete missingUsername.username;
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ missingUsername })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        const missingPassword = Object.assign({}, dto);
        delete missingPassword.password;
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ missingPassword })
          .expectStatus(400);
      });
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Vlad',
          email: 'vlad@vlad.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });
  describe('Counter', () => {
    describe('Get empty counters', () => {
      it('should get empty counters', () => {
        return pactum
          .spec()
          .get('/counters')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create counters', () => {
      const dto: CreateCounterDto = {
        name: 'Counter without day',
        description: 'Test counter without providing a day',
      };
      it('should create a counter', () => {
        return pactum
          .spec()
          .post('/counters')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('counterId', 'id');
      });
    });
    describe('Get counters', () => {
      it('should get counters', () => {
        return pactum
          .spec()
          .get('/counters')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Edit counter by id', () => {
      const dto: EditCounterDto = {
        name: 'Swapped the name!',
        description: 'New Description',
      };
      it('should get counters', () => {
        return pactum
          .spec()
          .patch('/counters/{id}')
          .withPathParams('id', '$S{counterId}')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{counterId}')
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.description);
      });
    });
    describe('Get counter by id', () => {
      it('should get counters', () => {
        return pactum
          .spec()
          .get('/counters/{id}')
          .withPathParams('id', '$S{counterId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{counterId}');
      });
    });
    describe('Delete counter', () => {
      it('should delete counter', () => {
        return pactum
          .spec()
          .delete('/counters/{id}')
          .withPathParams('id', '$S{counterId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });
      it('should get empty counters', () => {
        return pactum
          .spec()
          .get('/counters')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
  describe('Category', () => {
    describe('Get categories', () => {});
    describe('Create categories', () => {});
    describe('Edit categories', () => {});
    describe('Get categories by id', () => {});
    describe('Delete categories', () => {});
  });
});
