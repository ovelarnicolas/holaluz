import Client from '../../../domain/client';

export interface IFileReader {
  getAllFromCsvFile(fileName: string): Promise<Client[]>;
  getAllFromXmlFile(fileName: string): Promise<Client[]>;
}
