import { injectable } from 'tsyringe';

interface GetHealthServiceResponse {
  status: string;
  timestamp: string;
}

@injectable()
class GetHealthService {
  async execute(): Promise<GetHealthServiceResponse> {
    const response = {
      status: 'ok',
      timestamp: this.getCurrentTimestamp(),
    };

    return response;
  }

  private getCurrentTimestamp() {
    return new Date().toISOString();
  }
}

export { GetHealthService };
