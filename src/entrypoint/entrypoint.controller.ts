import { Controller, Get } from '@nestjs/common';

@Controller()
export class EntrypointController {
    constructor() {}

    @Get('ping')
    ping() {
        return 'pong';
    }
}
