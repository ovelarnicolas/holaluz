import { Inject, Injectable } from '@nestjs/common';
import { IFileService } from './IFileService';
import { IFileReader } from '../../domain/ports/file/IFileReader';
import Client from '../../domain/client';
import Report from '../../domain/report';

@Injectable()
export class FileService implements IFileService {
  constructor(
    @Inject('IFileReader') private readonly fileReader: IFileReader,
  ) {}

  async readFile(fileName: string): Promise<any> {
    let data: Client[];
    if (fileName.includes('csv')) {
      data = await this.fileReader.getAllFromCsvFile(fileName);
    } else if (fileName.includes('xml')) {
      data = await this.fileReader.getAllFromXmlFile(fileName);
    }

    const suspicious = data
      .map((client) => ({
        ...client,
        readings: client.reading.filter(
          (read) =>
            read.reading > client.average + client.average * 0.5 ||
            read.reading < client.average - client.average * 0.5,
        ),
      }))
      .filter((client) => client.readings.length > 0);

    const report: Report[] = suspicious.flatMap((susp) =>
      susp.readings.map(
        (read) =>
          ({
            client: susp.id,
            month: read.period,
            suspicious: read.reading,
            median: susp.average,
          } as Report),
      ),
    );

    return report;
  }
}
