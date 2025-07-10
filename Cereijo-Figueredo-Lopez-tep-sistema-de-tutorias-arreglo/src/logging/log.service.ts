import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  /**
   * @param logData 
   * @returns 
   */
  async createLog(logData: Partial<Log>): Promise<Log> {
    const newLog = this.logRepository.create(logData);
    return this.logRepository.save(newLog);
  }
}