import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from './comments/comment.module';
// import { CommentService } from './comments/services/comment.service';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { GraphQLModule } from '@nestjs/graphql';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { CategoryModule } from './category/category.module';
// import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('TYPEORM_HOST'),
        username: config.get<string>('TYPEORM_USERNAME'),
        password: config.get<string>('TYPEORM_PASSWORD'),
        database: config.get<string>('TYPEORM_DATABASE'),
        port: +config.get<number>('TYPEORM_PORT'),
        entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
