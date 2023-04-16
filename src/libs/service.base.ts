import ServiceResponse from './service.response';

export default abstract class BaseService {
    protected readonly response: ServiceResponse;

    constructor() {
        this.response = new ServiceResponse();
    }
}
