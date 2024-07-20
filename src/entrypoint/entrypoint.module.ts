import { Module } from '@nestjs/common';
import { EntrypointController } from './entrypoint.controller';

@Module({
    controllers: [EntrypointController],
})
export class EntrypointModule {}
