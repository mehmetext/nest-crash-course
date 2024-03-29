import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule, TodosModule],
})
export class AppModule {}
