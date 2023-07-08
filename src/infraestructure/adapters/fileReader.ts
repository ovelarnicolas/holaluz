import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Client from '../../domain/client';
import { IFileReader } from '../../domain/ports/file/IFileReader';
import { Read } from '../../domain';
import { finished } from 'stream/promises';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class FileReader implements IFileReader {
  async getAllFromXmlFile(fileName: string): Promise<Client[]> {
    const clients: Client[] = [];
    const filePath = `data/${fileName}`;
    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('File not found');
    }
    const xmlData = fs.readFileSync(filePath, 'utf8');
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });
    const parsedXml = parser.parse(xmlData);

    let readings: Read[] = [];
    let clientReadingSum = 0;
    let index = 0;

    parsedXml.readings.reading.forEach((read) => {
      readings.push({ period: read.period, reading: +read['#text'] });
      clientReadingSum += +read['#text'];
      if (index === 11) {
        clients.push({
          id: read.clientID,
          reading: readings,
          average: clientReadingSum / 12,
        }),
          (index = 0);
        clientReadingSum = 0;
        readings = [];
      } else index++;
    });

    return clients;
  }

  async getAllFromCsvFile(fileName: string): Promise<Client[]> {
    const clients: Client[] = [];
    const filePath = `data/${fileName}`;
    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('File not found');
    }

    const parseStream = parse({ delimiter: ',', fromLine: 2 });
    const stream = fs
      .createReadStream(filePath, { encoding: 'utf-8' })
      .pipe(parseStream);

    let readings: Read[] = [];
    let clientReadingSum = 0;
    let index = 0;

    stream.on('readable', () => {
      let record: string[];
      while ((record = parseStream.read()) !== null) {
        readings.push({ period: record[1], reading: +record[2] });
        clientReadingSum += +record[2];
        if (index === 11) {
          clients.push({
            id: record[0],
            average: clientReadingSum / 12,
            reading: readings,
          });
          index = 0;
          clientReadingSum = 0;
          readings = [];
        } else index++;
      }
    });

    await finished(stream);
    return clients;
  }
}
